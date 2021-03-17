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
            console.log(this.dataset.url);
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
});