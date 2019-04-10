
function ajax(parmas) {
    return $.ajax({
        url: parmas.url,
        type: 'GET',
        dataType: "json",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": 'Bearer' + ' ' + parmas.token
        },
        success: function (res) {
            return res
        }.bind(this)
    })
}

function getQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}

function saveCookie (name, data, time) {
    let exp = new Date();
    if(time){
        exp.setTime(exp.getTime() + 90 * 24 * 3600 * 1000)
    }else{
        exp.setTime(exp.getTime() + time)
    }
    document.cookie = name + "=" + escape(data) + ";expires=" + exp.toGMTString() + ';path=/';

}

function getCookie (name) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (name === aCrumb[0])
        return unescape(aCrumb[1])
    }
    return null;
}

function deleteCookie (name)  {
    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}
