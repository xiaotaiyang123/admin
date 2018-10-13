// 入口
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import store from './store/store.js'
Vue.use(ElementUI)
Vue.config.productionTip = false
// 全局守卫，对用户进行判断

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('mytoken')
  // 如果已经登录，那我不干涉你，让你随便访问
  if (token) {
    next()
  } else {
    if (to.path !== '/login') {
      // 如果没有登录，但你访问其他需要登录的页面，那我就让你跳到登录页面去
      next({ path: '/login' })
    } else {
      // 如果没有登录，但你访问的login，那就不干涉你，让你访问
      next()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
