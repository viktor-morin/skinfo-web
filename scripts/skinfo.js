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