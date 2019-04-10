var containter = {
    //看门狗 机器人分配
    dogQroceInit: function () {
        this.getToken().then(res => {
            if (res.code === 1200) {
                this.getGogCode(res.access_token)
            }
        })
    },
    getGogCode(token) {
        var parmas = {
            url: API.distribution,
            token: token
        }
        ajax(parmas).then(res => {
            if (res.code === 1200) {
                var branch =
                    '<div class="qrcode-content">' +
                    '        <div class="qrcode-title">' +
                    '            <img class="head_url" src="' + res.data.head_url + '" alt="">' +
                    '            <div class="group-word">' +
                    '                <div class="name">' + res.data.name + '</div>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div class="qrcode-img">' +
                    '            <img class="qrcode" src="' + res.data.qrcode + '" alt="">' +
                    '        </div>' +
                    '        <div class="des-buttom">扫一扫上面的二维码图案，加我微信</div>' +
                    '    </div>'

                $(".dog").append(branch)
            } else { //机器人不足 1600
                window.location.href = API_PATH + '/error-page-one?type=' + res.code
            }
        })
    },
    //扫码添加群助手
    groupQroceInit: function () {
        this.getToken().then(res => {
            if (res.code === 1200) {
                this.getGroupCode(res.access_token)
            }
        })
    },
    getGroupCode(token) {
        var group_code = getQueryString('group_code')
        var parmas = {
            url: API.robot_qrcode + group_code + '/robot_qrcode',
            token: token
        }

        ajax(parmas).then(res => {
            if (res.code == 1200) {
                var branch =
                    '<div class="groupQrcode-content">' +
                    '            <div class="g-title">' +
                    '                <img class="img" src="./images/profile_group.png" alt="">' +
                    '                <span class="name">' + res.data.name + '</span>' +
                    '            </div>' +
                    '            <div class="g-qrcode">' +
                    '                <div class="g-qrcode-des">' +
                    '                    扫码添加群助手为好友后<br/>' +
                    '                    群助手会将您拉入群中\n' +
                    '                </div>' +
                    '                <img class="g-code" src="' + res.data.qrcode + '" alt="">' +
                    '            </div>' +
                    '        </div>'

                $(".group").append(branch)
            } else {
                window.location.href = API_PATH + '/error-page-two?type=' + res.code
            }

        })
    },

    getToken: function () {
        var unionId = getCookie('unionId_d')
        return $.ajax({
            url: API_PATH + '/auth',
            type: 'post',
            contentType: 'application/json',
            dataType: "json",
            async: false,
            data: JSON.stringify({"union_id": unionId}),
            success: function (res) {
                if (res.code === 1200) {
                    saveCookie('access_token_d', res.access_token)
                    return res.access_token
                }
            }
        })
    }

}





