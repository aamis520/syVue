// import Vue from 'vue'
// import VueI18n from 'vue-i18n'
// Vue.use(VueI18n);
// 基础货币类型
const currencyType = [
    'USDT',
    'CNY',
    'ETH',
    'UT',
    'BTC'
]
// 国际
const nationalityOption = [
    {
        label:'澳洲',
        value:2
    },
    {
        label:'中国',
        value:1
    }
]

const nationalityOptionTwo =[
    {
        label:'Australia',
        value:2
    },
    {
        label:'China',
        value:1
    }
]

// 币种对应图标
const coinTypeIcon = {
    'ada':'ada.png',
    'bch':'bch.png',
    'btc':'btc.png',
    'dash':'dash.png',
    'eos':'eos.png',
    'etc':'etc.png',
    'eth':'eth.png'
}

const nationalityInfo = {
    1:{
        credentials:'身份证',
    },
    2:{
        credentials:'护照'
    }
}

export { currencyType, nationalityOption, nationalityInfo,coinTypeIcon,nationalityOptionTwo}
