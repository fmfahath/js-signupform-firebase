import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrDDXuZrRWzN5DOOWn0v8sACq8-ElWNK0",
    authDomain: "js-signupform-firebase.firebaseapp.com",
    projectId: "js-signupform-firebase",
    storageBucket: "js-signupform-firebase.appspot.com",
    messagingSenderId: "757117378220",
    appId: "1:757117378220:web:1d2907b47e89299df18909"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


const loginForm = document.querySelectorAll('.login-signup')[0];
const signupForm = document.querySelectorAll('.login-signup')[1];
const nav_to_signup = document.querySelector('#nav-to-signup');
const nav_to_login = document.querySelector('#nav-to-login');
const login_submit = document.querySelector('#login-submit');
const signup_submit = document.querySelector('#signup-submit');
const forgotpwd = document.querySelector('#nav-to-forgotpwd');
const details = document.querySelector(".user-details");
const signupMessage = document.getElementById("signup-message");
const loginMessage = document.getElementById("login-message");

const userDetails = (currentUser) => {
    console.log(JSON.parse(currentUser));
};

function showAlert(element, message, status) {
    if (status === "success") {
        element.style.display = "block";
        element.classList.remove("error")
        element.classList.add("success")
        element.innerHTML = message;
        setTimeout(() => {
            element.style.display = "none";
        }, 3000);

    } else {
        element.style.display = "block";
        element.classList.remove("success")
        element.classList.add("error")
        element.innerHTML = message;
        setTimeout(() => {
            element.style.display = "none";
        }, 3000);
    }


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
};

// create account link
nav_to_signup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    document.querySelector('#login').reset();
});

// already have an account link
nav_to_login.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    document.querySelector('#signup').reset();
});

//getting signup input
signup_submit.addEventListener('click', (e) => {
    e.preventDefault();
    signup_submit.style.display = 'none';
    document.querySelectorAll('.loader')[1].style.display = "block";

    const userName = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-pwd').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((useCredential) => {
            const user = useCredential.user;
            const userData = {
                userName: userName,
                email: email,
            };


            showAlert(signupMessage, "Created Successfully", "success");

            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {

                    signup_submit.style.display = 'block';
                    document.querySelectorAll('.loader')[1].style.display = "none";
                    document.getElementById('signup').reset();
                    signupForm.style.display = 'none';
                    loginForm.style.display = 'block';
                })
                .catch((error) => {
                    console.log("error writing document", error)
                })
        })
        .catch((error) => {

            const erroCode = error.code;
            if (erroCode === 'auth/email-already-in-use') {
                showAlert(signupMessage, "Email Address Already Exists!", "error");
            }
            else {
                showAlert(signupMessage, "Unable to create a user", "error");
            }

            document.querySelectorAll('.loader')[1].style.display = "none";
            signup_submit.style.display = 'block';
        })

});
