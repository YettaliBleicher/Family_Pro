// מערך המכיל את המידע על התמונות
// let files = [];
const memberName = sessionStorage.getItem("memberName");
document.getElementById("memberName").textContent = memberName;

const memberId = sessionStorage.getItem("memberIdToOpenGallery");
console.log(memberId);

let picture = [];
let video = [];


function divideFile(files) {
    files.forEach(file => {
        if (file.fileTypeId == 1)
            picture.push(file);
        else
            video.push(file);
    })
}

const getFilesByMemberId = async function (memberId) {
    try {
        const response = await fetch(`http://localhost:3000/file/${memberId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const files = await response.json();
        return files;
    } catch (error) {
        console.error('Error:', error);
    }
};
getFilesByMemberId(memberId).then(files => { createGallery(files); })
// פונקציה ליצירת הגלריה
function createGallery(files) {
    const galleryContainer = document.getElementById('galleryContainer');
    divideFile(files);

    // יצירת אלמנטים לתמונות
    picture.forEach(file => {
        const responsiveDiv = document.createElement('div');
        responsiveDiv.classList.add('responsive');

        const galleryDiv = document.createElement('div');
        galleryDiv.classList.add('gallery');

        const link = document.createElement('a');
        link.href = file.filePath;
        link.target = "_blank";

        const image = document.createElement('img');
        image.src = file.filePath;

        link.appendChild(image);
        galleryDiv.appendChild(link);
        responsiveDiv.appendChild(galleryDiv);
        galleryContainer.appendChild(responsiveDiv);
    });

    // יצירת אלמנטים לסרטונים
    video.forEach(file => {
        const responsiveDiv = document.createElement('div');
        responsiveDiv.classList.add('responsive');

        const galleryDiv = document.createElement('div');
        galleryDiv.classList.add('gallery');

        const videoElement = document.createElement('video');
        videoElement.controls = true;
        // videoElement.width = "100%";
        // videoElement.height = "350";  // להבטיח התאמה לגובה התמונות

        const source = document.createElement('source');
        source.src = file.filePath;
        source.type = "video/mp4";  // קביעת סוג הווידאו

        videoElement.appendChild(source);
        galleryDiv.appendChild(videoElement);
        responsiveDiv.appendChild(galleryDiv);
        galleryContainer.appendChild(responsiveDiv);
    });
}

// קריאה לפונקציה ליצירת הגלריה
getFilesByMemberId(memberId);