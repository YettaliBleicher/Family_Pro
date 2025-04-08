// import { updateUser } from "../../server/service/user";
let userEmail = null;
let checkPassword = false;
const toggleUserForm = () => {
    const form = document.getElementById('userForm');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}


const changePassword = () => {
    checkPassword = true;
    // בחירת האלמנט שבו נכניס את כל האלמנטים הדינמיים
    const container = document.getElementById("passwordContainer");

    // יצירת האלמנטים
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "סיסמא:";
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.type = "password";
    passwordInput.name = "password";

    const verifyLabel = document.createElement("label");
    verifyLabel.textContent = "אימות סיסמה:";

    const verifyPasswordInput = document.createElement("input");
    verifyPasswordInput.id = "verifyPassword";
    verifyPasswordInput.type = "password";
    verifyPasswordInput.name = "verifyPassword";

    // הוספת האלמנטים שנוצרו למכולה
    container.appendChild(passwordLabel);
    container.appendChild(passwordInput);
    container.appendChild(document.createElement("br")); // ירידת שורה
    container.appendChild(verifyLabel);
    container.appendChild(verifyPasswordInput);

}

// הפונקציה מבצעת בקשת fetch לנתיב ומעבירה את הטוקן בכותרות
const decodeToken = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('http://localhost:3000/getUserData', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json(); // המרת התשובה ל-JSON

            console.log("in decoded - " + JSON.stringify(data))
            userEmail = data.email;
            resolve();  // הפונקציה הסתיימה בהצלחה
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            reject(error);  // אם קרתה שגיאה, הפונקציה לא הושלמה
        }
    });
}

// פונקציה עזר שתמתין להשלמת decodeToken לפני שמבצעת פעולות נוספות
const initPage = async () => {
    try {
        await decodeToken(); // מחכים שהפונקציה `decodeToken` תסתיים
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}


const updateUserInData = async (user) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        // const { id, ...data } = user; // שולפים את ה-id ושאר הנתונים
        console.log("data   " + JSON.stringify(user));
        console.log("data   " + userEmail);
        const response = await fetch(`http://localhost:3000/updateUser/'${userEmail}'`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("response   "+ await response)
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

const updateUser = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const messageElement = document.getElementById("message").value;
    let password;
    if (checkPassword === true) {
        password = document.getElementById("password")?.value || "";
        const verifyPassword = document.getElementById("verifyPassword")?.value || "";
        if (password !== verifyPassword) {
            console.log("psd: " + password);
            return;
        }
    }
    await initPage();
    user = {};
    if (firstName != "")
        user["firstName"] = firstName;
    if (lastName != "")
        user["lastName"] = lastName;
    if (checkPassword === true && password != "")
        user["userPassword"] = password;
    console.log(JSON.stringify(user));
    updateUserInData(user).then(result => {
        if (result.message === "Password already exists") {
            alert("Password already exists")
            // messageElement.textContent = "Password already exists";
            console.log("return");
            return;
        }
        else {
            console.log("result  =" + result);
            localStorage.setItem("token",result);
            // window.open('../html/introduction.html', '_self');
            alert("עודכן בהצלחה");

        }


    })
}
// export{toggleUserForm, updateUser, changePassword}