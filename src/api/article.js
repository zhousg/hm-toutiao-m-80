// 提供  调用文章相关的接口函数

import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId - 频道ID
 * @param {String} timestamp - 时间戳 相对于分页页码
 */
export const getArticles = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/**
 * 不喜欢
 * @param {Object,Number} articleId - 文章ID
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}

/**
 * 取消不喜欢
 * @param {Object,Number} articleId - 文章ID
 */
export const undisLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes/' + articleId, 'delete')
}

/**
 * 点赞
 * @param {Object,Number} articleId - 文章ID
 */
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: articleId
  })
}

/**
 * 取消点赞
 * @param {Object,Number} articleId - 文章ID
 */
export const unlikings = (articleId) => {
  return request('/app/v1_0/article/likings/' + articleId, 'delete')
}

/**
 * 举报文章
 * @param {Number,Object} articleId - 文章ID
 * @param {Integer} type - 举报类型
 */
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}

/**
 * 获取联想建议词条
 * @param {String} text - 搜索关键字
 */
export const suggest = (text) => {
  return request('/app/v1_0/suggestion', 'get', {
    q: text
  })
}

/**
 * 获取搜索结果
 * @param {Integer} param.page - 页码
 * @param {Integer} param.perPage - 每页几条
 * @param {String} param.q - 搜索关键字
 */
export const searchArticles = ({ page, perPage = 20, q }) => {
  return request('/app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}

/**
 * 获取文章详情
 * @param {Object,Number} articleId
 */
export const getArticleDetail = (articleId) => {
  return request('/app/v1_0/articles/' + articleId, 'get')
}

/**
 * 获取评论列表 或者 获取回复列表
 * @param source - 文章的ID  或者  评论ID
 * @param {String} type - a 获取评论列表  c 获取回复列表
 * @param {Integer} offset - ID偏移量   通俗：每一页数据最后数据的ID
 */
export const getComments = (source, type, offset) => {
  return request('/app/v1_0/comments', 'get', { source, type, offset })
}

/**
 * 添加评论或评论回复
 * @param target - 文章的ID  或者  评论ID
 * @param {*} content - 内容
 * @param {*} articleId - 文章的ID  回复的时候需要
 */
export const commentOrReply = (target, content, articleId) => {
  return request('/app/v1_0/comments', 'post', { target, content, art_id: articleId })
}
