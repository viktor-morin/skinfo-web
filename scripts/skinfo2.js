function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
    async function runMainHeaderAnimation() {
        var text = 'Vi samlar datan';
        
        var mainTitle =  document.getElementById('information-header-main');
        for (i = 0; i< text.length; i++) {
            mainTitle.innerHTML += text[i];
            await sleep(60);
        }
        var subTitle = document.getElementById('skinfofade');
        subTitle.classList.add('fade');
        for (i = 0; i< 7; i++) {
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

    $("#company").click(function () {
        window.location.href = 'app.html';
        return false;
    });

    runMainHeaderAnimation();
});