<template>
    <div class="notice_main">
        <div class="notice_main_header">
            <router-link class="option" to="/exchange/coinexchange" style="outline:none;color:#525d6f;">{{$t('navigation.exchange')}}</router-link>
			<!-- 公告中心 -->
            <i class="el-icon-arrow-right"></i><span>{{$t('Announcement Center')}}</span>
        </div>
        <div v-loading = "loading"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">
          <div  v-for="(notice,index) in NoticeList" class="notice_con_div" @click="detailMore(notice)" :key='index'>
            <div class="notice_con_div_left">
                <img :src="notice.notice_img" width="100%" height="100%"/>
            </div>
            <router-link class="notice_con_div_right" :to="{path:'/notice/detail',query:{id:notice.notice_id}}">{{notice.notice_title}}
                <div class="notice_desc">{{notice.notice_desc}}</div>
                <div class="notice_time">
                    <div class="notice_time_left">{{notice.notice_time}}</div>
					<!--  阅读 -->
                    <div class="notice_time_right">{{notice.notice_reading}} {{$t('read')}}</div>
                </div>
            </router-link>
          </div>
        </div>
    </div>
</template>
<script>
import { api } from "@/static/api";
export default {
  name: "Notice",
  data() {
    return {
      NoticeList: [],
      loading: false,
      langs: {
        "zh-cn": {
          name: "简体中文",
          code: 1
        },
        "en-us": {
          name: "English",
          code: 0
        }
      }
    };
  },
  created() {
    this.GetNoticeList();
  },
  computed: {
    lang() {
      return this.$store.getters.getLang;
    }
  },
  watch: {
    lang() {
      this.changeLan();
    }
  },
  methods: {
    // 改变语言
    changeLan() {
      this.loading = true
      let params = {
        type: this.langs[this.lang].code
      };
      api
        .setUserLanguage(params)
        .then(res => {
          var data = {
            type: 2
          };
          this.GetNoticeList();
        })
        .catch(err => {
          this.loading = false
        });
    },
    // 获取公告
    GetNoticeList() {
      this.loading = true
      this.NoticeList = [];
      var data = {
        type: 1
      };
      api
        .GetNoticeList(data)
        .then(res => {
          if (res.error_code == 1000) {
            this.loading = false
            this.NoticeList = res.data;
          } else {
            this.loading = false
            this.$message({
              message: res.error_desc,
              iconClass: "errorMessage",
              duration: 1000
            });
          }
        })
        .catch(err => {
          this.loading = false
        });
	},
	detailMore(notice){
		this.$router.push({
			path:'/notice/detail',
			query:{id:notice.notice_id}
		})
	}
  }
};
</script>
<style>
.notice_main {
  width: 1200px;
  height: auto;
  min-height: 200px;
  margin: 0px auto;
  margin-top: 40px;
  background: #191f27;
  overflow: hidden;
}

.notice_main_header {
  line-height: 87px;
  border-bottom: 1px solid #202234;
  color: #525d6f;
  font-size: 12px;
  padding-left: 50px;
  box-sizing: border-box;
}

.notice_main_header span {
  color: #c8cdd3;
}

.notice_con_div {
  cursor: pointer;
  width: 1200px;
  height: 180px;
  display: block;
  padding: 20px 0px;
  display: flex;
  position: relative;
  padding-left: 50px;
  box-sizing: border-box;
}

.notice_con_div:after {
  width: 1100px;
  height: 1px;
  content: " ";
  display: block;
  background: #202234;
  position: absolute;
  bottom: 0;
  left: 50px;
}

.notice_con_div:hover {
  background: #1c232c;
}

.notice_con_div_left {
  float: left;
  width: 260px;
  height: 140px;
  background: #2c3642;
}

.notice_con_div_right {
  float: left;
  width: 800px;
  margin-left: 40px;
  color: #fefefe !important;
}

.notice_con_div_right a {
  color: #fefefe !important;
}

.notice_con_title {
  width: 100%;
  text-align: left;
  height: 35px;
  line-height: 35px;
  color: white;
  font-size: 16px;
}

.notice_desc {
  width: 100%;
  text-align: left;
  height: 70px;
  font-size: 13px;
  color: #fff;
  line-height: 20px;
  opacity: 0.5;
  margin-top: 15px;
}

.notice_time {
  width: 100%;
  height: 35px;
  padding-top: 10px;
}

.notice_time_left {
  color: #85898e;
  width: 180px;
  height: 20px;
  line-height: 20px;
  background: url("~@/assets/img/notice1.png") no-repeat left;
  float: left;
  font-size: 13px;
  padding-left: 22px;
}

.notice_time_right {
  color: #85898e;
  width: 200px;
  height: 20px;
  line-height: 20px;
  float: left;
  background: url("~@/assets/img/notice2.png") no-repeat left;
  font-size: 13px;
  padding-left: 22px;
}
</style>
