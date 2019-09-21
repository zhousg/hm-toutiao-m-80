// 用户 相关的API调用
import request from '@/utils/request'

/**
 * 登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 */
export const login = ({ mobile, code }) => {
  // 调用request函数 得到一个promise的对象
  return request('/app/v1_0/authorizations', 'post', {
    mobile,
    code
  })
}

/**
 * 添加关注
 * @param {Integer} userId
 */
export const followings = (userId) => {
  return request('/app/v1_0/user/followings', 'post', {
    target: userId
  })
}

/**
 * 取消关注
 * @param {Integer} userId
 */
export const unfollowings = (userId) => {
  return request('/app/v1_0/user/followings/' + userId, 'delete')
}

/**
 * 获取首页用户信息
 */
export const getUserInfo = () => {
  return request('/app/v1_0/user', 'get')
}

/**
 * 获取编辑资料用户信息
 */
export const getUserProfile = () => {
  return request('/app/v1_0/user/profile', 'get')
}

/**
 * 上传头像
 * @param {Object} formData - 文件对象
 */
export const updatePhoto = (formData) => {
  return request('/app/v1_0/user/photo', 'PATCH', formData)
}

/**
 * 修改用户信息
 * @param {Object} user - 用户的信息  { name, gender, birthday }
 */
export const updateUserInfo = ({ name, gender, birthday }) => {
  return request('/app/v1_0/user/profile', 'PATCH', { name, gender, birthday })
}
