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
 * 不感兴趣
 * @param {Object,Number} articleId - 文章ID
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
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
