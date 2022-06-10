$(document).ready(function (){
    $('#tresc').css('background-color','grey');
    $('input').css('font-weight','700');
    $(':disabled').addClass('green');
    $('#calculate').click(() => calculateRate());
});