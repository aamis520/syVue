<template>
    <div class="section">
        <div class="basic">
        <h5 class="basic_title">{{$t('Account Info')}}</h5>
        <ul class="message">
            <li>UID:</li>
            <li>{{username}}</li>
        </ul>
        <ul class="message">
            <li>{{$t('Lv')}}:</li>
            <li></li>
            <li class="message_v">{{$t('ordinary')}}</li>
        </ul>
        <ul class="message">
            <li>{{$t('login password')}}:</li>
            <li>********</li>
            <li class="loginpwd" @click="changeSignPwd">{{$t('Change')}}</li>
        </ul>
        <ul class="message">
            <li>{{$t('Fund password')}}:</li>
            <li v-html="defaultPinCode"></li>
            <li v-if="hasSettedPinCode" class="capitalpwd" @click="changePinCodeSet">{{$t('Change')}}</li>
            <li v-if="!hasSettedPinCode" class="notset"  @click="changePinCode">{{$t('Set')}}</li>
        </ul>
        </div>
        <div class="account ">
            <h5 class="basic_title">{{$t('Account Security')}}</h5>
            <!-- <ul class="message">
                <li>谷歌验证:</li>
                <li></li>
                <li class="notset">去绑定</li>
            </ul> -->
            <ul class="message">
                 <li><!--邮箱验证-->{{$t('E-mail verification')}}:</li>
                <li>{{useremail}}</li>
				<!-- 已激活 -->
                <li class="capitalpwd">{{$t('activated')}}</li>
            </ul>
        </div>

		<!-- 模态框 -->
		 <el-dialog :title="$t('Fund password settings')" :visible.sync="pinCodeModalVisible" width="394px" @close="clearDialog" center><!--交易密码设置 -->
			<div class="login_div_password" style="position: relative">
				<!-- <el-tooltip class="item" effect="red" manual :value="isPwdErr" :content="err.errMsg||''" placement="right"> -->
				 <el-input class="pwd_input" type="password" @focus="iptFocus" v-model="signPwd.pwd" :placeholder="$t('Six digits')"></el-input><!-- 六位数字 -->
				<div class="findpassword_error" style="padding-left: 0;z-index:2000;position:absolute;top:15px;left:270px;white-space: nowrap" v-show="isPwdErr">
					<p class="findpassword_error_1" ref='box'>{{inputPwd}}</p>
				</div>
				<!-- </el-tooltip> -->
			</div>
			<div class="login_div_password" style="position: relative">
				<!-- <el-tooltip class="item" effect="red" manual :value="isPwdSameErr" :content="err.errMsg||''" placement="right"> -->
				<el-input class="pwd_input" v-model="signPwd.pwdt" @focus="clearPwdToolTip" type="password" :placeholder="$t('confirm password')"></el-input><!--  确认密码 -->
				<div class="findpassword_error" style="padding-left: 0;z-index:2000;position:absolute;top:15px;left:270px;white-space: nowrap" v-show="isPwdSameErr">
					<p class="findpassword_error_1">{{$t('The password entered twice is inconsistent')}}</p><!-- 两次输入的密码不一致 -->
				</div>
				<!-- </el-tooltip> -->
			</div>
      <div class="cashPassTip">
        <span>{{$t('cashPassTip')}}</span>
      </div>
			<span slot="footer" class="dialog-footer">
        <el-button class="dialog-confirm-btn" @click="savePinCode">{{$t('Confirm')}}</el-button>
      </span>
		</el-dialog>

		<transition name="slide-fade">
			<div class="shadow" v-show="transaction">
				<!-- 交易密码设置成功弹窗 -->
				<div class="transaction">
					<div><img src="~@/assets/img/jiaoyi.png" /></div>
					<div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
						<ul>
							 <li>{{$t('The funds password is set successfully')}}</li><!-- 交易密码设置成功-->
							 <li style="padding:0 10px;">{{$t('Only when real name certification is completed can the transaction be conducted')}}~</li><!-- 只有完成实名认证才可以进行交易 -->
							<li>
								<p class="later" @click="tranHide">{{$t('CancelLater')}}</p>
								<router-link class="toAuthenticate" to='/account/identityverify' @click.native="tnHide">{{$t('Authenticate')}}</router-link><!-- 去认证 -->
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>

		<transition>
			<div class="shadow" v-show="changePinPwd">
				<!-- 交易密码修改弹窗 -->
				<div class="transaction">
					<div><img src="~@/assets/img/jiaoyi.png" /></div>
					<div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
						<ul>
							 <!-- <li>{{$t('The funds password is set successfully')}}</li> 交易密码修改弹窗-->
							 <li style="padding:0 10px;">{{$t('Prohibited')}}~</li><!-- 只有完成实名认证才可以进行交易 -->
							<li>
								<p class="later" @click="tranHide">{{$t('CancelLater')}}</p>
								<router-link class="toAuthenticate" to='/user/findpincode' @click.native="tnHide">{{$t('Confirm')}}</router-link><!-- 去认证 -->
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>

	</div>
