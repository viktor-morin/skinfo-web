var url = 'https://api.skinfo.se/';
var selectCounter = -1;
$(document).ready(function () {

    // function logdata(eventtype, url, filter, platform, os_name, os_version, widget_version, type, show, widget_id, data) {
    //     var dict = new Object();
    //     dict['userId'] = getSkinfoId();
    //     dict['eventType'] = ;
    //     dict['url'] = url;

    //     dict['platform'] = platform;
    //     dict['osName'] = os_name;
    //     dict['osVersion'] = os_version;
    //     dict['widgetVersion'] = widget_version;

    //     var eventProperties = new Object();
    //     if (filter) {
    //         eventProperties['filter'] = filter;
    //     }
    //     if (type) {
    //         eventProperties['type'] = type;
    //     }
    //     if (show) {
    //         eventProperties['show'] = show;
    //     }
    //     if (widget_id) {
    //         eventProperties['widgetId'] = widget_id;
    //     }
    //     if (data) {
    //         eventProperties['data'] = data;
    //     }
    //     dict['eventProperties'] = eventProperties;

    //     skinfolog({
    //         eventtype: 'setting_removed',
    //         url: window.location.href,
    //         platform: navigator.platform,
    //         os_name: navigator.userAgent,
    //         os_version: navigator.appVersion,
    //         widget_version: '@Model.WidgetVersion.ToString()',
    //         widget_id: '@Model.Id',
    //         data: value,
    //     });

    //     var json = JSON.stringify(dict);
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('POST', url + 'log', true);
    //     xhttp.send(json);
    // }

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var id = getParameterByName('id');
    if (id != null) {
        $.ajax({
            type: 'GET',
            url: url + 'search/get?query=' + id,
            dataType: 'html',
            complete: function (result) {
                $('#data').html(result.responseText);
            }
        });
        $('#searchbox').val(id);
    }

    $('#searchbox').on('keydown', function (e) {
        const key = e.key;
        if (key == 'Enter') {
            var text = $('#searchbox').val();
            if (text.length == 0) {
                return;
            }

            if (text.includes(',')) {
                window.location.href = 'search?id=' + text;
            }
            else {
                
                var parent = document.getElementById('searchbar-suggestions');
                var result = parent.querySelector(".search-selected");
                if (result == null) {
                    window.location.href = 'search?id=' + parent.firstChild.innerText;
                } else {
                    window.location.href = 'search?id=' + result.innerText;
                }
                
            }
        }

        else if (key == 'ArrowDown') {
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter < parent.childNodes.length - 1) {
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
            var parent = document.getElementById('searchbar-suggestions');
            if (selectCounter > -1) {
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
        var parent = document.getElementById('searchbar-suggestions');
        var text = $('#searchbox').val();
        selectCounter = -1;

        if (text.length == 0) {
            parent.innerHTML = '';
            parent.style.display = 'none';
        }
        else if (text.includes(',')) {
            parent.innerHTML = '';
            parent.style.display = 'none';
        }
        else {
            $.ajax({
                type: 'GET',
                url: url + 'search/suggestion?query=' + text,
                contentType: "application/json; charset=utf-8",
                complete: function (result) {
                    if (result.responseJSON.length > 0) {
                        parent.style.display = 'inherit';
                        parent.innerHTML = '';
                        var text = $('#searchbox').val();
                        if (text.length == 0 || text.includes(',')) {
                            parent.innerHTML = '';
                            parent.style.display = 'none';
                            return;
                        }

                        result.responseJSON.forEach(element => {
                            var child = document.createElement('div');
                            child.innerText = element;
                            child.classList.add('searchbar-item');
                            child.onclick = function () {
                                window.location.href = 'search?id=' + element;
                            }
                            parent.appendChild(child);
                        });
                    } else {
                        parent.style.display = 'none';
                    }
                }
            });
        }
    });
})