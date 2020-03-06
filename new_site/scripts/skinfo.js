var countDownComplete = false;
var slotsValue = 0;

function susbsribeToSkinfo(email) {
    $.ajax({
        type: 'POST',
        url: 'https://skinfo-api.azurewebsites.net/email',
        data: email,
        success: function () {

        },
        error: function () {

        },
        complete: function () {

        }
    });
}

function getAvailableSlots() {
    $.ajax({
        type: 'GET',
        jsonCallback: 'updateAvailableSlots',
        url: 'https://skinfo-api.azurewebsites.net/availableslot/jsonp',
        dataType: 'jsonp',
    })
}

function updateAvailableSlots(data) {
    countDownComplete = true;
    slotsValue = data;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function doSlotsCountDown() {
    getAvailableSlots();
    var slots = 350;
    while (!countDownComplete) {
        $('#slots').html(slots);
        slots = slots - 1;
        await sleep(1);
    }
    while (slots > slotsValue) {
        $('#slots').html(slots);
        slots = slots - 1;
        await sleep(10);
    }
    $('#slots').html(slotsValue);
}

$(document).ready(function () {
    doSlotsCountDown();
    updateComments();

    $("#download_big").click(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    $("#contact").click(function () {
        window.location.href = 'contact.html';
        return false;
    });

    $("#company").click(function () {
        window.location.href = 'company.html';
        return false;
    });
});