</template>
<script>
	import { api } from '@/static/api'
	import { nationalityInfo } from '@/static/dataConfig'
	import { Validate } from '@/static/common'
	import countdown from '@xkeshi/vue-countdown'

	export default {
		name: 'Security',
		props: {

		},
		data() {
			return {
				transaction: false,
				changePinPwd:false,
				pinCodeModalVisible: false,
				payPwdModalVisible: false,
				signPwd: {
					pwd: '',
					pwdt: ''
				},
				isPwdErr: false,
				isPwdSameErr: false,
				err: {},
				inputPwd: ''
			}
		},
		computed: {
			username() {
				return this.$store.getters.username
			},
			useremail() {
				return this.$store.getters.useremail
			},
			hasSettedPinCode() {
				return this.$store.getters.hasSettedPinCode == 1 ? true : false
			},
			defaultPinCode() {
				return this.$store.getters.hasSettedPinCode == 1 ? '********' : ''
			}
		},
		components: {
			countdown
		},
		created() {},
		mounted() {},
		methods: {
			iptFocus() {
				this.isPwdErr = false
			},
			tranHide() {
				this.transaction = false
				this.changePinPwd = false
				document.body.style.overflow = 'auto'
			},
			tnHide() {
				this.transaction = false
				this.changePinPwd =false
				document.body.style.overflow = 'auto'
			},
			changeSignPwd() {
				this.$router.push({
					name: 'findpassword',
					path: '/user/findpassword'
				})
			},
			changePinCodeSet() {

				this.changePinPwd = true
				// this.$router.push({
				// 	name: 'findpincode',
          		// 	path: '/user/findpincode'
				// })
			},
			changePinCode() {
				this.pinCodeModalVisible = true
			},
			cancelChangePinCode() {
				this.pinCodeModalVisible = false
			},
			clearPwdToolTip() {
				this.isPwdSameErr = false
			},
			savePinCode() {
				var self = this
				const reg = {
					pwdRegTwo: /^\d{6}$/
				}
				if(this.signPwd.pwd == '') {
					this.isPwdErr = true
					this.inputPwd = this.$t('spassword')
					return
				} else if(!reg.pwdRegTwo.test(this.signPwd.pwd)) {
					this.isPwdErr = true
					this.inputPwd = this.$t('Password must be 6 digits')
					//'密码必须为6位数字'
					return
				} else if(this.signPwd.pwd != this.signPwd.pwdt) {
					this.isPwdSameErr = true
					return
				}

				var data = {
					password: this.signPwd.pwd,
					password_t: this.signPwd.pwdt
        }
				api.setPinCode(data)
					.then(res => {
						if(res.error_code == 1000) {
              this.pinCodeModalVisible = false
							// this.$message(res.error_desc)
							this.$store.dispatch('completeSettedPincode')
							// this.$message({
							//     message: res.error_desc,
							//     type: 'success'
              // })
              setTimeout(function (){
                self.transaction = true
                console.log('1')
              },500)
							document.body.style.overflow = 'hidden'
						}
					}).catch(err => {
						this.pinCodeModalVisible = false
					})
			},
			clearDialog(){
				this.isPwdSameErr = false
				this.isPwdErr = false
				this.signPwd.pwd = ''
				this.signPwd.pwdt = ''

			}
		}
	}
