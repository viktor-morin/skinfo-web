var url = 'https://api.skinfo.se/';
var selectCounter = -1;
var maxPageNumber = -1;
var getNewPage = false;

function browse(pageNumber) {
    var browseModel = {
        browseTags: getAllTagsAsBrowseTags(),
        sortOrder: getSortOrder(),
        pageNumber: pageNumber,
        concernsActive: document.getElementById('concern-onoff').innerText === 'På'
    };
    $.ajax({
        url: url + 'shopproduct/browse/',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(browseModel),
        headers: { 'apikey': 'EChu_A6S2vd' },
        success: function (products) {
            var productPage = document.getElementById('product');
            maxPageNumber = products.maxPageNumber;
            if (productPage && products.searchResult.length == 0)
                productPage.style.display = 'grid';
            else if (productPage)
                productPage.style.display = 'none';

            if (document.getElementById('numberOfProducts'))
                document.getElementById('numberOfProducts').innerText = products.count + ' PRODUKTER';

            if (products.pageNumber == 1)
                document.getElementById('allproducts').innerHTML = '';

            products.searchResult.forEach(product => createProductCardElement(product));

            if (products.pageNumber == 1) {
                saveSessionStorage(products.searchResult);
                window.sessionStorage.setItem('product-count', JSON.stringify(products.count));
            }
            else if (products.pageNumber > 1) {
                appendSessionStorage(products.searchResult);
            }
            sessionStorage.setItem('pageNumber', JSON.stringify(products.pageNumber));
            getNewPage = false;
        },
        error: function (data) {
        }
    });

    logAmplitude('search');
}

function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


function isHidden(el) {
    if (el)
        return (el.offsetParent === null)
}

function logAmplitude(event, data) {
    var pageNumberJSON = sessionStorage.getItem('pageNumber');
    var pageNumber = JSON.parse(pageNumberJSON);
    switch (event) {
        case 'search':
            var eventProperties = {
                'brands': Array.from(document.getElementsByClassName('search-tags-brand')).map(m => m.innerText),
                'ingredients': Array.from(document.getElementsByClassName('search-tags-ingredient')).map(m => m.innerText),
                'productNames': Array.from(document.getElementsByClassName('search-tags-name')).map(m => m.innerText),
                'sortOrder': getSortOrder(),
                'pageNumber': pageNumber,
                'noConcerns': document.getElementById('concern-onoff').innerText === 'Av'
            };
            break;
        case 'buy_click':
            var eventProperties = {
                'whichButton': data
            };
            break;
        case 'show_product':
            var eventProperties = {
                'name': data.name,
                'brand': data.brand,
                'shop': data.affiliatelinks[0].shop,
                'price': data.price,
                'skinfunctions': data.skinfunctions.length,
                'concerns': data.concerns.length,
                'other': data.highlights.length
            };
            break;
        case 'expand_inci':
            var eventProperties = {
                'name': data.name,
                'brand': data.brand,
                'shop': data.affiliatelinks[0].shop,
                'price': data.price,
                'skinfunctions': data.skinfunctions.length,
                'concerns': data.concerns.length,
                'other': data.highlights.length
            };
            break;
    }

    amplitude.getInstance().logEvent(event, eventProperties);
}

function ifTagsHidePlaceholder() {
    var tags = document.getElementsByClassName('search-tag');
    if (tags.length > 0)
        document.getElementById('searchbox').placeholder = '';
    else
        document.getElementById('searchbox').placeholder = 'Sök varumärke, produkt eller ingrediens';
}

