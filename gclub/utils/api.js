// const API_PATH = 'https://gclub.lizmom.cn'; 

const API_PATH = 'https://gclub.lizmom.cn:18080'
const api = {
  APP_ID: 'wxf6153567687b6c60', //APPID 栗子小助手
  getUnionid: API_PATH+'/wechat/app/user_info',
  topicList: API_PATH+'/topic/posts', //话题论点列表
  likes: API_PATH+'/topic/like',//点赞/取消点赞
  topicGroup: API_PATH+'/topics',//群内话题概要
  topicDetail: API_PATH+'/topic/post/detail',//单个论点详情
  view: API_PATH+'/topic/view',//记录浏览量
  comment: API_PATH+"/topic/comment"
}
module.exports = api;