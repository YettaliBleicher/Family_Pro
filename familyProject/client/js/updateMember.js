const checkIdElement = document.getElementById("existMember");

//שליחת עידכון בן משפחה לשרת
const updateMemberData = async function (memberData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const { familyMemberId, ...data } = memberData; // שולפים את ה-id ושאר הנתונים
        console.log("data   " + JSON.stringify(data))
        const response = await fetch(`http://localhost:3000/familyMember/${familyMemberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("response   "+ await response)
        return await response.json();
    } catch (error) {
        checkIdElement.textContent = error.message || "An error occurred. Please try again.";

        console.error('Error:', error);
    }
};


function updateMember() {
    const form = document.getElementById('updateMemberForm');
    const formElements = form.elements;
    let formData = {};
    for (let element of formElements) {
        if (element.value || element.checked || element.type === 'radio') {
            if (element.type === 'radio') {
                if (element.checked) {
                    if (element.id === 'aliveYes') {
                        formData['isAlive'] = 1;
                    } else if (element.id === 'aliveNo') {
                        formData['isAlive'] = 0;
                    }
                }
            }
            else if (element.type === 'select-one' || element.type === 'text' || element.type === 'date') {
                if (element.id === 'familyMemberId') {
                    formData[element.id] = Number(element.value);
                } else if (element.id === 'genderId' && element.value !== '0') {
                    formData[element.id] = Number(element.value);
                } else if (element.id === 'statusId' && element.value !== '0') {
                    formData[element.id] = Number(element.value);
                } else if (element.id !== 'genderId' && element.id !== 'statusId') {
                    formData[element.id] = element.value;
                }
            }
            
        }
    }

    const familyMemberIdElment = document.getElementById("familyMemberId");

    updateMemberData(formData).then(result => {
        if (result.message === "Id isnt exists") {
            checkIdElement.textContent = "אין חבר משפחה עם מזהה זה";
            familyMemberIdElment.value="";
            return;
        }
        window.location.href="../html/managerHome.html"
    })
}



