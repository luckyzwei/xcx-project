import {fetch} from "./wxRequest";
const API = require('./config');
/**
 * 获取token
 * @param params
 */
const getToken = (params) => fetch(params, API.BASE_URLs + '/uaa/oauth/token?grant_type=password&password=&username=unionid_' + params.unionId + "_type_12");
/**          
 * 刷新token
 * @param params
 */
const refreshToken = (params) => fetch(params, API.BASE_URLs + '/uaa/oauth/token?grant_type=refresh_token&refresh_token=' + params.refresh_token);

module.exports={
    getToken:getToken,
    refreshToken:refreshToken,
};