const form = document.getElementById('change-pass-form');
form.addEventListener('submit', registerUser);

async function registerUser(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;

    const result = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           newPassword: password,
           // fetch data from local storage
           token: localStorage.getItem('token')    
        })

    }).then((res) => res.json())

    if(result.status === "ok"){
        alert('Success');
        // adding data to localStorage
        localStorage.setItem('token', result.data)
    } else {
        alert (result.error);
    }


    console.log(result);
}