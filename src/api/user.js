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
