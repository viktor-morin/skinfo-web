var url = 'https://api.skinfo.se/';
var selectCounter = -1;
$(document).ready(function () {
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var id = getParameterByName('id');
    if (id != null) {
        $.ajax({
            type: 'GET',
            url: url + 'search/get?query=' + id + '&language=' + getLanguage(),
            dataType: 'html',
            complete: function (result) {
                $('#data').html(result.responseText);
            }
        });
        $('#searchbox').val(id);
    }

    $('#searchbox').on('keydown', function (e) {
        const key = e.key;
        if (key == 'Enter') {
            var text = $('#searchbox').val();
            if (text.length == 0) {
                return;
            }

            if (text.includes(',')) {
                logData(text);
                window.location.href = 'search?id=' + text;
            }
            else {

                var parent = document.getElementById('searchbar-suggestions');
                var result = parent.querySelector(".search-selected");
                if (result == null) {
                    logData(parent.firstChild.innerText);
                    window.location.href = 'search?id=' + parent.firstChild.innerText;
                } else {
                    logData(result.innerText);
                    window.location.href = 'search?id=' + result.innerText;
                }

            }
        }

        else if (key == 'ArrowDown') {
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter < parent.childNodes.length - 1) {
                selectCounter++;
            }
            parent.childNodes.forEach(child => {
                child.classList.remove('search-selected');
            });
            if (selectCounter > -1) {
                parent.childNodes[selectCounter].classList.add('search-selected');
                var searchBox = $('#searchbox');
                searchBox.val(parent.childNodes[selectCounter].innerText);
                setTimeout(function () {
                    searchBox[0].setSelectionRange(-1, -1);
                }, 1);
            }
        }
        else if (key == 'ArrowUp') {
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter > -1) {
                selectCounter--;
            }
            parent.childNodes.forEach(child => {
                child.classList.remove('search-selected');
            });
            if (selectCounter > -1) {
                parent.childNodes[selectCounter].classList.add('search-selected');
                var searchBox = $('#searchbox');
                searchBox.val(parent.childNodes[selectCounter].innerText);
                setTimeout(function () {
                    searchBox[0].setSelectionRange(-1, -1);
                }, 1);

            }
        }
    });

    $('#searchbox').on('input', function (e) {
        e.stopPropagation();
        var parent = document.getElementById('searchbar-suggestions');
        var text = $('#searchbox').val();
        selectCounter = -1;

        if (text.length == 0) {
            parent.innerHTML = '';
            parent.style.display = 'none';
        }
        else if (text.includes(',')) {
            parent.innerHTML = '';
            parent.style.display = 'none';
        }
        else {
            $.ajax({
                type: 'GET',
                url: url + 'search/suggestion?query=' + text,
                contentType: "application/json; charset=utf-8",
                complete: function (result) {
                    if (result.responseJSON.length > 0) {
                        parent.style.display = 'inherit';
                        parent.innerHTML = '';
                        var text = $('#searchbox').val();
                        if (text.length == 0 || text.includes(',')) {
                            parent.innerHTML = '';
                            parent.style.display = 'none';
                            return;
                        }

                        result.responseJSON.forEach(element => {
                            var child = document.createElement('div');
                            child.innerText = element;
                            child.classList.add('searchbar-item');
                            child.onclick = function () {
                                logData(element);
                                window.location.href = 'search?id=' + element;
                            }

                            child.addEventListener("mouseover", function (e) {
                                var parent = document.getElementById('searchbar-suggestions');
                                parent.childNodes.forEach(child => {
                                    child.classList.remove('search-selected');
                                });
                                child.classList.add('search-selected');
                            });

                            child.addEventListener("mouseout", function (e) {
                                var parent = document.getElementById('searchbar-suggestions');
                                parent.childNodes.forEach(child => {
                                    child.classList.remove('search-selected');
                                });
                            });

                            parent.appendChild(child);
                        });
                    } else {
                        parent.style.display = 'none';
                    }
                }
            });
        }
    });

    function logData(query) {
        var dict = new Object();
        dict['eventType'] = 'search';
        dict['url'] = window.location.href;

        dict['platform'] = navigator.platform;
        dict['osName'] = navigator.userAgent;
        dict['osVersion'] = navigator.appVersion;
        dict['widgetVersion'] = 'Web';

        var eventProperties = new Object();
        eventProperties['query'] = query;

        dict['eventProperties'] = eventProperties;

        var json = JSON.stringify(dict);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url + "search/log", true);
        xhttp.send(json);
    }

    function getLanguage() {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf('skinfo-language=');
            if (c_start != -1) {
                c_start = c_start + 'skinfo-language'.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        var lang = 'en-US';
        document.cookie = 'skinfo-language' + "=" + lang + '; SameSite=None; Domain=skinfo.se; Secure; Expires=Tue, 19 Jan 2038 03:14:07 UTC';
        return lang;
    }

    function setLanguage(value) {
        document.cookie = 'skinfo-language' + "=" + value + '; SameSite=None; Domain=skinfo.se; Secure; Expires=Tue, 19 Jan 2038 03:14:07 UTC';
    }

    function loadSettings() {
        var language = getLanguage();
        switch (language) {
            case 'en-US':
                document.getElementById('searchbox').placeholder = 'Search any ingredient/ingredients..';
                loadEng();
                break;
            case 'sv-SE':
                document.getElementById('searchbox').placeholder = 'Sök efter ingredienser..';
                loadSwe();
                break;
            default:
                break;
        }
    }

    function loadSwe() {
        document.getElementById('eng').style.webkitFilter = 'grayscale(1)';
        document.getElementById('eng').style.filter = 'grayscale(1)';
        document.getElementById('eng').style.opacity = 0.5;
        this.style.webkitFilter = '';
        this.style.opacity = 1;
        setLanguage('sv-SE');
    }

    function loadEng() {
        document.getElementById('swe').style.webkitFilter = 'grayscale(1)';
        document.getElementById('swe').style.filter = 'grayscale(1)';
        document.getElementById('swe').style.opacity = 0.5;
        this.style.webkitFilter = '';
        this.style.opacity = 1;
        setLanguage('en-US');
    }

    document.getElementById('swe').onclick = function () {
        loadSwe();
    }

    document.getElementById('eng').onclick = function () {
        loadEng();
    }

    loadSettings();
})
