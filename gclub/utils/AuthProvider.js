import { fetch } from './wxRequest';//接口请求
const API = require('./api');
const Promise = require('./es6-promise');
//登录 获取token 
function onLogin() {
    let unionId   = wx.getStorageSync('union_id');
    return fetch(API.auth, null, { 'union_id': unionId }, 'POST').then(res => {
        saveTokens(res.access_token, res.expire_time);
        return res.access_token
    }).catch((req) => {
        return 'error'
    })
}

function getAccessToken() {
    let date = Date.now();
    let expires_in = wx.getStorageSync('expires_in');
    let access_token = wx.getStorageSync('access_token')
    // console.log('有效期：' + expires_in + '    当前时间：' + date + '    token：' + wx.getStorageSync('access_token') + '   unionid：' + wx.getStorageSync('union_id'))
    //判断是否存在
    if (!access_token || !expires_in || access_token == '' || expires_in==''){
        // console.log("111")
        return onLogin()
    }else{
        // console.log("222")
        if ((!expires_in || date >= expires_in) && access_token) {
            // console.log("333")
            return onRefreshToken();
        } else if (!access_token || access_token=='') {
            // console.log("444")
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(access_token)
                }, 2000)
            })
        }else{
            // console.log("555")
            return new Promise((resolve, reject) => {
                resolve(access_token)
            })
        }
    }
}
function onRefreshToken() {
    setWait();
    return onLogin()//重新登录
}

function setWait() {
    wx.removeStorageSync('access_token');
}

function saveTokens(access_token, expires_in) {
    wx.setStorageSync('access_token', access_token);
    let exp = Date.now();
    let expires_ins = exp + expires_in * 1000 - 60000;
    wx.setStorageSync('expires_in', expires_ins);
}

module.exports = {
    onLogin: onLogin,
    getAccessToken: getAccessToken,
    saveTokens: saveTokens
}