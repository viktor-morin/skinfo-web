var url = 'https://staging.skinfo.se/';
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

    function createInnerElementForSuggestion(query, element) {
        return query + '<b>' + element.replace(query, '') + '</b>';
    }

    var id = getParameterByName('id');
    if (id != null) {
        $.ajax({
            type: 'GET',
            headers: { 'apikey': '6h[-yENBfB' },
            url: url + 'website/ingredient?ingredient=' + id + '&language=' + getLanguage(),
            dataType: 'html',
            complete: function (result) {
                $('#data').html(result.responseText);
            }
        });
        $('#searchbox').val(id);
    }


    $('form input').keydown(function (e) {
        if (e.keyCode == 13) {
            console.log('ville');
            e.preventDefault();
            return false;
        }
    });

    $('#searchbox').on('keydown', function (e) {
        e.stopPropagation();
        const key = e.key;
        if (key == 'Enter') {
            var text = $('#searchbox').val();
            if (text.length == 0) {
                return;
            }

            if (text.includes(',')) {
                logData(text);
                $.ajax({
                    type: 'GET',
                    headers: { 'apikey': '6h[-yENBfB' },
                    url: url + 'website/ingredient?ingredient=' + text + '&language=' + getLanguage(),
                    dataType: 'html',
                    complete: function (result) {
                        $('#data').html(result.responseText);
                    }
                });
            }
            else {

                var parent = document.getElementById('searchbar-suggestions');
                var result = parent.querySelector(".search-selected");
                if (result == null) {
                    logData(parent.firstChild.innerText);
                    $.ajax({
                        type: 'GET',
                        headers: { 'apikey': '6h[-yENBfB' },
                        url: url + 'website/ingredient?ingredient=' + parent.firstChild.innerText + '&language=' + getLanguage(),
                        dataType: 'html',
                        complete: function (result) {
                            $('#data').html(result.responseText);
                        }
                    });
                } else {
                    logData(result.innerText);
                    $.ajax({
                        type: 'GET',
                        headers: { 'apikey': '6h[-yENBfB' },
                        url: url + 'website/ingredient?ingredient=' + result.innerText + '&language=' + getLanguage(),
                        dataType: 'html',
                        complete: function (result) {
                            $('#data').html(result.responseText);
                        }
                    });
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
            document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
            document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
            parent.style.display = 'none';
        }
        else if (text.includes(',')) {
            parent.innerHTML = '';
            document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';;
            document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
            parent.style.display = 'none';
        }
        else {
            $.ajax({
                type: 'GET',
                url: url + 'website/suggestion?query=' + text,
                headers: { 'apikey': '6h[-yENBfB' },
                contentType: "application/json; charset=utf-8",
                complete: function (result) {
                    if (result.responseJSON.length > 0) {
                        parent.style.display = 'inherit';
                        document.getElementById('searchbar').style.borderBottomLeftRadius = '0px';
                        document.getElementById('searchbar').style.borderBottomRightRadius = '0px';
                        parent.innerHTML = '';
                        var text = $('#searchbox').val();
                        if (text.length == 0 || text.includes(',')) {
                            parent.innerHTML = '';
                            document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                            document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
                            parent.style.display = 'none';
                            return;
                        }

                        var breakChild = document.createElement('div');
                        breakChild.style.marginLeft = '20px';
                        breakChild.style.marginRight = '20px';
                        breakChild.style.backgroundColor = 'lightgray';
                        breakChild.style.height = '1px';
                        breakChild.style.maxWidth = '648px';
                        parent.appendChild(breakChild);

                        result.responseJSON.forEach(element => {
                            var child = document.createElement('div');
                            child.innerHTML = createInnerElementForSuggestion(text, element);
                            child.classList.add('searchbar-item');
                            child.onclick = function () {
                                logData(element);
                                $.ajax({
                                    type: 'GET',
                                    headers: { 'apikey': '6h[-yENBfB' },
                                    url: url + 'website/ingredient?ingredient=' + element + '&language=' + getLanguage(),
                                    dataType: 'html',
                                    complete: function (result) {
                                        $('#data').html(result.responseText);
                                    }
                                });
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
                        document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                        document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
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
        eventProperties['language'] = getLanguage();

        dict['eventProperties'] = eventProperties;

        var json = JSON.stringify(dict);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url + "website/log", true);
        xhttp.setRequestHeader('apikey', '6h[-yENBfB');
        xhttp.send(json);
    }

    function getLanguage() {
        return 'en-US';

        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf('_skinfo-language=');
            if (c_start != -1) {
                c_start = c_start + '_skinfo-language'.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        var lang = 'en-US';
        document.cookie = '_skinfo-language' + "=" + lang + '; SameSite=None; Domain=skinfo.se; Secure; Expires=Tue, 01 Jan 2031 00:00:01 UTC';
        return lang;
    }

    // function setLanguage(value) {
    //     document.cookie = '_skinfo-language' + "=" + value + '; SameSite=None; Domain=skinfo.se; Secure; Expires=Tue, 01 Jan 2031 00:00:01 UTC';
    // }

    // function loadSettings() {
    //     var language = getLanguage();
    //     switch (language) {
    //         case 'en-US':
    //             loadEng(document.getElementById('eng'));
    //             break;
    //         case 'sv-SE':
    //             loadSwe(document.getElementById('swe'));
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // function loadSwe(caller) {
    //     document.getElementById('searchbox').placeholder = 'Sök efter ingredienser..';
    //     document.getElementById('eng').style.webkitFilter = 'grayscale(1)';
    //     document.getElementById('eng').style.filter = 'grayscale(1)';
    //     document.getElementById('eng').style.opacity = 0.5;
    //     caller.style.webkitFilter = '';
    //     caller.style.filter = '';
    //     caller.style.opacity = 1;
    //     setLanguage('sv-SE');
    // }

    // function loadEng(caller) {
    //     document.getElementById('searchbox').placeholder = 'Search any ingredients..';
    //     document.getElementById('swe').style.webkitFilter = 'grayscale(1)';
    //     document.getElementById('swe').style.filter = 'grayscale(1)';
    //     document.getElementById('swe').style.opacity = 0.5;
    //     caller.style.webkitFilter = '';
    //     caller.style.filter = '';
    //     caller.style.opacity = 1;
    //     setLanguage('en-US');
    // }

    // document.getElementById('swe').onclick = function () {
    //     loadSwe(this);
    //     if (location.pathname.includes('search'))
    //         location.reload();
    // }

    // document.getElementById('eng').onclick = function () {
    //     loadEng(this);
    //     if (location.pathname.includes('search'))
    //         location.reload();
    // }

    // loadSettings();
})
