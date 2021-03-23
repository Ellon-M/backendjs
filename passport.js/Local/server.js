const express		= require('express');
const session		= require('express-session'); // HTTP - stateless. Express- session stores previous request or activity, but on the server. Cookies are stored on the client side.
const hbs			= require('express-handlebars'); // template engine
const mongoose		= require('mongoose');
const passport		= require('passport');
const localStrategy	= require('passport-local').Strategy; //The local authentication strategy authenticates users using a username and password. 
const bcrypt		= require('bcrypt'); // hashing passwords
const app			= express();
require('dotenv/config');
const User          = require('./model/User');



//DB Connection
mongoose.connect(process.env.DB_CONNECTION,{        
	useNewUrlParser: true,
useUnifiedTopology: true,
  useCreateIndex: true},
   () => console.log("Connected to DB"));


// Middleware


app.engine('hbs', hbs({ extname: '.hbs' })); // starting the handlebars engine. (Renaming the extension from .handlebars to .hbs)
app.set('view engine', 'hbs'); //sets our engine
app.use(express.static(__dirname + '/public'));


// create a session
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true
}));
// what creating a new session does: 

//generate a unique session id

// store that session id in a session cookie (so subsequent requests made by the client can be identified) 

//create an empty session object, as req.session

// depending on the value of saveUninitialized, at the end of the request, the session object will be stored in the session store (which is generally some sort of database)



// you only need these for POST requests and PUT requests
//  because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body)

// express provides the middleware to deal with the incoming data/ the object in the body of the request

// there are two ways that this 'data' reaches the server:
       //- urlencoded
       //- JSON

// for express.urlencoded() - express recognizes the incoming request object as a string or array
// for express.json() -   - express recognizes the incoming request object as a JSON object     
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Passport

app.use(passport.initialize()); // initialise passport
app.use(passport.session());    // to make sure that the session remains, when moving between pages or refreshing pages
// Basically, offering session authentication as another authentiation strategy, without retrieving user details from a database 

// In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
// So each subsequent request will not contain credentials, but rather the unique cookie that is set in the user's browser.


//serializing and deserializing the user

//SerializeUser determines which data of the user object should be stored in the session

//Serializing a user into a session
passport.serializeUser(function (user, done) {
	done(null, user.id); 
    
    // user id is saved in the session and is later used to retrieve the whole object via the deserializeUser function.
    //Any key of the user object can be used i.e name, email etc 
});

// Here, the key passed in the done function (user.id), is matched with the corresponding one in the database

// deserialize the user to get the user's details
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// In order for persistent sessions to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made.




//Strategy

// passport uses what are termed strategies to authenticate requests. This particular one verifies a username and a password
// Strategies, and their configuration, are supplied via the use() function.
passport.use(new localStrategy(function (username, password, done) {
	User.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
			return done(null, user);
		});
	});
}));


// defining a function that checks if a user is logged in, and if not they are redirected to the login page
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	// else
	res.redirect('/login'); // redirects a user that is not logged in back to the login page
}


function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	// else
	res.redirect('/');  // redirects a user that is not logged out back to the home page if they try to log in
}

// ROUTES
app.get('/', isLoggedIn, (req, res) => {
	res.render("index", { title: "Home" });
});

app.get('/about', (req, res) => {
	res.render("index", { title: "About" });
});

// can only log in if logged out
app.get('/login', isLoggedOut, (req, res) => {
	const response = {
		title: "Login",
		// sends an error msg to the template
		error: req.query.error
	}

	res.render('login', response);
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login?error=true'
}));

app.get('/logout', function (req, res) {
	req.logout();   // passport function that terminates a login session.  Invoking logout() will remove the req.user property and clear the login session (if any).
	res.redirect('/'); // route redirects you to where the log out can be performed; that is on the home page
});



//setup admin

app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: "admin" });

	if (exists) {
		console.log('exists');
		res.redirect('/login');
		return;
	};

	// Salting is an additional step during hashing, typically seen in association to hashed passwords, that adds an additional value to the end of the password that changes the hash value produced.
	//A salt is a random string.
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(adminPass, salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new User({
				username: "admin",
				password: hash
			});

			newAdmin.save();

			res.redirect('/login');
		});
	});
});

app.get('/register', (req, res) => {
	const resp = {
		title: "Register",
		// sends an error msg to the template
		error: req.query.error
	}

	res.render('reg', resp);
});

// register new user

app.post('/register', async (req, res) => {
	const {username, password: plainTextPassword} = req.body;
	bcrypt.genSalt(10, async function (err, salt) {
			if (err)
				return next(err);
			const password =  await bcrypt.hash(plainTextPassword, 10);
			try {
				const response = await User.create({
					username,
					password
				});
				console.log("User create successfully", response);
				res.redirect('/login');
			} catch (error) {
				console.log(JSON.stringify(error));
				if (error.code === 11000) {	
					const resp = {
			     title: "Register",
				 error: req.query.error
					}
					res.render('reg', resp)
				}
				
				
			}
		});
})

app.listen(5500, () => {
    console.log('Server up at 5500');
})