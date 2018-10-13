import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome/welcome.vue'
import user from '../views/user/user.vue'
import roles from '../views/Authority/rolesList.vue'
import auth from '../views/Authority/authList.vue'
import categories from '../views/categories/categories.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      redirect: 'welcome', // 重定向
      children: [
        {
          path: 'welcome',
          name: 'welcome',
          component: welcome
        },
        {
          path: 'users',
          name: 'users',
          component: user
        },
        {
          path: 'roles',
          name: 'roles',
          component: roles
        },
        {
          path: 'rights',
          name: 'rights',
          component: auth
        },
        {
          path: 'categories',
          name: 'categories',
          component: categories
        }
      ]
    }
  ]
})
