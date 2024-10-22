const signUp = document.querySelector(".sign-up");
if(signUp) {
    const passWordInput = signUp.querySelector("input[type='password']");

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
