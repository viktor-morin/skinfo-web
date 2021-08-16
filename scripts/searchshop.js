var url = 'https://localhost:5001/';
url = 'https://staging.skinfo.se';
var selectCounter = -1;
var oldestSearchValue = '';

function getSortOrder() {
    return document.getElementById('sort').value;
}

function browse() {
    var pageNumber = -1;
    var browseModel = {
        browseTags: getAllTagsAsBrowseTags(),
        sortOrder: getSortOrder(),
        pageNumber: pageNumber,
        noConcerns: document.getElementById('no-concerns').checked
    };

    $.ajax({
        url: 'https://localhost:5001/shopproduct/browse',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(browseModel),
        headers: { 'apikey': 'EChu_A6S2vd' },
        success: function (data) {
            document.getElementById('allproducts').innerHTML = '';
            var products = data.searchResult;
            products.forEach(product => createProductCardElement(product));
        },
        error: function (data) {
            //errorFunction();
        }
    });
}

function updateTags(value, tagType) {
    var tagElement = document.createElement('span');
    tagElement.classList.add('search-tag');
    switch (tagType) {
        case "searchbar-brand":
            tagElement.innerHTML = '<span class="search-tags search-tags-brand" style="display: flex; width:max-content;">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
        case "searchbar-product":
            tagElement.innerHTML = '<span class="search-tags search-tags-name" style="display: flex; width:max-content;">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
        case "searchbar-ingredient":
            tagElement.innerHTML = '<span class="search-tags search-tags-ingredient" style="display: flex; width:max-content;">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
    }

    var inputfield = document.getElementById('searchinput');
    var children = inputfield.children;
    for (i = 0; i < children.length; i++) {
        if (children[i].id == 'searchicon' || children[i].classList.contains('search-tag'))
            continue;
        else {
            children[i].insertAdjacentElement('beforebegin', tagElement);
            return;
        }
    }
}

function convertLatestTagToText() {
    var tags = document.getElementsByClassName('search-tag');
    if (tags.length == 0)
        return;

    $('#searchbox').val(tags[tags.length - 1].innerText);
    tags[tags.length - 1].remove();
}

function updateGUI(result) {

}

function updateResult(result) {
    updateGUI(result);
}

function getShopData(searchValue, tagType) {
    updateTags(searchValue, tagType);
    browse();
}

