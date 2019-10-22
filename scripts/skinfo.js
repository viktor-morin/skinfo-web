function susbsribeToSkinfo(email) {
    $.ajax({
        type: 'POST',
        url: 'https://skinfo-email.azurewebsites.net/api/skinfo-email-subscriber',
        data: email,
        dataType: 'json',
        success: function () {

        },
        error: function() {

        },
        complete: function() {

        }
    });
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }