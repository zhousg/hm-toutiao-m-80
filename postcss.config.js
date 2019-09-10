module.exports = {
  plugins: {
    autoprefixer: {},
    // 作用仅仅用于px转换成rem单位配置
    // rootValue 目前37.5  意思：如果 100px ----> 100/37.5rem
    // 同时依赖js插件  flexible  它作用设置html的font-size的大小
    // 正好flexible插件设置 rem基准值的规则： 屏幕宽度十分之一
    // 基于iphone6做为标准设备  375px 现在基准值 37.5px

    // 以前基于iphone4做为标准设备  320px  基准值 32px  那么rootValue 32px

    // 标准设备不一样  设计稿也不一样
    // iphone6做为标准设备375px  设计稿尺寸750px

    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
