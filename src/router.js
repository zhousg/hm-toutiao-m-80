import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载方式 导入所有的组件
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '/', name: 'home', component: Home },
        { path: '/question', name: 'question', component: Question },
        { path: '/video', name: 'video', component: Video },
        { path: '/user', name: 'user', component: User }
      ]
    },
    { path: '/user/profile', name: 'profile', component: UserProfile },
    { path: '/user/chat', name: 'chat', component: UserChat },
    { path: '/login', name: 'login', component: Login },
    { path: '/search', name: 'search', component: Search },
    { path: '/search/result', name: 'search-result', component: SearchResult },
    { path: '/article', name: 'article', component: Article }
  ]
})

export default router
