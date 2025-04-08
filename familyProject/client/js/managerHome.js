let isManager;
let userEmail;
let userName;
let firstTime = true;
const form = document.getElementById('userForm');
const mainelement = document.getElementById('main');
const messageElement = document.getElementById('message'); // וודאי שיש אלמנט כזה ב-HTML
const userIcon = document.getElementById('user-icon'); // וודאי שיש אלמנט כזה ב-HTML
const container = document.getElementById("passwordContainer");




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
            isManager = data.isManager;
            userEmail = data.email;
            console.log()
            userIcon.textContent = data.firstName[0];



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
        await decodeToken(); 
        if (firstTime == true)
            createPage();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

initPage();

const createPage = () => {
    firstTime = false;
    const container = document.createElement("div");
    container.className = "container";

    const title = document.createElement("h1");
    title.textContent = "ניהול משפחה";
    container.appendChild(title);

    // מערך הכפתורים
    const buttonsData = [
        { text: "תרשים המשפחה", link: "family-tree.html" },
        { text: "הוספת מנהלים למשפחה", link: "./manager.html" },
        { text: "עדכון אישיים בעץ", link: "./updateMember.html" },
        // { text: "חיפוש קרובי משפחה", link: "search-relatives.html" }
    ];

    // אם המשתמש הוא מנהל, ניצור את כל הכפתורים, אחרת רק את הכפתור הראשון
    const buttonsToCreate = isManager ? buttonsData : [buttonsData[0]];

    // יצירת הכפתורים על פי המערך הרלוונטי
    buttonsToCreate.forEach(buttonData => {
        const button = document.createElement("button");
        button.className = "button";
        button.textContent = buttonData.text;
        button.onclick = () => window.location.href = buttonData.link;
        container.appendChild(button);
    });

    mainelement.appendChild(container);

};

let checkPassword = false;
const toggleUserForm = () => {
    container.textContent="";
    messageElement.textContent="";
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}


const changePassword = () => {
    checkPassword = true;
    // בחירת האלמנט שבו נכניס את כל האלמנטים הדינמיים

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
            const errorData = await response.json();
            throw new Error(errorData.error);

        }
        // console.log("response   "+ await response)
        return await response.json();
    } catch (error) {
        messageElement.textContent = error.message || "An error occurred. Please try again.";
    }
}

const updateUser = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    // messageElement = document.getElementById("message").value;
    let password;
    if (checkPassword === true) {
        password = document.getElementById("password")?.value || "";
        const verifyPassword = document.getElementById("verifyPassword")?.value || "";
        if (password !== verifyPassword) {
            messageElement.textContent="הסיסמאות אינן זהות";
            // console.log("psd: " + password);
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
            localStorage.setItem("token", result);
            // window.open('../html/introduction.html', '_self');
            alert("עודכן בהצלחה");
            form.style.display = form.style.display === 'block' ? 'none' : 'block';


        }


    })
}
// export{toggleUserForm, updateUser, changePassword}