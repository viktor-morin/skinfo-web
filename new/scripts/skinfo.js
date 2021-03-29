$(document).ready(function () {
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
            if (this.dataset.url.startsWith('https'))
                window.open(
                    this.dataset.url,
                    '_blank'
                );
            else
                window.location.href = this.dataset.url;
        }
    }

    var footerItems = document.getElementsByClassName('footer-link');
    for (i = 0; i < footerItems.length; i++) {
        footerItems[i].onclick = function () {
            if (this.dataset.url.startsWith('https'))
                window.open(
                    this.dataset.url,
                    '_blank'
                );
            else
                window.location.href = this.dataset.url;
        }
    }

    $.ajax({
        type: 'GET',
        url: 'https://api.skinfo.se/information/instagram',
        headers: { 'apikey': '6h[-yENBfB' },
        contentType: "application/json; charset=utf-8",
        complete: function (result) {
            var feed = new Instafeed({
                accessToken: result.responseJSON,
                limit: 8,
                template: '<div class="insta-div"><a href="{{link}}" target="_blank" id="{{id}}"><img src="{{image}}" /></a></div>'
            });
            feed.run();
        }
    });

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (document.getElementById('send-email')) {
        document.getElementById('send-email-button').onclick = function () {
            var email = document.getElementById('send-email-input').value;
            if (validateEmail(email)) {
                document.getElementById('send-email').style.display = 'none';
                document.getElementById('send-email-succesful').style.display = 'block';

                setTimeout(function () {
                    document.getElementById('send-email-succesful').style.opacity = '1.0';
                }, 10);
                // $.ajax({
                //     type: 'POST',
                //     url: 'https://api.skinfo.se/information/email?email=' + email,
                //     contentType: "application/json; charset=utf-8",
                //     headers: { 'apikey': '6h[-yENBfB' },
                //     error: function () {
                //         document.getElementById('send-email-input').focus();
                //         console.log('error');
                //     },
                //     success: function () {
                //         document.getElementById('send-email').style.display = 'none';
                //         document.getElementById('send-email-succesful').style.display = 'block';

                //         setTimeout(function () {
                //             document.getElementById('send-email-succesful').style.opacity = '1.0';
                //         }, 10);

                //         console.log('success');
                //     }
                // });
            }
            else {
                console.log('before-error');
                document.getElementById('send-email-input').focus();
            }
        }
    }
});