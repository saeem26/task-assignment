function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    if (username === "saeem" && password === "2646") {
        message.style.display = "none";
        // Smooth transition
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "add_employee.html";
        }, 300);
    } else {
        message.textContent = "Invalid username or password";
        message.style.display = "block";
        message.style.animation = "shake 0.5s";
        setTimeout(() => {
            message.style.animation = "";
        }, 500);
    }
}
