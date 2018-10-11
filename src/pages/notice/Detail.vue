<template>
    <div class="notice_main">
        <div class="notice_main_header">
            <router-link class="option" to="/exchange/coinexchange" style="outline:none;color:#525d6f;">{{$t('navigation.exchange')}}</router-link>
			<!-- 公告中心 -->
            <i class="el-icon-arrow-right"></i><router-link class="option" to="/notice" style="outline:none;color:#525d6f;">{{$t('Announcement Center')}}</router-link>
			<!-- 公告详情 -->
            <i class="el-icon-arrow-right"></i><span>{{$t('Announcement details')}}</span>
        </div>
        <div class="notice_main_title">{{NoticeDetail.notice_title}}</div>
        <div class="notice_main_desc">{{NoticeDetail.notice_desc}}</div>
        <div class="notice_detail_time">
            <div class="notice_detail_time_left">{{NoticeDetail.notice_time}}</div>
            <div class="notice_detail_time_right">{{NoticeDetail.notice_reading}}</div>
        </div>
        <div class="notice_con" v-html="NoticeDetail.notice_content"></div>
    </div>
</template>
<script>
	import { api } from '@/static/api'
	export default {
		name: 'Notice',
		data() {
			return {
				NoticeDetail: {},
        id: '',
        loacing: false,
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
		created() {
			this.GetNoticeDetail(this.$route.query.id),
			this.SetNoticeReadingCount(this.$route.query.id)
		},
		computed:{
			lang(){
                return this.$store.getters.getLang
			}
		},
		watch:{
			lang(){
				this.changeLan()
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
            this.GetNoticeDetail(this.$route.query.id);
          })
          .catch(err => {
            this.loading = false
          });
      },
			// 获取公告
			GetNoticeDetail(id) {
        this.loading = true
				this.NoticeDetail = ''
				var data = {
					id: id
				}
				api.GetNoticeDetail(data).then(res => {
					if(res.error_code == 1000) {
            this.loading = false
						this.NoticeDetail = res.data
					} else {
            this.loading = false
						this.$message({
							message: res.error_desc,
							iconClass: 'errorMessage',
							duration: 1000
						})
					}
				}).catch(err => {
          this.loading = false
				})
			},
			//添加阅读量
			SetNoticeReadingCount(id) {
				var data = {
					id: id
				}
				api.SetNoticeReadingCount(data).then(res => {
					if(res.error_code == 1000) {} else {
						this.$message({
							message: res.error_desc,
							iconClass: 'errorMessage',
							duration: 1000
						})
					}
				}).catch(err => {})
			}
		},
	}
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

	.notice_main_title {
		padding: 0px 50px;
		width: 100%;
		margin-top: 20px;
		line-height: 24px;
		font-size: 20px;
		color: white;
		text-align: left;
	}

	.notice_main_desc {
		padding: 0px 50px;
		width: 100%;
		height: 70px;
		margin-top: 15px;
		line-height: 22px;
		font-size: 14px;
		color: #767a7f;
	}

	.notice_detail_time {
		padding: 0px 50px;
		width: 100%;
		height: 45px;
		padding-top: 10px;
	}

	.notice_detail_time_left {
		color: #85898e;
		width: 180px;
		height: 20px;
		line-height: 20px;
		background: url('~@/assets/img/notice1.png') no-repeat left;
		float: left;
		font-size: 13px;
		padding-left: 22px;
	}

	.notice_detail_time_right {
		color: #85898e;
		width: 200px;
		height: 20px;
		line-height: 20px;
		float: left;
		background: url('~@/assets/img/notice2.png') no-repeat left;
		font-size: 13px;
		padding-left: 22px;
	}

	.notice_con {
		padding: 40px 50px;
		background: #1c232c;
		width: 100%;
		height: auto;
		min-height: 150px;
		line-height: 22px;
		font-size: 14px;
		color: rgba(254, 254, 254, 0.8);
    font-weight: 100;
    span{
      background-color: transparent;
    }
	}
</style>
