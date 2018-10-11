import router from './router'
import store from './store/store.js'

import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       if (store.getters.roles.length === 0) {
//         store.dispatch('GetInfo').then(res => { // 拉取用户信息
//           next()
//         }).catch(() => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error('验证失败,请重新登录')
//             next({ path: '/login' })
//           })
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
  }
    next()
})

router.afterEach(() => {
  
})