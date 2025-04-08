let familyId;
let isManager;
let user;

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
            familyId = data.familyId;
            isManager = data.isManager;
            user = `${data.firstName} ${data.lastName}`;

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
        console.log(familyId, isManager, user); // כעת הנתונים זמינים לשימוש
        createFamilyTree();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

initPage();


let familyMap = null;
let realtionshipToNode = null;
let allMembers = null;
let realationShipForMember = null;
let firstTime = true;
// let allUsers = null;

let startButton; 

//פונקציה ליצירת הכפתור, שיהי גלובלי וניתן להסרה
function createStartButton() {
    startButton = document.createElement("button");
    startButton.textContent = "בואו נתחיל!";
    startButton.classList.add("start-button");
    startButton.id="style";
    startButton.onclick = () => {
        removeStartButton();

        document.getElementById("formContainer2").style.display = "block";
    };
    document.body.appendChild(startButton);
}

//פונקצייה להסרת הכפתור
function removeStartButton() {
    if (startButton) {
        startButton.remove();
        startButton = null; // מאתחלים את המשתנה כדי לא לשמור על אלמנטים מיותרים בזיכרון
    }
}

const checkFunctionToOpen = () => {
    if (firstTime) {
        startFirstNode();
    } else {
        addMemberInForm();
    }
}


