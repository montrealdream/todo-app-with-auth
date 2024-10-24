import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

// Tính năng quên mật khẩu
const forgotPassWordForm = document.querySelector("[forgot-password]");
if(forgotPassWordForm) {
    forgotPassWordForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = forgotPassWordForm.email.value;
        if(email) {
            // cách 1: Cách này thì phải setup tên miền local thì 127.0.0.1
            /** 
             *  giải thích: cách này thì không cần dùng trang otp vì khi nhận mail sẽ nhấn vào link, link đó sẽ yêu cầu bạn nhập mật khẩu mới. 
             * 
             *  thì sau khi vào link nhập mật khẩu mới thì nó sẽ chuyển hướng trang web theo url
            */
            const actionCodeSettings = {
                url: `http://127.0.0.1:5500/FrontEnd/todo-app-with-auth/login.html`
            }
            sendPasswordResetEmail(auth, email, actionCodeSettings)
                .then(() => {
                    showAlert("Đã gửi email thành công", "success", 5000);
                    // Password reset email sent!
                    // ..
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showAlert("Gửi email thất bại", "error", 5000);
                    // ..
                });
            // hết cách 1
        }
        
    });
}
// Hết Tính năng quên mật khẩu

// Lấy user đang đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {   
        const headerUser = headerTodo.querySelector(".header__user");
        const uid = user.uid;
        const email = user.email;
        const fullName = user.displayName;
        
        // thêm danh sách các thông tin
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "header__user-info");
        newDiv.innerHTML = `
            <div class="header__info-item">
                ${fullName}
            </div>
            <div class="header__info-item">
                    ${email}
            </div>
            <div class="header__info-item">
                <span>Chế độ tối</span>
                <div class="dark-mode"></div>
            </div>

            <div class="header__info-item" btn-logout>
                    Đăng xuất
            </div>
        `;

        headerUser.appendChild(newDiv);
        headerUser.querySelector("img").src = user.photoURL; // add ảnh của user vào khi đăng nhập
        headerUser.style.display = "flex"; // hiển thị lên

        // Tính năng đăng xuất
        const logOut = headerTodo.querySelector("[btn-logout]");
        if(logOut) {
            logOut.addEventListener("click", event => {
                signOut(auth)
                .then(() => {
                    // Sign-out successful.
                    window.location.href = "login.html";
                    showAlert("Đăng xuất thành công", "success", 5000);
                })
                .catch((error) => {
                    // An error happened.
                });
    });
}
// Hết Tính năng đăng xuất
    } 
    else {
        // User is signed out
        // ...
    }
});
// Hết Lấy user đang đăng nhập

// Khi nhấn vào hình ảnh, show ra thông tin và lựa chọn của user
const openInfoUser = document.querySelector("[open-info-user]");
if(openInfoUser) {
    openInfoUser.addEventListener("click", event => {
        const userInfo = openInfoUser.querySelector(".header__user-info");
        userInfo.classList.toggle("header__user-info-show");
    });
}
// Hết Khi nhấn vào hình ảnh, show ra thông tin và lựa chọn của user

// show password khi đăng ký đăng nhập
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
// hết show password khi đăng ký đăng nhập

// khi nhấn ra bên ngoài sẽ tắt các cái đang show
document.addEventListener("click" , event => {  
    // ... từ từ sẽ xử lý
});
// hết khi nhấn ra bên ngoài sẽ tắt các cái đang show
 
// Tính năng đăng nhập với tài khoản Google
const loginGoogle = document.querySelector("[login-google]");
if(loginGoogle) {
    const provider = new GoogleAuthProvider(); 
    loginGoogle.addEventListener("click", event => {
        // Your web app's Firbase configuration Google
        signInWithPopup(auth, provider)
            .then((result) => {
                // đăng nhập thành công
                window.location.href = "index.html";
            })
            .catch((error) => {
                showAlert("Đăng nhập thất bại", "error", 5000);
            });
    });
}
// Hết Tính năng đăng nhập với tài khoản Google
