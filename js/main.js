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
resume.onclick = function () {
    resume.innerHTML = "Currently Unavailable"
    setTimeout(function () {
        resume.innerHTML = "Resume"
    },1500);
}