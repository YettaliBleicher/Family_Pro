const images = document.querySelectorAll('.background-slideshow img');
let currentImageIndex = 0;

function changeImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

// החלפת תמונה כל 5 שניות
setInterval(changeImage, 5000);