<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save()">
    </van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto=true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender===0?'男':'女'" />
      <van-cell is-link title="生日" @click="showBirthday=true" :value="user.birthday" />
    </van-cell-group>
    <!-- 选择头像 -->
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell is-link title="本地相册选择图片" @click="openChangeFile()"/>
      <van-cell is-link title="拍照" />
    </van-popup>
    <!-- 输入框 -->
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <!-- 选择性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-cell is-link title="男" @click="changeGender(0)" />
      <van-cell is-link title="女" @click="changeGender(1)" />
    </van-popup>
    <!-- 日期选择 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <!-- 文件选择控件 -->
    <input ref="file" @change="upload()" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { updatePhoto, getUserProfile, updateUserInfo } from '@/api/user'
export default {
  name: 'user-profile',
  data () {
    return {
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前时间
      nowDate: new Date(),
      // 最小时间
      minDate: new Date('1970-01-01'),
      photo: '',
      // 用户信息
      user: {
        name: '',
        // 0 男 1 女  后台没有处理好
        gender: 0,
        birthday: '2019-08-08'
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 保存
    async save () {
      // 1. 获取数据
      // 2. 提交数据 封装API
      // 3. 成功提示
      await updateUserInfo(this.user)
      this.$toast.success('保存信息成功')
    },
    async getUserProfile () {
      const data = await getUserProfile()
      this.user = data
      this.photo = data.photo
    },
    // 1. 绑定点击事件，弹出本地资源管理器
    // 2. 使用input[type="file"]元素，点击后选择图片
    // 3. 点击 本地相册选择图片 触发file元素的点击  弹出资源管理器
    // 4. 选择图片后，触发file元素的change事件, 获取选择的图片对象
    // 5. 封装一个提交头像的API
    // 6. 使用API提交我们选择的图片对象
    // 7. 成功后，更新头像地址，关闭对话框。
    openChangeFile () {
      // 获取DOM触发click事件。
      this.$refs.file.click()
    },
    async upload () {
      // 选择图片后  （以前 this.files[0] 获取文件对象）
      const file = this.$refs.file.files[0]
      // 组成一个formData
      const formData = new FormData()
      formData.append('photo', file)
      const data = await updatePhoto(formData)
      // 更新头像
      this.photo = data.photo
      this.showPhoto = false
      this.$toast.success('修改头像成功')
    },
    changeGender (type) {
      this.user.gender = type
      this.showGender = false
    },
    confirmDate (value) {
      // value 的格式  日期对象
      // birthday 的格式  字符串
      // value转换格式后赋值给birthday
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      // 关闭弹窗
      this.showBirthday = false
    }
  }
}
</script>

<style scoped lang='less'></style>
