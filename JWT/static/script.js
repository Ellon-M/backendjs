const form = document.getElementById('reg-form');
form.addEventListener('submit', registerUser);


// Send data as JSON
async function registerUser(event) {
    // to prevent the page from refreshing - a default action
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // convert js objects into strings
        body: JSON.stringify({
            username,
            password
        })
        // on fulfilled
    }).then((res) => res.json())

    if(result.status === "ok"){
    }else {
        alert (result.error);
    }
     console.log(result);
}