//קבלת כל הקשרים של המשפחה מהשרת
const realationShip = async function () {
    try {
        const response = await fetch('http://localhost:3000/getRealationshipData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ familyId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//קבלת כל חברי המשפחה מהשרת
const members = async function () {
    try {
        const response = await fetch('http://localhost:3000/getFamilyMemberData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ familyId })
        });
        if (!response.ok) {
            const errorMsg = `Failed to to fatch. Status: ${response.status}, ${response.statusText}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//קבלת כל משתמשי המשפחה מהשרת
const getUsersByFamilyId = async function () {
    try {
        const response = await fetch('http://localhost:3000/usersOfFamily', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ familyId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//שליחת עידכון בן משפחה לשרת
const updateMemberData = async function (memberData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const { id, ...data } = memberData; // שולפים את ה-id ושאר הנתונים
        console.log("data   " + JSON.stringify(data))
        const response = await fetch(`http://localhost:3000/familyMember/${id}`, {
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
        console.error('Error:', error);
    }
};

//הוספת עידכון קשר בן משפחה לשרת
const addFamilyRealationship = async function (femilyRealationship) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch(`http://localhost:3000/familyRealationShip`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(femilyRealationship)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//בקשה לשרת להוספת חבר משפחה חדש
const addFamilyMemberToData = async function (memberData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch('http://localhost:3000/familyMember', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memberData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const addedMember = await response.json();
        console.log('Added family member:', addedMember);
        return addedMember;
    } catch (error) {
        console.error('Error:', error);
    }
};

//בקשה לעדכון פרופיל של בן משפחה
const updateProfile = async function (memberId, file) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const formData = new FormData();
        formData.append("myFile", file);

        const response = await fetch(`http://localhost:3000/uploadProfile/${memberId}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        // בדוק אם התגובה תקינה
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//add file
const addFile = async function (memberId, file) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const formData = new FormData();
        formData.append("myFile", file);

        const response = await fetch(`http://localhost:3000/upload/${memberId}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        // בדוק אם התגובה תקינה
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

//פונקציה ליצירת חוליה ראשונה במידה והעץ ריק
const startFirstNode = () => {
    const addFamilyMember = {};

    const formFields = document.getElementById("familyMemberForm2");
    const inputs = formFields.querySelectorAll("input");
    const selects = formFields.querySelectorAll("select");
    const textarea = formFields.querySelector("textarea");

    const isAlive = formFields.querySelector('input[name="alive"]:checked');
    addFamilyMember["isAlive"] = isAlive ? isAlive.value === "כן" ? 1 : 0 : null;

    inputs.forEach(input => {
        if (input.name !== "alive") {
            const label = input.id;

            if (input.type === "date" && input.value) {
                addFamilyMember[label] = new Date(input.value).toISOString().split('T')[0];
            } else {
                addFamilyMember[label] = input.value !== "" ? input.value : null;
            }
        }
    });

    selects.forEach(select => {
        const label = select.id;

        // if (select.multiple) {
        //     // אם זה שדה בחירה מרובה, אוספים את כל הערכים שנבחרו
        //     const selectedValues = Array.from(select.selectedOptions)
        //         .map(option => option.value)
        //         .filter(value => value !== "0"); // מסננים ערכים שאינם נבחרים בפועל

        //     addFamilyMember[label] = selectedValues.length > 0 ? selectedValues : null;
        // } else {
        // אם זה לא בחירה מרובה, אוספים ערך אחד
        const selectedOption = select.options[select.selectedIndex];
        const selectedId = selectedOption.id;

        addFamilyMember[label] = selectedId !== "0" ? selectedId : null;
        // }
    });

    if (textarea) {
        const label = textarea.id;
        addFamilyMember[label] = textarea.value !== "" ? textarea.value : null;
    }

    addFamilyMember["familyId"] = familyId;

    console.log(addFamilyMember);


    addFamilyMemberToData(addFamilyMember).then(addedMember => {
        // console.log('Added family member:', addedMember);
        location.reload(); // רענון יקרה רק אחרי שהבקשה הסתיימה
    }).catch(error => {
        console.error('Error adding family member:', error);
    });
}

//יצירת הנתונים של עץ משפחה ספציפי
const createFamilyTree = async () => {
    const [familyMembers, relationships] = await Promise.all([members(), realationShip()]);
    let copy_relationships = [...relationships];
    realtionshipToNode = [...relationships];
    allMembers = [...familyMembers];

    familyMap = familyMembers.reduce((acc, member) => {
        const firstName = member.firstName == null ? "" : member.firstName;
        const lastName = member.lastName == null ? "" : member.lastName;
        acc[member.familyMemberId] = {
            id: member.familyMemberId,
            birthDate: member.birthDate,
            deathDate: member.deathDate,
            youthName: member.youthName,
            biography: member.biography,
            genderType: member.gender,
            photoPath: member.photoPath,
            statusType: member.status,
            isAlive: member.isAlive,
            birthCountry: member.birthCountry,
            // profile: member.photoPath,
            name: firstName + " " + lastName,
            children: [],
            partner: null,
            visit_child: false,
            visit_partner: false,
            root: true
            // visit: false

        };
        return acc;
    }, {});

    Object.keys(familyMap).forEach(familyMemberId => {
        const member = familyMap[familyMemberId];

        const filteredRelations = copy_relationships
            .map((relation, index) => ({ relation, index })) // יוצר אובייקטים שמכילים את הרשומה והאינדקס
            .filter(item =>
                item.relation.familyMemberId1 == familyMemberId || item.relation.familyMemberId2 == familyMemberId
            );


        filteredRelations.forEach(fr => {
            if (fr.relation.relationshipType === 'בן זוג') {
                member.visit_partner = true;
                member.partner = true;

                if (fr.relation.familyMemberId1 == familyMemberId) {
                    if (!familyMap[fr.relation.familyMemberId2].visit_partner)
                        member.partner = familyMap[fr.relation.familyMemberId2];
                }
                else {
                    if (!familyMap[fr.relation.familyMemberId1].visit_partner)
                        member.partner = familyMap[fr.relation.familyMemberId1];
                }
            }

            else {
                if (fr.relation.familyMemberId2 == familyMemberId) {
                    member.root = false;
                    if (!member.visit_child) {

                        member.visit_child = true;
                        familyMap[fr.relation.familyMemberId1].children.push(member);
                    }

                }
                else {
                    if (!familyMap[fr.relation.familyMemberId2].visit_child) {
                        familyMap[fr.relation.familyMemberId2].visit_child = true;
                        member.children.push(familyMap[fr.relation.familyMemberId2]);
                    }
                }
            }

            relationships.splice(fr.relation.index, 1);

        });


    });


    // כאן ניצור את העץ
    const treeData = [];

    Object.keys(familyMap).forEach(memberId => {

        const member = familyMap[memberId];
        const memberNode = {
            id: member.id,
            birthDate: member.birthDate,
            deathDate: member.deathDate,
            youthName: member.youthName,
            biography: member.biography,
            genderType: member.genderType,
            photoPath: member.photoPath,
            statusType: member.statusType,
            isAlive: member.isAlive,
            birthCountry: member.birthCountry,
            name: member.name,
            children: member.children,
            partner: member.partner,
            // visit: true,
            root: member.root
        };

        treeData.push(memberNode);


    });

    const treeData1 = treeData.filter(item => item.root /*&& item.partner !== true*/);

    console.log(treeData1);

    if (treeData1.length > 0) {
        const svgContainer = document.getElementById('svgContainer');

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "familyTree");
        svg.setAttribute("width", "2000");
        svg.setAttribute("height", "2000");
        svgContainer.appendChild(svg);

        firstTime = false;
        drawTree(treeData1);
    }
    else {
        createStartButton();
    }
};

// ציור העץ משפחה כתרשים
const drawTree = (data) => {
    const svg = d3.select("#familyTree");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const root = d3.hierarchy({ children: data });
    const treeLayout = d3.tree().size([height + 100, width + 200]);
    treeLayout(root);

    const link = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    const links = svg.selectAll(".link")
        .data(root.links().filter(d => d.source.depth > 0))
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    const nodes = svg.selectAll(".node")
        .data(root.descendants().slice(1))
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    const familyGroup = nodes.append("g")
        .attr("class", "familyGroup");

    familyGroup.append("rect")
        .attr("x", -70)
        .attr("y", -40)
        .attr("width", 200)
        .attr("height", 80)
        .attr("rx", 10)
        .attr("fill", "lightgray")
        .attr("stroke", "#007BFF")
        .attr("stroke-width", 2);

    familyGroup.append("circle")
        .attr("cx", -35)
        .attr("cy", 0)
        .attr("r", 25)
        .attr("fill", "white")
        .attr("stroke", "#007BFF")
        .attr("id", "profile")
        .attr("stroke-width", 2);

    familyGroup.append("image")
        .attr("id", d => `profile-${d.data.id}`)  // הוספת id ייחודי לכל תמונה
        .attr("href", d => d.data.photoPath? d.data.photoPath : "../pictures/profile2.jpg")
        .attr("x", -60)
        .attr("y", -25)
        .attr("width", 50)
        .attr("height", 50)
        .attr("clip-path", "circle(25px at 25px 25px)");

    familyGroup.append("foreignObject")
        .attr("x", -45)
        // .attr("y", -1)
        .attr("width", 20)
        .attr("height", 20)
        .append("xhtml:button")
        .attr("class", "editButton")
        .attr("title", "העלאת תמונת פרופיל")
        .html("📷")
        .on("click", (event, d) => updateProfileImage(d.data.id));

    familyGroup.append("foreignObject")
        .attr("x", -7)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 30)
        .append("xhtml:div")
        .attr("class", "nameLabel")
        .html(d => d.data.name);

    // כפתור לפתיחת הטופס
    familyGroup.append("foreignObject")
        .attr("x", 10)
        .attr("y", 5)
        .attr("width", 30)
        .attr("height", 30)
        .append("xhtml:button")
        .attr("class", "actionButton")
        .attr("title", "פרטים מלאים")
        .html("📄")
        .on("click", (event, d) => openForm(d.data));

    // כפתור להוספת בן משפחה
    familyGroup.append("foreignObject")
        .attr("x", 50)
        .attr("y", 5)
        .attr("width", 30)
        .attr("height", 30)
        .append("xhtml:button")
        .attr("class", "actionButton")
        .attr("title", "הוספת בן משפחה")
        .html("+")
        .on("click", (event, d) => openSelectTypeMember(d.data));


    familyGroup.append("foreignObject")
        .attr("x", 90)
        .attr("y", 5)
        .attr("width", 30)
        .attr("height", 30)
        .append("xhtml:button")
        .attr("class", "actionButton")
        .attr("title", "העלאת טפסים")
        .html(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  `)

        .on("click", (event, d) => {
            // יצירת input מסוג file נסתר והפעלתו בלחיצה
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.name = "myFile";
            fileInput.accept = "image/png, image/jpeg, image/jpg, video/*";
            fileInput.style.display = "none";
            fileInput.onchange = () => {
                uploadFiles(d.data.id, fileInput.files[0]);
            };
            fileInput.click();
        })// פותח את חלון העיון


    nodes.filter(d => d.data.partner === true)
        .each(function (d) {

            const firstPartnerRelation = realtionshipToNode.find(r =>
                (r.familyMemberId1 == d.data.id || r.familyMemberId2 == d.data.id) &&
                r.relationshipType === 'בן זוג'
            );
            let partnerId;

            if (firstPartnerRelation) {
                partnerId = firstPartnerRelation.familyMemberId1 == d.data.id
                    ? firstPartnerRelation.familyMemberId2
                    : firstPartnerRelation.familyMemberId1;
                d.data.partner = familyMap[partnerId];
            }
        })

    nodes.filter(d => d.data.partner && d.data.partner !== true)
        .each(function (d) {
            const partnerNode = nodes.filter(node => node.data.id === d.data.partner.id).data()[0];
            let partnerX = null;
            let partnerY = null;
            if (partnerNode) {
                partnerX = partnerNode.y;
                partnerY = partnerNode.x;
            } else {
                partnerX = d.y;
                partnerY = d.x;
            }

            if (d.data.statusType === "גרוש" || d.data.statusType === "גרושה") {
                d3.select(this.parentNode).append("line")
                    .attr("class", "linkPrevPartner")
                    .attr("x1", d.y - 70)
                    .attr("y1", d.x)
                    .attr("x2", partnerX - 70)
                    .attr("y2", partnerY);
            }
            else {
                d3.select(this.parentNode).append("line")
                    .attr("class", "linkPartner")
                    .attr("x1", d.y - 70)
                    .attr("y1", d.x)
                    .attr("x2", partnerX - 70)
                    .attr("y2", partnerY);
            }
        });
};

//פונקציה לפתיחת פרטים 
const openForm = (data) => {

    document.getElementById('parents').innerHTML = '';
    document.getElementById('formFields').innerHTML = '';
    document.getElementById('profile').innerHTML = '';
    const formFields = document.getElementById("formFields");
    formFields.innerHTML = "";
    const profile = document.getElementById("profile");
    profile.innerHTML = "";

    if (data.photoPath) {
        const fieldHtml = `
                <br>
                <div class="image-container">
                    <img src="${data.photoPath}" class="image-preview" />
                </div><br>
            `;
        profile.innerHTML += fieldHtml;
    }
    const currentRealationshipParent = realtionshipToNode.filter(rel =>
        rel.familyMemberId2 === data.id && rel.relationshipType === 'הורה-ילד'
    );

    console.log("currentRealationshipParent  " + currentRealationshipParent);

    const parents = currentRealationshipParent
        .map(rel => allMembers.find(member => member.familyMemberId === rel.familyMemberId1));

    console.log(parents);

    if (parents.length > 0) {
        const parentsFields = document.getElementById("parents");
        parentsFields.innerHTML = "";
        let parentsHtml;

        if (parents.length === 1) {
            parentsHtml = `
            <label>${parents[0].gender === "זכר" ? "אב" : parents[0].gender === "נקבה" ? "אם" : "הורה"}:</label>
            <input type="text" value="${parents[0].firstName} ${parents[0].lastName}"readonly><br>
        `;
        } else if (parents.length === 2) {
            const father = parents.find(parent => parent.gender === "זכר");
            const mother = parents.find(parent => parent.gender === "נקבה");
            const unknownParents = parents.filter(parent => parent.gender === "לא ידוע");

            parentsHtml = '';

            if (father) {
                parentsHtml += `
                <label>אב:</label>
                <input type="text" value="${father.firstName} ${father.lastName}"readonly  /><br>
            `;

            }

            if (mother) {
                parentsHtml += `
                <label>אם:</label>
                <input type="text" value="${mother.firstName} ${mother.lastName}" readonly /><br>
            `;

            }
            unknownParents.forEach((parent, index) => {
                parentsHtml += `
                <label>הורה ${index + 1}:</label>
                <input type="text" value="${parent.firstName} ${parent.lastName}"readonly  /><br>
            `;
            });
        }

        parentsFields.innerHTML += parentsHtml;
    }

    document.getElementById("memberName").innerText = `פרטים של ${data.name}`;
    formFields.innerHTML += `<input type="hidden" id="memberId" value="${data.id}">`;

    const addField = (key, label, value, isDate = false, readonly = false) => {
        let formattedValue = value;

        if (isDate && value) {
            const date = new Date(value);
            formattedValue = date.toISOString().split('T')[0]; // פורמט YYYY-MM-DD
        }
        if (!readonly) {
            const fieldHtml = `
            <label id="${key}">${label}:</label>
            <input type="${isDate ? 'date' : 'text'}" value="${formattedValue || ''}"><br>
        `;
            formFields.innerHTML += fieldHtml;
        }
        else {
            const fieldHtml = `
            <label id="${key}">${label}:</label>
            <input type="${isDate ? 'date' : 'text'}" value="${formattedValue || ''}"readonly><br>
        `;
            formFields.innerHTML += fieldHtml;
        }
    };

    // פונקציה להוספת שדות בחירה
    const addSelect = (key, label, value) => {
        const options = label === 'מין'
            ? { 'זכר': 1, 'נקבה': 2, 'לא ידוע': 3 }
            : { 'רווק': 2, 'נשוי': 3, 'פרוד': 4, 'גרוש': 5, 'אלמן': 6, 'רווקה': 7, 'נשואה': 8, 'פרודה': 9, 'גרושה': 10, 'אלמנה': 11, '': 0 };


        const defaultOption = value || ''; // אם value הוא null או ריק, ישמש כערך ברירת מחדל

        const fieldHtml = `
        <label id="${key}">${label}:</label>
        <select>
            ${Object.entries(options).map(([keyOfdict, val]) => `
                <option id="${val}" value="${val}" ${keyOfdict === defaultOption ? 'selected' : ''}>${keyOfdict}</option>
            `).join('')}
        </select><br>
        `;

        formFields.innerHTML += fieldHtml;
    };
    const fullName = data.name.trim();
    const nameParts = fullName.split(" ");

    const dLastName = nameParts.pop();
    const dFirstName = nameParts.join(" ");

    addField("firstName", "שם פרטי", dFirstName);
    addField("lastName", "שם משפחה", dLastName);

    addField("birthDate", "תאריך לידה", data.birthDate, true);
    addField("deathDate", "תאריך פטירה", data.deathDate, true);
    addField("youthName", "שם נעורים", data.youthName);
    addSelect("genderId", "מין", data.genderType);
    addSelect("statusId", "סטטוס חברתי", data.statusType);

    if (data.partner) {
        addField("partner", "בן זוג", data.partner.name, false, true);
    }

    const addIsAliveField = (gender, isAlive) => {
        const label = gender === "נקבה" ? "חיה" : "חי";
        const fieldHtml = `
            <label>${label}:</label><br>
            <label>
                <input type="radio" name="isAlive" value="true" ${isAlive ? 'checked' : ''}>
                כן
            </label>
            <label>
                <input type="radio" name="isAlive" value="false" ${!isAlive ? 'checked' : ''}>
                לא
            </label><br>
        `;
        formFields.innerHTML += fieldHtml;
    };

    addIsAliveField(data.genderType, data.isAlive);
    addField("birthCountry", "ארץ לידה", data.birthCountry);

    document.getElementById("formContainer").style.display = "block";
    document.getElementById("svgContainer").classList.add("inactive");

};

//פונקציה לעריכת פרטי איש משפחה מתוך החוליה עצמה
const updateMember = () => {
    const formFields = document.getElementById("formFields");
    const inputs = formFields.querySelectorAll("input");
    const selects = formFields.querySelectorAll("select");
    const updatedData = {};

    // ה-ID מהשדה המוסתר
    const memberId = document.getElementById("memberId").value;
    updatedData["isAlive"] = formFields.querySelector('input[name="isAlive"]:checked').value !== ""
        ? formFields.querySelector('input[name="isAlive"]:checked').value
        : null;
    updatedData["id"] = memberId;

    inputs.forEach(input => {
        if (input.type !== "hidden" && input.name != "isAlive" && input.previousElementSibling.id != "partner") {
            const label = input.previousElementSibling.id;

            if (input.type === "date" && input.value) {
                // וידוא שהפורמט הוא YYYY-MM-DD
                updatedData[label] = new Date(input.value).toISOString().split('T')[0];
            } else {
                updatedData[label] = input.value !== "" ? input.value : null;
            }
        }
    });

    selects.forEach(select => {
        const label = select.previousElementSibling.id;
        const selectedOption = select.options[select.selectedIndex];
        const selectedId = selectedOption.id;

        updatedData[label] = selectedId != 0 ? selectedId : null;
    });

    if (isManager==1) {
        updateMemberData(updatedData).then(data => {
            console.log('Updated member data:', data);
            location.reload();
        });
    } else {
        const setToEmail = async () => {
            try {
                const allUsers = await getUsersByFamilyId();
                if (allUsers && Array.isArray(allUsers) && allUsers.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allUsers.length);
                    const manager = allUsers[randomIndex];
                    if (manager) {
                        return manager.email;
                    } else {
                        console.error('No manager found for this family.');
                        return null;
                    }
                } else {
                    console.error('Failed to retrieve users.');
                    return null;
                }
            } catch (error) {
                console.error('Error setting toEmail:', error);
                return null;
            }
        };

        setToEmail().then(email => {
            if (email) {
                updatedData["toEmail"] = email;
                updatedData["user"] = user;
                sessionStorage.setItem("memberData", JSON.stringify(updatedData));
                window.location.href = "sendEmails.html";
            } else {
                console.error('Failed to set the email.');
            }
        });
    }
};

// פונקציה לבחירת סוג חבר להוספה - נפתח בעת לחיצה על כפתור ההוספה
const openSelectTypeMember = (data) => {
    event.stopPropagation();

    // הסרת תפריט קיים אם יש כזה
    d3.select(".dropdown").remove();

    // יצירת תפריט חדש
    const dropdown = d3.select("body")
        .append("div")
        .attr("class", "dropdown")
        .style("position", "absolute")
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`)
        .style("background-color", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)")
        .style("padding", "10px")
        .style("z-index", 1000);


    const currentRealationshipParent = realtionshipToNode.filter(rel =>
        rel.familyMemberId2 === data.id && rel.relationshipType === 'הורה-ילד'
    );

    const currentRealationshipSpouse = realtionshipToNode.filter(rel =>
        (rel.familyMemberId1 === data.id || rel.familyMemberId2 === data.id) && rel.relationshipType === 'בן זוג'
    );

    let options = [];
    if (currentRealationshipParent.length == 2) {
        options = ["בן/ת זוג (נוכחי, לשעבר)", "ילד"];
    }
    else {
        options = ["הורה", "בן/ת זוג (נוכחי, לשעבר)", "ילד"];
    }

    options.forEach(option => {
        dropdown.append("div")
            .attr("class", "dropdown-item")
            .style("padding", "8px")
            .style("cursor", "pointer")
            .text(option)
            .on("click", () => {
                openNewMember(option, data.id);
                dropdown.remove();
            })
            .on("mouseover", function () {
                d3.select(this).style("background-color", "#f0f0f0");
            })
            .on("mouseout", function () {
                d3.select(this).style("background-color", "#fff");
            });
    });

    // סגירת התפריט בלחיצה מחוץ אליו
    d3.select("body").on("click", () => {
        dropdown.remove();
    });
};

//לאחר שנבחר סוג קשר להוספה נשמרים הנתונים של מי שאליו מוסיפים ואיזה קשר מוסיפים.
const openNewMember = (typeMemberToAdd, srcFamilyMemberId) => {

    sessionStorage.setItem("typeMemberToAdd", typeMemberToAdd);
    sessionStorage.setItem("srcFamilyMemberId", srcFamilyMemberId);

    const formMember = document.getElementById('dynamicSelectContainer');
    formMember.innerHTML = '';


    if (typeMemberToAdd === 'ילד') {

        //מציאת כל הבני זוג של מי שהוספנו לו (למקרה שנוסיף לו ילד שנדע לאיזה הורה נוסף לקשר אותו.)
        const currentRealationshipSpouse = realtionshipToNode.filter(rel =>
            (rel.familyMemberId1 == srcFamilyMemberId || rel.familyMemberId2 == srcFamilyMemberId) && rel.relationshipType === 'בן זוג'
        );

        //מחזירה את הבני זוג עצמם (הנתונים) מלבד את שלו עצמו.
        const getMatchinSpouse = (allMembers, currentRealationshipSpouse, srcFamilyMemberId) => {
            return allMembers.filter(member =>
                member.familyMemberId !== parseInt(srcFamilyMemberId) &&
                currentRealationshipSpouse.some(relationship =>
                    relationship.familyMemberId1 === member.familyMemberId ||
                    relationship.familyMemberId2 === member.familyMemberId
                )
            );
        };


        const spouses = getMatchinSpouse(allMembers, currentRealationshipSpouse, srcFamilyMemberId);

        // פוקציה המוסיפה עבור כל הורה, בן זוג - select.
        const addSpouseSelect = (spouses) => {
            const container = document.getElementById('dynamicSelectContainer');
            const label = document.createElement('label');
            label.innerHTML = "הורה נוסף:";
            label.id = "secondParent";
            container.appendChild(label);

            const select = document.createElement('select');
            select.name = 'secondParent';
            select.id = 'secondParent';

            spouses.forEach(spouse => {
                const option = document.createElement('option');
                option.id = spouse.familyMemberId;
                option.textContent = spouse.firstName + " " + spouse.lastName;
                select.appendChild(option);
            });

            container.appendChild(select);
        };

        //הפונקציה שלעיל נקראת רק במידת הצורך - כאשר יש יותר מהורה אחד
        if (spouses.length > 1) {
            addSpouseSelect(spouses);
        }
    }
    else {
        // פונקציה המוסיפה עבור כל ילד - select.
        const addselectToChildren = (children) => {
            const container = document.getElementById('dynamicSelectContainer');
            const label = document.createElement('label');
            label.innerHTML = "בחירת ילדים משותפים";
            label.id = "commonChildrenLabel";
            container.appendChild(label);

            const select = document.createElement('select');
            select.name = 'commonChildren';
            select.id = 'commonChildren';
            select.multiple = true;

            children.forEach(child => {
                const option = document.createElement('option');
                option.value = child.familyMemberId;
                option.textContent = `${child.firstName} ${child.lastName}`;
                select.appendChild(option);
            });


            container.appendChild(select);
        };

        if (typeMemberToAdd === "בן/ת זוג (נוכחי, לשעבר)") {

            console.log("in בן/ת זוג (נוכחי, לשעבר)");

            const currentRealationshipChildren = realtionshipToNode
                .filter(rel =>
                    rel.familyMemberId1 === srcFamilyMemberId && rel.relationshipType === 'הורה-ילד'
                )
                .filter(rel =>
                    !realtionshipToNode.some(otherRel =>
                        otherRel.familyMemberId2 === rel.familyMemberId2 &&
                        otherRel.relationshipType === 'הורה-ילד' &&
                        otherRel.familyMemberId1 !== srcFamilyMemberId
                    )
                );



            //מחזירה את הילדים עצמם (הנתונים).
            const getMatchingChildren = (allMembers, currentRealationshipChildren) => {
                return allMembers.filter(member =>
                    currentRealationshipChildren.some(relationship =>
                        relationship.familyMemberId2 === member.familyMemberId
                    )
                );
            };

            const children = getMatchingChildren(allMembers, currentRealationshipChildren);

            console.log(children);
            addselectToChildren(children);
        }

        else {

            console.log("in parent");

            //מציאת כל האחים של מי שהוספנו לו הורה (מציאת ההורה הראשון ואח"כ מציאת כל ילדיו כדי שנדע איזה אחים הם משני ההורים)
            const firstParent = realtionshipToNode.find(rel =>
                rel.familyMemberId2 == srcFamilyMemberId && rel.relationshipType === 'הורה-ילד'
            );

            let commonChildren = [];
            if (firstParent) {
                commonChildren = realtionshipToNode.filter(rel =>
                    rel.familyMemberId1 == firstParent && rel.relationshipType === 'הורה-ילד'
                    && rel.familyMemberId2 != srcFamilyMemberId
                );

                //מחזירה את הילדים עצמם (הנתונים).
                const getMatchingChildren = (allMembers, currentRealationshipChildren) => {
                    return allMembers.filter(member =>
                        currentRealationshipChildren.some(relationship =>
                            relationship.familyMemberId2 === member.familyMemberId
                        )
                    );
                };

                const children = getMatchingChildren(allMembers, commonChildren);
                if (commonChildren.length > 0)
                    addselectToChildren(children);

            }

        }
    }
    document.getElementById("formContainer2").style.display = "block";
    document.getElementById("svgContainer").classList.add("inactive");


};

//פונקציה שנעשית כאשר לוחצים על הוספה - בתוך הטופס
async function addMemberInForm() {
    let currentFamilyMemberId;
    let realationShipToAdd = {};

    const addFamilyMember = {};

    const typeMemberToAdd = sessionStorage.getItem("typeMemberToAdd");
    const srcFamilyMemberId = sessionStorage.getItem("srcFamilyMemberId");
    const formFields = document.getElementById("familyMemberForm2");
    const inputs = formFields.querySelectorAll("input");
    const selects = formFields.querySelectorAll("select");
    const textarea = formFields.querySelector("textarea");

    const isAlive = formFields.querySelector('input[name="alive"]:checked');
    addFamilyMember["isAlive"] = isAlive ? isAlive.value === "כן" ? 1 : 0 : null;

    inputs.forEach(input => {
        if (input.name !== "alive") {
            const label = input.id;

            if (input.type === "date" && input.value) {
                addFamilyMember[label] = new Date(input.value).toISOString().split('T')[0];
            } else {
                addFamilyMember[label] = input.value !== "" ? input.value : null;
            }
        }
    });

    selects.forEach(select => {
        const label = select.id;

        if (select.multiple) {
            // אם זה שדה בחירה מרובה, אוספים את כל הערכים שנבחרו
            const selectedValues = Array.from(select.selectedOptions)
                .map(option => option.value)
                .filter(value => value !== "0"); // מסננים ערכים שאינם נבחרים בפועל

            addFamilyMember[label] = selectedValues.length > 0 ? selectedValues : null;
        } else {
            // אם זה לא בחירה מרובה, אוספים ערך אחד
            const selectedOption = select.options[select.selectedIndex];
            const selectedId = selectedOption.id;

            addFamilyMember[label] = selectedId !== "0" ? selectedId : null;
        }
    });

    if (textarea) {
        const label = textarea.id;
        addFamilyMember[label] = textarea.value !== "" ? textarea.value : null;
    }

    addFamilyMember["familyId"] = familyId;

    const createRealationship = async (familyMemberId1, familyMemberId2, relationshipId) => {
        realationShipToAdd["familyMemberId1"] = familyMemberId1
        realationShipToAdd["familyMemberId2"] = familyMemberId2;
        realationShipToAdd["relationshipId"] = relationshipId;
    };

    if (typeMemberToAdd === "ילד") {
        const currentRealationshipSpouse = realtionshipToNode.filter(rel =>
            (rel.familyMemberId1 === parseInt(srcFamilyMemberId) || rel.familyMemberId2 === parseInt(srcFamilyMemberId)) && rel.relationshipType === 'בן זוג'
        );
        if (currentRealationshipSpouse.length == 0) {

            addFamilyMemberToData(addFamilyMember).then(addedMember => {
                console.log('Added family member:', addedMember);
                currentFamilyMemberId = addedMember.id;

                createRealationship(parseInt(srcFamilyMemberId), currentFamilyMemberId, 1);

                addFamilyRealationship(realationShipToAdd)
                    .then(response => {
                        console.log('Relationship added:', response);
                        location.reload(); // רענון יקרה רק אחרי שהבקשה הסתיימה
                    })
                    .catch(error => {
                        console.error('Error adding relationship:', error);
                    });

            }).catch(error => {
                console.error('Error adding family member:', error);
            });
        } else {
            if (currentRealationshipSpouse.length == 1) {
                addFamilyMemberToData(addFamilyMember).then(addedMember => {
                    console.log('Added family member:', addedMember);
                    currentFamilyMemberId = addedMember.id;

                    createRealationship(parseInt(srcFamilyMemberId), currentFamilyMemberId, 1);

                    addFamilyRealationship(realationShipToAdd)
                        .then(response => {

                            createRealationship(currentRealationshipSpouse[0].familyMemberId1 == parseInt(srcFamilyMemberId) ?
                                currentRealationshipSpouse[0].familyMemberId2 :
                                currentRealationshipSpouse[0].familyMemberId1, currentFamilyMemberId, 1);


                            console.log('Relationship added:', response);

                            addFamilyRealationship(realationShipToAdd)
                                .then(response1 => {
                                    console.log('Relationship added:', response1);
                                    location.reload();
                                })
                                .catch(error => {
                                    console.error('Error adding relationship:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Error adding relationship:', error);
                        });


                }).catch(error => {
                    console.error('Error adding family member:', error);
                });
            }
            else {
                let secondParentId = addFamilyMember.secondParent;
                delete addFamilyMember.secondParent;
                addFamilyMemberToData(addFamilyMember).then(addedMember => {
                    console.log('Added family member:', addedMember);
                    currentFamilyMemberId = addedMember.id;

                    createRealationship(parseInt(srcFamilyMemberId), currentFamilyMemberId, 1);

                    addFamilyRealationship(realationShipToAdd)
                        .then(response => {

                            createRealationship(secondParentId, currentFamilyMemberId, 1);

                            console.log('Relationship added:', response);

                            addFamilyRealationship(realationShipToAdd)
                                .then(response1 => {
                                    console.log('Relationship added:', response1);
                                    location.reload();
                                })
                                .catch(error => {
                                    console.error('Error adding relationship:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Error adding relationship:', error);
                        });


                }).catch(error => {
                    console.error('Error adding family member:', error);
                });

            }
        }
    }

    else if (typeMemberToAdd === "בן/ת זוג (נוכחי, לשעבר)") {

        const commonChildren = addFamilyMember["commonChildren"] ? [...addFamilyMember["commonChildren"]] : [];
        delete addFamilyMember["commonChildren"];

        console.log(" = = = " + JSON.stringify(addFamilyMember));


        // console.log(selectedChildren); // המשתנה החדש שמכיל את הנתונים שנבחרו

        const relationshipPromises = []; // צור מערך כאן

        try {
            const addedMember = await addFamilyMemberToData(addFamilyMember);
            console.log('Added family member:', addedMember);
            const currentFamilyMemberId = addedMember.id;

            // הוסף את הקשר בין בני הזוג
            await createRealationship(currentFamilyMemberId, parseInt(srcFamilyMemberId), 2);
            await addFamilyRealationship(realationShipToAdd);
            console.log('Relationship added between spouses.');

            // הוסף קשרים לילדים
            for (const childId of commonChildren) {
                console.log(`Attempting to create relationship for child ID: ${childId}`);
                const promise = (async () => {
                    await createRealationship(currentFamilyMemberId, childId, 1);
                    await addFamilyRealationship(realationShipToAdd);
                    console.log(`Relationship added for child ID: ${childId}`);
                })().catch(error => console.error('Error adding relationship for child:', error));

                relationshipPromises.push(promise); // דחוף את ההבטחה למערך

                // השהייה של 100 מילישניות בין הבקשות
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // המתן לסיום כל הקשרים
            await Promise.all(relationshipPromises);
            location.reload(); // רענון אחרי שהפעולות הסתיימו

        } catch (error) {
            console.error('Error adding family member or relationships:', error);
        }

    }
    else {

        let commonChildren = addFamilyMember["commonChildren"] ? [...addFamilyMember["commonChildren"]] : [];
        commonChildren.push(parseInt(srcFamilyMemberId));
        delete addFamilyMember["commonChildren"];

        const firstParent = realtionshipToNode.filter(rel =>
            rel.familyMemberId2 === parseInt(srcFamilyMemberId) && rel.relationshipType === 'הורה-ילד'
        ).map(rel => rel.familyMemberId1);

        console.log("common/// " + commonChildren);
        console.log("common/// " + firstParent);

        const relationshipPromises = []; // צור מערך כאן

        try {
            const addedMember = await addFamilyMemberToData(addFamilyMember);
            console.log('Added family member:', addedMember);
            const currentFamilyMemberId = addedMember.id;

            if (firstParent.length > 0) {
                // הוסף את הקשר בין בני הזוג
                await createRealationship(currentFamilyMemberId, firstParent[0], 2);
                await addFamilyRealationship(realationShipToAdd);
                console.log('Relationship added between spouses.');
            }

            // הוסף קשרים לילדים
            for (const childId of commonChildren) {
                console.log(`Attempting to create relationship for child ID: ${childId}`);
                const promise = (async () => {
                    await createRealationship(currentFamilyMemberId, childId, 1);
                    await addFamilyRealationship(realationShipToAdd);
                    console.log(`Relationship added for child ID: ${childId}`);
                })().catch(error => console.error('Error adding relationship for child:', error));

                relationshipPromises.push(promise); // דחוף את ההבטחה למערך

                // השהייה של 100 מילישניות בין הבקשות
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // המתן לסיום כל הקשרים
            await Promise.all(relationshipPromises);
            location.reload(); // רענון אחרי שהפעולות הסתיימו

        } catch (error) {
            console.error('Error adding family member or relationships:', error);
        }


    }

};

//פונקציה להעלאת קבצים לכל חוליה
const uploadFiles = (memberId, file) => {
    addFile(memberId, file).then(result => { console.log("after all!!"); alert("upload success!"); })
};

//פונקציה לפתיחת ביגרפיה של חבר משפחה - חוליה
const openBiography = () => {
    const memberIdToFindBiog = document.getElementById("memberId").value;
    const firstNameValue = document.querySelector('#firstName + input').value;
    const lastNameValue = document.querySelector('#lastName + input').value;
    const memberName = firstNameValue + " " + lastNameValue;

    sessionStorage.setItem("memberIdToFindBiog", memberIdToFindBiog);
    sessionStorage.setItem("memberName", memberName);
    window.open('../html/biography.html', '_self');
}

//פונקציה לפתיחת גלריה של חבר משפחה - חוליה
const openGallery = () => {
    const memberIdToOpenGallery = document.getElementById("memberId").value;
    const firstNameValue = document.querySelector('#firstName + input').value;
    const lastNameValue = document.querySelector('#lastName + input').value;
    const memberName = firstNameValue + " " + lastNameValue;
    
    sessionStorage.setItem("memberIdToOpenGallery", memberIdToOpenGallery); // memberIdToFindBiog הוא מספר
    sessionStorage.setItem("memberName", memberName);

    window.open('../html/gallery.html', '_self');
}

//פונקציה לסגירת הטפסים
const closeForm = () => {
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("formContainer2").style.display = "none";
    document.getElementById("svgContainer").classList.remove("inactive");
};

//פונקציה לעדכון התמונה של פרופיל חבר משפחה
async function updateProfileImage(id) {
    // יצירת input מסוג קובץ
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none"; // הסתרת ה-input

    // הפונקציה שמטפלת בשינוי התמונה אחרי העלאה
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("image/")) {
            try {
                // קריאה לפונקציה updateProfile עם ה-id והתמונה שנבחרה
                await updateProfile(id, file);

                alert("עדכון פרופיל נעשה בהצלחה")
                // const reader = new FileReader();
                // reader.onload = (loadEvent) => {
                //     const imageUrl = loadEvent.target.result;

                //     const imageElement = document.querySelector(`#profile-${id}`);
                //     if (imageElement) {
                //         imageElement.setAttribute("href", imageUrl);
                //     }
                // };
                // reader.readAsDataURL(file);

                location.reload();

            } catch (error) {
                console.error("Error uploading profile image:", error);
            }
        }
        else {
            alert("הקובץ שהעלית איננו תמונה")
        }
    };

    // פתיחת בוחר הקבצים
    fileInput.click();
}


