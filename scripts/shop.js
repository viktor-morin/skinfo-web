var url = 'https://localhost:5001/';
//url = 'https://staging.skinfo.se/';
var selectCounter = -1;
var oldestSearchValue = '';

function loadSessionStorage() {
    var tagsJSON = sessionStorage.getItem('tags');
    var productJSON = sessionStorage.getItem('products');

    var tags = JSON.parse(tagsJSON);
    if (tags) {
        for (i = 0; i < tags.length; i++) {
            var tagElement = document.createElement('span');
            tagElement.classList.add('search-tag');
            tagElement.innerHTML = tags[i];

            var inputfield = document.getElementById('searchinput');
            var children = inputfield.children;
            for (i = 0; i < children.length; i++) {
                if (children[i].id == 'searchicon' || children[i].classList.contains('search-tag'))
                    continue;
                else {
                    children[i].insertAdjacentElement('beforebegin', tagElement);
                    break;
                }
            }
        }
    }

    var products = JSON.parse(productJSON);
    if (products) {
        products.forEach(product => createProductCardElement(product));
    }
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}



function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function createProductPage(product) {
    var card = document.createElement('div');
    card.classList.add('product-card-single');

    var productImg = document.createElement('div');
    productImg.classList.add('product-img-div-single');

    var img = document.createElement('img');
    img.src = product.pictureUrl;
    img.classList.add('product-img');
    productImg.appendChild(img);

    card.appendChild(productImg);

    var brand = document.createElement('brand');
    brand.innerText = product.brand;
    brand.classList.add('product-brand');
    card.appendChild(brand);

    var name = document.createElement('div');
    name.innerText = product.name;
    name.classList.add('product-name');
    card.appendChild(name);

    var summary = document.createElement('div');
    summary.classList.add('summarydiv');
    var summaryText = document.createElement('div');
    summaryText.innerText = 'Summering';
    summaryText.style.fontWeight = 'bold';
    var summarySciene = document.createElement('a');
    summarySciene.innerText = 'Baserat på vetenskaplig underlag';
    summarySciene.style.color = 'black';
    summarySciene.style.textDecoration = 'underline';
    var summaryLogoDiv = document.createElement('div');
    var summaryLogo = document.createElement('img');
    summaryLogo.src = 'svg/skinfo-logo-color-black.svg';
    summaryLogo.width = '50';
    var summaryIcon = document.createElement('img');
    summaryIcon.src = 'svg/check-filled.svg';
    summaryIcon.width = '10';
    summaryIcon.style.paddingLeft = '5px';
    summaryIcon.style.paddingBottom = '3px';
    summaryLogoDiv.appendChild(summaryLogo);
    summaryLogoDiv.appendChild(summaryIcon);
    summary.appendChild(summaryText);
    summary.appendChild(summarySciene);
    summary.appendChild(summaryLogoDiv);
    card.appendChild(summary);

    var skinfunctions = document.createElement('div');
    skinfunctions.style.display = 'flex';
    var skinfunctionText = document.createElement('div');
    var skinfunctionsLogo = document.createElement('div');
    //skinfunctionsLogo.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.881 122.88" enable-background="new 0 0 122.881 122.88" xml:space="preserve"><g><path d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" /></g></svg>';
    skinfunctionsLogo.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-5 -5 360 360" xml:space="preserve"><g style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" ><path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 68.371 32.98 l -26.521 30 c -0.854 0.967 -2.083 1.52 -3.372 1.52 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 C 69.843 28.275 70.018 31.119 68.371 32.98 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>';

    skinfunctionsLogo.style.width = '25px';
    skinfunctionsLogo.style.marginRight = '10px';

    if (product.skinfunctions.length > 0)
        skinfunctionsLogo.style.fill = 'green';
    else
        skinfunctionsLogo.style.fill = 'lightgray';

    skinfunctions.appendChild(skinfunctionsLogo);
    var skinfunctionTitle = document.createElement('div');
    skinfunctionTitle.style.fontWeight = 'bold';
    skinfunctionTitle.innerText = 'Kan hjälpa med (' + product.skinfunctions.length + ' st)';

    var skinfunctionUnderText = document.createElement('div');

    for (i = 0; i < product.skinfunctions.length; i++) {
        var fullText = product.skinfunctions[i].split(':');
        skinfunctionUnderText.innerHTML = skinfunctionUnderText.innerHTML + fullText[0] + '<i style="color:rgba(0,0,0,0.6)"> - ' + fullText[1].trim() + '</i><br>';
    }

    //skinfunctionUnderText.innerHTML = product.skinfunctions.join('<br>');

    skinfunctionText.appendChild(skinfunctionTitle);
    skinfunctionText.appendChild(skinfunctionUnderText);
    skinfunctions.appendChild(skinfunctionsLogo);
    skinfunctions.appendChild(skinfunctionText);

    var highlights = document.createElement('div');
    highlights.style.display = 'flex';
    highlights.style.marginTop = '5px';
    highlights.style.marginBottom = '5px';
    var highlightsText = document.createElement('div');
    var highlightsLogo = document.createElement('div');
    // highlightsLogo.innerHTML = '<?xml version="1.0" ?><svg style="enable-background:new 0 0 32 32;" version="1.1" viewBox="7.5 7.5 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"></style><g><g transform="translate(28.000000, 278.000000)"><path d="M4-222.1c-13.2,0-23.9-10.7-23.9-23.9c0-13.2,10.7-23.9,23.9-23.9s23.9,10.7,23.9,23.9 C27.9-232.8,17.2-222.1,4-222.1L4-222.1z M4-267.3c-11.7,0-21.3,9.6-21.3,21.3s9.6,21.3,21.3,21.3s21.3-9.6,21.3-21.3 S15.7-267.3,4-267.3L4-267.3z"/><polygon points="-8.7,-247.4 16.7,-247.4 16.7,-244.6 -8.7,-244.6"/><polygon points="2.6,-258.7 5.4,-258.7 5.4,-233.3 2.6,-233.3"/></g></g></svg>';
    highlightsLogo.style.minWidth = '25px';
    highlightsLogo.style.marginRight = '10px';

    if (product.highlights.length > 0)
        highlightsLogo.style.fill = 'black';
    else
        highlightsLogo.style.fill = 'lightgray';

    highlights.appendChild(highlightsLogo);

    var highlightsTitle = document.createElement('div');
    highlightsTitle.style.fontWeight = 'bold';
    highlightsText.appendChild(highlightsTitle);
    highlightsText.style.display = 'flex';
    highlightsText.style.marginTop = '5px';
    //highlightsText.style.margin = 'auto';

    for (i = 0; i < product.highlights.length; i++) {
        var highlightsUnderText = document.createElement('div');
        highlightsUnderText.innerHTML = product.highlights[i];
        highlightsUnderText.classList.add('synonym-tag');
        highlightsText.appendChild(highlightsUnderText);
    }

    //highlights.appendChild(highlightsLogo);
    //highlights.appendChild(highlightsText);

    var concerns = document.createElement('div');
    concerns.style.display = 'flex';
    concerns.style.marginTop = '5px';
    concerns.style.marginBottom = '5px';
    var concernsLogo = document.createElement('div');
    var concernsText = document.createElement('div');
    concernsLogo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 286.054 286.054" style="enable-background:new 0 0 286 286;" xml:space="preserve"><g><path d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027 c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209 S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972 c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723 c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843 C160.878,195.732,152.878,187.723,143.036,187.723z"></path></g></svg>';
    concernsLogo.style.minWidth = '25px';
    concernsLogo.style.marginRight = '10px';

    if (product.concerns.length > 0)
        concernsLogo.style.fill = 'rgb(255, 161, 0)';
    else
        concernsLogo.style.fill = 'lightgray';

    concerns.appendChild(concernsLogo);

    var concernsTitle = document.createElement('div');
    concernsTitle.style.fontWeight = 'bold';
    concernsTitle.innerText = 'Bra att veta (' + product.concerns.length + ' st)';

    var concersUnderText = document.createElement('div');
    for (i = 0; i < product.concerns.length; i++) {
        var fullText = product.concerns[i].split(':');
        concersUnderText.innerHTML = concersUnderText.innerHTML + fullText[0] + '<br><i style="color: rgba(0,0,0,0.6);">' + fullText[1] + '</i><br>';
    }
    //concersUnderText.innerHTML = product.concerns.join('<br>');

    concernsText.appendChild(concernsTitle);
    concernsText.appendChild(concersUnderText);
    concerns.appendChild(concernsLogo);
    concerns.appendChild(concernsText);

    //card.appendChild(highlights);
    card.appendChild(skinfunctions);
    card.appendChild(concerns);

    var highlights = document.createElement('div');
    highlights.style.display = 'flex';
    var highlightsTitle = document.createElement('div');
    highlightsTitle.style.fontWeight = 'bold';
    highlightsTitle.innerText = 'Övrigt';

    highlights.style.display = 'flex';
    highlights.style.marginTop = '5px';
    highlights.style.marginBottom = '5px';
    var highlightsLogo = document.createElement('div');
    highlightsLogo.innerHTML = '<?xml version="1.0" ?><svg style="enable-background:new 0 0 32 32;" version="1.1" viewBox="7.5 7.5 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"></style><g><g transform="translate(28.000000, 278.000000)"><path d="M4-222.1c-13.2,0-23.9-10.7-23.9-23.9c0-13.2,10.7-23.9,23.9-23.9s23.9,10.7,23.9,23.9 C27.9-232.8,17.2-222.1,4-222.1L4-222.1z M4-267.3c-11.7,0-21.3,9.6-21.3,21.3s9.6,21.3,21.3,21.3s21.3-9.6,21.3-21.3 S15.7-267.3,4-267.3L4-267.3z"/><polygon points="-8.7,-247.4 16.7,-247.4 16.7,-244.6 -8.7,-244.6"/><polygon points="2.6,-258.7 5.4,-258.7 5.4,-233.3 2.6,-233.3"/></g></g></svg>';
    highlightsLogo.style.minWidth = '25px';
    highlightsLogo.style.marginRight = '10px';

    if (product.highlights.length > 0)
        highlightsLogo.style.fill = 'black';
    else
        highlightsLogo.style.fill = 'lightgray';


    var hightlightsdiv = document.createElement('div');

    highlights.appendChild(highlightsLogo);
    hightlightsdiv.appendChild(highlightsTitle);
    hightlightsdiv.appendChild(highlightsText);
    highlights.appendChild(hightlightsdiv);
    card.appendChild(highlights);

    var ingredientlist = document.createElement('div');
    ingredientlist.innerText = 'Ingredienslista';
    ingredientlist.classList.add('gray-title');
    card.appendChild(ingredientlist);

    var inci = document.createElement('div');
    inci.id = 'inci';
    card.appendChild(inci);

    var shops = document.createElement('div');
    shops.classList.add('gray-title');
    shops.innerText = 'Butiker';
    card.appendChild(shops);

    for (i = 0; i < product.affiliatelinks.length; i++) {
        var shop = product.affiliatelinks[i].shop;
        var price = product.affiliatelinks[i].price;
        var productUrl = product.affiliatelinks[i].url;

        var shopDiv = document.createElement('div');
        shopDiv.style.display = 'flex';
        shopDiv.style.justifyContent = 'space-around';
        var shopImg = document.createElement('img');
        shopImg.style.width = '100px';
        shopImg.style.height = 'fit-content';
        shopImg.style.margin = 'auto';

        switch (shop) {
            case 'APOTEA':
                shopImg.src = 'shop/apotea-logo.webp';
                break;
            case 'SKINCITY':
                shopImg.src = 'shop/skincity.svg';
                break;
        }

        var shopPrice = document.createElement('div');
        shopPrice.innerText = price + 'kr';
        shopPrice.style.margin = 'auto';

        var shopButton = document.createElement('a');
        shopButton.innerText = 'Till Butik';
        shopButton.href = productUrl;
        shopButton.classList.add('shop-button');
        shopButton.style.margin = 'auto';

        shopDiv.appendChild(shopImg);
        shopDiv.appendChild(shopPrice);
        shopDiv.appendChild(shopButton);

        card.appendChild(shopDiv);
    }

    var sources = document.createElement('div');
    sources.classList.add('gray-title');
    sources.classList.add('collapsible');
    sources.innerText = 'Källor';
    sources.onclick = function (e) {
        var content = document.getElementById('sources-content');
        var contentArrow = document.getElementById('sources-arrow');
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
        if (contentArrow.classList.contains('down')) {
            contentArrow.classList.remove('down');
            contentArrow.classList.add('up');
        } else {
            contentArrow.classList.add('down');
            contentArrow.classList.remove('up');
        }
    }

    var arrow = document.createElement('i');
    arrow.id = 'sources-arrow';
    arrow.classList.add('arrow');
    arrow.classList.add('down');
    sources.appendChild(arrow);

    var sourcesData = document.createElement('div');
    sourcesData.id = 'sources-content';
    sourcesData.classList.add('sources-content');

    var skinfoinfo = document.createElement('div');
    skinfoinfo.innerText = 'Skinfo baserar all data från högt respekterade källor från forskning och myndigheter'
    skinfoinfo.style.marginBottom = '10px';
    var echa = document.createElement('div');
    echa.innerText = 'European Chemicals Agency'
    var chemsec = document.createElement('div');
    chemsec.innerText = 'The International Chemical Secretariat'
    var europeanCommision = document.createElement('div');
    europeanCommision.innerText = 'European Commission';
    var pcpc = document.createElement('div');
    pcpc.innerText = 'Personal Care Products Council'
    var oecd = document.createElement('div');
    oecd.innerText = 'The Organisation for Economic Co-operation and Development';

    sourcesData.appendChild(skinfoinfo);
    sourcesData.appendChild(echa);
    sourcesData.appendChild(chemsec);
    sourcesData.appendChild(europeanCommision);
    sourcesData.appendChild(pcpc);
    sourcesData.appendChild(oecd);

    card.appendChild(sources);
    card.appendChild(sourcesData);

    document.getElementById('product').appendChild(card);
    $('#inci').html(product.widget);

    document.getElementsByClassName('si-main-in-div')[0].remove();
    document.getElementById('si-ingredients-menu').parentNode.children[0].remove();
    document.getElementById('si-personal-section').remove();
}


