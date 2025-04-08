let messageElement = null;
let dest;
let isManager = 0;// הפונקציה מוסיפה את האלמנטים הדינאמיים ל-div
let currentFamilyId = null;

dest = sessionStorage.getItem("dest");
if (dest === "newFamily") {
    createDynamicElements();
}

//פונקציה ליצירת האלמנטים לבחירת סיסמא - יצירה דינאמית רק למנהל
function createDynamicElements() {
    const vertifyDiv = document.getElementById("vertifyFamilyPassword");
    const verifyInput = document.createElement("input");
    verifyInput.type = "password";
    verifyInput.id = "familyVertify";
    verifyInput.placeholder = "Verify Family Password";
    verifyInput.required = true;
    const iconSpan = document.createElement("span");
    iconSpan.className = "icon";
    iconSpan.textContent = "🔒";
    vertifyDiv.appendChild(verifyInput);
    vertifyDiv.appendChild(iconSpan);
}

//פונקציה
const addFamilyToData = async (familyPassword) => {
    // let messageElement;
    // let checkPasswordElement;
    console.log("lets start");
    // password = document.getElementById("familyPassword").value;
    let familyVerify = document.getElementById("familyVertify").value;
    // messageElement = document.getElementById("message");
    checkFamilyPasswordElement = document.getElementById("checkFamilyPassword");
    if (familyPassword !== familyVerify) {
        messageElement.textContent = "family passwords do not match";
        return;
    }

    const passwordToAdd = { "familyPassword": familyPassword };
    console.log("obg password = " + passwordToAdd.familyPassword);

    // addFamily(passwordToAdd).then(addFamily => {
    //     if (result.message === "Password already exists") {
    //         checkFamilyPasswordElement.textContent = "Password already exists";
    //         return;
    //     }
    //     familyId = addFamily.id;
    //     console.log("currentFamilyId = " + familyId);
    // })

    const addFamilyResult = await addFamily(passwordToAdd);

    if (addFamilyResult && addFamilyResult.message === "Password already exists") {
        checkFamilyPasswordElement.textContent = "Password already exists";
        return;
    }

    currentFamilyId = addFamilyResult.id;
    console.log("currentFamilyId = " + currentFamilyId);
}

//בקשה לשרת להוספת משפחה חדשה
const addFamily = async function (passwordToData) {
    console.log("in fetch");
    console.log("i am here! fetch")
    try {
        const response = await fetch('http://localhost:3000/family', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(passwordToData)
        });
        console.log("in fetch after server!");
        const addFamily = await response.json();
        console.log("result from fetch" + addFamily);
        return addFamily;
    } catch (error) {
        console.log("fetch error");
        messageElement.textContent = "An error occurred. Please try again.";
    }

}

//בקשה לשרת להוספת משתמש חדש
// const addUser = async function (userDetails) {
//     console.log("i am here! fetch")

//     try {
//         const response = await fetch('http://localhost:3000/user', {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(userDetails)
//         });

//         if (!response.ok) {
//             // אם השרת החזיר שגיאה, נשלוף את הודעת השגיאה מהתשובה
//             const errorData = await response.json();
//             // messageElement.textContent = errorData.error;
//             throw new Error(errorData.error);
//         }

//         console.log("in fetch after server!");
//         const result = await response.json();
//         console.log("result from fetch" + result);
//         return result;
//     } catch (error) {
//         console.log("fetch error");

//         messageElement.textContent = "An error occurred. Please try again.";
//     }
// }

const addUser = async function (userDetails) {
    console.log("i am here! fetch");

    try {
        const response = await fetch('http://localhost:3000/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        });

        if (!response.ok) {
            // שליפת הודעת השגיאה מהשרת אם קיימת שגיאה בתשובה
            const errorData = await response.json();
            throw new Error(errorData.error); // זריקת השגיאה עם הודעת השגיאה מהשרת
        }

        console.log("in fetch after server!");
        const result = await response.json();
        console.log("result from fetch: " + result);
        return result;
    } catch (error) {
        console.log("fetch error", error);

        // הצגת הודעת השגיאה על המסך
        const messageElement = document.getElementById('message'); // וודאי שיש אלמנט כזה ב-HTML
        messageElement.textContent = error.message || "An error occurred. Please try again.";
    }
};


//בקשה לשרת לקבלת קוד משפחה ע"פ סיסמא
const getFamilyIdByPassword = async function (familyPassword) {
    try {
        const response = await fetch(`http://localhost:3000/familyPassword/${familyPassword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ familyPassword })
        });
        const data = await response.json();
        return data.familyId;
    } catch (error) {
        console.error('Error:', error);
    }
};

//פונקציה שנקראת בעת לחיצה על הכפתור
const signUp = async () => {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const verify = document.getElementById("vertify").value;
    messageElement = document.getElementById("message");
    const checkEmailElement = document.getElementById("checkEmail");
    const familyPassword = document.getElementById("familyPassword").value;
    const checkPasswordElement = document.getElementById("checkPassword");

    if (dest === "newFamily") {
        console.log("i am manager start");
        isManager = 1;
        if (currentFamilyId == null) {
            console.log("check if family already exist currentFamilyId = " + currentFamilyId);
            await addFamilyToData(familyPassword);
        }
    }
    else {
        currentFamilyId = await getFamilyIdByPassword(familyPassword);
        console.log(JSON.stringify(currentFamilyId))
        if (currentFamilyId==null) {
            checkPasswordElement.textContent = "סיסמת משפחה שגויה";
            return;
        }
        console.log("currentFamilyId//// " + currentFamilyId);
    }
    // בדיקה בסיסית אם הסיסמאות תואמות לפני שליחה לשרת
    if (password !== verify) {
        messageElement.textContent = "Passwords do not match";
        return;
    }

    const userDetails = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userPassword: password,
        familyId: currentFamilyId,
        isManager: isManager
    };


    await addUser(userDetails).then(result => {
        console.log("result====" + result);
        console.log("result.message------" + result.message)

        console.log("Type of result.message:", typeof result.message);
        console.log("Content of result.message:", result.message);

        if (result.message === "Email already exists") {
            console.log("i am hear in the error message");
            checkEmailElement.textContent = "Email already exists";
            return;
        }
        else if (result.message === "Password already exists") {
            checkPasswordElement.textContent = "Password already exists";
            return;
        }
        else {
            console.log("result  =" + result);
            localStorage.setItem("token", result);
            window.open('../html/managerHome.html', '_self');

        }
    });

}