import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile    } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

const headerTodo = document.querySelector(".header");
const headerUser = headerTodo.querySelector(".header__user");

// Tính năng đăng ký
const signUpForm = document.querySelector("[sign-up]");
if(signUpForm) {
    // lắng nghe sự kiện submit form đăng ký
    signUpForm.addEventListener("submit", event => {
        event.preventDefault(); // chặn sự kiện mặc định

        const email = signUpForm.email.value;
        const password = signUpForm.password.value;

        if(email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // update profile cho user nè (tạo thành công thì update)
                    updateProfile(auth.currentUser, {
                        displayName: signUpForm.fullName.value, 
                        photoURL: "https://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
                    });

                    // Signed up (khi đăng kí thành công thì nó đăng nhập lun nha)
                    const user = userCredential.user;

                    // chuyển hướng trang và show alert
                    window.location.href = "index.html";
                    showAlert("Đăng ký tài khoản thành công", "success", 3000);
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

// Hết Tính năng đăng ký

// Tính năng đăng nhập
const loginForm = document.querySelector("[login]");
if(loginForm) {
    // lắng nghe sự kiện submit form đăng nhập
    loginForm.addEventListener("click", event => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        if(email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    if(user) {
                        window.location.href = "index.html"; // chuyển đến trang chủ todo app khi đã đăng nhập thành công
                        showAlert("Đăng nhập thành công", "success", 5000);
                    }
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showAlert("Đăng nhập thất bại", "error", 5000);
                });
        }
    });
}
// Hết Tính năng đăng nhập

// Tính năng đăng xuất
const logOut = headerTodo.querySelector("[btn-logout]");
if(logOut) {
    logOut.addEventListener("click", event => {
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "login.html";
            showAlert("Đăng xuất thành công", "success", 5000);
          }).catch((error) => {
            // An error happened.
          });
    });
}
// Hết Tính năng đăng xuất

// Lấy user đang đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const email = user.email;
        
        // add email đang đăng nhập vào
        headerUser.querySelector(".header__user-email").innerHTML = email;
        headerUser.style.display = "flex"; // hiển thị lên
        console.log(user);
    } 
    else {
        // User is signed out
        // ...
    }
});
// Hết Lấy user đang đăng nhập

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
