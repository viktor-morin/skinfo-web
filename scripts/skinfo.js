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

    $(window).resize(function () {
        if ($(window).width() >= 830) {
            var menu = document.getElementById('skinfo-menu-mobile');
            var expanded = document.getElementById('skinfo-menu-mobile-expanded');
            if (menu && expanded) {
                if (menu.classList.contains('change')) {
                    menu.classList.toggle('change');
                    var main = document.getElementById('main-menu');
                    main.classList.toggle('main-menu-change');
                }
                if (expanded.style.display == 'grid') {
                    expanded.style.display = 'none';
                }
            }
            if (expanded) {
                if (expanded.classList.contains('browse-fullscreen-menu'))
                    expanded.classList.remove('browse-fullscreen-menu');
            }
        }
    });

    var actionbuttons = document.getElementsByClassName('actionbutton');
    for (i = 0; i < actionbuttons.length; i++) {
        actionbuttons[i].onclick = function () {
            if (this.dataset.url.startsWith('https'))
                window.open(
                    this.dataset.url,
                    '_blank'
                );
            else
                window.location.href = this.dataset.url;
        }
    }

    var oldSize = document.body.clientWidth;
    if (document.getElementById('instafeed')) {
        window.onresize = function () {
            var mainInstagramDiv = document.getElementById('instafeed');
            if (mainInstagramDiv) {
                var newSize = document.body.clientWidth;
                var action = false;
                var hideCounter = 0;
                if (newSize > 1000 && oldSize <= 1000) {
                    action = true;
                } else if (newSize < 1000 && oldSize >= 1000) {
                    action = true;
                    hideCounter = 2;
                } else if (newSize < 600 && oldSize <= 600) {
                    action = true;
                    hideCounter = 4;
                }

                if (action) {
                    var imageSize = getInstagramImageSize(hideCounter);
                    for (i = mainInstagramDiv.children.length - 1; i >= 0; i--) {
                        if (hideCounter > 0) {
                            mainInstagramDiv.children[i].style.display = 'none';
                            hideCounter--;
                        } else {
                            mainInstagramDiv.children[i].style.display = 'inline-block';
                            mainInstagramDiv.children[i].style.width = imageSize;
                            mainInstagramDiv.children[i].style.paddingTop = imageSize;
                        }
                    }
                }

                oldSize = newSize;
            }
        };
        $.ajax({
            type: 'GET',
            url: 'https://api.skinfo.se/information/instagram',
            headers: { 'apikey': '6h[-yENBfB' },
            contentType: "application/json; charset=utf-8",
            complete: function (result) {
                var feed = new Instafeed({
                    accessToken: result.responseJSON,
                    limit: 8,
                    template: '<div class="insta-div"><a href="{{link}}" target="_blank" id="{{id}}"><img src="{{image}}"/></a></div>',
                    after: function () {
                        var newSize = document.body.clientWidth;
                        var action = false;
                        var hideCounter = 0;
                        if (newSize > 1000) {
                            action = true;
                        } else if (newSize < 1000) {
                            action = true;
                            hideCounter = 2;
                        } else if (newSize < 600) {
                            action = true;
                            hideCounter = 4;
                        }

                        if (action) {
                            var mainInstagramDiv = document.getElementById('instafeed');
                            var imageSize = getInstagramImageSize(hideCounter);
                            for (i = mainInstagramDiv.children.length - 1; i >= 0; i--) {
                                if (hideCounter > 0) {
                                    mainInstagramDiv.children[i].style.display = 'none';
                                    hideCounter--;
                                } else {
                                    mainInstagramDiv.children[i].style.display = 'inline-block';
                                    mainInstagramDiv.children[i].style.width = imageSize;
                                    mainInstagramDiv.children[i].style.paddingTop = imageSize;
                                }
                            }
                        }
                    }
                });
                feed.run();
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function requestDemo() {
        var email = document.getElementById('send-email-input').value;
        if (validateEmail(email)) {
            document.getElementById('send-email').style.display = 'none';
            document.getElementById('send-email-button').disabled = false;
            document.getElementById('send-email-succesful').parentElement.parentElement.style.marginTop = '25px';
            document.getElementById('send-email-succesful').parentElement.parentElement.style.marginBottom = '100px';
            document.getElementById('send-email-succesful').style.display = 'block';
            setTimeout(function () {
                document.getElementById('send-email-succesful').style.opacity = '1.0';
                document.getElementById('send-email-succesful').innerHTML = document.getElementById('send-email-succesful').innerText + '<br>' + '<b>' + email + '</b>';
            }, 10);
            $.ajax({
                type: 'POST',
                url: 'https://api.skinfo.se/information/email?email=' + email,
                contentType: "application/json; charset=utf-8",
                headers: { 'apikey': '6h[-yENBfB' },
                error: function () {
                },
                success: function () {
                }
            });
        }
        else {

            document.getElementById('send-email').classList.add('shake-me');
            setTimeout(function () {
                document.getElementById('send-email').classList.remove('shake-me');
            }, 1000);
            document.getElementById('send-email-input').focus();
        }
    }

    if (document.getElementById('send-email')) {
        document.getElementById('send-email-button').onclick = function () {
            requestDemo();
        }
        document.getElementById('send-email-input').addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                requestDemo();
            }
        })
    }

    function getInstagramImageSize(numberOfHiddenChildren) {
        switch (numberOfHiddenChildren) {
            case 0:
                return '12.5%';
            case 2:
                return '16.6%';
            case 4:
                return '25%';
        }
    }
});