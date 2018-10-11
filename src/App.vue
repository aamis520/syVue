<template>
  <div id="app" style="min-width:1100px;">
    <transition name="fade" mode="out-in" :duration="300">
      <router-view />
    </transition>
  </div>
</template>

<script>

  import {api} from '@/static/api'
  export default {
    name: 'App',

    beforeCreate() {
      // 获取local

      var userinfo = JSON.parse(localStorage.getItem('__uinfo'))
      if (userinfo && userinfo.email != '') {
        this.$store.dispatch('userLogin', userinfo)
      }
    },
    created(){
      this.$store.dispatch("changeLang", {
					lang:localStorage.getItem('lang')
      });
      this.changeLan()
    },
    computed:{
      lang(){
        if(this.$store.getters.getLang == localStorage.getItem('lang')){
             return this.$store.getters.getLang
			  }else {
            return localStorage.getItem('lang')
        }
      },
    },
    watch:{
      lang(){
        this.changeLan()
      }
    },
    methods:{
      // 改变语言
      changeLan() {
        let langs = {
          "zh-cn": {
            name:"简体中文",
            code:1
          },
          "en-us": {
            name:"English",
            code:0
          }
        }
        let params = {
          type: langs[this.lang].code
        };
        api.setUserLanguage(params)
          .then(res => {
             if(this.lang == 'zh-cn'){
               document.title = 'AUEC 交易所'
             }else{
               document.title = 'Australian Equity Exchange Center'
             }
          })
          .catch(err => {
          });


      },
    }


  }
</script>

<style rel='stylesheet/scss' scoped>
  #app {
    font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    margin: 0 auto;
    height: 100%;
  }

  *, body {
    padding: 0px;
    margin: 0px auto;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  a {
    text-decoration: none
  }

</style>
