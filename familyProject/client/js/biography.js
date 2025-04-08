
const familyMemberId = sessionStorage.getItem("memberIdToFindBiog");
const memberName = sessionStorage.getItem("memberName");
document.getElementById("memberName").textContent = memberName;

let initialBiography;
let member = {};

//קבלת הביוגרפיה
const getBiographyToMember = async function () {
    try {
        const response = await fetch(`http://localhost:3000/memberBiography/${familyMemberId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        // return await response.json();
        const data = await response.json();
        return data[0].biography;
    } catch (error) {
        console.error('Error:', error);
    }
};

//לעדכון ביוגרפיה
const updateMemberData = async function (memberData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const { id, ...data } = memberData; // שולפים את ה-id ושאר הנתונים
        console.log("data   " + JSON.stringify(data))
        const response = await fetch(`http://localhost:3000/memberBiography/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // console.log("response   "+ await response)
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};



// פונקציה לטעינת הביוגרפיה
function loadBiography(initialBiography) {
    document.getElementById("biographyDisplay").innerHTML = initialBiography;
}

// פונקציה להחלת גודל הטקסט הנבחר
function setFontSize(size) {
    document.execCommand("fontSize", false, size);
}

// פונקציה להחלת סוג הפונט הנבחר
function setFontName(fontName) {
    document.execCommand("fontName", false, fontName);
}

// פונקציות לעיצוב הטקסט
function formatText(command) {
    document.execCommand(command, false, null);
}

function setTextColor(color) {
    document.execCommand("foreColor", false, color);
}

function setHighlightColor(color) {
    document.execCommand("hiliteColor", false, color);
}

// פונקציה להחלפת מצב העריכה
function toggleEdit() {
    const editorContainer = document.querySelector('.editor-container');
    const biographyDisplay = document.getElementById("biographyDisplay");
    const editButton = document.getElementById("editButton");
    const editor = document.getElementById("editor"); // <--- שורה זו מגדירה משתנה עבור העורך


    if (editorContainer.classList.contains('hidden')) {
        // העברת תוכן הביוגרפיה לעורך
        document.getElementById("editor").innerHTML = biographyDisplay.innerHTML;
        editorContainer.classList.remove('hidden');
        biographyDisplay.style.display = 'none';
        editButton.textContent = 'סגור עריכה';
        editor.setAttribute("contenteditable", "true"); // <--- שורה זו מאפשרת עריכה בעורך

    } else {
        editorContainer.classList.add('hidden');
        biographyDisplay.style.display = 'block';
        editor.setAttribute("contenteditable", "false"); // <--- שורה זו מבטלת עריכה בעורך

        editButton.textContent = 'ערוך ביוגרפיה';
    }
}

// שמירת תוכן הביוגרפיה למסד נתונים
function saveContentToDatabase() {
    const content = document.getElementById("editor").innerHTML;
    console.log("Content to save:", content);
    member["id"] = familyMemberId;
    member["biography"] = content;

    updateMemberData(member).then(result=>{
        location.reload(); // רענון יקרה רק אחרי שהבקשה הסתיימה
    }

    );

    // כאן תוכלי להוסיף את הקוד לשליחת הנתונים לשרת
    // לדוגמה, שימוש ב-fetch כפי שהראיתי קודם
}

getBiographyToMember(familyMemberId)
    .then(biography => {
        loadBiography(biography);
    });

    function searchWikipedia() {
        const query = document.getElementById("searchInput").value;
        if (query) {
            window.open(`https://he.wikipedia.org/wiki/${encodeURIComponent(query)}`, '_blank');
        }
    }

    function searchGoogle() {
        const query = document.getElementById("searchInput").value;
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    }