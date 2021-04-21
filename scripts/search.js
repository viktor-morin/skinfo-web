var url = 'https://staging.skinfo.se/';
url = 'https://localhost:5001/'
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
        query = query.toLowerCase();
        return query + '<b>' + element.replace(query, '') + '</b>';
    }

    var id = getParameterByName('id');
    if (id != null) {
        $.ajax({
            type: 'GET',
            headers: { 'apikey': '6h[-yENBfB' },
            url: url + 'website/link?id=' + id + '&language=' + getLanguage(),
            dataType: 'html',
            complete: function (result) {
                $('#data').html(result.responseText);
            }
        });
        $('#searchbox').val(id);
    }

    function getCookieData() {
        $.ajax({
            type: 'GET',
            url: 'https://api.skinfo.se/' + 'cookie/get?language=' + getLanguage(),
            xhrFields: {
                withCredentials: true
            },
            complete: function (result) {
                if (result.responseText) {
                    var json = JSON.parse(result.responseText);
                }
            }
        });

        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                if (xhttp.responseText) {
                    var json = JSON.parse(xhttp.responseText);
                }
            } else {
                console.log(xhttp.responseText);
            }
        }


        xhttp.open('GET', 'https://api.skinfo.se/cookie/get?language=' + getLanguage(), true);
        xhttp.withCredentials = true;
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhttp.send();
    }

    $('form input').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    function getIngredientData(searchValue) {
        $.ajax({
            type: 'GET',
            headers: { 'apikey': '6h[-yENBfB' },
            url: url + 'website/ingredient?ingredients=' + searchValue + '&language=' + getLanguage(),
            dataType: 'html',
            complete: function (result) {
                var mainDiv = document.getElementById('search-main-div');
                mainDiv.innerHTML = '';
                var json = JSON.parse(result.responseText);
                if (json.widget) {
                    $('#widget').html(json.widget);
                } else {


                    var ingredients = json.single.ingredients;
                    for (i = 0; i < ingredients.length; i++) {
                        var child = document.createElement('h1');
                        if (ingredients[i].synonyms.length > 0) {
                            child = document.createElement('h1');
                            child.classList.add('seo-fact-header');
                            child.innerHTML = synonymsHeader;
                            mainDiv.appendChild(child);
                        }

                        for (j = 0; j < ingredients[i].synonyms.length; j++) {
                            child = document.createElement('div');
                            child.classList.add('seo-fact-synonyms');
                            child.innerText = ingredients[i].synonyms[j];
                            mainDiv.appendChild(child);
                        }

                        if (ingredients[i].functions.length > 0) {
                            child = document.createElement('h1');
                            child.classList.add('seo-fact-header');
                            child.innerHTML = functionsHeader;
                            mainDiv.appendChild(child);
                        }
                        for (j = 0; j < ingredients[i].functions.length; j++) {
                            child = document.createElement('div');
                            child.classList.add('seo-fact-functions');
                            child.innerText = ingredients[i].functions[j].short;
                            child.dataset.id = 'f-' + ingredients[i].functions[j].id;
                            mainDiv.appendChild(child);
                            child = document.createElement('div');
                            child.classList.add('seo-fact-functions');
                            child.innerText = ingredients[i].functions[j].long;
                            mainDiv.appendChild(child);
                        }

                        if (ingredients[i].concerns.length > 0) {
                            child = document.createElement('h1');
                            child.classList.add('seo-fact-header');
                            child.innerHTML = concernsHeader;
                            mainDiv.appendChild(child);
                        }
                        for (j = 0; j < ingredients[i].concerns.length; j++) {
                            child = document.createElement('div');
                            child.classList.add('seo-fact-concerns');
                            child.innerText = ingredients[i].concerns[j].short;
                            child.dataset.id = 'c-' + ingredients[i].concerns[j].id;
                            mainDiv.appendChild(child);
                            child = document.createElement('div');
                            child.classList.add('seo-fact-concerns');
                            child.innerText = ingredients[i].concerns[j].long;
                            mainDiv.appendChild(child);
                        }

                        if (ingredients[i].origins.length > 0) {
                            child = document.createElement('h1');
                            child.classList.add('seo-fact-header');
                            child.innerHTML = originsHeader;
                            mainDiv.appendChild(child);
                        }
                        for (j = 0; j < ingredients[i].origins.length; j++) {
                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-origin');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + ingredients[i].origins[j].key);
                            child.appendChild(use);
                            mainDiv.appendChild(child);
                        }

                        child = document.createElement('h1');
                        child.classList.add('seo-settings');
                        child.innerText = settingsHeader;
                        mainDiv.appendChild(child);

                        for (j = 0; j < ingredients[i].functions.length; j++) {

                            var mainChild = document.createElement('div');
                            mainChild.classList.add('seo-choice');

                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove');
                            child.appendChild(use);
                            mainChild.appendChild(child);

                            child = document.createElement('div');
                            child.innerText = ingredients[i].functions[j].short;
                            child.dataset.id = 'f-' + ingredients[i].functions[j].id;
                            mainChild.appendChild(child);

                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#add');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                            mainDiv.appendChild(mainChild);
                        }
                        for (j = 0; j < ingredients[i].concerns.length; j++) {

                            var mainChild = document.createElement('div');
                            mainChild.classList.add('seo-choice');

                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove');
                            child.appendChild(use);
                            mainChild.appendChild(child);

                            child = document.createElement('div');
                            child.innerText = ingredients[i].concerns[j].short;
                            child.dataset.id = 'c-' + ingredients[i].concerns[j].id;
                            mainChild.appendChild(child);

                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#add');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                            mainDiv.appendChild(mainChild);
                        }
                        //1
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isSafeToUse.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isSafeToUse) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isSafeToUseYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isSafeToUseNo;
                            mainDiv.appendChild(child);
                        }
                        //2
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isGoodForYourSkin.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isGoodForYourSkin) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForYourSkinYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForYourSkinNo;
                            mainDiv.appendChild(child);
                        }
                        //3
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isDangerous.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isDangerous) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isDangerousYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isDangerousNo;
                            mainDiv.appendChild(child);
                        }
                        //4
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isBadForYourSkin.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isBadForYourSkin) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isBadForYourSkinYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isBadForYourSkinNo;
                            mainDiv.appendChild(child);
                        }
                        //5
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isSafeDuringPregnancy.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isSafeDuringPregnancy) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isSafeDuringPregnancyYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isSafeDuringPregnancyNo;
                            mainDiv.appendChild(child);
                        }
                        //6
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isBadForSensitiveSkin.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isBadForSensitiveSkin) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isBadForSensitiveSkinYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isBadForSensitiveSkinNo;
                            mainDiv.appendChild(child);
                        }
                        //7
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isExfoliating.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isExfoliating) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isExfoliatingYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isExfoliatingNo;
                            mainDiv.appendChild(child);
                        }
                        //8
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isVegan.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isVegan) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isVeganYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isVeganNo;
                            mainDiv.appendChild(child);
                        }
                        //9
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isGoodForDrySkin.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isGoodForDrySkin) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForDrySkinYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForDrySkinNo;
                            mainDiv.appendChild(child);
                        }
                        //10
                        child = document.createElement('h1');
                        child.classList.add('seo-question');
                        child.innerText = isGoodForOilySkin.replace('X', ingredients[i].displayName);
                        mainDiv.appendChild(child);
                        if (ingredients[i].isGoodForOilySkin) {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForOilySkinYes;
                            mainDiv.appendChild(child);
                        } else {
                            child = document.createElement('div');
                            child.classList.add('seo-answer');
                            child.innerText = isGoodForOilySkinNo;
                            mainDiv.appendChild(child);
                        }
                        //11
                        // child = document.createElement('h1');
                        // child.classList.add('seo-question');
                        // child.innerText = isPatent.replace('X', ingredients[i].displayName);
                        // mainDiv.appendChild(child);
                        // if (ingredients[i].patent) {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isPatentYes;
                        //     mainDiv.appendChild(child);
                        // } else {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isPatentNo;
                        //     mainDiv.appendChild(child);
                        // }
                        //12
                        // child = document.createElement('h1');
                        // child.classList.add('seo-question');
                        // child.innerText = isSkinIdentical.replace('X', ingredients[i].displayName);
                        // mainDiv.appendChild(child);
                        // if (ingredients[i].skinIdential) {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isSkinIdenticalYes;
                        //     mainDiv.appendChild(child);
                        // } else {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isSkinIdenticalNo;
                        //     mainDiv.appendChild(child);
                        // }
                        //13
                        // child = document.createElement('h1');
                        // child.classList.add('seo-question');
                        // child.innerText = isActive.replace('X', ingredients[i].displayName);
                        // mainDiv.appendChild(child);
                        // if (ingredients[i].active) {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isActiveYes;
                        //     mainDiv.appendChild(child);

                        // } else {
                        //     child = document.createElement('div');
                        //     child.classList.add('seo-answer');
                        //     child.innerText = isActiveNo;
                        //     mainDiv.appendChild(child);
                        // }
                    }
                }
            }
        });
    }

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
                getIngredientData(text);
            }

            if (document.getElementById('searchbar-suggestions').style.display == 'none') {
                return;
            }

            else {

                var parent = document.getElementById('searchbar-suggestions');
                var result = parent.querySelector(".search-selected");
                if (result == null) {
                    logData(parent.children[1].innerText);
                    getIngredientData(parent.children[1].innerText);
                    $('#searchbox').val(parent.children[1].innerText);
                } else {
                    logData(result.innerText);
                    getIngredientData(result.innerText);
                    $('#searchbox').val(result.innerText);
                }
            }
            parent.innerHTML = '';
            document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
            document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
            parent.style.display = 'none';
        }

        else if (key == 'ArrowDown') {
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter < parent.childNodes.length - 1) {
                selectCounter++;
                if (selectCounter == 0)
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
                if (selectCounter == 0)
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
                        breakChild.style.marginBottom = '3px';
                        parent.appendChild(breakChild);

                        result.responseJSON.forEach(element => {
                            var child = document.createElement('div');
                            child.innerHTML = createInnerElementForSuggestion(text, element);
                            child.classList.add('searchbar-item');
                            child.onclick = function () {
                                parent.innerHTML = '';
                                document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                                document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
                                parent.style.display = 'none';
                                logData(element);
                                getIngredientData(element);
                                document.getElementById('searchbox').value = element;
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

    getCookieData();

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
