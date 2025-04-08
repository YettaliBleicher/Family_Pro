const images = document.querySelectorAll('.background-slideshow img');
let currentImageIndex = 0;

function changeImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

// החלפת תמונה כל 5 שניות
setInterval(changeImage, 5000);
const newFamily =  () =>{
    sessionStorage.setItem("dest", "newFamily");
    window.location.href='./signUp.html';
}

const existFamily =  () =>{
    sessionStorage.setItem("dest", "existFamily");
    window.location.href='./signUp.html';
}
