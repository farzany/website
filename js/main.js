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