// vue-cli的配置对象
module.exports = {
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  }
}
