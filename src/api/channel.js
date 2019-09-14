// 提供  频道相关的接口调用的函数
import request from '@/utils/request'

/**
 * 获取我的频道信息（如果没登录，获取的是后台设置的默认频道列表）
 */
export const getMyChannels = () => {
  return request('/app/v1_0/user/channels', 'get')
}
