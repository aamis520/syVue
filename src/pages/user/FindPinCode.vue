<template>
  <div>
    <div class="findpassword_main">

      <div class="findpassword_main_div">
        <div class="sjx_main">
          <div class="findpassword_main_div_top">
            <div class="breadcrumb">
              <!-- <a href="">首页 > </a>找回密码 -->
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item class="sjx_yangshi" :to="{ path: '/account/security' }">{{$t('Personal center')}}</el-breadcrumb-item>
				<!-- 修改交易密码 -->
                <el-breadcrumb-item class="sjx_yangshi2">{{$t('pinpassword')}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <div class="step1" v-if="curStep == 1">
            <div class="findpassword_main_div_img1"></div>
            <div class="findpwdzi">
              <ul>
				  <!-- 确认账号 -->
                <li :class="this.$store.getters.getLang == 'en-us'? 'en' : 'cn'">{{$t('confirmUser')}}</li>
				<!-- 邮箱验证 -->
                <li :class="this.$store.getters.getLang == 'en-us'? 'emailEn': 'emailCn'">{{$t('E-mail verification')}}</li>
				<!-- 修改密码 -->
                <li :class="this.$store.getters.getLang == 'en-us'? 'pwdEn': 'pwdCn'">{{$t('change Password')}}</li>
              </ul>
            </div>
            <div class="findpassword_main_div_email">
				<!-- 电子邮箱 -->
              <div class="findpassword_main_div_email_left">{{$t('E-mail')}}</div>
              <p class="findpinword">{{email}}</p>
              <!-- <div class="findpassword_main_div_email_right">

              </div> -->
						</div>
						<div class="findpassword_main_div_code">
							<!-- 验证码 -->
							<div class="findpassword_main_div_code_left">{{$t('Verification code')}}</div>
							<div class="findpassword_main_div_code_right">
								<input style="text-indent:15px;" type="text" v-model="verifyCode" @focus="get_focus">
							</div>
							<img :src="imgCodeUrl">
							<!-- 换一张 -->
							<a @click="another" style="cursor: pointer;">{{$t('Change a sheet')}}</a>
							<transition name="fade">
								<!-- 你输入的验证码错误 -->
								<div class="findpassword_error findpassword_error_3" v-show="isVerifyCodeErr">{{$t('codeErr')}}</div>
							</transition>
						</div>
						<a class="findpassword_main_div_btn" @click="toStep2">
							<!-- 下一步 -->
							<div>{{$t('Next')}}</div>
						</a>
					</div>
					<div class="step2" v-if="curStep == 2">
						<div class="findpasswordtwo_main_div_img2"></div>
						<div class="findpwdzi">
							<ul>
								<!-- 确认账号 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'en' : 'cn'">{{$t('confirmUser')}}</li>
								<!-- 邮箱验证 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'emailEn': 'emailCn'">{{$t('E-mail verification')}}</li>
								<!-- 修改密码 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'pwdEn': 'pwdCn'">{{$t('change Password')}}</li>
							</ul>
						</div>
						<!-- 为了您的账号安全，请完成身份认证 -->
						<div class="findpasswordtwo_main_ts">{{$t('youCom')}}</div>
						<div class="findpassword_main_div_email findpasswordtwo_email">
							<div class="findpassword_main_div_email_left">{{$t('E-mail')}}</div>
							<div class="findpasswordtwo_email_right">{{email}}</div>
						</div>
						<div class="findpassword_main_div_code findpasswordtwo_code">
							<div class="findpassword_main_div_code_left">{{$t('Verification code')}}</div>
							<div class="findpassword_main_div_email_right">
								<input style="text-indent:15px;" type="text" v-model="code" @focus="get_focus">
							</div>
							<!-- <button class="send" @click="sjx_send">发送验证码</button> -->
							<button class="send" :disabled="counting" @click="sjx_send">
								<countdown v-if="counting"
										:time="60000"
										:leadingZero="false"
										@countdownend="countDownEnd">
								<template slot-scope="props"><span v-if="props.seconds">{{ props.seconds
									}}{{"s" + $t('Resend')}}</span>
									<span v-else>{{$t('60s Resend')}}</span>
								</template>
								</countdown>
								<span v-else-if="reSendTag">{{$t('Resend')}}</span>
								<span v-else>{{$t('Send code')}}</span>
							</button>
							<transition name="fade">
								<div class="findpassword_error findpassword_error_3" ref="isVerCode" v-show="isVerifyCodeErr">{{$t('codeErr')}}</div>
							</transition>
						</div>
						<a class="findpassword_main_div_btn" @click="toStep3">
							<div>{{$t('Next')}}</div>
						</a>
					</div>
					<div class="step3" v-if="curStep == 3">
						<div class="findpasswordtwo_main_div_img3"></div>
						<div class="findpwdzi">
							<ul>
								<!-- 确认账号 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'en' : 'cn'">{{$t('confirmUser')}}</li>
								<!-- 邮箱验证 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'emailEn': 'emailCn'">{{$t('E-mail verification')}}</li>
								<!-- 修改密码 -->
								<li :class="this.$store.getters.getLang == 'en-us'? 'pwdEn': 'pwdCn'">{{$t('change Password')}}</li>
							</ul>
						</div>
						<!-- 您正在找回的账户是 -->
						<div class="findpasswordtwo_main_ts">{{$t('youRecover')}}：<span>{{email}}</span></div>
						<div class="findpassword_main_div_email findpasswordtwo_email">
							<!-- 新交易密码 -->
							<span class="mi">{{$t('newPwd')}}</span>
							<input class="sjx_ipt" type="password" v-model="pwd" @focus="get_focus">
							<transition name="fade">
								<div class="findpassword_error" style="padding-left: 0;width:218px;" v-show="isEmailErr">
									<!-- 长度为6~14个字符 -->
									<p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">{{$t('pwdLang')}}</p>
								</div>
							</transition>
						</div>

						<div class="findpassword_main_div_email findpasswordtwo_email ">
							<!-- 确认新密码 -->
							<span class="mi">{{$t('comPwd')}}</span>
							<input class="sjx_ipt" type="password" v-model="pwd_t" @focus="get_focus">
							<transition name="fade">
								<div class="findpassword_error" style="padding-left: 0;" v-show="isVerifyCodeErr">
									<!-- 两次输入的密码不一致 -->
								<p class="findpassword_error_1">{{$t('The password entered twice is inconsistent')}}</p>
								</div>
							</transition>
						</div>
						<!--<a class="findpassword_main_div_btn" @click="sjx_ok">确定</a>-->
						<a class="findpassword_main_div_btn" @click="sjx_ok">
							<div>{{$t('Confirm')}}</div>
						</a>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import { api } from '@/utils/api'
	import countdown from '@xkeshi/vue-countdown'

	export default {
		name: 'FindPinCode',
		props: {},
		data() {
			return {
				counting: false,
				curStep: 1,
				email: this.$store.getters.useremail,
				imgCodeUrl: api.getImgCode(1002),
				verifyCode: '',
				pwd: '',
				pwd_t: '',
				isEmailErr: false,
				isVerifyCodeErr: false,
				code: '',
				reSendTag: false
			}
		},
		components: {
			countdown
		},
		created() {
			//    this.getImg()
		},
		mounted() {

		},
		watch: {},
		methods: {
			countDownEnd() {
				this.reSendTag = true
				this.counting = false
			},
			toStep2() {
				// this.curStep = 2
//				if(this.email == ''){
//					return
//				}
				var data = {
					email: this.$store.getters.useremail,
					code: this.verifyCode,
				}
				//找回密码第一步邮箱和验证码验证 2009 邮箱未注册
				api.checkImgCode(data).then(res => {
					if(res.error_code == 2008 || res.error_code == 2003 || res.error_code == 2009) {
						this.isEmailErr = true;
					} else if(res.error_code == 3010 || res.error_code == 3001) {
						this.isVerifyCodeErr = true;
						this.imgCodeUrl = api.getImgCode(1002);
					} else {
						this.isEmailErr = false;
						this.isEmailErr = false;
						this.curStep = 2;
					}
				})

			},
			//邮箱验证码验证
			toStep3() {
				// this.curStep = 3
				var data = {
					code: this.code
				}
				api.checkDealCode(data).then(res => {
					if (res.error_code == 3007) {
						this.isVerifyCodeErr = true
						// "请输入验证码"
						this.$refs.isVerCode.innerHTML = this.$t('scode')
					} else if (res.error_code == 3006) {
						this.isVerifyCodeErr = true
						// "验证码输入错误"
						this.$refs.isVerCode.innerHTML = this.$t('verCode')
					} else if (res.error_code == 3005) {
						this.isVerifyCodeErr = true
						// "验证码已过期"
						this.$refs.isVerCode.innerHTML = this.$t('codeExp')
					} else {
						this.curStep = 3
					}
				})
			},
			another() {
				this.imgCodeUrl = api.getImgCode(1002)
			},
			//发送邮件
			sjx_send() {
				if(this.counting) {
					return
				}
				this.counting = true
				var data = {
					email: this.email
				}
				api.getPinCodeVerifyCode(data).then(res => {
					if(res.error_code == 1000) {
						this.$message({
							// '邮件已发送'
							message: this.$t('messSent'),
              				iconClass: 'successMessage',
							type: 'success',
							duration: 1000
						})
					}
				})
			},
			//重新设置密码
			sjx_ok() {
				var data = {
					password: this.pwd,
					password_t: this.pwd_t
				}
				api.modifyDealPwd(data).then(res => {
					if((res.error_code != 1000)) {
						this.isEmailErr = true
						this.isVerifyCodeErr = true
					} else {
						this.isEmailErr = false
						this.isVerifyCodeErr = false
						this.$message({
							// '密码修改成功!'
							message: this.$t('pwdreset'),
              				iconClass: 'successMessage',
							type: 'success',
							duration: 1000
						})
						this.$router.push({
							name: 'security',
							path: '/account/security'
						})
					}
				})
			},
			get_focus() {
				this.isEmailErr = false
				this.isVerifyCodeErr = false
			}

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel='stylesheet/scss' scoped>
	.findpassword_main {
		width: 100%;
		height: 1020px;
		background: #151922;
		overflow: hidden
	}

	.findpassword_main_div {
		background: #191f27;
		width: 1200px;
		height: 940px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 40px;
	}

	.sjx_main {
		width: 1100px;
		margin: 0 auto;
		height: 940px;
	}

	.findpassword_main_div_top {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #202234;
		text-align: left;
		font-size: 14px;
		color: #adaeb6;
		padding-top: 14px;
	}

	.findpassword_main_div_top a {
		color: #3a4556;
	}

	.findpassword_main_div_img1,
	.findpasswordtwo_main_div_img,
	.findpasswordsuccess_img {
		margin-left: 140px;
		background: url('~@/assets/img/findpassword1.png') no-repeat center;
		width: 770px;
		margin-top: 76px;
		height: 100px;
	}

	.findpassword_main_div_code {
		width: 1000px;
		line-height: 50px;
		height: 50px;
		margin-top: 30px;
		margin-left: 50px;
	}
	.findpassword_main_div_email{
		width: 1000px;
		line-height: 50px;
		height: 50px;
		margin-top: 50px;
		margin-left: 50px;
	}

	.findpassword_main_div_email_left,
	.findpassword_main_div_code_left {
		width: 135px;
		float: left;
		text-align: left;
		color: #a2b2c8;
		line-height: 50px;
		height: 50px;
		font-size: 14px;
	}

	.findpassword_main_div_code_right {
		width: 300px !important;
		float: left;
	}

	.send {
		width: 115px;
		height: 50px;
		border: 1px solid #4c54f9;
		color: #4c54f9;
		text-align: center;
		line-height: 47px;
		background: #1a232c;
		float: left;
		margin-left: 24px;
		cursor: pointer;
	}

	.findpasswordsuccess_main_div_code_right {
		width: 510px;
	}

	.findpassword_main_div_code img {
		float: left;
		margin-left: 10px;
		height: 50px;
		width: 125px;
	}

	.findpassword_main_div_code a {
		float: left;
		height: 50px;
		min-width: 60px;
		float: left;
		margin-left: 15px;
		color: #4c54f9;
		font-size: 14px;
	}

	.findpassword_main_div_btn {
		width: 510px;
		height: 50px;
		line-height: 50px;
		color: white;
		display: block;
		background: #4c54f9;
		margin-top: 50px;
		margin-left: 145px;
		text-align: center;
	}

	.findpasswordtwo_main_div_img2 {
		background: url('~@/assets/img/findpassword2.png') no-repeat center;
		margin-left: 140px;
		width: 770px;
		margin-top: 76px;
		height: 100px;
	}

	.findpasswordtwo_main_div_img3 {
		background: url('~@/assets/img/findpassword3.png') no-repeat center;
		margin-left: 140px;
		width: 770px;
		margin-top: 76px;
		height: 100px;
	}

	.findpasswordtwo_main_ts {
		width: 100%;
		padding-left: 155px;
		color: #708bb0;
		text-align: left;
		margin-top: 40px;
		font-size: 14px;
	}

	.findpasswordtwo_email {
		margin-top: 50px
	}

	.findpinword{
		float: left;
		color: #c2c3ca;
	}
	.findpasswordtwo_code {
		margin-top: 30px
	}

	.findpasswordtwo_email_right {
		width: 360px;
		color: #c2c3ca;
		height: 50px;
		line-height: 50px;
		text-align: left;
		font-size: 16px;
		float: left;
	}

	.findpassword_main_div_btn {
		width: 510px;
		height: 50px;
		line-height: 50px;
		color: white;
		display: block;
		background: #4c54f9;
		margin-top: 50px;
		margin-left: 185px;
		text-align: center;
	}

	.findpassword_main_div_btn:hover div {
		background: rgba(255, 255, 255, 0.1);
	}

	.findpassword_main_div_btn:active div {
		background: rgba(0, 0, 0, 0.1);
	}

	.findpasswordthree_desc {
		width: 100%;
		height: 55px;
		background: url('~@/assets/img/findpassword4.png') no-repeat center;
		margin-top: 175px;
	}

	.findpasswordsuccess_btn {
		margin-left: auto;
		margin-top: 90px;
	}

	.findpasswordsuccess_img {
		background: url('~@/assets/img/findpassword3.png') no-repeat center;
	}

	.findpassword_error {
		text-align: left;
		color: #8faacc;
		font-size: 12px;
		padding: 13px 16px;
		padding-left: 25px;
		box-sizing: border-box;
		border-radius: 2px;
		width: 180px;
		position: relative;
		min-height: 50px;
		height: auto;
		margin-left: 30px;
		background: #3a4a5e;
		float: left;
		line-height: 24px;
	}

	.findpassword_error::after {
		content: "";
		width: 0px;
		height: 0px;
		border-top: 6px solid rgba(0, 0, 0, 0);
		border-right: 6px solid #3a4a5e;
		border-bottom: 6px solid rgba(0, 0, 0, 0);
		border-left: 6px solid rgba(0, 0, 0, 0);
		position: absolute;
		left: 0px;
		margin-left: -12px;
		top: 10px;
	}

	.findpassword_error_1 {
		background: #3a4a5e url('~@/assets/img/findpassword5.png') no-repeat 10px 6px;
		text-indent: 30px;
	}

	.findpassword_error_2 {
		background: #3a4a5e url('~@/assets/img/findpassword6.png') no-repeat 10px 6px;
		text-indent: 30px;
	}

	.findpassword_error_3 {
		background: #3a4a5e url('~@/assets/img/findpassword7.png') no-repeat 10px 20px;
	}

	.findpwdzi {
		color: #708bb0;
		font-size: 12px;
	}

	.findpwdzi ul {
		overflow: hidden;
	}

	.findpwdzi ul li {
		list-style: none;
		float: left;
	}

	.cn{
		margin-left: 158px;
	}
	.en{
		margin-left: 125px;
	}

	.emailEn{
        margin-left: 240px;
	}
	.emailCn {
		margin-left: 300px;
	}
	.pwdEn{
		margin-left: 250px;
	}

	.pwdCn {
		margin-left: 300px;
	}

	.mi {
		display: block;
		width: 135px;
		height: 50px;
		float: left;
		line-height: 50px;
		color: #a2b2c8;
	}

	.sjx_ipt {
		width: 505px;
		height: 48px;
		border: 1px solid #384658;
		float: left;
		background: #151920;
		color: #a2b2c8;
		text-indent: 15px;
	}

	.send:disabled {
		color: #ccc;
		border: 1px solid #CCC;
	}
	 /* 提示过度动画  */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
