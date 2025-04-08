let allUsers = null;

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    const userDetails = {
        email: email,
        userPassword: password
    };

    const logInUser = async function () {
        try {
            const users = await fetch('http://localhost:3000/logIn', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDetails)

            });
            return await users.json();
        } catch (error) {
            messageElement.textContent = "An error occurred. Please try again.";
        }
    };

    logInUser().then(result => {
        if (result.message === "סיסמא שגויה" || result.message === "משתמש לא קיים במערכת") {
            messageElement.textContent = result.message;
            return;
        }
        else {
            console.log("result  =" + result);
            localStorage.setItem("token", result);
            window.open('../html/managerHome.html', '_self');
        }
        // אם המשתמש נמצא במערכת, מעבירים אותו לדף הבית או לדף ייעודי
    })

});

