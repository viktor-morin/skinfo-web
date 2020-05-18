function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
    async function runMainHeaderAnimation() {
        var text = 'The ingredientlist';
        var extraFirst = 'invented';
        var extraEnd = 'reinvented';
        
        var mainTitle =  document.getElementById('information-header-main');
        for (i = 0; i < text.length; i++) {
            mainTitle.innerHTML += text[i];
            await sleep(40);
        }

        mainTitle =  document.getElementById('information-header-main2');
        for (i = 0; i < extraFirst.length; i++) {
            mainTitle.innerHTML += extraFirst[i];
            await sleep(40);
        }

        for (i = 0; i < 3; i++) {
            if (i%2 == 0) {
                mainTitle.innerHTML += '_'
            } else {
                mainTitle.innerHTML = mainTitle.innerHTML.substring(0, mainTitle.innerHTML.length - 1);
            } 
            await sleep(150);
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
            if (i%2 == 0) {
                mainTitle.innerHTML += '_'
            } else {
                mainTitle.innerHTML = mainTitle.innerHTML.substring(0, mainTitle.innerHTML.length - 1);
            } 
            await sleep(200);
        }
    }

    $("#download_big").click(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    $("#contact").click(function () {
        window.location.href = 'contact.html';
        return false;
    });

    $("#company").click(function () {
        window.location.href = 'company.html';
        return false;
    });

    $("#app").click(function () {
        window.location.href = 'app.html';
        return false;
    });

    runMainHeaderAnimation();
});