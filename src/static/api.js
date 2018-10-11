import axios from 'axios'
import router from '../router'
import VueCookies from 'vue-cookies'
import store from '../store/store'
import {
  Message
} from 'element-ui'

const expire = 1000 * 60 * 120
const apiConfig = {
  // baseURL: 'http://frontend.sy.sxurl.cn/',
  baseURL: 'https://frontend.unione.io/',
  // baseURL: 'http://frontend.unione.io/',
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  retry: 3,
  retryDelay: 1000,
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Content-Type': 'application/x-www-form-urlencoded'
    // 'content-type':'text/html; charset=UTF-8'
  },
  validateStatus(status) {
    return true
  }
}
const showError = (msg) => {
  if(msg){
    Message({
      message: msg,
      type: 'error',
      iconClass: 'errorMessage',
      duration: 1000
    })

  }else{
  }
}
let n = 0  // 网络出错 只弹框一次的flag
const instance = axios.create(apiConfig)
instance.interceptors.request.use(function (config) {
  if(navigator.onLine){
    return config
  }else{
    if(n > 0){

    }else{
      Message({
        message: '网络连接错误,请检查网络',
        type: 'error',
        iconClass: 'errorMessage',
        duration: 3000
      })

    }
    n += 1
    return Promise.reject(config)
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 有res的拦截
    if (response.status < 200 || response.status >= 300) {
      showError('网络错误，刷新网页重试')
    }

    // if(!response.data.error_code || !response.error_code){
    //   showError('网络错误，刷新网页重试')
    // }
    if((response.data.error_code || response.error_code ) && (response.error_code == 2015 || response.data.error_code == 2015) ){
      showError('超时登陆，请重新登陆')
      store.dispatch('userLogout')
    }
    if(response.data != null){
      return response.data
    }else{
      return response
    }

  }
  ,
  // 报错 尝试重连
  function axiosRetryInterceptor(error) {
    var config = error
    if(!config || !config.retry){
      return Promise.reject(config)
    }
    config.__retryCount = config.__retryCount || 0;
    if(config.__retryCount >= config.retry) {
      // Reject with the error
      // 最后一次重试失败 要做一次提示  TODO
      return Promise.reject(config);
    }
    config.__retryCount += 1;

    var backOff = new Promise(function(resolve){
      setTimeout(function(){
        resolve()
      },config.retryDelay || 1)
    })

    return backOff.then(function(){
      return instance(config)
    })
  }
);


function handleError(err) {
  console.error(err)
  return err
}

// 错误统一处理，成功单独处理
function handleStatusCode(response) {
  if (response.status >= 400 && response.status <= 500) {
    alert('出错了')
    return Promise.reject(response)
  }
  return response
}

const post = (uri, params) => {

  return instance.post(uri, params).then((res) => {

    switch (res.error_code) {

      case  1000:
        var usinfo = JSON.parse(localStorage.getItem('__uinfo'))
        if(usinfo){
          localStorage.setItem('__uinfo', JSON.stringify(usinfo))
        }
        if(res.data){
          return res.data

        }else{
          return res
        }

      case 2014:
      case 2015:
        return instance.post('/assets/loginout').then(() => {
          store.dispatch('userLogout')

        })


      default:


    }

    throw  res


  }).catch((res) => {
    if(res.error_code != 2015){
      // 2007 是 重复注册
      if(res.error_code == 2007){
        store.dispatch('repeatRegist')
      }else if(res.error_code == 2009){
        // 邮箱未注册
        store.dispatch('noRegist')
      }
      showError(res.error_desc)

    }
    throw  res

  })

}



const get = (uri, params) => {


  return instance.get(uri, {params}).then((res) => {


    switch (res.error_code) {

      case  1000:
        var usinfo = JSON.parse(localStorage.getItem('__uinfo'))
        if(usinfo){
          localStorage.setItem('__uinfo', JSON.stringify(usinfo))
        }
        return res



      default:


    }

    throw  res


  }).catch((res) => {
    if(res){
      showError(res.error_desc)
    }
    throw  res

  })

}



const api = {
  //  用户登录
  userLogin(params) {
    return post('/user/login', params)
  },
  // 用户退出
  userLogOut() {
    return instance.post('/assets/loginout')
  },
  // 用户注册
  userRegist(params) {
    return post('/user/register', params)
  },
  // 获取用户数据
  getUserData(data){
    return instance.post('assets/getuserdata',data)
  },
  // 邮箱是否已经验证
  checkUserEmail(params){
  	return post('/user/checkuserisactivation',params)
  },
  // 再次发送邮箱验证
  sendEmailAgain(params){
  	return post('/user/sendactivateemailagain',params)
  },
  //  获取图片验证码
  getImgCode(type) {
    return apiConfig.baseURL + '/public/getimgcode?timestamp=' + (new Date().getTime()).toString() + '&type=' + type
  },
  // 验证图片验证码 进入下一步
  checkLoginImgCode(data) {
    return instance.post('/user/checkfindpasswordimgcode', data)
  },
  //发送找回密码验证码到邮箱
  sendFindPwdCode(data) {
    return instance.post('/user/sendfindpasswordcode', data)
  },
  // 提交找回密码验证码进入下一步
  checkFindPwdCode(data) {
    return instance.post('/user/checkfindpasswordcode', data)
  },
  // 修改登录密码
  setSignPwd(data) {
    return instance.post('/user/setfindpasswordagain', data)
  },
  // 新增委托
  addDelegate(params) {
    return post('/entrust/order', params)
  },
  // 撤销委托
  cancelDelegate(params) {
    return post('/entrust/cancel', params)
  },
  // 当前委托
  curDelegate(data) {
    return instance.post('/entrust/current', data)
  },
  // 订单页面当前委托
  ordercurDelegate(params) {
    return get('/entrust/currentAll', params)
  },
  // 历史委托
  hisDelegate(params) {
    return  get('/entrust/history', params)
  },
  // 根据交易ID获取交易明细
  orderDetail(params) {
    return  get('/entrust/userdetail', params)
  },
  // 后台中英文切换
  setUserLanguage(params){
    return  get('/user/setuserlanguage',params)
  },
  // 委托明细
  delegateDetail(params) {
    return get('/entrust/detail', params)
  },
  // 获取ws端口
  getPortAll(params){
    return get('/Port/getPortAll', params)
  },
  // 轮播图
  getBanner(data){
    return instance.post('/banner/index',data)
  },
  // 公告
  getNotice(data) {
    return instance.post('/index/getnotice', data)
  },
  // 资产列表（持有）
  getAssetslist(data) {
    return instance.post('/assets/assetslist', data)
  },
  // 用户账户/余额
  userAccount(data) {
    return instance.post('/user/account', data)
  },
  // 上传地址
  uploadUrl() {
    return apiConfig.baseURL + '/public/upload'
  },
  // 获取国家
  getCountry(data) {
    return instance.post('/public/getcountry', data)
  },
  // 身份验证
  userAuth(data) {
    return instance.post('/assets/authentication', data)
  },
  // 设置交易密码
  setPinCode(data) {
    return instance.post('/assets/settransactionpassword', data)
  },
  //获取充币地址
  getRechargeAddress(data) {
    return instance.post('/assets/rechargeaddress', data)
  },
  //资产中心-财务记录（充币记录）
  assetsRechargeRecord(data) {
    return instance.get('/assets/assetsRecord?page=' + data.page)
  },
  //资产中心-财务记录（提取币记录）
  assetsWithdrawRecord(data) {
    return instance.get('/assets/assetsWithdraw?page=' + data.page)
  },
  // 提币地址列表
  withdrawAddressList(data) {
    return instance.post('/assets/getusertakecoinadresslist', data)
  },
  // 删除提币地址
  deleteWithdrawAddress(data) {
    return instance.post('/assets/deletetakecoinaddress', data)
  },
  // 验证交易密码图片验证码
  checkImgCode(data) {
    return instance.post('/assets/checkupdatetransactionpasswordimgcode', data)
  },
  // 发送修改交易密码验证码
  getPinCodeVerifyCode(data) {
    return instance.post('/assets/sendupdatetransactionpasswordcode', data)
  },
  // 验证修改交易密码验证码
  checkDealCode(data) {
    return instance.post('/assets/checkupdatetransactionpasswordcode', data)
  },
  // 修改交易密码
  modifyDealPwd(data) {
    return instance.post('/assets/setupdatetransactionpassword', data)
  },
  // 发送提币验证邮件
  getTakeCoinVerifyCode(data) {
    return instance.post('/assets/sendaddtakecoinaddressemail', data)
  },
  // 添加提币地址
  addWithdrawAddress(data) {
    return instance.post('/assets/addtakecoinaddress', data)
  },
  //获取提币地址
  getWithdrawAddress(data) {
    return instance.post('/assets/gettakecoinaddress', data)
  },
  //提币手续费接口
  calWithdrawFee(data) {
    return instance.post('/assets/getpoundage', data)
  },
  sendWithdrawCode(data) {
    return instance.post('/assets/sendtakecoinemail', data)
  },
  //提币按钮
  withdrawCoin(data) {
    return instance.post('/assets/takecoin', data)
  },
  // 提币限制
  withdrawCoinLimit(data) {
    return instance.post('/public/takecoininputlimited', data)
  },
  //获取公告列表
  GetNoticeList(data) {
    return instance.post('/index/getnotice', data)
  },
  //获取公告详情
  GetNoticeDetail(data) {
    return instance.post('/index/getnoticedetail', data)
  },
  getWsByCurrency(data) {
    var arr = Object.keys(data), str = ''
    for (var i in arr) {
      str += ('&' + arr[i] + '=')
      str += data[arr[i]]
    }
    str = '?' + str.substr(1)
    return instance.get('/Port/getPort' + str)
  },
  //添加阅读量
  SetNoticeReadingCount(data) {
    return instance.post('/public/setnoticereadingcount', data)
  },
  getAddress(data) {
    return instance.post('/assets/getAddress', data)
  },
  checkRegisterEmail(data) {
    return instance.post('/user/checkregisteremail', data)
  },
  accountPair(data) {
    return instance.post('/user/account_pair', data)
  },
  currentDelegateAll(data) {
    return instance.post('/entrust/currentAll', data)
  },
  getCoinList(data) {
    return instance.post('/public/getallcoinlist', data)
  }
}
export {api, handleError, handleStatusCode}

