const API = require('./api');
import { fetch } from './wxRequest';//接口请求
import { getAccessToken } from './AuthProvider';//获取 token 
//接口调用
// wxRequest(url, token, data, type) 
/**
 * 获取unionid 非鉴权
 * @param params
 */
const get_unionId = (params) => {
  return fetch(API.getUnionid, null, params, 'POST');
}
/**
 * 群内话题概要
 * @param params
 */
const get_topic_group = () => {
  return fetch(API.topicGroup, null, null, 'GET');
}
/**
 * 话题论点列表
 * @param params
 */
const get_topic_list = (params) => {
  return fetch(API.topicList, null, params, 'POST');
}
/**
 * 点赞/取消点赞
 * @param params
 */
const set_likes = (params) => {
  return fetch(API.likes , null, params, 'POST');
}
/**
 * 单个论点详情
 */
const topic_detail = (params) => {
  return fetch(API.topicDetail + `?post_id=${params.post_id}&union_id=${params.union_id}`, null, null, 'GET');
}
/**
 * 记录浏览量
 */
const save_view_num = (params) => {
  return fetch(API.view, null, params, 'POST');
}
/**
 * 发布
 */
const view_comment = (params) => {
  return fetch(API.comment, null, params, 'POST');
}

module.exports={
  get_unionId: get_unionId,
  get_topic_group: get_topic_group,
  get_topic_list: get_topic_list,
  set_likes: set_likes,
  topic_detail: topic_detail,
  save_view_num: save_view_num,
  view_comment: view_comment
}