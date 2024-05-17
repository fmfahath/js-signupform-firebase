// const auth = firebase.auth();
// const db = firebase.firestore();


const loginForm = document.querySelectorAll('.login-signup')[0];
const signupForm = document.querySelectorAll('.login-signup')[1];
const nav_to_signup = document.querySelector('#nav-to-signup');
const nav_to_login = document.querySelector('#nav-to-login');
const login_submit = document.querySelector('#login-submit');
const signup_submit = document.querySelector('#signup-submit');
const forgotpwd = document.querySelector('#nav-to-forgotpwd');
const details = document.querySelector(".user-details");

const userDetails = (currentUser) => {
    console.log(JSON.parse(currentUser));
}

window.onload = () => {

    // localStorage.setItem('currently_loggedIn',
    //     JSON.stringify({
    //         userName: "abc",
    //         email: "abc@gmail.com"
    //     }))

    try {
        const currentUser = window.localStorage.getItem('currently_loggedIn');

        if (currentUser === null) {
            throw new Error('No current User');
        }
        else {
            loginForm.style.display = 'none;'
            signupForm.style.display = 'none;'
            details.style.display = 'block';
            userDetails(currentUser);
        }
    } catch (error) {
        loginForm.style.display = 'block';

    }
}

nav_to_signup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    document.querySelector('#login').reset();
})

nav_to_login.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    document.querySelector('#signup').reset();
})