</script>
<style lang="scss" scoped>
	/* 右侧  */

	.section {
		width: 987px;
		height: 946px;
		float: right;
	}

	.basic {
		width: 987px;
		height: 437px;
		background: #191f27;
		padding: 0 50px;
		box-sizing: border-box;
	}

	.basic_title {
		font-size: 14px;
		color: #c2c3ca;
		line-height: 54px;
	}

	.message {
		height: 91px;
		border-top: 1px solid #202234;
		overflow: hidden;
		list-style: none;
	}

	.message li {
		float: left;
		line-height: 91px;
		color: #a2b2c8;
		font-size: 14px;
		height: 91px;
		cursor: pointer;
	}

	.message li:first-child {
		width: 337px;
	}

	.message li:nth-child(2) {
		width: 340px;
		text-align: right;
	}

	.message li:nth-child(3) {
		width: 210px;
		text-indent: 86px;
	}

	.message_v {
		background: url("~@/assets/img/v.png") 30% 50% no-repeat;
	}

	.loginpwd {
		background: url("~@/assets/img/yes.png") 30% 50% no-repeat;
	}

	.capitalpwd {
		background: url("~@/assets/img/yes.png") 30% 50% no-repeat;
	}
	/* 账号安全 */

	.account {
		width: 987px;
		height: 495px;
		background: #191f27;
		padding: 0 50px;
		box-sizing: border-box;
		margin-top: 15px;
	}

	.notset {
		background: url("~@/assets/img/wrong.png") 30% 50% no-repeat;
	}

	.login_div_user,
	.login_div_password {
		margin-left: auto;
		margin-right: auto;
		margin-top: 25px;
		width: 310px;
		height: 60px;
		background: url('~@/assets/img/index8.png') no-repeat left;
		border-bottom: 1px solid #efeff0;
		padding-left: 30px;
		position: relative;
	}

	.login_div_user input {
		background: none;
		text-align: left;
		font-size: 14px;
		color: #363a3f;
		line-height: 60px;
		width: 270px;
		height: 60px;
		border: none;
	}

	.login_div_password {
		background: url('~@/assets/img/index9.png') no-repeat left;
	}

	.login_div_password input {
		background: none;
		text-align: left;
		font-size: 14px;
		color: #363a3f;
		line-height: 60px;
		width: 270px;
		height: 60px;
		border: none;
	}

	.login_div_other {
		margin-left: auto;
		margin-right: auto;
		width: 310px;
		height: 20px;
		margin-top: 30px;
	}

	.login_div_other_left {
		width: 90px;
		height: 20px;
		font-size: 12px;
		float: left;
		color: #555555;
	}

	.login_div_other_left a {
		width: 12px;
		height: 12px;
		border: 1px solid #4e56f9;
		margin-top: 4px;
		display: block;
		float: left;
	}

	.login_div_other_left_a_click {
		background: url('~@/assets/img/index10.png') no-repeat left;
		border: none !important;
	}

	.login_div_other_left span {
		height: 20px;
		line-height: 20px;
		float: left;
		margin-left: 10px
	}

	.login_div_other_right {
		width: 80px;
		height: 20px;
		text-align: right;
		font-size: 12px;
		float: right;
		color: #8f94fb
	}
	/* 错误提示 */

	.findpassword_error {
		text-align: left;
		color: #fff;
		font-size: 12px;
		padding: 10px 16px;
		padding-left: 25px;
		box-sizing: border-box;
		border-radius: 5px;
		min-width: 20px;
		position: relative;
		min-height: 20px;
		height: auto;
		margin-left: 30px;
		background: #fc3759;
		float: left;
		line-height: 20px;
	}

	.findpassword_error::after {
		content: "";
		width: 0px;
		height: 0px;
		border-top: 6px solid rgba(252, 55, 89, 0);
		border-right: 6px solid #fc3759;
		border-bottom: 6px solid rgba(252, 55, 89, 0);
		border-left: 6px solid rgba(252, 55, 89, 0);
		position: absolute;
		left: 0px;
		margin-left: -12px;
		top: 14px;
	}

	.findpassword_error_1 {
		text-indent: 16px;
	}

	// 交易密码设置成功弹窗
	html,
	body {
		height: 100%;
	}

	.shadow {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 0;
	}

	.transaction {
		width: 330px;
		min-height: 330px;
		position: absolute;
		top: 45%;
		left: 50%;
		margin: -165px 0 0 -165px;
		z-index: 100;
		border-radius: 2px;
		overflow: hidden;
	}

	.transaction img {
		width: 330px;
		display: block;
		height: 167px;
	}

	.transactionCode {
		background: #fff;
		// min-height: 163px;
		overflow: hidden;
	}

	.transactionCode ul li {
		list-style: none;
	}

	.transactionCode ul li:first-child {
		text-align: center;
		margin-top: 30px;
		font-size: 14px;
		color: #262f3b;
	}

	.transactionCode ul li:nth-child(2) {
		text-align: center;
		font-size: 14px;
		margin-top: 6px;
		color: #4c54f9;
	}

	.transactionCode ul li:last-child {
		margin-top: 25px;
		height: 30px;
	}

	.later {
		background: #b6b7b7;
		margin-left: 42px;
		width: 108px;
		height: 30px;
		font-size: 14px;
		float: left;
		text-align: center;
		line-height: 30px;
		color: #fcfcf2;
		cursor: pointer;
	}

	.toAuthenticate {
		background: #4c54f9;
		margin-left: 26.4px;
		width: 108px;
		height: 30px;
		font-size: 14px;
		float: left;
		text-align: center;
		line-height: 30px;
		color: #fcfcf2;
		cursor: pointer;
	}
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */

	.slide-fade-enter-active {
		transition: all .3s ease-out 0.5s;
	}

	.slide-fade-leave-active {
		transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.slide-fade-enter,
	.slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */

	{
		transform: translateY(-20px);
		opacity: 0;
  }

  .cashPassTip{
    padding: 17px;
    span {
      font-size: 12px;
      color: #fc3759;
    }
  }
</style>
