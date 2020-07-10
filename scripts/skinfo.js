function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isElementInViewport(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    if (el == undefined) {
        return;
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function onVisibilityChange(el, callback) {
    var old_visible = false;
    return function () {
        if (old_visible == true) {
            return;
        }
        var visible = isElementInViewport(el);
        if (visible != old_visible) {
            old_visible = visible;
            if (typeof callback == 'function') {
                callback();
            }
        }
    }
}

$(document).ready(function () {
    async function runMainHeaderAnimation() {
        var text = 'The ingredient list';
        var extraFirst = 'invented';
        var extraEnd = 'reinvented';

        var mainTitle = document.getElementById('information-header-main');
        if (mainTitle == null) {
            return;
        }

        for (i = 0; i < text.length; i++) {
            mainTitle.innerHTML += text[i];
            await sleep(40);
        }

        mainTitle = document.getElementById('information-header-main2');
        for (i = 0; i < extraFirst.length; i++) {
            mainTitle.innerHTML += extraFirst[i];
            await sleep(40);
        }

        for (i = 0; i < 3; i++) {
            if (i % 2 == 0) {
                mainTitle.innerHTML += '_'
            } else {
                mainTitle.innerHTML = mainTitle.innerHTML.substring(0, mainTitle.innerHTML.length - 1);
            }
            await sleep(200);
        }

        for (i = extraFirst.length; i >= 0; i--) {
            mainTitle.innerHTML = mainTitle.innerHTML.substring(0, mainTitle.innerHTML.length - 1);
            await sleep(40);
        }

        await sleep(250);

        var subTitle = document.getElementsByClassName('fademein');
        for (i = 0; i < subTitle.length; i++) {
            subTitle[i].classList.add('fade');
        }

        for (i = 0; i < extraEnd.length; i++) {
            mainTitle.innerHTML += extraEnd[i];
            await sleep(40);
        }

        for (i = 0; i < 7; i++) {
            if (i % 2 == 0) {
                mainTitle.innerHTML += '_'
            } else {
                mainTitle.innerHTML = mainTitle.innerHTML.substring(0, mainTitle.innerHTML.length - 1);
            }
            await sleep(200);
        }
    }

    $('#read_more').click(function () {
        document.body.scrollTop = 0;
        document.getElementsByClassName('two-split-div')[0].scrollIntoView({ behavior: 'smooth' })
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
            expaned.style.display = 'block';
        } else {
            expaned.style.display = 'none';
        }
    });

    window.onresize = function() {
        if ($(window).width() >= 600) {
            var menu = document.getElementById('skinfo-menu-mobile');
            var expaned = document.getElementById('skinfo-menu-mobile-expanded');
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

    var handler = onVisibilityChange($('#break-div'), async function () {
        var div = document.getElementById('information-header-main-white');

        if (div == null) {
            return;
        }

        div.innerHTML = ' ';

        var textFirst = 'Take care';
        var textSecond = '(skin)care';

        for (q = 0; q < textFirst.length; q++) {
            div.innerHTML += textFirst[q];
            await sleep(40);
        }

        for (q = 0; q < 4; q++) {
            if (q % 2 == 0) {
                div.innerHTML += '_'
            } else {
                div.innerHTML = div.innerHTML.substring(0, div.innerHTML.length - 1);
            }
            await sleep(200);
        }

        for (q = 4; q > 0; q--) {
            div.innerHTML = div.innerHTML.substring(0, div.innerHTML.length - 1);
            await sleep(40);
        }


        for (q = 0; q < textSecond.length; q++) {
            div.innerHTML += textSecond[q];
            await sleep(40);
        }

        for (q = 0; q < 5; q++) {
            if (q % 2 == 0) {
                div.innerHTML += '_'
            } else {
                div.innerHTML = div.innerHTML.substring(0, div.innerHTML.length - 1);
            }
            await sleep(200);
        }

        q = 0;
    });

    $(window).on('DOMContentLoaded load resize scroll', handler);
    runMainHeaderAnimation();
});