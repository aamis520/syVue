import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store/store.js'
import { getToken } from '@/utils/auth'
import { resolve } from 'path';

// 创建axios实例
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


const service = axios.create({
  baseURL: process.env.AUTH_API_HOST,
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.getToken) {
    config.headers['X-Token'] = store.getters.getToken // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  *
  */
    const res = response.data
    // console.log(res)
    // if(res.statusCode !== 200){
    //     Message({
    //         message: res.msg,
    //         iconClass: 'errorMessage',
    //         duration: 1000
    //     })
    //     return Promise.reject('error')
    // }
    return response.data
  },
  error => {
    Message({
      message: error.message,
      iconClass: 'errorMessage',
      duration: 1000
    })
    return Promise.reject(error)
  }
)


// login 登陆
export function login(email, password) {
  return service({
    url: 'login',
    method: 'post',
    data: {
      email: email,
      password: password
    }
  })
}

// 账号激活
export function activateAccount(token) {
  return service({
    url: 'activate',
    method: 'post',
    params: { token }
  })
}
// 查询激活状态
export function getActiveStatus(data){
  return service({
    url: 'activeStatus',
    method: 'post',
    data: data
  })
}
// 发送激活邮件
export function sendActiveEmail(params){
  return service({
    url: 'sendActiveEmail',
    method: 'post',
    data: params
  })
}
// 再次发送
// 注册
export function regist(data) {
  return service({
    url: 'register',
    method: 'post',
    data: data
  })
}

// 退出
export function logout(uid) {
  return service({
    url: 'logout',
    method: 'post',
    data: uid
  })
}


// 忘记密码 1
export function forgetPwdStepFirst(email) {
  return service({
    url: '/password/step1/confirm/email',
    method: 'post',
    data:{email}
  })
}

// 忘记密码 2
export function forgetPwdStepSecond( params ) {
  return service({
    url: '/password/get/step2/'+ params.email + '/' + params.code + '/confirm',
    method: 'get'
  })
}

//
export function sendEmailCode ( params ){ 
  return service({
    url: '/get/step2/code',
    method: ''
  })
}

// 忘记密码 3
export function forgetPwdStepThird( params ) {
  return service({
    url: '/password/get/step3/reset'+ params.userid + '/' + params.password,
    method: 'get'
  })
}
