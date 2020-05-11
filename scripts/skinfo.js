function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
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
