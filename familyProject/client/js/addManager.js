let familyId;

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
            familyId = data.familyId;
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
        // console.log(familyId, isManager, user); // כעת הנתונים זמינים לשימוש
        fetchUsers(familyId).then(result => { displayUsers(managers); })
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

initPage();

let managers = null;
const fetchUsers = async function (familyId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch(`http://localhost:3000/familyManager/${familyId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        managers = await response.json();
        console.log("managers==== " + managers[0]);

        return managers;
    } catch (error) {
        console.error('Error:', error);
    }
};

// fetchUsers(familyId).then(result => { displayUsers(managers); })

// הצגת רשימת המשתמשים
function displayUsers(managers) {
    console.log("managers==== " + managers[0]);
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    managers.forEach(manager => {
        const listItem = document.createElement('li');
        listItem.className = 'user-item';
        listItem.innerHTML = `
            <span>${manager.firstName + " " + manager.lastName}</span>
            <input type="checkbox" class="user-checkbox" data-user-id="${manager.userId}">
        `;
        userList.appendChild(listItem);
    });
}

// פונקציית סינון לפי החיפוש
function filterUsers() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        item.style.display = name.includes(searchValue) ? 'flex' : 'none';
    });
}

// פונקציה לעדכון המשתמשים שנבחרו כמנהלים
function setAdmins() {
    const selectedUsers = Array.from(document.querySelectorAll('.user-checkbox'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.dataset.userId);
    console.log("selectedUsers " + selectedUsers)

    selectedUsers.forEach(userId => {
        fetch(`http://localhost:3000/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isManager: true })
        }).then(response => response.json())
            .then(data => console.log(`User ${userId} updated`, data))
            .catch(error => console.error('Error updating user:', error));
    });
}