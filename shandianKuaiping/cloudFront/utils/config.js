
// const apiMall = "http://dev.gemii.cc:58080";

//  const apiMall = "http://test.gemii.cc:58080";
const apiMall = "https://kuaiping.gemii.cc";

const apiMalls = apiMall + '/lizcloud/api';

const api = {
  SECRET: "bGl6LWFydGljbGUtd3g6c2VjcmV0", //base64加密liz-shop-owner:secret
    // APP_ID: 'wx94e11293c31dcd93', //APPID,
    APP_ID: 'wx138cc46bd172c9de', //APPID,
    BASE_URL:apiMall,
    BASE_URLs:apiMalls,
}
module.exports = api;
