$(document).ready(function () {
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = 16 * Math.random() | 0; return ('x' == c ? r : r & 3 | 8).toString(16) });
    }

    function getSkinfoId() {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf('skinfo-id=');
            if (c_start != -1) {
                c_start = c_start + 'skinfo-id'.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        var id = uuidv4();
        document.cookie = 'skinfo-id' + "=" + id + '; SameSite=None; Domain=skinfo.se; Secure; Expires=Tue, 19 Jan 2038 03:14:07 UTC';
        return id;
    }


    $('#b2b_button').click(function () {
        window.location.href = 'company.html';
        return false;
        // document.body.scrollTop = 0;
        // document.getElementsByClassName('two-split-div')[0].scrollIntoView({ behavior: 'smooth' })
    });

    $('#see_cases').click(function () {
        document.body.scrollTop = 0;
        document.getElementById('see_us_live_header').scrollIntoView({ behavior: 'smooth' })
    });

    $('#get_skinfo').click(function () {
        document.body.scrollTop = 0;
        document.getElementById('contact_us_header').scrollIntoView({ behavior: 'smooth' })
    });

    $('#contact').click(function () {
        window.location.href = 'contact.html';
        return false;
    });

    $('#company').click(function () {
        window.location.href = 'company.html';
        return false;
    });

    $('#app').click(function () {
        window.location.href = 'app.html';
        return false;
    });

    $('#company2').click(function () {
        window.location.href = 'company.html';
        return false;
    });

    $('#app2').click(function () {
        window.location.href = 'app.html';
        return false;
    });

    $('#company3').click(function () {
        window.location.href = 'company.html';
        return false;
    });

    $('#app3').click(function () {
        window.location.href = 'app.html';
        return false;
    });

    $('#contact2').click(function () {
        window.location.href = 'contact.html';
        return false;
    });

    $('#download_big').click(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

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

    window.onresize = function() {
        if ($(window).width() >= 600) {
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
});