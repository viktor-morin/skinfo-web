$(document).ready(function () {
    try {
        var currentUrl = window.location.href.split('.html')[0];
        window.history.replaceState(null, null, currentUrl);
    }
    catch {

    }

    $('#skinfo-menu-mobile').click(function () {
        var menu = document.getElementById('skinfo-menu-mobile');
        var expaned = document.getElementById('skinfo-menu-mobile-expanded');
        var main = document.getElementById('main-menu');
        menu.classList.toggle('change');
        main.classList.toggle('main-menu-change');
        if (menu.classList.contains('change')) {
            expaned.style.display = 'grid';
        } else {
            expaned.style.display = 'none';
        }
    });
    window.onresize = function () {
        if ($(window).width() >= 700) {
            var menu = document.getElementById('skinfo-menu-mobile');
            var expaned = document.getElementById('skinfo-menu-mobile-expanded');
            if (menu && expaned) {
                if (menu.classList.contains('change')) {
                    menu.classList.toggle('change');
                    var main = document.getElementById('main-menu');
                    main.classList.toggle('main-menu-change');
                }
                if (expaned.style.display == 'block') {
                    expaned.style.display = 'none';
                }
            }
        }
    }

    var menuItems = document.getElementsByClassName('menu-button');
    for (i = 0; i < menuItems.length; i++) {
        menuItems[i].onclick = function () {
            window.location.href = this.dataset.url;
        }
    }

    $.ajax({
        type: 'GET',
        url: 'https://api.skinfo.se/information/instagram',
        contentType: "application/json; charset=utf-8",
        complete: function (result) {
            var feed = new Instafeed({
                accessToken: result.responseJSON,
                limit: 8
            });
            feed.run();
        }
    });

    // function validateEmail(email) {
    //     var re = /^[^\s@]+@[^\s@]+$/;
    //     return re.test(email);
    // }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (document.getElementById('send-email')) {
        document.getElementById('send-email-button').onclick = function () {
            var email = document.getElementById('send-email-input').value;
            if (validateEmail(email)) {
                $.ajax({
                    type: 'POST',
                    url: 'https://api.skinfo.se/information/email?email=' + email,
                    contentType: "application/json; charset=utf-8",
                    error: function (result) {
                        console.log('error');
                    },
                    success: function (result) {
                        console.log('success');
                    }
                });
            }
            else {

            }
        }
    }
});