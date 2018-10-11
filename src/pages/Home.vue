<template>
	<div>
    <div @click.stop="goToRegist">
          <el-carousel class="banner_big"
      v-loading="loading2"
      :autoplay="false"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
        <!-- <el-carousel-item class="testImg" v-for="(item,index) in photo" :key="index"
          v-on:click="goToRegist"
          style="width:100%;height:100%;cursor:pointer;" >
          <img style="display:block;width:100%;height:100;" :src="item.photo" alt="" v-on:click="goToRegist">
        </el-carousel-item> -->
        <el-carousel-item class="testImg" v-for="(item,index) in photo" :key="index"
        @click="goToRegist"
          style="width:100%;height:100%" v-bind:style="{background: 'url('+ item.photo +') no-repeat 50% center' }">
        </el-carousel-item>
      </el-carousel>
    </div>
    <span style="display:none;">{{lang}}</span>
    <div class="ad">
      <sy-notice></sy-notice>
    </div>
		<div class="main-wrapper">
			<div class="main-inner">
				<!-- <div class="main_cat">
					<a href="javascript:void(0);">USD交易区</a>
					<a href="">HKD交易区</a>
					<a href="javascript:void(0);">BTC交易区</a>
				</div> -->
				<!-- <div class="hr"></div> -->
				<div class="main_cat_con">
					<div class="main_cat_con_t main_cat_con_t_first main_cat_con_t_usd"></div>
					<div v-for="(item,index) in marketListUSDT" @click="goCoinExchange(item)" class="main_cat_con_t" :key="index">
						<div class="main_cat_con_t_title">{{item.name.toUpperCase()}} / USDT</div>
						<div class="main_cat_con_t_money">{{Number(item.order_price)}}</div>
						<div class="main_cat_con_t_percent" :class="item.positive?'fall':'rise'">
              <span v-if="!item.positive">-</span>
              <span v-else>+</span>
              {{Math.abs(item.p)}}%</div>
					</div>
				</div>
				<div class="main_cat_con" style="display:none">
					<div class="main_cat_con_t main_cat_con_t_first main_cat_con_t_hkd"></div>
					<div class="main_cat_con_t" v-for="(item,index) in marketListUT" :key="index">
						<div class="main_cat_con_t_title">{{item.name.toUpperCase()}} / UT</div>
						<div class="main_cat_con_t_money">{{Number(item.order_price)}}</div>
						<div class="main_cat_con_t_percent" :class="item.positive?'fall':'rise'">{{Math.abs(item.p)}}%</div>
					</div>
				</div>
				<div class="main_footer">
          <div v-show="$store.getters.getLang == 'en-us'">
					  <img src="@/assets/img/ban3_en.jpg" witdh="100%">
          </div>
          <div v-show="$store.getters.getLang !== 'en-us'">
					  <img src="@/assets/img/ban3.jpg" witdh="100%">
          </div>


				</div>
        <div class="tw-main-footer">
          <el-row>
            <el-col :span="8">
              <div class="bit-img">
                <img src="@/assets/img/gaoxiao1.png" alt="高效">
              </div>
              <p class="bit-title">高效交易搓合引擎</p>
              <p class="bit-content">101BITEX的訂單搓合引擎可以在數毫秒的延遲中處理數百萬筆訂單。整個系統設計為全分布式、高度可用性以及可自動擴展性，為全球的交易者提供良好的交易體驗</p>
            </el-col>
            <el-col :span="8">
              <div class="bit-img">
                <img src="@/assets/img/biao1.png" alt="高效">
              </div>
              <p class="bit-title">全年無休</p>
              <p class="bit-content">除了每天「收盤處理」和每週的「系統定期維護」的相關時段內會停止交易，加密貨幣交易是全年無休的</p>
            </el-col>
            <el-col :span="8">
              <div class="bit-img">
                <img src="@/assets/img/anquan1.png" alt="高效">
              </div>
              <p class="bit-title">虛擬資產安全</p>
              <p class="bit-content">101BITEX將大部分的虛擬資產存放在離線冷錢包的多重保管庫中，它需要八個橫跨世界各洲的其中五個硬體加密模組來開啓。此外，儲存在線上熱錢包的虛擬資產也會向保險公司投保。</p>
            </el-col>
          </el-row>
        </div>
			</div>
		</div>
	</div>
