import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import router from '../router'


import createPersist, {createStorage} from 'vuex-localstorage'
import { stat } from 'fs';


Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {
      loggedin: false,   //登录状态
      nationality: 1,       //默认中国
      id: 0,                 //用户id
      name: '',             //用户名
      email: '',            //用户邮箱
      hasSettedPinCode: 0,   //是否设置了交易密码 1是0否
      authState: 1,         //认证状态 1未认证 2认证被拒绝 3认证中 4已认证
      lang:'en-us'
      // language:'zh',
      // language_node:0,
    },
    authToken: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    lang: 'en-us',
    langs: {
      "zh-cn": {
        name: "简体中文",
        code: 1
      },
      "en-us": {
        name: "English",
        code: 0
      },
      "zh-tw": {
        name: "繁体中文",
        code: 1
      }
    }
  },
  mutations: {
    SET_TOKEN(state, token){
      state.authToken = token
    },
    login(state, params) {
      state.userInfo.loggedin = true
      state.userInfo.id = params.id || 0
      state.userInfo.nationality = params.nationality || 1
      state.userInfo.name = params.name || ''
      state.userInfo.email = params.email || ''
      state.userInfo.hasSettedPinCode = params.hasSettedPinCode
      state.userInfo.authState = params.authState
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    logout(state) {
      state.userInfo.loggedin = false
      state.userInfo.id = 0
      state.userInfo.nationality = 1
      state.userInfo.name = ''
      state.userInfo.email = ''
      state.userInfo.hasSettedPinCode = 0
      state.userInfo.authState = 1

      localStorage.removeItem('__uinfo')
      router.replace({path: '/user/login'})
    },
    GO_REGIST(state){
      router.replace({path: '/user/regist'})
    },
    LoginLong(state){
      state.userInfo.loggedin = false
      state.userInfo.id = 0
      state.userInfo.nationality = 1
      state.userInfo.name = ''
      state.userInfo.email = ''
      state.userInfo.hasSettedPinCode = 0
      state.userInfo.authState = 1
      localStorage.removeItem('__uinfo')
      router.replace
      ({path: '/home'})
    },
    completeAuth(state) {
      state.userInfo.authState = 3
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    completeSettedPinCode(state) {
      state.userInfo.hasSettedPinCode = 1
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    CHANGE_LANG(state, params) {
      state.lang = params.lang
      localStorage.removeItem('lang')
      localStorage.setItem('lang', params.lang)
    },
    changeAuth(state, params){
      state.userInfo.authState = params.authState
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    }
  },
  getters: {
    getToken: (state) => {
      return state.authToken
    },
    loggedIn: (state) => {
      return state.userInfo.loggedin
    },
    username: (state) => {
      return state.userInfo.name
    },
    useremail: (state) => {
      return state.userInfo.email
    },
    authState: (state) => {
      return state.userInfo.authState
    },
    hasSettedPinCode: (state) => {
      return state.userInfo.hasSettedPinCode
    },
    getLang: (state) => {
      return state.lang
    },
    getToken: (state) => {
      return state.authToken
    },
    getLangs: (state) => {
      return state.langs
    }
  },
  actions: {
    set_token({commit},token){
      commit('SET_TOKEN',token)
    },
    userLogin({commit}, params) {
      commit('login', params)
    },
    userLogout({commit}) {
      localStorage.removeItem('token')
      commit('SET_TOKEN','')
      commit('logout')
    },
    completeAuth({commit}) {
      commit('completeAuth')
    },
    completeSettedPincode({commit}) {
      commit('completeSettedPinCode')
    },
    changeLang({commit}, params) {
      commit('CHANGE_LANG', params)

    },
    changeAuthState({commit},params){
      commit('changeAuth',params)
    },
    // 登陆超时
    loginLong({commit}){
      commit('SET_TOKEN','')
      commit('LoginLong')
    },
    // 重复注册
    repeatRegist({commit}){
      commit('logout')
    },
    // 未注册
    noRegist({commit}){
      commit('GO_REGIST')
    }
  }
})

export default store
