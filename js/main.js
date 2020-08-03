// Closing the Burger Menu after selection
$(document).ready(function(){
    $(".check").click(function(){
        $("#menu-btn").prop("checked", true);
    });
    $(".uncheck").click(function(){
        $("#menu-btn").prop("checked", false);
    });
});

// Fade-In Fade-Out Animations
AOS.init({
    duration: 1000,
});

// Resume Currently Unavailable
let resume = document.getElementById("resume");
if (resume !== null) {
    resume.addEventListener('click',function(){
        resume.innerHTML = "Currently Unavailable"
        setTimeout(function () {
            resume.innerHTML = "Resume"
        },1500);
    });
}

// Modals
function ModalOpen(obj) {
    let modalId = obj.id;
    console.log(modalId);
    let modalBg = document.getElementsByClassName("modal-bg " + modalId)[0];
    console.log(modalBg);
    let modalClose = modalBg.getElementsByClassName("modal-close")[0];

    modalBg.classList.add('modal-active');

    modalClose.addEventListener('click',function() {
        modalBg.classList.remove('modal-active');
    });
}
