// 提供 一个插件（基于vue的插件）
// 包含：工具函数  过滤器  自定义指令
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

/**
 * 阻碍程序的运行，阻碍1秒即可。
 */
const $sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}

/**
 * 过滤器函数
 * @param {String} strDate - 就是过滤器 | 前的表达式的值
 */
const relTime = (strDate) => {
  // 转换的逻辑
  // moment 插件  dayjs 插件  都是处理时间格式
  // dayjs 轻量一些
  return dayjs().locale('zh-cn').from(strDate)
}

export default {
  install (Vue) {
    // 做基于vue的代码
    Vue.prototype.$sleep = $sleep
    Vue.filter('relTime', relTime)
  }
}
