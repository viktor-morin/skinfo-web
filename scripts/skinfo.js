function susbsribeToSkinfo(email) {
    $.ajax({
        type: 'POST',
        url:  'https://skinfo-api.azurewebsites.net/email',
        data: email,
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