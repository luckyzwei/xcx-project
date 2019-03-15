import {MessageCenter} from './MessageCenter';


import {getToken, refreshToken} from './token';

const API = require('./config');
const Promise = require('./es6-promise');

let message = new MessageCenter();
message.register('token');
let params = {
    method: 'POST',
    token: {
        type: 'Basic',
        value: API.SECRET
    }
}

function onLogin() {
    params.unionId = wx.getStorageSync('unionid');
    return getToken(params).then((res) => {
        saveTokens(res.access_token, res.refresh_token, res.expires_in);
        message.fire('token', res.access_token);
        return res.access_token
    }).catch((req) => {
        return 'error'
    })
}

function setWait() {
    wx.removeStorageSync('access_token');
}

function saveTokens(access_token, refresh_token, expires_in) {
    wx.setStorageSync('access_token', access_token);
    wx.setStorageSync('refresh_token', refresh_token);
    let exp = Date.now();
    let expires_ins = exp + expires_in * 1000 - 60000;
    wx.setStorageSync('expires_in', expires_ins);
}

function onRefreshToken() {
  setWait(); 
    params.refresh_token = wx.getStorageSync('refresh_token');
    return refreshToken(params).then((res) => {
        if (res.access_token) {
            saveTokens(res.access_token, res.refresh_token, res.expires_in);
            message.fire('token', res.access_token);
            return res.access_token;
        } else {
            return onLogin().then(res => {
                return res
            });
        }
    }).catch(req => {
        if (wx.getStorageSync('refresh_token') != null) {
            return onLogin().then(res => {
                return res
            });
        }
    })
}

function getAccessToken() {
  
    let date = Date.now();
    let expires_in = wx.getStorageSync('expires_in');

  console.log('有效期：' + expires_in + '    当前时间：' + date + '    token：' + wx.getStorageSync('access_token') + '   unionid：' + wx.getStorageSync('unionid'))
    if ((!expires_in || date >= expires_in) && wx.getStorageSync('access_token')) {
      console.log('刷新token')
        return onRefreshToken()
    } else if ((!expires_in || date >= expires_in) && !wx.getStorageSync('access_token')) {
      console.log('获取token')
        return new Promise((resolve, reject) => {
            message.subscribe("token", (event) => {
                resolve(event.args)
            });
        })
    } else {
      console.log('storage取token')
        return new Promise((resolve, reject) => {
            resolve(wx.getStorageSync('access_token'))
        })
    }

}

module.exports = {
    onLogin: onLogin,
    getAccessToken: getAccessToken
}