import {fetch} from './wxRequest';
import {uploadFile} from './uploadFile';
import {getAccessToken} from './AuthProvider';

const API = require('./config');

/**
 * 获取unionid
 * @param params
 */
const getUnionId = (params) => fetch(params, API.BASE_URLs + '/article-api/noauth/wdwd/loadUserAuthorizeWechat');
/**
 * 上传文件
 * @param params
 */
const upload = (params) => {
  return getAccessToken().then(token=>{
    params.token = {type:'Bearer',value:token};
    return uploadFile(params, API.BASE_URLs + '/gridfs-api/noauth/s3-media');
})};
/**
 * 获取文章详情
 */
const getArticleInfo = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };

    let url = API.BASE_URLs + "/article-api/authsec/article/info/v2"
    if (params.id.length != 0) url = url + '?id=' + params.id
    return fetch(params, url);
  })
};

/**
 * 新版获取文章详情
 */
const getArticleInfoNew = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    let url = API.BASE_URLs + "/article-api/authsec/article/info/v2"
    if (params.id.length != 0) url = url + '?id=' + params.id
    return fetch(params, url);
  })
};
/**
 * 获取一级评论
 */
const getSuperComments = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    let url = API.BASE_URLs + "/article-api/authsec/comment/getAllPrimaryComments?articleId=" + params.articleId + "&_page=" + params.currentPage + "&_size=" + params.pageSize
    return fetch(params, url);
  })
};
/**
 * 获取二级评论
 */
const getChildComments = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    let url = API.BASE_URLs + "/article-api/authsec/comment/getChildCommentsByParentId?parentId=" + params.parentId
    return fetch(params, url);
  })
};
/**
 * 添加投票
 */
const addVote = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/vote/add"
    return fetch(params, url);
  })
};
/**
 * 点赞
 */
const addThumbUp = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/thumbup/addThumbup"
    return fetch(params, url);
  })
}
/**
 * 新增评论
 */
const addComment = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/comment/addComment"
    return fetch(params, url);
  })
}

/**
 * 获取文章列表
 */
const getArticleList = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/article/list?_page=" + params.page;
    if(params.size){
      url = url + "&_size=" + params.size
    }
    return fetch(params, url);
  })
};
/**
 * 热门搜索
 */
const getHotArticle = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    let url = API.BASE_URLs + "/article-api/authsec/article/getHotArticle";
    return fetch(params, url);
  })
};
/**
 * 列表分类类型
 */
const getArticleTypeList = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    let url = API.BASE_URLs + "/article-api/authsec/article/articleTypeList";
    return fetch(params, url);
  })
};
/**
 * 新增文章
 */
const addArticle = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/article/ugc/add";
    return fetch(params, url);
  })
};
/**
 * 我的帖子
 */
const getMyArticle = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    let url = API.BASE_URLs + "/article-api/authsec/article/myArticle?_page=" + params.page + "&_size=" + params.size;
    return fetch(params, url);
  })
};
/**
 * 我的评论
 */
const getMyComment = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    let url = API.BASE_URLs + "/article-api/authsec/comment/myComments?_page=" + params.page + "&_size=" + params.size;
    return fetch(params, url);
  })
};
/**
 * 我的足迹
 */
const getMyRecord = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    let url = API.BASE_URLs + "/article-api/authsec/article/myBrowseRecord?_page=" + params.page + "&_size=" + params.size;
    return fetch(params, url);
  })
};



/**
 * 消息提醒评论
 */
const getCommentRemind = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    let url = API.BASE_URLs + "/article-api/authsec/comment/Remind?_page=" + params.page + "&_size=" + params.size;
    return fetch(params, url);
  })
};


/**
 * 消息提醒点赞
 */
const getThumbRemind = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    let url = API.BASE_URLs + "/article-api/authsec/comment/thumbupMessageRemind?_page=" + params.page + "&_size=" + params.size;
    return fetch(params, url);
  })
};

/**
 * 投诉
 */
const addComplain = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/complain/add";
    return fetch(params, url);
  })
};

/**
 * 删除文章
 */
const deleteArticle = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "PUT";
    let url = API.BASE_URLs + "/article-api/authsec/article/deleteArticle";
    return fetch(params, url);
  })
};


/**
 * 合并图片
 */
const mergePictures = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token };
    params.method = "POST";
    let url = API.BASE_URLs + "/article-api/authsec/article/mergeImage";   
    return fetch(params, url);
  })
};

/**
 * 获取二维码
 */
const getQRcode = (params) => {
  return getAccessToken().then(token => {
    params.token = { type: 'Bearer', value: token }
    // let url = API.BASE_URLs + "/article-api/authsec/program/qrcode?page=" + 'pages/shareMoments/shareMoments' + "&scene=" + params.scene + '&appId=' + 'wx94e11293c31dcd93';
    let url = API.BASE_URLs + "/article-api/authsec/program/qrcode?page=" + 'pages/shareMoments/shareMoments' + "&scene=" + params.scene + '&appId=' + 'wx138cc46bd172c9de';

    
    return fetch(params, url);
  })
};

module.exports={
    getUnionId:getUnionId,
    uploadFile:upload,
    getArticleInfo:getArticleInfo,
    getSuperComments:getSuperComments,
    getChildComments:getChildComments,
    addVote:addVote,
    addThumbUp:addThumbUp,
    addComment:addComment,
    getArticleList: getArticleList,
    getHotArticle: getHotArticle,
    getArticleTypeList: getArticleTypeList,
    addArticle: addArticle,
    getMyArticle: getMyArticle,
    getMyComment: getMyComment,
    getMyRecord: getMyRecord,
  getThumbRemind: getThumbRemind,
  getCommentRemind: getCommentRemind,
  addComplain: addComplain,
  deleteArticle: deleteArticle,
  mergePictures: mergePictures,
  getQRcode: getQRcode,
  getArticleInfoNew: getArticleInfoNew
};