function loadSessionStorage() {
    var tagsJSON = sessionStorage.getItem('tags');
    var productJSON = sessionStorage.getItem('products');
    var products = JSON.parse(productJSON);
    if (!products) {
        sessionStorage.removeItem('tags');
        sessionStorage.removeItem('products');
        sessionStorage.removeItem('product-count');
        return;
    }

    var tags = JSON.parse(tagsJSON);
    if (tags) {
        for (i = 0; i < tags.length; i++) {
            var tagElement = document.createElement('span');
            tagElement.classList.add('search-tag');
            tagElement.innerHTML = tags[i];

            document.getElementsByClassName('search-tags-maindiv')[0].appendChild(tagElement);
        }
    }

    ifTagsHidePlaceholder();

    if (products.length > 0) {
        if (document.getElementById('product'))
            document.getElementById('product').innerHTML = '';
        try {
            history.replaceState(null, 'Skinfo', 'https://skinfo.se/shop');
        } catch {

        }
        if (document.getElementById('numberOfProducts')) {
            var countJSON = sessionStorage.getItem('product-count');
            var count = JSON.parse(countJSON);
            document.getElementById('numberOfProducts').innerText = count + ' PRODUKTER';
        }

        for (i = 0; i < products.length; i++) {
            createProductCardElement(products[i]);
        }
    }

    sessionStorage.removeItem('tags');
    sessionStorage.removeItem('products');
    sessionStorage.removeItem('product-count');
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

function productClicked() {
    window.sessionStorage.setItem('product_clicked', JSON.stringify(1));
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
    brand.style.paddingLeft = '20px';
    brand.style.marginTop = '10px';
    card.appendChild(brand);

    var name = document.createElement('div');
    name.innerText = product.name;
    name.classList.add('product-name');
    name.style.minHeight = '0px';
    name.style.paddingLeft = '20px';
    card.appendChild(name);
    var price = document.createElement('div');
    price.innerText = product.price;
    price.style.paddingLeft = '20px';
    price.style.marginBottom = '10px';
    card.appendChild(price);

    var shopButton = document.createElement('a');
    shopButton.innerText = 'Till Butik';
    shopButton.href = product.affiliatelinks[0].url;
    shopButton.target = '_blank';
    shopButton.classList.add('shop-button');
    shopButton.classList.add('buy-upper');
    shopButton.style.width = '33%';
    shopButton.style.width = '150px';
    shopButton.style.marginBottom = '10px';
    card.appendChild(shopButton);

    var summary = document.createElement('div');
    summary.classList.add('summarydiv');
    var summaryText = document.createElement('div');
    summaryText.innerText = 'Summering';
    var summarySciene = document.createElement('div');

    summarySciene.innerText = 'Baserat på vetenskaplig underlag';
    summarySciene.classList.add('summarySciene');
    var summaryLogoDiv = document.createElement('div');
    summaryLogoDiv.style.display = 'flex';
    summaryLogoDiv.style.flexDirection = 'row';
    summaryLogoDiv.appendChild(summarySciene);
    var summaryLogo = document.createElement('img');
    summaryLogo.src = 'svg/skinfo-logo-color-black.svg';
    summaryLogo.width = '50';
    var summaryIcon = document.createElement('img');
    summaryIcon.src = 'svg/check-filled.svg';
    summaryIcon.width = '10';
    summaryIcon.style.paddingLeft = '5px';
    summaryIcon.style.paddingRight = '5px';
    summaryIcon.style.paddingBottom = '3px';
    summaryLogoDiv.appendChild(summaryIcon);
    summaryLogoDiv.appendChild(summaryLogo);

    summary.appendChild(summaryText);
    summary.appendChild(summaryLogoDiv);
    card.appendChild(summary);

    var skinfunctions = document.createElement('div');
    skinfunctions.style.display = 'flex';
    skinfunctions.style.fontSize = '14px';
    var skinfunctionText = document.createElement('div');
    var skinfunctionsLogo = document.createElement('div');
    skinfunctionsLogo.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-5 -5 360 360" xml:space="preserve"><g style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" ><path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 68.371 32.98 l -26.521 30 c -0.854 0.967 -2.083 1.52 -3.372 1.52 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 C 69.843 28.275 70.018 31.119 68.371 32.98 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>';

    skinfunctionsLogo.style.minWidth = '18px';
    skinfunctionsLogo.style.marginRight = '10px';

    if (product.skinfunctions.length > 0)
        skinfunctionsLogo.style.fill = '#31cf8d';
    else
        skinfunctionsLogo.style.fill = 'lightgray';

    skinfunctions.appendChild(skinfunctionsLogo);
    var skinfunctionTitle = document.createElement('div');
    skinfunctionTitle.style.fontWeight = 'bold';
    skinfunctionTitle.style.color = "#545454";
    skinfunctionTitle.style.marginBottom = "3px";
    skinfunctionTitle.innerText = 'Kan hjälpa med (' + product.skinfunctions.length + ' st)';

    var skinfunctionUnderText = document.createElement('div');

    for (i = 0; i < product.skinfunctions.length; i++) {
        var fullText = product.skinfunctions[i].split('|');
        skinfunctionUnderText.innerHTML = skinfunctionUnderText.innerHTML + fullText[0] + ':<i style="font-weight:bold; color: #545454;"> ' + fullText[1].trim() + '</i><br>';
    }

    if (product.skinfunctions.length == 0)
        skinfunctionUnderText.innerHTML = skinfunctionUnderText.innerHTML + '<i style="color:rgba(0,0,0,0.6)"> Skinfo samlar in vetenskaplig information om ingredinsers effekt löpande.</i><br>';

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
    highlightsLogo.style.minWidth = '18px';
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
    highlightsText.style.flexWrap = 'wrap';
    highlightsText.style.marginTop = '5px';

    for (i = 0; i < product.highlights.length; i++) {
        var highlightsUnderText = document.createElement('div');
        highlightsUnderText.innerHTML = product.highlights[i];
        highlightsUnderText.classList.add('synonym-tag');
        highlightsText.appendChild(highlightsUnderText);
    }

    var concerns = document.createElement('div');
    concerns.style.display = 'flex';
    concerns.style.fontSize = '14px';
    concerns.style.marginTop = '5px';
    concerns.style.marginBottom = '5px';
    var concernsLogo = document.createElement('div');
    var concernsText = document.createElement('div');
    concernsLogo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 286.054 286.054" style="enable-background:new 0 0 286 286;" xml:space="preserve"><g><path d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027 c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209 S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972 c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723 c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843 C160.878,195.732,152.878,187.723,143.036,187.723z"></path></g></svg>';
    concernsLogo.style.minWidth = '18px';
    concernsLogo.style.marginRight = '10px';

    if (product.concerns.length > 0)
        concernsLogo.style.fill = 'rgb(255, 161, 0)';
    else
        concernsLogo.style.fill = 'lightgray';

    concerns.appendChild(concernsLogo);

    var concernsTitle = document.createElement('div');
    concernsTitle.style.fontWeight = 'bold';
    concernsTitle.style.color = "#545454";
    concernsTitle.style.marginBottom = '3px';
    concernsTitle.innerText = 'Bra att veta (' + product.concerns.length + ' st)';

    var concersUnderText = document.createElement('div');
    for (i = 0; i < product.concerns.length; i++) {
        var fullText = product.concerns[i].split('|');
        concersUnderText.innerHTML = concersUnderText.innerHTML + fullText[0] + ': <i style="font-weight:bold; color: #545454;">' + fullText[2] + '<i>' + '<br><i style="font-weight: normal;color: rgba(0,0,0,0.6);">' + fullText[1] + '</i><br>';
    }

    concernsText.appendChild(concernsTitle);
    concernsText.appendChild(concersUnderText);
    concerns.appendChild(concernsLogo);
    concerns.appendChild(concernsText);

    card.appendChild(skinfunctions);
    card.appendChild(concerns);

    var highlights = document.createElement('div');
    highlights.style.display = 'flex';
    highlights.style.fontSize = '14px';
    var highlightsTitle = document.createElement('div');
    highlightsTitle.style.fontWeight = 'bold';
    highlightsTitle.style.color = "#545454";
    highlightsTitle.style.marginBottom = '3px';
    highlightsTitle.innerText = 'Övrigt';

    highlights.style.display = 'flex';
    highlights.style.marginTop = '5px';
    highlights.style.marginBottom = '5px';
    var highlightsLogo = document.createElement('div');
    highlightsLogo.innerHTML = '<?xml version="1.0" ?><svg style="enable-background:new 0 0 32 32;" version="1.1" viewBox="7.5 7.5 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"></style><g><g transform="translate(28.000000, 278.000000)"><path d="M4-222.1c-13.2,0-23.9-10.7-23.9-23.9c0-13.2,10.7-23.9,23.9-23.9s23.9,10.7,23.9,23.9 C27.9-232.8,17.2-222.1,4-222.1L4-222.1z M4-267.3c-11.7,0-21.3,9.6-21.3,21.3s9.6,21.3,21.3,21.3s21.3-9.6,21.3-21.3 S15.7-267.3,4-267.3L4-267.3z"/><polygon points="-8.7,-247.4 16.7,-247.4 16.7,-244.6 -8.7,-244.6"/><polygon points="2.6,-258.7 5.4,-258.7 5.4,-233.3 2.6,-233.3"/></g></g></svg>';
    highlightsLogo.style.minWidth = '18px';
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
    ingredientlist.classList.add('gray-title');

    var ingrediensText = document.createElement('div');
    ingrediensText.innerText = 'Ingredienslista';
    var ingrediensCombine = document.createElement('div');
    ingrediensCombine.style.display = 'flex';
    var ingrediensOrigin = document.createElement('div');
    ingrediensOrigin.innerText = 'Från';
    ingrediensOrigin.style.marginRight = '40px';
    var ingrediensConcentration = document.createElement('div');
    ingrediensConcentration.innerText = 'Halt';

    ingredientlist.appendChild(ingrediensText);
    ingrediensCombine.appendChild(ingrediensOrigin);
    ingrediensCombine.appendChild(ingrediensConcentration);
    ingredientlist.appendChild(ingrediensCombine);

    card.appendChild(ingredientlist);

    var inci = document.createElement('div');
    inci.id = 'inci';
    card.appendChild(inci);

    var shops = document.createElement('div');
    shops.classList.add('gray-title');

    var shops1 = document.createElement('div');
    shops1.innerText = 'Butiker';
    var shops2 = document.createElement('div');
    shops2.innerText = 'Pris';
    var shops3 = document.createElement('div');

    shops.appendChild(shops1);
    shops.appendChild(shops3);
    card.appendChild(shops);

    for (i = 0; i < product.affiliatelinks.length; i++) {
        var shop = product.affiliatelinks[i].shop;
        var price = product.affiliatelinks[i].price;
        var productUrl = product.affiliatelinks[i].url;

        var shopDiv = document.createElement('div');
        shopDiv.style.display = 'flex';
        shopDiv.style.justifyContent = 'space-around';
        var shopImg = document.createElement('img');
        shopImg.style.height = '50px';
        shopImg.style.margin = 'auto';
        shopImg.style.marginLeft = 'inherit';

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
        shopButton.target = '_blank';
        shopButton.classList.add('shop-button');

        shopImg.style.width = '33%';
        shopPrice.style.width = '33%';
        shopPrice.style.textAlign = 'center';
        shopButton.style.width = '33%';

        shopImg.style.width = '150px';
        shopPrice.style.maxWidth = '150px';
        shopButton.style.width = '150px';

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
        if (content.style.maxHeight == 'fit-content') {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = 'fit-content';
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
    skinfoinfo.innerHTML = 'Information om enskilda ingredienser är baserad på en eller flera utav nedanstående källor: <br> <br> European Commission database for information on cosmetic substances and ingredients - Cosing <br> Scientific Committee on Consumer Safety - SCCS <br> European Chemicals Agency - ECHA <br> National Center for Biotechnology Information - NCBI <br> Personal Care Products Council - PCPC  <br> Organisation for Economic Co-operation and Development - OECD <br>'
    skinfoinfo.style.marginBottom = '10px';
    skinfoinfo.style.fontSize = '14px';
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


    var skinfosourcelogos = document.createElement('div');
    skinfosourcelogos.innerHTML = '<div><div class="source-div"><img class="source" src="infos_logo/1200px-ECHA_Logo.svg.png"><img class="source" src="infos_logo/Chemsec.png"><img class="source" src="infos_logo/European_Commission.png"><img class="source" src="infos_logo/oecd.png"><img class="source" src="infos_logo/ncbi.png"><img class="source" src="infos_logo/PersonalCareProductsCouncilLogo.png"></div></div>';

    sourcesData.appendChild(skinfoinfo);
    sourcesData.appendChild(skinfosourcelogos);
    card.appendChild(sources);
    card.appendChild(sourcesData);

    document.getElementById('product').appendChild(card);
    $('#inci').html(product.widget);

    document.getElementById('si-ingredient-expand').onclick = function (e) {
        logAmplitude('expand_inci', product);
    }
}


function getParameterByName(name, url = window.location.href) {
    if (url.includes('C:') || url.includes('file'))
        return '7b38f4a6-508d-45d3-9548-33002b12ccbd';
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$.ajax({
    url: url + 'cookie/shop/',
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
    card.onclick = productClicked;

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
    productTextDiv.appendChild(brand);

    var name = document.createElement('div');
    name.innerText = product.name;
    name.classList.add('product-name');
    productTextDiv.appendChild(name);

    var price = document.createElement('div');
    price.innerText = product.price;
    price.classList.add('product-price');

    card.appendChild(productTextDiv);
    card.appendChild(price);

    var skinfoData = document.createElement('div');
    skinfoData.classList.add('skinfodata');
    var skinfoLogo = document.createElement('img');
    skinfoLogo.src = 'svg/skinfo-logo-color-black.svg';
    skinfoLogo.classList.add('skinfodata-logo');

    var skinfunctionsMainDiv = document.createElement('div');
    skinfunctionsMainDiv.classList.add('skinfunctions-main-div');
    var skinfunctionsDiv = document.createElement('div');
    skinfunctionsDiv.classList.add('skinfoDataElement');
    var skinfunctions = document.createElement('div');
    skinfunctions.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-5 -5 360 360" xml:space="preserve"><g style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)" ><path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 68.371 32.98 l -26.521 30 c -0.854 0.967 -2.083 1.52 -3.372 1.52 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 C 69.843 28.275 70.018 31.119 68.371 32.98 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>';
    skinfunctions.style.width = '18px';
    skinfunctions.style.height = '18px';
    skinfunctions.style.backgroundColor = 'white';
    skinfunctions.style.borderRadius = '1rem';
    skinfunctions.style.margin = 'auto';

    if (product.skinfunctions.length > 0)
        skinfunctions.style.fill = '#31cf8d';
    else
        skinfunctions.style.fill = 'lightgray';

    skinfunctionsDiv.appendChild(skinfunctions);
    var skinfunctionsNumber = document.createElement('div');
    skinfunctionsNumber.innerText = product.skinfunctions.length + ' st';
    skinfunctionsNumber.classList.add('skinfoDataNumber');
    skinfunctionsDiv.appendChild(skinfunctionsNumber);

    var concernsDiv = document.createElement('div');
    concernsDiv.classList.add('skinfoDataElement');
    var concerns = document.createElement('div');
    concerns.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 286.054 286.054" style="enable-background:new 0 0 286 286;" xml:space="preserve"><g><path d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027 c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209 S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972 c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723 c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843 C160.878,195.732,152.878,187.723,143.036,187.723z"></path></g></svg>';
    concerns.style.width = '18px';
    concerns.style.height = '18px';
    concerns.style.backgroundColor = 'white';
    concerns.style.borderRadius = '1rem';
    concerns.style.margin = 'auto';

    if (product.concerns.length > 0)
        concerns.style.fill = '#FFA100';
    if (product.concerns.length == 0)
        concerns.style.fill = 'lightgray';

    var concernsNumber = document.createElement('div');
    concernsNumber.innerText = product.concerns.length + ' st';
    concernsNumber.classList.add('skinfoDataNumber');

    concernsDiv.appendChild(concerns);
    concernsDiv.appendChild(concernsNumber);
    skinfoData.appendChild(skinfoLogo);
    skinfunctionsMainDiv.appendChild(skinfunctionsDiv);
    skinfunctionsMainDiv.appendChild(concernsDiv);
    skinfoData.appendChild(skinfunctionsMainDiv);
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

function appendSessionStorage(data) {
    var tags = document.getElementsByClassName('search-tag');
    var innerTags = [];
    for (i = 0; i < tags.length; i++) {
        innerTags.push(tags[i].innerHTML);
    }

    window.sessionStorage.setItem('tags', JSON.stringify(innerTags));

    var productJSON = sessionStorage.getItem('products');
    var products = JSON.parse(productJSON);

    for (i = 0; i < data.length; i++)
        products.push(data[i]);

    window.sessionStorage.setItem('products', JSON.stringify(products));
}

function removeTag(e) {
    e.parentElement.parentElement.remove();
    ifTagsHidePlaceholder();
    if (document.getElementById('product')) {
        document.getElementById('product').style.display = 'block';
        document.getElementById('numberOfProducts').innerHTML = '';
        document.getElementById('allproducts').innerHTML = '';
    }
    else
        browse(1);
}

function getAllTagsAsBrowseTags() {
    return {
        brands: Array.from(document.getElementsByClassName('search-tags-brand')).map(m => m.innerText),
        ingredients: Array.from(document.getElementsByClassName('search-tags-ingredient')).map(m => m.innerText),
        productNames: Array.from(document.getElementsByClassName('search-tags-name')).map(m => m.innerText),
    };
}

function updateTags(value, tagType) {
    var tagElement = document.createElement('span');
    tagElement.classList.add('search-tag');
    switch (tagType) {
        case "searchbar-brand":
            tagElement.innerHTML = '<span class="search-tags search-tags-brand" style="display: flex; width:max-content; min-width: max-content">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
        case "searchbar-product":
            if (value.productName)
                tagElement.innerHTML = '<span class="search-tags search-tags-name" style="display: flex; width:max-content; min-width: max-content">' + stripHtml(value.productName) + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            else
                tagElement.innerHTML = '<span class="search-tags search-tags-name" style="display: flex; width:max-content; min-width: max-content">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
        case "searchbar-ingredient":
            tagElement.innerHTML = '<span class="search-tags search-tags-ingredient" style="display: flex; width:max-content; min-width: max-content">' + value + '<span class="search-tag-delete" onclick="removeTag(this)" title="Remove tag"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></span></span>';
            break;
    }

    document.getElementsByClassName('search-tags-maindiv')[0].appendChild(tagElement);
    ifTagsHidePlaceholder();
}

function convertLatestTagToText() {
    var tags = document.getElementsByClassName('search-tag');
    if (tags.length == 0)
        return;

    tags[tags.length - 1].remove();

    ifTagsHidePlaceholder();
}

function getShopData(searchValue, tagType) {
    updateTags(searchValue, tagType);
    browse(1);
}


$(document).ready(function () {
    document.addEventListener("click", function (e) {
        if (e.target.href) {
            if (e.target.classList.contains('buy-upper'))
                logAmplitude('buy_click', 'first');
            else
                logAmplitude('buy_click', 'second');
        }
    });

    var productJSON = sessionStorage.getItem('products');
    if (!window.location.href.includes('product') && (productJSON == null || productJSON.length == 0)) {
        browse(1);
    }

    var modal = document.getElementById('feedbackModal');
    if (document.getElementById('feedback')) {
        document.getElementById('feedback').onclick = function () {
            modal.style.display = 'block';
        }
    }

    if (document.getElementById('feedbackSend')) {
        document.getElementById('feedbackSend').onclick = function () {
            var value = document.getElementById('feedbackValue').value;

            $.ajax({
                type: 'POST',
                url: 'https://api.skinfo.se/information/feedback?feedback=' + value,
                contentType: "application/json; charset=utf-8",
                headers: { 'apikey': '6h[-yENBfB' },
                error: function () {
                },
                success: function () {
                }
            });

            var modalContent = document.getElementsByClassName('modal-content')[0];
            modalContent.style.textAlign = 'center';
            modalContent.innerHTML = 'Tack!';
            document.getElementById('feedback').style.display = 'none';
            setTimeout(function () { modal.style.display = "none"; }, 1500);

        }
    }

    var clicks = document.getElementsByClassName('skinfo-info-click');
    for (i = 0; i < clicks.length; i++) {
        clicks[i].onclick = function () {
            var content = document.getElementById('skinfo-info');
            if (content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            if (this.style.transform == 'rotate(180deg)')
                document.getElementsByClassName('skinfo-info-click')[1].style.display = 'block';
            else
                this.style.display = 'none';
        }
    }

    if (document.getElementsByClassName("close")[0]) {
        document.getElementsByClassName("close")[0].onclick = function () {
            modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (modal && event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('sort').onchange = function (e) {
        document.getElementById('allproducts').innerHTML = '';
        browse(1);
    }

    var sliders = document.getElementsByClassName('si-slider-main');
    for (i = 0; i < sliders.length; i++) {
        sliders[i].onclick = function (e) {
            document.getElementById('allproducts').innerHTML = '';
            if (this.firstElementChild.firstElementChild.classList.contains('si-slider-notchecked')) {
                this.firstElementChild.firstElementChild.classList.remove('si-slider-notchecked');
                this.style.backgroundColor = null;
                this.nextElementSibling.innerText = 'På';
                browse(1);
            }
            else {
                this.firstElementChild.firstElementChild.classList.add('si-slider-notchecked');
                this.style.backgroundColor = 'transparent';
                this.nextElementSibling.innerText = 'Av';
                browse(1);
            }
        }
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
                    getShopData(parent.children[childCounter].innerText, parent.children[childCounter].classList[parent.children[childCounter].classList.length - 1]);
                } else {
                    getShopData(result.innerText, result.classList[result.classList.length - 2]);
                }
                document.getElementById('searchbox').value = '';
                document.getElementById('searchbox').focus();
            }
            parent.innerHTML = '';
            parent.style.display = 'none';
            ifTagsHidePlaceholder();
        }
        else if (key == 'ArrowDown') {
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter < parent.childNodes.length - 1) {
                selectCounter++;
                if (selectCounter == 0)
                    selectCounter++;
                if (parent.childNodes[selectCounter].classList.contains('searchbar-title'))
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
                if (parent.childNodes[selectCounter].classList.contains('searchbar-title'))
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
            if (!document.getElementById('product'))
                browse(1);

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
                                getShopData(element, 'searchbar-brand');
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
                                getShopData(element, 'searchbar-product');
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
                                getShopData(element, 'searchbar-ingredient');
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
                        parent.style.display = 'none';
                    }
                }
            });
        }
    });


    var productClickedJSON = sessionStorage.getItem('product_clicked');
    var productClicked = JSON.parse(productClickedJSON);
    if (productClicked == 1) {
        sessionStorage.removeItem('product_clicked');
    } else {
        loadSessionStorage();
        var oldScrollValue = sessionStorage.getItem('skinfo-scroll');
        if (oldScrollValue !== null) {
            var value = parseInt(oldScrollValue, 10);
            value = (value * -1) + 50;
            window.scrollTo(0, value);
            sessionStorage.removeItem('skinfo-scroll');
        }
        sessionStorage.removeItem('product_clicked');
    }

    var productId = getParameterByName('id');
    if (productId && window.location.href.includes('product')) {
        $.ajax({
            url: url + 'shopproduct/?id=' + productId,
            type: 'GET',
            headers: { 'apikey': 'EChu_A6S2vd' },
            success: function (product) {
                createProductPage(product);
                logAmplitude('show_product', product);
            },
            error: function () {
            }
        });
    }

    window.addEventListener("beforeunload", () => {
        if (!document.getElementById('product'))
            window.sessionStorage.setItem('skinfo-scroll', document.body.getBoundingClientRect().top.toString());
    });

    $(window).scroll(function () {
        if (document.getElementById('product') && document.getElementById('product').innerHTML !== '')
            return;

        var pageNumberJSON = sessionStorage.getItem('pageNumber');
        var pageNumber = JSON.parse(pageNumberJSON)
        if (pageNumber == null)
            pageNumber = 1;

        if ($(window).scrollTop() + $(window).height() > $(document).height() - $(window).height()) {
            if (getNewPage || (maxPageNumber !== -1 && maxPageNumber < pageNumber))
                return;

            getNewPage = true;
            pageNumber++;
            browse(pageNumber);
        }
    });

    if (document.getElementById('allproducts')) {
        if (document.getElementById('product'))
            return;

        if (document.getElementById('allproducts').innerHTML !== '') {
            browse(1);
        }
    }
})