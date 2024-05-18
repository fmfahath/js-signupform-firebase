import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore();
const user = auth.currentUser;



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
const detailsMessage = document.getElementById("details-message");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");


function showAlert(element, message, status, timer) {
    if (status === "success") {
        element.style.display = "block";
        element.classList.remove("error")
        element.classList.add("success")
        element.innerHTML = message;

        if (timer == true) {
            setTimeout(() => {
                element.style.display = "none";
            }, 3000);
        }

    } else {
        element.style.display = "block";
        element.classList.remove("success")
        element.classList.add("error")
        element.innerHTML = message;
        if (timer == true) {
            setTimeout(() => {
                element.style.display = "none";
            }, 3000);
        }
    }


}


window.onload = () => {

    checkAuthState();
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

//signup function
signup_submit.addEventListener('click', (e) => {
    e.preventDefault();
    signup_submit.style.display = 'none';
    document.querySelectorAll('.loader')[1].style.display = "block";

    const userName = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-pwd').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const userData = {
                userName: userName,
                email: email,
            };


            showAlert(signupMessage, "Created Successfully", "success");

            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, userData)
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

// signIn function
login_submit.addEventListener('click', (e) => {
    e.preventDefault();
    login_submit.style.display = 'none';
    document.querySelectorAll('.loader')[0].style.display = "block";

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pwd').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredencial) => {

            document.querySelectorAll('.loader')[0].style.display = "none";
            document.getElementById('login').reset();
            login_submit.style.display = 'block';
            loginForm.style.display = "none";
            details.style.display = "flex";

            const user = userCredencial.user;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            //setting session data
            if (docSnap.exists()) {
                const userData = {
                    uid: user.uid,
                    userName: docSnap.data().userName,
                    email: docSnap.data().email,
                };

                sessionStorage.setItem("user-cred", JSON.stringify(userData));


            }
            else {
                console.log("user logied In. But cannot create session data");
                userInfo.style.display = "none";
                showAlert(detailsMessage, "Cannot Create Session Data", "error");
            }


            // getting session Data
            const sessionData = JSON.parse(sessionStorage.getItem("user-cred"));

            if (sessionData) {
                document.getElementById("user-userName").innerHTML = sessionData.userName;
                document.getElementById("user-uid").innerHTML = sessionData.uid;
                document.getElementById("user-email").innerHTML = sessionData.email;
            }
            else {
                console.log("Cannot get session data");
                userInfo.style.display = "none";
                showAlert(detailsMessage, "Cannot get session data", "error");
            }

        })
        .catch((error) => {
            const erroCode = error.code;
            if (erroCode === 'auth/invalid-credential')
                showAlert(loginMessage, "Incorrect Email or Password", "error", true)
            else {
                showAlert(loginMessage, "Account Doesn't Exist", "error", true)

            }

            login_submit.style.display = 'block';
            document.querySelectorAll('.loader')[0].style.display = "none";
        })

});


//logout button
logoutBtn.addEventListener('click', async (e) => {
    await signOut(auth);
    sessionStorage.removeItem("user-cred");
    details.style.display = "none";
    loginForm.style.display = "block";
});


const checkAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("loggedin");
            details.style.display = "flex";
        }
        else {
            console.log("no logged in profile");
            loginForm.style.display = 'block';
        }
    })
}

