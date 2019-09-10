// 基于配置好的axios 提供一个调用接口函数
import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store'

// 创建一个新的axios实例  进行配置
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [data => {
    // 修改格式
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截 （加token）
instance.interceptors.request.use(config => {
  // 修改配置
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截 ( 成功：剔除无用数据  失败：刷新token )
instance.interceptors.response.use(res => {
  // res = {data:{data:'数据',message:'信息'}}
  // 当没有响应内容  res.data.data 报错
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, err => {
  // TODO 处理token失效
  return Promise.reject(err)
})

// 导出的是 一个函数  调用接口