function getParameterByName(name, url = window.location.href) {
    if (url.includes('C:'))
        return 'a379667c-41f4-4629-8f20-40c60c6e6242';
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var productId = getParameterByName('id');
if (productId) {
    $.ajax({
        url: url + 'shopproduct/?id=' + productId,
        type: 'GET',
        headers: { 'apikey': 'EChu_A6S2vd' },
        success: function (product) {
            createProductPage(product);
        },
        error: function (data) {
        }
    });
}


var productJSON = sessionStorage.getItem('products');
if (!window.location.href.includes('product') && (productJSON == null || productJSON.length == 0)) {
    $.ajax({
        url: url + 'shopproduct/getall/',
        type: 'GET',
        headers: { 'apikey': 'EChu_A6S2vd' },
        success: function (products) {
            var productPage = document.getElementById('product');
            if (productPage && products.length == 0)
                productPage.style.display = 'grid';
            else if (productPage)
                productPage.style.display = 'none';
            products.forEach(product => createProductCardElement(product));
        },
        error: function (data) {
            //errorFunction();
        }
    });
}

$.ajax({
    url: 'https://staging.skinfo.se/cookie/shop/',
    type: 'GET',
    xhrFields: {
        withCredentials: true
    },
    success: function () {
        var userId = getCookie('_skinfo-shop-id');
        amplitude.getInstance().setUserId(userId);
    },
    error: function () {
    }
});

function createProductCardElement(product) {
    var card = document.createElement('a');
    card.href = 'https://skinfo.se/product?id=' + product.id;
    card.classList.add('product-card');

    var productImg = document.createElement('div');
    productImg.classList.add('product-img-div');

    var img = document.createElement('img');
    img.src = product.pictureUrl;
    img.classList.add('product-img');
    productImg.appendChild(img);

    card.appendChild(productImg);

    var productTextDiv = document.createElement('div');
    productTextDiv.classList.add('product-text');

    var brand = document.createElement('brand');
    brand.innerText = product.brand;
    brand.classList.add('product-brand');
    //card.appendChild(brand);
    productTextDiv.appendChild(brand);

    var name = document.createElement('div');
    name.innerText = product.name;
    name.classList.add('product-name');
    //card.appendChild(name);
    productTextDiv.appendChild(name);

    var price = document.createElement('div');
    price.innerText = product.price;
    price.classList.add('product-price');
    //card.appendChild(price);


    card.appendChild(productTextDiv);

    card.appendChild(price);

    var skinfoData = document.createElement('div');
    skinfoData.style.marginTop = '10px';
    skinfoData.style.display = 'flex';
    skinfoData.style.justifyContent = 'space-evenly';
    //skinfoData.style.backgroundColor = 'rgb(248, 248, 248)';
    var skinfoLogo = document.createElement('img');
    skinfoLogo.src = 'svg/skinfo-logo-color-black.svg';
    skinfoLogo.style.width = '50px';

    var skinfunctionsDiv = document.createElement('div');
    skinfunctionsDiv.classList.add('skinfoDataElement');
    var skinfunctions = document.createElement('div');
    skinfunctions.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-5 -5 360 360" xml:space="preserve"><g style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" ><path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 68.371 32.98 l -26.521 30 c -0.854 0.967 -2.083 1.52 -3.372 1.52 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 C 69.843 28.275 70.018 31.119 68.371 32.98 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>';
    skinfunctions.style.width = '20px';
    skinfunctions.style.margin = 'auto';

    if (product.skinfunctions.length > 0)
        skinfunctions.style.fill = 'green';
    else
        skinfunctions.style.fill = 'lightgray';

    skinfunctionsDiv.appendChild(skinfunctions);
    var skinfunctionsNumber = document.createElement('div');
    skinfunctionsNumber.innerText = product.skinfunctions.length;
    skinfunctionsNumber.classList.add('skinfoDataNumber');
    skinfunctionsDiv.appendChild(skinfunctionsNumber);

    var concernsDiv = document.createElement('div');
    concernsDiv.classList.add('skinfoDataElement');
    concernsDiv.style.display = 'flex';
    concernsDiv.style.flexDirection = 'row';
    var concerns = document.createElement('div');
    concerns.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 286.054 286.054" style="enable-background:new 0 0 286 286;" xml:space="preserve"><g><path d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027 c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209 S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972 c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723 c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843 C160.878,195.732,152.878,187.723,143.036,187.723z"></path></g></svg>';
    concerns.style.width = '20px';
    concerns.style.margin = 'auto';

    if (product.concerns.length > 0)
        concerns.style.fill = '#FFA100';
    if (product.concerns.length == 0)
        concerns.style.fill = 'lightgray';

    concernsDiv.appendChild(concerns);

    var concernsStats = document.createElement('div');
    concernsStats.appendChild(concerns);

    var concernsNumber = document.createElement('div');
    concernsNumber.innerText = product.concerns.length;
    concernsNumber.classList.add('skinfoDataNumber');
    concernsStats.appendChild(concernsNumber);

    concernsDiv.appendChild(concernsStats);
    skinfoData.appendChild(skinfoLogo);
    skinfoData.appendChild(skinfunctionsDiv);
    skinfoData.appendChild(concernsDiv);
    card.appendChild(skinfoData);
    document.getElementById('allproducts').appendChild(card);
}

function getSortOrder() {
    return document.getElementById('sort').value;
}

function saveSessionStorage(data) {
    var tags = document.getElementsByClassName('search-tag');
    var innerTags = [];
    for (i = 0; i < tags.length; i++) {
        innerTags.push(tags[i].innerHTML);
    }

    window.sessionStorage.setItem('tags', JSON.stringify(innerTags));
    window.sessionStorage.setItem('products', JSON.stringify(data));
}

function removeTag(e) {
    e.parentElement.parentElement.remove();
    browse();
}

function getAllTagsAsBrowseTags() {
    return {
        brands: Array.from(document.getElementsByClassName('search-tags-brand')).map(m => m.innerText),
        ingredients: Array.from(document.getElementsByClassName('search-tags-ingredient')).map(m => m.innerText),
        productNames: Array.from(document.getElementsByClassName('search-tags-name')).map(m => m.innerText),
    };
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
        url: url + 'shopproduct/browse',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(browseModel),
        headers: { 'apikey': 'EChu_A6S2vd' },
        success: function (data) {
            document.getElementById('allproducts').innerHTML = '';
            var products = data.searchResult;
            saveSessionStorage(products);
            var productPage = document.getElementById('product');
            if (productPage && products.length == 0)
                productPage.style.display = 'grid';
            else if (productPage)
                productPage.style.display = 'none';

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
    document.getElementById('allproducts').onclick = function () {
        var event = 'Button Clicked';
        var eventProperties = {
            "hover time": "100ms"
        };
        amplitude.getInstance().logEvent(event, eventProperties);
    }

    document.getElementById('sort').onchange = function (e) {
        browse();
    }

    document.getElementById('no-concerns').onchange = function (e) {
        browse();
    }

    document.getElementById('vegan').onchange = function (e) {
        browse();
    }

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
                } else {
                    logData(result.innerText);
                    getShopData(result.innerText, result.classList[result.classList.length - 2]);
                    $('#searchbox').val('');
                }
            }
            parent.innerHTML = '';
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
                        parent.innerHTML = '';
                        var text = $('#searchbox').val().trimStart();
                        if (text.length == 0) {
                            parent.innerHTML = '';
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

    loadSessionStorage();
    var oldScrollValue = sessionStorage.getItem('skinfo-scroll');
    if (oldScrollValue !== null) {
        var value = parseInt(oldScrollValue, 10);
        value = (value * -1) + 50;
        window.scrollTo(0, value);
    }

    window.addEventListener("beforeunload", () => {
        window.sessionStorage.setItem('skinfo-scroll', document.body.getBoundingClientRect().top.toString());
    });
})