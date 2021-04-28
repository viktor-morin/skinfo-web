var url = 'https://api.skinfo.se/';
var url = 'https://localhost:5001/';
var selectCounter = -1;

function getIngredientData(searchValue) {
    $.ajax({
        type: 'GET',
        headers: { 'apikey': '6h[-yENBfB' },
        url: url + 'website/ingredient?ingredients=' + searchValue + '&language=' + getLanguage(),
        dataType: 'html',
        complete: function (result) {
            document.getElementById('widget').innerHTML = '';
            var mainDiv = document.getElementById('search-main-div');
            mainDiv.innerHTML = '';
            var errorDiv = document.getElementById('search-error-div');
            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '';
            var json = JSON.parse(result.responseText);
            if (json.widget) {
                document.title = documentTitleWidget;
                document.querySelector('meta[name="description"]').setAttribute("content", documentDescriptionWidget);
                $('#widget').html(json.widget);
                if (json.single.errorsDuplicates.length > 0) {
                    var child = document.createElement('div');
                    child.classList.add('seo-error-header');
                    child.innerHTML = errorsDuplicatesTitle;
                    errorDiv.appendChild(child);
                }
                for (i = 0; i < json.single.errorsDuplicates.length; i++) {
                    var child = document.createElement('div');
                    child.classList.add('seo-error-ingredient');
                    child.innerHTML = json.single.errorsDuplicates[i];
                    errorDiv.appendChild(child);
                }
                if (json.single.errorsMissmatch.length > 0) {
                    var child = document.createElement('div');
                    child.classList.add('seo-error-header');
                    child.innerHTML = errorsMissmatchTitle;
                    errorDiv.appendChild(child);
                }
                for (i = 0; i < json.single.errorsMissmatch.length; i++) {
                    var child = document.createElement('div');
                    child.classList.add('seo-error-ingredient');
                    child.innerHTML = json.single.errorsMissmatch[i];
                    errorDiv.appendChild(child);
                }
                if (json.single.errorsMissmatch.length > 0 || json.single.errorsDuplicates.length > 0) {
                    errorDiv.style.display = 'grid';
                }
            } else {
                var ingredients = json.single.ingredients;
                for (i = 0; i < ingredients.length; i++) {
                    document.title = documentTitle.replace('X', ingredients[i].displayName);
                    document.querySelector('meta[name="description"]').setAttribute("content", documentDescription.replace('X', ingredients[i].displayName));
                    var child = document.createElement('h1');
                    child.classList.add('seo-displayname');
                    child.innerHTML = ingredients[i].displayName;
                    mainDiv.appendChild(child);
                    if (ingredients[i].synonyms.length > 0) {
                        child = document.createElement('h2');
                        child.classList.add('seo-fact-header');
                        child.style.marginTop = '20px';
                        child.innerHTML = synonymsHeader;
                        mainDiv.appendChild(child);
                    }
                    for (j = 0; j < ingredients[i].synonyms.length; j++) {
                        child = document.createElement('div');
                        child.classList.add('seo-fact-synonyms');
                        child.innerText = ingredients[i].synonyms[j];
                        mainDiv.appendChild(child);
                    }
                    if (ingredients[i].origins.length > 0) {
                        child = document.createElement('h2');
                        child.style.marginTop = '20px';
                        child.classList.add('seo-fact-header');
                        child.innerHTML = originsHeader;
                        child.id = 'functions';
                        mainDiv.appendChild(child);
                    }
                    for (j = 0; j < ingredients[i].origins.length; j++) {
                        child = document.createElement('div');
                        child.classList.add('seo-svg-origin-text');
                        child.innerText = ingredients[i].origins[j].value;
                        var svgChild = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgChild.classList.add('seo-svg-origin');
                        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + ingredients[i].origins[j].key);
                        svgChild.appendChild(use);
                        child.appendChild(svgChild);
                        mainDiv.appendChild(child);
                    }
                    if (ingredients[i].functions.length > 0) {
                        child = document.createElement('h2');
                        child.style.marginTop = '20px';
                        child.classList.add('seo-fact-header');
                        child.innerHTML = functionsHeader;
                        child.id = 'concers';
                        mainDiv.appendChild(child);
                    }
                    for (j = 0; j < ingredients[i].functions.length; j++) {
                        child = document.createElement('div');
                        child.classList.add('seo-fact-functions-short');
                        child.innerText = ingredients[i].functions[j].short;
                        child.dataset.id = 'f-' + ingredients[i].functions[j].id;
                        mainDiv.appendChild(child);
                        child = document.createElement('div');
                        child.classList.add('seo-fact-functions-long');
                        child.innerText = ingredients[i].functions[j].long;
                        mainDiv.appendChild(child);
                    }
                    if (ingredients[i].concerns.length > 0) {
                        child = document.createElement('h2');
                        child.style.marginTop = '20px';
                        child.classList.add('seo-fact-header');
                        child.innerHTML = concernsHeader;
                        mainDiv.appendChild(child);
                    }
                    for (j = 0; j < ingredients[i].concerns.length; j++) {
                        child = document.createElement('div');
                        child.classList.add('seo-fact-concerns-short');
                        child.innerText = ingredients[i].concerns[j].short;
                        child.dataset.id = 'c-' + ingredients[i].concerns[j].id;

                        var svgChild = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgChild.classList.add('seo-svg-concern');
                        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#exclamationmark');
                        svgChild.appendChild(use);
                        child.appendChild(svgChild);

                        mainDiv.appendChild(child);
                        child = document.createElement('div');
                        child.classList.add('seo-fact-concerns-long');
                        child.innerText = ingredients[i].concerns[j].long;
                        mainDiv.appendChild(child);
                    }
                    child = document.createElement('h2');
                    child.classList.add('seo-settings');
                    child.style.marginTop = '20px';
                    child.innerText = settingsHeader;
                    mainDiv.appendChild(child);
                    child = document.createElement('h3');
                    child.classList.add('seo-settings-underheader');
                    child.innerText = settingsUnderHeader;
                    mainDiv.appendChild(child);
                    var mainChild = document.createElement('div');
                    if (globalIngredients.includes(ingredients[i].displayName)) {
                        child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        child.classList.add('seo-svg-settings');
                        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove');
                        child.appendChild(use);
                        mainChild.appendChild(child);
                    } else {
                        child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        child.classList.add('seo-svg-settings');
                        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#add');
                        child.appendChild(use);
                        mainChild.appendChild(child);
                    }
                    mainChild.classList.add('seo-choice');
                    mainChild.dataset.id = ingredients[i].displayName;
                    mainChild.addEventListener('click', updateSettingsBind, false);
                    child = document.createElement('div');
                    child.innerText = ingredients[i].displayName;
                    mainChild.appendChild(child);
                    mainDiv.appendChild(mainChild);
                    for (j = 0; j < ingredients[i].functions.length; j++) {
                        var mainChild = document.createElement('div');
                        mainChild.classList.add('seo-choice');
                        mainChild.addEventListener('click', updateSettingsBind, false);
                        if (globalFunctions.includes('f-' + ingredients[i].functions[j].id)) {
                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                        } else {
                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#add');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                        }
                        child = document.createElement('div');
                        child.innerText = ingredients[i].functions[j].short;
                        mainChild.dataset.id = 'f-' + ingredients[i].functions[j].id;
                        mainChild.appendChild(child);
                        mainDiv.appendChild(mainChild);
                    }
                    for (j = 0; j < ingredients[i].concerns.length; j++) {
                        var mainChild = document.createElement('div');
                        mainChild.classList.add('seo-choice');
                        mainChild.addEventListener('click', updateSettingsBind, false);
                        if (globalConcerns.includes('c-' + ingredients[i].concerns[j].id)) {
                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#remove');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                        } else {
                            child = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            child.classList.add('seo-svg-settings');
                            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#add');
                            child.appendChild(use);
                            mainChild.appendChild(child);
                        }
                        child = document.createElement('div');
                        child.innerText = ingredients[i].concerns[j].short;
                        mainChild.dataset.id = 'c-' + ingredients[i].concerns[j].id;
                        mainChild.appendChild(child);
                        mainDiv.appendChild(mainChild);
                    }
                    child = document.createElement('div');
                    child.style.marginTop = '20px';
                    mainDiv.appendChild(child);
                    child = document.createElement('div');
                    child.style.marginTop = '20px';
                    child.style.marginBottom = '20px';
                    child.style.borderTop = '1px solid black';
                    mainDiv.appendChild(child);
                    child = document.createElement('div');
                    child.innerText = questionsHeader.replace('X', ingredients[i].displayName);
                    child.classList.add('seo-fact-header');
                    child.classList.add('seo-fact-header-freq-question');
                    mainDiv.appendChild(child);
                    var questionMainDiv = document.createElement('div');
                    questionMainDiv.style.display = 'grid';
                    mainDiv.appendChild(questionMainDiv);
                    //1
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isSafeToUse.replace('X', ingredients[i].displayName);
                    child.style.order = '1';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isSafeToUse) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isSafeToUseYes;
                        child.style.order = '2';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isSafeToUseNo.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';
                        child.style.order = '3';
                        questionMainDiv.appendChild(child);
                    }
                    //2
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isGoodForYourSkin.replace('X', ingredients[i].displayName);
                    child.style.order = '4';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isGoodForYourSkin) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForYourSkinYes;
                        child.style.order = '5';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForYourSkinNo.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';
                        child.style.order = '6';
                        questionMainDiv.appendChild(child);
                    }
                    //3
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.classList.add('seo-question-new-section');
                    child.innerText = isDangerous.replace('X', ingredients[i].displayName);
                    child.style.order = '7';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isDangerous) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isDangerousYes.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';
                        child.style.order = '8';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isDangerousNo;
                        child.style.order = '9';
                        questionMainDiv.appendChild(child);
                    }
                    //4
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isBadForYourSkin.replace('X', ingredients[i].displayName);
                    child.style.order = '10';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isBadForYourSkin) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isBadForYourSkinYes.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';
                        child.style.order = '11';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isBadForYourSkinNo;
                        child.style.order = '12';
                        questionMainDiv.appendChild(child);
                    }
                    //5
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isSafeDuringPregnancy.replace('X', ingredients[i].displayName);
                    child.style.order = '25';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isSafeDuringPregnancy) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isSafeDuringPregnancyYes;
                        child.style.order = '26';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isSafeDuringPregnancyNo.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';;
                        child.style.order = '27';
                        questionMainDiv.appendChild(child);
                    }
                    //6
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isBadForSensitiveSkin.replace('X', ingredients[i].displayName);
                    child.style.order = '19';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isBadForSensitiveSkin) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isBadForSensitiveSkinYes.replace('Y', convert(ingredients[i].concerns.length)) + concernsLink + '.';
                        child.style.order = '20';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isBadForSensitiveSkinNo;
                        child.style.order = '21';
                        questionMainDiv.appendChild(child);
                    }
                    //7
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isExfoliating.replace('X', ingredients[i].displayName);
                    child.style.order = '28';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isExfoliating) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isExfoliatingYes;
                        child.style.order = '29';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isExfoliatingNo;
                        child.style.order = '30';
                        questionMainDiv.appendChild(child);
                    }
                    //8
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.classList.add('seo-question-new-section');
                    child.innerText = isVegan.replace('X', ingredients[i].displayName);
                    child.style.order = '22';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isVegan) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isVeganYes + ingredients[i].origins.map(function (element) { return element.value }).join(',');
                        child.style.order = '23';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isVeganNo;
                        child.style.order = '24';
                        questionMainDiv.appendChild(child);
                    }
                    //9
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.classList.add('seo-question-new-section');
                    child.innerText = isGoodForDrySkin.replace('X', ingredients[i].displayName);
                    child.style.order = '13';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isGoodForDrySkin) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForDrySkinYes.replace('Y', convert(ingredients[i].functions.length)) + functionsLink + '.';
                        child.style.order = '14';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForDrySkinNo;
                        child.style.order = '15';
                        questionMainDiv.appendChild(child);
                    }
                    //10
                    child = document.createElement('h1');
                    child.classList.add('seo-question');
                    child.innerText = isGoodForOilySkin.replace('X', ingredients[i].displayName);
                    child.style.order = '16';
                    questionMainDiv.appendChild(child);
                    if (ingredients[i].isGoodForOilySkin) {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForOilySkinYes.replace('Y', convert(ingredients[i].functions.length)) + functionsLink + '.';
                        child.style.order = '17';
                        questionMainDiv.appendChild(child);
                    } else {
                        child = document.createElement('div');
                        child.classList.add('seo-answer');
                        child.innerHTML = isGoodForOilySkinNo;
                        child.style.order = '18';
                        questionMainDiv.appendChild(child);
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
    if (id) {
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

    var ingredient = getParameterByName('ingredient');
    if (ingredient) {
        getIngredientData(ingredient);
        $('#searchbox').val(ingredient);
    }

    $('form input').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    $('#searchbox').on('keydown', function (e) {
        e.stopPropagation();
        const key = e.key;
        if (key == 'Enter') {
            var text = $('#searchbox').val().trimStart();
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
        var text = $('#searchbox').val().trimStart();
        selectCounter = -1;

        if (text.length == 0) {
            parent.innerHTML = '';
            document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
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
                    if (result.responseJSON && result.responseJSON.length > 0) {
                        parent.style.display = 'inherit';
                        document.getElementById('searchbar').style.borderBottomLeftRadius = '0px';
                        document.getElementById('searchbar').style.borderBottomRightRadius = '0px';
                        parent.innerHTML = '';
                        var text = $('#searchbox').val().trimStart();
                        if (text.length == 0) {
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
})