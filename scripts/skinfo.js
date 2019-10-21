function susbsribeToSkinfo(email, buttonId) {
    var result = false;
    var formData = $(email).serialize();
    $.ajax({
        type: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        data: formData,
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