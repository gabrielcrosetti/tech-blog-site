const signupForm = document.querySelector('.signup-form');

async function signupFormHandler(event) {
    event.preventDefault();

    // Collect user input
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && email && password) {
        const newUser = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
            
        if (newUser.ok) {
            document.location.replace('/dashboard');
        }
        else {
            alert(newUser.statusText);
        }
    }

    // error if input is missing
    else {
        const errorPEl = document.createElement('p');
        errorPEl.textContent = 'Do not leave blank values.';
        
        signupForm.appendChild(errorPEl);
    }
};

signupForm.addEventListener('submit', signupFormHandler);