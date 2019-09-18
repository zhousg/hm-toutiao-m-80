// 提供  频道相关的接口调用的函数
import request from '@/utils/request'
import store from '@/store'
// 约定 KEY
const CHANNEL_KEY = 'hm-toutiao-m-80-channels'
// 约定 VALUE  ----> [{id:'频道ID',name:'频道名称'},...]

/**
 * 获取我的频道信息（如果没登录，获取的是后台设置的默认频道列表）
 */
// 1. 负责获取我的频道
// 2. 登录  获取的我的频道数据
// 3. 未登录
// 3.1 未登录 且  已存储  业务：获取本地存储数据
// 3.2 未登录 且  未存储  业务：获取默认数据，且进行本地存储。
// 4. 约定（不管任何情况，返回值是一个promise对象，获取我的频道（数据格式一致和后台返回的））
export const getMyChannels = () => {
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      // 登录
      const data = await request('/app/v1_0/user/channels', 'get')
      resolve(data)
    } else {
      // 未登录
      const channelsStr = window.localStorage.getItem(CHANNEL_KEY)
      if (channelsStr) {
        // 已存储
        const channelsJson = JSON.parse(channelsStr)
        resolve({ channels: channelsJson })
      } else {
        // 未存储
        const data = await request('/app/v1_0/user/channels', 'get')
        // 存储
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels))
        resolve(data)
      }
    }
  })
}

/**
 * 删除频道（支持 未登录 与 已登录）
 * @param {Integer} channelId - 频道ID
 */
export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      if (user.token) {
      // 登录
        await request(`/app/v1_0/user/channels/${channelId}`, 'DELETE')
        // 成功
        resolve()
      } else {
      // 未登录
      // 1. 获取本地的频道  数组
        const localChannels = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
        // 2. 根据ID获取索引
        const index = localChannels.findIndex(item => item.id === channelId)
        // 3. 使用splice进行删除
        localChannels.splice(index, 1)
        // 4. 更新本地存储
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        // 5. 调用成功
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 添加频道
 * @param {Array} orderChannels - 排序好的频道数据 [{id:'频道ID',seq:1,name:'频道名称'},...]
 */
export const addChannel = (orderChannels) => {
  // 实现添加频道  登录状态（调用接口）  未登录状态（使用本地存储）
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      if (user.token) {
        // 登录状态（调用接口）
        await request('/app/v1_0/user/channels', 'put', {
          // orderChannels 内包含name字段，没关系
          channels: orderChannels
        })
        // 处理成功
        resolve()
      } else {
        // 未登录状态（使用本地存储）
        // 1. 获取本地的频道
        const jsonStr = window.localStorage.getItem(CHANNEL_KEY)
        const localChannels = JSON.parse(jsonStr)
        // 2. 插入添加的频道
        const { id, name } = orderChannels[orderChannels.length - 1]
        localChannels.push({ id, name })
        // 3. 再次的存储在本地
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        // 4. 处理成功
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 获取全部频道
 */
export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