function getLanguage() {
    return 'sv-SE';

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

    function createInnerBrandsElementForSuggestion(query, element) {
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

    function createInnerIngredientElementForSuggestion(query, element) {
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

    function createInnerProductElementForSuggestion(query, element) {
        query = query.toLowerCase();
        if (element.productName.startsWith(query))
            return query + '<b>' + element.productName.replace(query, '') + '</b>';

        var words = query.split(' ');
        element.productName = '<b>' + element.productName + '</b>';
        words.forEach(word => {
            if (element.productName.includes(word) && word != '')
                element.productName = element.productName.replace(word, '</b>' + word + '<b>');
        });

        return element.productName;
    }

    var id = getParameterByName('id');
    if (id) {
        //change to product id

        // $.ajax({
        //     type: 'GET',
        //     headers: { 'apikey': '6h[-yENBfB' },
        //     url: url + 'website/link?id=' + id + '&language=' + getLanguage(),
        //     dataType: 'html',
        //     complete: function (result) {
        //         updateResult(result);
        //         var json = JSON.parse(result.responseText);
        //         $('#searchbox').val(json.query);
        //         oldestSearchValue = json.query;
        //     }
        // });
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

            if (document.getElementById('searchbar-suggestions').style.display == 'none') {
                return;
            }

            else {
                var parent = document.getElementById('searchbar-suggestions');
                var result = parent.querySelector(".search-selected");
                if (result == null) {
                    var childCounter = 1;
                    while (parent.children[childCounter].classList.contains('searchbar-title')) {
                        childCounter++;
                    }
                    logData(parent.children[childCounter].innerText);
                    getShopData(parent.children[childCounter].innerText, parent.children[childCounter].classList[parent.children[childCounter].classList.length - 1]);
                    $('#searchbox').val('');
                    //$('#searchbox').val(parent.children[childCounter].innerText);
                } else {
                    logData(result.innerText);
                    getShopData(result.innerText, result.classList[result.classList.length - 1]);
                    $('#searchbox').val('');
                    //$('#searchbox').val(result.innerText);
                }
            }
            parent.innerHTML = '';
            // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
            // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
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
        else if (key == 'Backspace' && document.getElementById('searchbox').value == '') {
            convertLatestTagToText();
            return false;
        }
    });

    $('#searchbox').on('input', function (e) {
        e.stopPropagation();
        var parent = document.getElementById('searchbar-suggestions');
        var text = $('#searchbox').val().trimStart();
        selectCounter = -1;

        if (text.length == 0) {
            parent.innerHTML = '';
            // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
            // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
            parent.style.display = 'none';
        }
        else {
            $.ajax({
                type: 'GET',
                url: url + 'shopproduct/suggestion?query=' + text,
                headers: { 'apikey': 'EChu_A6S2vd' },
                contentType: "application/json; charset=utf-8",
                complete: function (result) {
                    if (result.responseJSON && (
                        result.responseJSON.brands || result.responseJSON.ingredients || result.responseJSON.products) &&
                        (result.responseJSON.brands.length > 0 || result.responseJSON.ingredients.length > 0 ||
                            result.responseJSON.products.length > 0)) {
                        parent.style.display = 'inherit';
                        // document.getElementById('searchbar').style.borderBottomLeftRadius = '0px';
                        // document.getElementById('searchbar').style.borderBottomRightRadius = '0px';
                        parent.innerHTML = '';
                        var text = $('#searchbox').val().trimStart();
                        if (text.length == 0) {
                            parent.innerHTML = '';
                            // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                            // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
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

                        //brands
                        if (result.responseJSON.brands.length > 0) {
                            var brandName = document.createElement('div');
                            brandName.classList.add('searchbar-item');
                            brandName.classList.add('searchbar-title');
                            brandName.innerText = 'Varumärke';
                            parent.appendChild(brandName);
                        }
                        result.responseJSON.brands.forEach(element => {
                            var child = document.createElement('div');
                            child.innerHTML = createInnerBrandsElementForSuggestion(text, element);
                            child.classList.add('searchbar-item');
                            child.classList.add('searchbar-brand');
                            child.onclick = function () {
                                parent.innerHTML = '';
                                // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                                // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
                                parent.style.display = 'none';
                                logData(element);
                                getShopData(element, 'searchbar-brand');
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

                        //products
                        if (result.responseJSON.products.length > 0) {
                            var productsName = document.createElement('div');
                            productsName.classList.add('searchbar-item');
                            productsName.classList.add('searchbar-title');
                            productsName.innerText = 'Produkter';
                            parent.appendChild(productsName);
                        }
                        result.responseJSON.products.forEach(element => {
                            var child = document.createElement('div');
                            child.innerHTML = createInnerProductElementForSuggestion(text, element);
                            child.classList.add('searchbar-item');
                            child.classList.add('searchbar-product')
                            child.onclick = function () {
                                parent.innerHTML = '';
                                // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                                // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
                                parent.style.display = 'none';
                                logData(element);
                                getShopData(element, 'searchbar-product');
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

                        //ingredients
                        if (result.responseJSON.ingredients.length > 0) {
                            var ingredientsName = document.createElement('div');
                            ingredientsName.classList.add('searchbar-item');
                            ingredientsName.classList.add('searchbar-title');
                            ingredientsName.innerText = 'Ingredienser';
                            parent.appendChild(ingredientsName);

                        }
                        result.responseJSON.ingredients.forEach(element => {
                            var child = document.createElement('div');
                            child.innerHTML = createInnerIngredientElementForSuggestion(text, element);
                            child.classList.add('searchbar-item');
                            child.classList.add('searchbar-ingredient');
                            child.onclick = function () {
                                parent.innerHTML = '';
                                // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                                // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
                                parent.style.display = 'none';
                                logData(element);
                                getShopData(element, 'searchbar-ingredient');
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
                        // document.getElementById('searchbar').style.borderBottomLeftRadius = '0.75rem';
                        // document.getElementById('searchbar').style.borderBottomRightRadius = '0.75rem';
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

        //amplitude directyly
    }
})