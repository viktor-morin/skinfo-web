var url = 'https://api.skinfo.se/';
var selectCounter = -1;
var oldestSearchValue = '';

function drawIngredientInfo(result) {
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
        if (json.single.errorsDuplicates.length == 0) {
            $('#widget').html(json.widget);
            var mainShareElement = document.createElement('div');
            mainShareElement.style.display = 'flex';
            var shareElement = document.createElement('div');
            shareElement.classList.add('seo-svg-share-element');
            shareElement.addEventListener('click', createLink, false);
            var shareText = document.createElement('div');
            shareText.style.marginTop = '-2px';
            shareText.innerText = 'Share'
            var svgChild = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgChild.classList.add('seo-svg-share-withText');
            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#share');
            svgChild.appendChild(use);
            shareElement.appendChild(shareText);
            shareElement.appendChild(svgChild);
            mainShareElement.appendChild(shareElement);
            mainDiv.appendChild(mainShareElement);
        }
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
            var svgChild = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgChild.classList.add('seo-svg-share');
            svgChild.addEventListener('click', createLink, false);
            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#share');
            svgChild.appendChild(use);
            mainDiv.appendChild(svgChild);
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
            mainDiv.appendChild(child);
            child = document.createElement('h3');
            child.classList.add('seo-settings-underheader');
            child.innerText = settingsUnderHeader;
            mainDiv.appendChild(child);
            child = document.createElement('div');
            child.style.marginTop = '20px';
            mainDiv.appendChild(child);
            child = document.createElement('div');
            child.style.marginTop = '20px';
            child.style.marginBottom = '20px';
            child.style.borderTop = '1px solid black';
            mainDiv.appendChild(child);
            child = document.createElement('div');
            child.innerHTML = questionsHeader.replace('X', ingredients[i].displayName);
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
                child.innerHTML = isSafeToUseNo.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';
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
                child.innerHTML = isGoodForYourSkinNo.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';
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
                child.innerHTML = isDangerousYes.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';
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
                child.innerHTML = isBadForYourSkinYes.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';
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
                child.innerHTML = isSafeDuringPregnancyNo.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';;
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
                child.innerHTML = isBadForSensitiveSkinYes.replace('X', convert(ingredients[i].concerns.length)) + concernsLink + '.';
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
            if (ingredients[i].origins.length > 0) {
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
                child.innerHTML = isGoodForDrySkinYes.replace('X', convert(ingredients[i].functions.length)) + functionsLink + '.';
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
                child.innerHTML = isGoodForOilySkinYes.replace('X', convert(ingredients[i].functions.length)) + functionsLink + '.';
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

function copyToClipboard(string) {
    let textarea;
    let result;

    try {
        textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', true);
        textarea.setAttribute('contenteditable', true);
        textarea.style.position = 'fixed';
        textarea.value = string;

        document.body.appendChild(textarea);
        textarea.select();
        result = document.execCommand('copy');
        textarea.blur();
    } catch (err) {
        console.error(err);
        result = null;
    } finally {
        document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
        result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
        if (!result) {
            return false;
        }
    }
    return true;
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function createLink() {
    var guid = uuidv4();
    $.ajax({
        type: 'POST',
        headers: { 'apikey': '6h[-yENBfB' },
        url: url + 'website/createsharedlink?ingredients=' + oldestSearchValue + '&language=' + getLanguage() + '&guid=' + guid,
        dataType: 'html',
        complete: function (result) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerText = 'Url copied!'
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        },
        error: function () {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerText = 'Something went wrong!'
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
    });

    copyToClipboard('https://www.skinfo.se/search?id=' + guid);
}

function getIngredientData(searchValue) {
    $.ajax({
        type: 'GET',
        headers: { 'apikey': '6h[-yENBfB' },
        url: url + 'website/ingredient?ingredients=' + searchValue + '&language=' + getLanguage(),
        dataType: 'html',
        complete: function (result) {
            oldestSearchValue = searchValue;
            drawIngredientInfo(result);
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
        if (element.startsWith(query))
            return query + '<b>' + element.replace(query, '') + '</b>';

        var words = query.split(' ');
        element = '<b>' + element + '</b>';
        words.forEach(word => {
            if (element.includes(word) && word != '')
                element = element.replace(word, '</b>' + word + '<b>');
        });

        return element;
    }

    var id = getParameterByName('id');
    if (id) {
        $.ajax({
            type: 'GET',
            headers: { 'apikey': '6h[-yENBfB' },
            url: url + 'website/link?id=' + id + '&language=' + getLanguage(),
            dataType: 'html',
            complete: function (result) {
                drawIngredientInfo(result);
                var json = JSON.parse(result.responseText);
                $('#searchbox').val(json.query);
                oldestSearchValue = json.query;
            }
        });
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
                                document.getElementById('searchbox').value = '';
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
        var data = {
            search: true,
            query: query,
            language: getLanguage()
        };
        document.getElementById('skinfo-settings-iframe').contentWindow.postMessage(data, '*');
    }
})