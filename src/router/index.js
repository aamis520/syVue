import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 用户登录
// import User from '@/pages/user/User'
// import Login from '@/pages/user/Login'
// import FindPwd from '@/pages/user/FindPwd'
// import FindPinCode from '@/pages/user/FindPinCode'
// import Regist from '@/pages/user/Regist'

const User = r => require(['@/pages/user/User'], r)
const Login = r => require(['@/pages/user/Login'], r)
const FindPwd = r => require(['@/pages/user/FindPwd'], r)
const FindPinCode = r => require(['@/pages/user/FindPinCode'], r)
const Regist = r => require(['@/pages/user//Regist'], r)
const MailboxVerification = r => require(['@/pages/user/MailboxVerification'], r)

// 账户安全
// import Account from '@/pages/account/Account'
// import IdentityVerify from '@/pages/account/IdentityVerify'
// import Security from '@/pages/account/Security'

const Account = r => require(['@/pages/account/Account'], r)
const IdentityVerify = r => require(['@/pages/account/IdentityVerify'], r)
const Security = r => require(['@/pages/account/Security'], r)


// 资产
// import Property from '@/pages/property/Property'
// import CoinOption from '@/pages/property/CoinOption'
// import FinancialRecords from '@/pages/property/FinancialRecords'
import WithDrawAddressManagement from '@/pages/property/WithdrawAddressManagement'

const Property = r => require(['@/pages/property/Property'], r)
const CoinOption = r => require(['@/pages/property/CoinOption'], r)
const FinancialRecords = r => require(['@/pages/property/FinancialRecords'], r)
// const WithDrawAddressManagement = r => require(['@/pages/property/WithDrawAddressManagement'], r)

// 新手帮助
// import GoogleVerifyIntro from '@/pages/help/GoogleVerifyIntro'
// import Wiki from '@/pages/help/Wiki'

const GoogleVerifyIntro = r => require(['@/pages/help/GoogleVerifyIntro'], r)
const Wiki = r => require(['@/pages/help/Wiki'], r)

// import Main from '@/pages/Main'
// import Home from '@/pages/Home'
// import CoinExchange from '@/pages/exchange/CoinExchange'

const Main = r => require(['@/pages/Main'], r)
const Home = r => require(['@/pages/Home'], r)
const CoinExchange = r => require(['@/pages/exchange/CoinExchange'], r)


// 订单
// import OrderList from '@/pages/order/OrderList'
const OrderList = r => require(['@/pages/order/OrderList'], r)

// 公告
// import Notice from '@/pages/notice/Notice'
// import Detail from '@/pages/notice/Detail'
const Notice = r => require(['@/pages/notice/Notice'], r)
const Detail = r => require(['@/pages/notice/Detail'], r)

//平台说明
const Explain = r => require(['@/pages/explain/Explain'],r)
const AboutUs = r => require(['@/pages/explain/AboutUs'],r)
const Agreement = r => require(['@/pages/explain/Agreement'],r)
const Disclaimer = r => require(['@/pages/explain/Disclaimer'],r)


Vue.use(Router)

const router = new Router({
	mode: "history",
	scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    // login
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          name: 'dashbord',
          component: Home
        },
        {
          path: 'home',
          name: 'home',
          component: Home,
          redirect: '/'
        },
        {
          path: 'property',
          name: 'property',
          component: Property,
          children: [
            {
              path: 'coinoption',
              name: 'coinoptionIndex',
              component: CoinOption
            },
            {
              path: 'coinoption/:dealId/:type',
              name: 'coinoption',
              component: CoinOption
            },
            {
              path: 'financialrecords',
              name: 'financialrecords',
              component: FinancialRecords
            },
            {
              path: 'financialrecords/:type',
              name: 'financialrecordsType',
              component: FinancialRecords
            },
            {
              path: 'withdrawaddressmanagement',
              name: 'withdrawaddressmanagement',
              component: WithDrawAddressManagement
            }
          ]
        },
        {
          path: 'account',
          component: Account,
          redirect: 'account/security',
          children: [
            {
              // 实名认证
              path: 'identityverify',
              name: 'identityverify',
              component: IdentityVerify
            },
            {
              // 个人中心
              path: 'security',
              name: 'security',
              component: Security
            }
          ]
        },
        //平台说明
        {
          path: 'explain',
          component: Explain,
          redirect: 'explain/aboutus',
          children: [
            {
              // 关于我们
              path: 'aboutus',
              name: 'aboutus',
              component: AboutUs
            },
            {
              // 注册协议
              path: 'agreement',
              name: 'agreement',
              component: Agreement
            },
            {
              // 注册协议
              path: 'disclaimer',
              name: 'disclaimer',
              component: Disclaimer
            },

          ]
        },
        {
          path: 'user',
          component: User,
          redirect: 'user/login',
          children: [
            {
              // 注册
              path: 'regist',
              name: 'regist',
              component: Regist
            },
            {
              // 登录
              path: 'login',
              name: 'login',
              component: Login
            },
            {
              path: 'mailboxverification/:email',
              name: 'mailboxverification',
              component:MailboxVerification
            },
            {
              // 找回/修改登录密码
              path: 'findpassword',
              name: 'findpassword',
              component: FindPwd
            },
            {
              // 找回/修改登录密码
              path: 'forgetpassword/:isforget',
              name: 'forgetpassword',
              component: FindPwd
            },
            {
              // 找回/修改交易密码
              path: 'findpincode',
              name: 'findpincode',
              component: FindPinCode
            }
          ]
        },
        {
          // 交易面板
          path: 'exchange/coinexchange',
          name: 'coinexchange',
          component: CoinExchange
        },
        {
          // 订单页面
          path: 'order',
          name: 'order',
          component: OrderList
        },
        {
          // 订单页面
          path: 'order/:category',
          name: 'orderByCategory',
          component: OrderList
        },
        {
          // 谷歌验证
          path: 'googleverifyintro',
          name: 'googleverifyintro',
          component: GoogleVerifyIntro
        },
        {
          // 谷歌验证
          path: 'wiki',
          name: 'wiki',
          component: Wiki
        },
        {
          // 公告中心
          path: 'notice',
          name: 'notice',
          component: Notice,
        },
        {
          // 公告详情
          path: 'notice/detail',
          name: 'noticedetail',
          component: Detail
        }
      ]
    }
  ]
})
export default router


