// auth 认证  管理本地的 token认证信息
const AUTH_KEY = 'hm-toutiao-m-80-user'
// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(AUTH_KEY) || '{}')
}
// 设置用户信息 user 对象格式
export const setUser = (user) => {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}
// 删除用户信息
export const delUser = () => {
  window.localStorage.removeItem(AUTH_KEY)
}
