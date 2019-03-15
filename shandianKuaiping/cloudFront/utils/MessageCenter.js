function MessageCenter() {
    let message = {};
    this.register = function (messageType) {
        if (typeof message[messageType] == 'undefined') {
            message[messageType] = [];
        } else {
            console.log("消息已被注册");
        }
    }
    this.subscribe = function (messageType, func) {
        if (typeof message[messageType] != 'undefined') {
            message[messageType].push(func);
        } else {
            console.log("消息未注册，不能进行订阅");
        }
    }
    this.fire = function (messageType, args) {
        if (typeof message[messageType] == 'undefined') {
            console.log("消息未注册，不能进行订阅");
            return false;
        }
        let events = {
            type: messageType,
            args: args || {}
        }

        message[messageType].forEach(function (item) {
            item(events);
        })
    }
}
module.exports={
    MessageCenter:MessageCenter
}