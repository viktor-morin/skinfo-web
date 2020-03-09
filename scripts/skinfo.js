function susbsribeToSkinfo(email) {
    $.ajax({
        type: 'POST',
        url:  'https://skinfo-api.azurewebsites.net/email',
        data: email,
        success: function () {
            console.log('ok');
        },
        error: function () {
            console.log('error');
        },
        complete: function () {
            console.log('complete');
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
    if (data > 0) {
        $('#spotsleft').html(data + ' <br> platser kvar i testversionen!');
    } else {
        $('#spotsleft').html('Skriv upp dig till beta versionen!');
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
