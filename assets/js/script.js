// firebase auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// module alert
import showAlert from "./show-alert.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlIAhRIl0ulkBn50vZ9H0UqlO7BUkZdlA",
    authDomain: "todo-app-81e37.firebaseapp.com",
    databaseURL: "https://todo-app-81e37-default-rtdb.firebaseio.com",
    projectId: "todo-app-81e37",
    storageBucket: "todo-app-81e37.appspot.com",
    messagingSenderId: "739433229549",
    appId: "1:739433229549:web:6de4130200b0a56bcd30e4"
};

const app = initializeApp(firebaseConfig); // Initialize Firebase
const db = getDatabase(); // Initialize Database
const auth = getAuth(app);  // Initialize Firebase Authentication and get a reference to the service

const todosRef = ref(db, 'todos');

const signUpForm = document.querySelector("[sign-up]");
if(signUpForm) {
    // lắng nghe sự kiện submit form đăng ký
    signUpForm.addEventListener("submit", event => {
        event.preventDefault(); // chặn sự kiện mặc định

        const fullName = signUpForm.fullName.value;
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;

        if(email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    if(user) {
                        window.location.href = "index.html";
                        showAlert("Đăng ký tài khoản thành công", "success", 3000);
                    }

                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showAlert("Đăng ký tài khoản thất bại", "error", 3000);
                    // ..
                });
        }
    });
}
// hết firbase auth

// form đăng kí, đăng nhập
const signUpClass = document.querySelector(".sign-up");
if(signUpClass) {
    const passWordInput = signUpClass.querySelector("input[type='password']");

    // tính năng xem mật khẩu ẩn hiện
    const showPassword = document.querySelector("[show-password]");
    if(showPassword) {
        // nếu có nhấn vào showPassword
        showPassword.addEventListener("click", event => {
            const isNotShow = (showPassword.getAttribute("show-password") === "");

            // nếu chưa show password ra => show ra
            if(isNotShow) {
                passWordInput.type = "text";
                showPassword.setAttribute("show-password","yes");
                showPassword.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
            }

            // nếu đã show password ra => ẩn
            else {
                passWordInput.type = "password";
                showPassword.setAttribute("show-password","");
                showPassword.innerHTML = `<i class="fa-regular fa-eye"></i>`;
            }
        });
        // hết tính năng xem mật khẩu ẩn hiện
    }
}
// hết form đăng kí, đăng nhập
