const comments = [
    'Min blivande favortiapp!',
    'Älskar detta! Så spännande!',
    'Gud vilken bra idé!',
    'Äntligen en app för oss som älskar hudvård!',
    'Äntligen! Ladda ner direkt!',
    'Tack för världens bästa app!',
    'Tack! Blev så glad när jag hittade appen!',
    'Det här är verkligen vad svenska beautymarknaden behöver!',
    'Alltså tack tack tack! Älskar redan appen och har använt den i timmar ',
    'Tack vare er app fick jag reda på att några av mina produkter innehöll skadliga ämnen!',
    'Verkligen superbra initiativ!',
    'Länge önskat att något sånt här ska finnas i Sverige!',
];

function isPageHidden(){
    return document.hidden || document.msHidden || document.webkitHidden;
}

async function updateComments() {
    var index = 0;
    while (true) {
        if (!isPageHidden()) {
            $("#comment").fadeOut("slow", function () {
                $('#comment').html(comments[index]);
            });
    
            $("#comment").fadeIn("slow", function () { });
            await sleep(3000);
    
            index = index + 1;
            if (index == comments.length - 1) {
                index = 0;
            }
        } else {
            await sleep(1000);
        }
    }
}