const form = document.getElementById('login');
form.addEventListener('submit', login);


async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    const result = await fetch('/api/login', {
        method: 'POST',
        // the headers are there so that the app can detect what data was sent and how it should handle it
        // if its json, then parse it as JSON
        headers: {
            'Content-Type': 'application/json'
        },

        // send object data as string
        body: JSON.stringify({
            username,
            password
        })

    }).then((res) => res.json())

    if(result.status === "ok"){
        alert('Success');
        console.log('Got the token ', result.data);
        // store the token
       localStorage.setItem('token', result.data);
    
    }else {
        alert (result.error);
    }
    console.log(result);
} 