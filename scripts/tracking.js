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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function showCookieQuestion() {
    var cookieelement = document.createElement('div');
    cookieelement.id = 'cookie-consent';
    cookieelement.innerHTML = '    <div style="position:fixed;z-index:200;top:0; left:0; background-color: black; opacity:0.2; width:100vw;height:100vh;"></div>    <div style="z-index:300;position: fixed; bottom: 0; left:0;background-color: white; width: 100vw;">        <div class="cookie-consent-container">            <div style="display: flex; flex-direction:column">                <div class="footer-header" style="text-align: left; margin-left: 0px;">We use cookies on Skinfo</div>                <div>We use cookies for personal content and advertisements as well as for analysis of our traffic. We share information about your use of the service with our partners in social media, advertising and traffic analysis. Our partners may combine this data with information that you have shared with them.</div>                <span style="margin-top:10px">Read more at our <a style="text-decoration: underline; margin-top: 5px;" href="/privacypolicy">Privacy Policy</a></span>            </div>            <div class="cookie-consent-buttons">                <button id="deny-cookie" class="main-button" style="min-width:110px;color:darkgray;background-color:lightgray; margin:0px 5px">Deny all</button>                <button id="allow-cookie" class="main-button" style="min-width:110px; color:white;background-color: #4d9669; margin:0px 5px">Accept</button>            </div>        </div>    </div>';
    document.body.appendChild(cookieelement);

    document.getElementById('deny-cookie').onclick = function () {
        setCookie('cookie-consent', false, 7);
        document.getElementById('cookie-consent').remove();
    }

    document.getElementById('allow-cookie').onclick = function () {
        setCookie('cookie-consent', true, 365);
        document.getElementById('cookie-consent').remove();
        checkCookieConcent();
    }
}

function checkCookieConcent() {
    var allowCookie = getCookie('cookie-consent');
    if (allowCookie == 'true') {
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://www.googletagmanager.com/gtag/js?id=UA-150835481-1';
        document.head.appendChild(scriptElement);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'UA-150835481-1');
    } else if (allowCookie == 'false') {
        //not doing anthing
    } else {
        setTimeout(function () {
            showCookieQuestion();
        }, 1000);

    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkCookieConcent();
});