</template>

<script>
  import { api } from '@/static/api'
  import syNotice from '@/components/notice'
	export default {
    name: 'Home',
    components: {
      syNotice
    },
		props: {

		},
		data() {
			return {
        pubNotice: [],
				thisSocketUrl:'',
				thisSocket:null,
				marketListUSDT: [],
				marketListUT: [],
        photo:[],
        loading2:true,
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
			}
		},
		created() {
				this.$store.dispatch("changeLang", {
					lang:localStorage.getItem('lang')
				});

            this.setLang()
			this.Banner()
			this.getNotice()
			this.getPortAll()
		},
		mounted() {
			// var self = this
			// console.log(1111, self)
			// this.newsocket.onmessage = function(data) {
			// 	// console.log('原始ws数据',data)
			// 	var res = JSON.parse(data.data)
			// 	// console.log('ws数据',res)
			// 	self.marketListUSDT = res.price.usdt;
			// 	self.marketListUT = res.price.ut;
			// 	for(var i in self.marketListUSDT) {
			// 		self.marketListUSDT[i].icon = '$'
			// 		self.marketListUSDT[i].positive = self.marketListUSDT[i].p >= 0 ? true : false
			// 	}
			// 	for(var i in self.marketListUT) {
			// 		self.marketListUT[i].icon = '$'
			// 		self.marketListUT[i].positive = self.marketListUT[i].p >= 0 ? true : false
			// 	}
			// }
    },
    computed: {
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
      goToRegist(){
        console.log('dadda')
        if(this.$store.getters.loggedIn == false){
          this.$router.push('/user/regist')
        }
      },
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
            this.getNotice()
			this.Banner()
          })
          .catch(err => {
            this.loading = false
          });
      },
      setLang(){},
			// 获取公告
			getNotice() {

        // this.pubNotice = []
				var data = {
					type: 2
				}
				api.getNotice(data)
					.then(res => {
						if(res.error_code == 1000) {
							//去后台传输的标签
							function reMove(obj){
								obj = obj.replace(/(\n)/g, "");
								obj = obj.replace(/(\t)/g, "");
								obj = obj.replace(/(\r)/g, "");
								obj = obj.replace(/<\/?[^>]*>/g, "");
								obj = obj.replace(/\s*/g, "");
								obj = obj.replace(/ /g, "");
								return obj;
							}
							console.log(res,'res')
							// this.pubNotice = reMove(res.data.notice_title)
							this.pubNotice = res.data
							console.log(this.pubNotice,'this.pubNotice')

						}
					}).catch(err => {})
			},
			goCoinExchange(item) {
        // if(!item) return
        if(item.is_recharge == 0){
          this.$message({
            message: this.$t('coinNotExchange'),
            iconClass: 'errorMessage',
            duration: 2000
          })
        }
				this.$router.push({
					path: '/exchange/coinexchange',
					query: {
						tradeCurrency: item.name.toUpperCase(),
						base: 'USDT'
					}
				})
			},
			Banner(){
				var data ={
					ver:1,
					language: this.$store.getters.getLang == 'en-us' ? 0 : 1
				}
				api.getBanner(data)
				.then(res => {
				   if(res.error_code == 1000){
						this.photo = []
						this.photo = res.banners
						this.loading2 = false
				   }
        	// TODO
				}).catch(err => {})
			},
			getPortAll(){
				var data ={

				}
				api.getPortAll(data)
				.then(res => {
					// console.log(res,'getPortAll')
					if(res.error_code == 1000){
						this.thisSocketUrl = 'wss://' + res.port_info[0].ip + '/sb/?port=' + res.port_info[0].pan_port
						// console.log(this.thisSocketUrl,'this.thisSocketUrl')
						this.initWs()
					}
				})
			},
			initWs(){
			   var self = this
               if(this.thisSocket){
				   this.thisSocket.close()
				   this.thisSocket = null
			   }
			   this.thisSocket = new WebSocket(this.thisSocketUrl)
			   this.thisSocket.onmessage = function(data){
				   var res = JSON.parse(data.data)
					//  console.log('ws接口res：', res)
					 self.marketListUSDT = res.price.usdt;
					self.marketListUT = res.price.ut;
					for(var i in self.marketListUSDT) {
						self.marketListUSDT[i].icon = '$'
						self.marketListUSDT[i].positive = self.marketListUSDT[i].p >= 0 ? true : false
					}
					for(var i in self.marketListUT) {
						self.marketListUT[i].icon = '$'
						self.marketListUT[i].positive = self.marketListUT[i].p >= 0 ? true : false
					}
			   }
			}
		}
  }

  function RndNum(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.banner {
		background: #202832 url('~@/assets/img/ban.jpg') no-repeat center;
		width: 100%;
		height: 580px;
	}

	.ad {
		width: 100%;
		/* height: 60px; */
		line-height: 24px;
		background: #fffbf4;
		color: #ffa33e;
		text-align: center;
		padding: 10px 20%;
	}

	.ad img {
		margin-top: -10px;
		margin-right: 15px;
	}

	.main-wrapper {
		background-color: #fff;
		overflow: hidden;
	}

	.main-inner {
		width: 1200px;
		margin: 0 auto;
	}

	.main_cat {
		height: 26px;
		width: 1200px;
		margin-top: 30px;
		margin-bottom: 30px
	}

	.main_cat a {
		float: left;
		color: #41444b;
		border: 1px solid #e1e1e1;
		border-radius: 200px;
		line-height: 24px;
		height: 24px;
		box-sizing: border-box;
		font-size: 11px;
		width: 100px;
		float: left;
		margin-right: 20px;
		text-align: center;
	}

	.main_cat a:nth-child(1) {
		color: white;
		background: #449283;
		border: none;
	}

	.main_cat a:nth-child(2) {
		color: white;
		background: #4c54f9;
		border: none;
	}

	.hr {
		width: 1200px;
		height: 1px;
		background: #ebebeb;
	}

	.main_cat_con {
		width: 1200px;
		height: auto;
		margin-top: 20px;
		margin-bottom: 20px;
		overflow: hidden
	}

	.main_cat_con_t {
		cursor: pointer;
		width: 190px;
		height: 110px;
		float: left;
		margin-right: 10px;
		background: #f7f8fb;
		padding: 18px;
		box-sizing: border-box;
		margin-bottom: 12px;
		transition: .3s;
	}
	.main_cat_con_t:hover{
		box-shadow: 0 2px 7px #ccc;
	}

	.main_cat_con_t_first {
		margin-left: 0px;
	}

	.main_cat_con_t_usd {
		background: #449283 url('~@/assets/img/usdt.png') no-repeat center;
		cursor: auto;
		box-shadow: none!important;
	}

	.main_cat_con_t_hkd {
		background: #4c54f9 url('~@/assets/img/ut.png') no-repeat center;
	}

	.main_cat_con_t_title {
		width: 100%;
		text-align: left;
		font-size: 12px;
		height: 14px;
		line-height: 14px;
		font-weight: bold;
	}

	.main_cat_con_t_money {
		width: 100%;
		margin-top: 18px;
		font-size: 14px;
		text-align: left;
		font-weight: bold;
		font-size: 16px;
		line-height: 16px;
		height: 16px;
	}

	.main_cat_con_t_percent {
		margin-top: 10px;
		color: #f45e5f;
		font-size: 12px;
		text-align: left;
		width: 100%;
	}

	.main_cat_con_t_percent_low {
    color: #14bb81;
	}

	.main_footer {
		width: 1200px;
		margin-top: 20px;
    .bit-img {
      width: 100%;
      text-align: center;
    }
	}
  .tw-main-footer {
    width: 1200px;
    margin: 90px auto;
    display: none;
    .bit-img {
      width: 100%;
      text-align: center;
      img {
        height: 120px;
      }
    }
    p{
      text-align: center;
      margin: 0!important;
    }
    .bit-title{
      font-size: 24px;
      line-height: 32px;
      padding: 10px;
      color: #16191e;
    }
    .bit-content{
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 1px;
      padding: 0 24px;
    }
  }
	.rise {
		color: #a4454b;
	}

	.fall {
		color: #5ead6f;
	}

  .testImg{
    height: 100%;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    background-position: 50% 0;
    background-repeat: repeat-x;
    transition: .5s;
    text-align: center;
    overflow: hidden;
    background-color: #1e2731;
  }


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 24px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #fffbf4;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #fffbf4;
  }
</style>
