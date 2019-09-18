<template>
  <van-action-sheet :value="value" @input="$emit('input',$event)" title="频道编辑" @closed="editing=false">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in channels" :key="item.id">
          <span @click="enterChannel(i)" class="f12" :class="{red:activeIndex===i}">{{item.name}}</span>
          <van-icon @click="delChannel(i,item.id)" v-show="editing" v-if="i!==0" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  props: {
    // 简单类型数据
    value: {
      type: Boolean,
      default: false
    },
    // 复杂数据类型
    channels: {
      type: Array,
      // 语法规范：通过一个函数的返回值来指定默认值
      default: () => []
    },
    // 激活频道索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    optionalChannels () {
      // 可选频道 = 全部频道 - 我的频道
      // 可选频道:遍历全部频道，拿着每一项去我的频道当中去对比，如果一样忽略，如果不一样，放到可选频道中。
      // Array.filter() 数组提供的遍历函数，当条件（回调函数的返回值）为真时候，把对应遍历的选项，放在新数组中。
      // this.channels.findIndex(myItem => myItem.id === item.id) 去我的频道中找是否有一样的ID
      // 如果找到了  findIndex()值  索引 0 1 2 3 4 ...
      // 如果没找呢  findIndex()值  -1
      return this.allChannels.filter(item => this.channels.findIndex(myItem => myItem.id === item.id) === -1)
    }
  },
  data () {
    return {
      // 正在编辑我的频道
      editing: false,
      // 全部频道
      allChannels: []
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 添加频道
    async addChannel ({ id, name }) {
      // 调用封装好的Api (支持两种方式)
      // 后端数据格式
      // 后端：对应频道是有排序的，｛频道1，序号 3｝｛频道2，序号 1｝
      // 后端：返回频道数据的时候，并没有返回序号，想往最后追加数据，需要知道最大序号。
      // 采用：是覆盖式修改，在传递频道数据的同时，在前端排好序提交数据给后端
      // 注意：后端需要的数据，不包含推荐，是默认频道 永远是第一。
      // 数据：[{id:'频道ID',seq:1},...]
      // 本地存储数据格式
      // 数据：{id:'频道ID',name:'频道名称'}
      // 需求：把两个数据合并在一起，在API中才能实现两个逻辑。
      // 数据：[{id:'频道ID',seq:1,name:'频道名称'},....最后一个本地需要的对象]
      const newChannels = this.channels.map((item, i) => ({
        id: item.id,
        name: item.name,
        seq: i
      }))
      newChannels.splice(0, 1)
      newChannels.push({ id, name, seq: newChannels.length + 1 })
      try {
        // 调用接口实现  添加频道
        await addChannel(newChannels)
        // 添加成功
        // 1. 提示  添加成功
        this.$toast({ type: 'success', message: '添加成功' })
        // 2. 更新组件界面，往channels中加入一个频道即可
        // 2.1 注意：频道编辑  文章列表 都有频道。 但是 复杂数据类型，没有修改引用地址，允许修改
        this.channels.push({
          id,
          name,
          // 是否正在上拉加载中
          upLoading: false,
          // 是否正在下拉刷新中
          downLoading: false,
          // 是否加载了所有的数据
          finished: false,
          // 文章列表
          articles: [],
          // 获取数据的时间戳
          timestamp: Date.now(),
          // 阅读位置
          scrollTop: 0
        })
      } catch (e) {
        this.$toast({ type: 'fail', message: '添加失败' })
      }
    },
    // 删除频道
    async delChannel (index, channelId) {
      try {
        // 1. 调用接口删除频道
        await delChannel(channelId)
        // 2. 提示  '删除成功'
        this.$toast({ type: 'success', message: '删除成功' })
        // 3. 移除频道 （当前组件，父组件）
        // 当前组件上  channels  我的频道是数组移除其中一项
        // 当父组件传递的数据为简单数据类型的时候，不能修改，此时的修改是赋值，改变引用。
        // 当父组件传递的数据为复杂数据类型的时候，可以修改，在保证引用不被修改的情况，修改数据。
        // 当前组件，父组件  我的频道数据  在内存的指向是一样的
        // 4. 有情况：
        // 4.1 当激活的频道是最后一个频道，删除当前激活的频道， 当前激活的频道往前推一位
        // 4.2 当前你删除的频道是当前激活频道的前面的频道，当前激活的频道往前推一位
        if (index <= this.activeIndex) {
        // 让activeIndex往前推一位
        // 通知父组件修改 activeIndex
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        this.channels.splice(index, 1)
      } catch (e) {
        this.$toast({ type: 'fail', message: '删除失败' })
      }
    },
    // 进入频道  进入频道的索引 index
    enterChannel (index) {
      // 关闭 当前组件
      this.$emit('input', false)
      // 把现在的index设置给父组件activeIndex即可
      // 给自己绑定一个自定义事件  触发这个事件传递index 让父组件来改
      this.$emit('update:activeIndex', index)
    },
    // 获取全部频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
