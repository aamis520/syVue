<template>
	<div class="vueBox">
    <ul  :class="{anim:animate==true}">
     <li class="slide-item" v-for="(item, index) in list" :key="index">
				<img src="@/assets/img/index3.png"/>
				<span v-if="item.notice_title">{{item.notice_title}}</span>
			</li>
    </ul>
    <div style="display:none;">{{langType}}</div>
	</div>
</template>
<script type="text/javascript">
import { api } from '@/static/api'
export default {
  props: {},
  data() {
    return {
      animate: false,
      setTimer: null,
      list: [],
      langs: {
        "zh-cn": {
          name:"简体中文",
          code:1
        },
        "en-us": {
          name:"English",
          code:0
        }
      }
    };
  },
  watch:{
    langType(){
      this.getNotice()
    }
  },
  computed:{
    langType(){
      return this.$store.getters.getLang
    }
  },
  methods: {
    scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      if(this.list){
        setTimeout(() => {
          //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
          this.list.push(this.list[0]); // 将数组的第一个元素添加到数组的
          this.list.shift(); //删除数组的第一个元素
          this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, 500);

      }
    },
    timer(){
      this.setTimer = setInterval(this.scroll,5000)
    },
    getNotice() {
      // 先设置一层语言
      this.list = []
      let params = {
        type: this.langs[this.langType].code
      }
      api.setUserLanguage(params)
					.then(res => {
            var data = {
              type: 2
            }
            api.getNotice(data)
              .then(res => {
                if(res.error_code == 1000) {
                  this.list = res.data
                }
              }).catch(err => {})
					}).catch(err => {
				})

			},

  },
  created: function() {
    this.getNotice()
    this.timer()
  }
};
</script>
<style scoped lang="scss">
.vueBox {
  width: 100%;
  height: 40px;
  position: relative;
  overflow: hidden;
  ul {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    .slide-item {
      width: 100%;
      list-style: none;
      text-align: center;
      height: 40px;
      font-size: 14px;
      span {
        line-height: 40px;
      }
      img {
        height: 20px;
        position: relative;
        top: 6px;
      }
    }
  }
  .anim {
    transition: all 0.5s;
    margin-top: -40px;
  } /*关键样式*/
}
</style>
