<template>
    <div class="sjx_main addressmanagement">
      <div class="sjx_section">
        <div class="sjx_sec1">
          <div class="section_title">
            <router-link class="option" to="/property/coinoption" style="outline:none;color:#67778c;">{{$t('Assets Center')}}</router-link>
            <i class="el-icon-arrow-right"></i><span>{{$t('Withdraw Address Management')}}</span></div>
          <div class="address">
            <div class="address_left">
              <p>{{$t('Coin')}}</p>
              <el-select class="coin-selecter" v-model="selectedCoin" :placeholder="$t('pleaseChoose')">
                <el-option class="def"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="address_right">
              <p>{{$t('Address')}}</p>
              <div class="right_sec">
                <input type="text" class="address-input" style="text-indent:14px;" v-model="verifyInfo.newAddress"/>
                <button @click="preAddAddress">{{$t('Add')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sjx_section2">
        <div class="address_list">
          <div class="address_list_title">{{$t('Address list')}}</div>
          <div class="address_list_section">
            <ul class="clear-head">
              <li>
                <p>{{$t('Coin')}}</p>
              </li>
              <li>
                <p>{{$t('Address')}}</p>
              </li>
              <li>
                <p>{{$t('Action')}}</p>
              </li>
            </ul>
            <ul class="clear" v-for="(item,index) in addressList" :key="index">
              <li>
                <p>{{item.plate_en}}</p>
              </li>
              <li >
                <p>{{item.address}}</p>
              </li>
              <li>
                <p style="color: #5e5fff;cursor: pointer;" @click="deleteAddress(item,index)">{{$t('delete')}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 模态框 -->
      <el-dialog
        :title="$t('Security authentication')"
        :visible.sync="addingAddress"
		@close="clearDialog"
        width="394px"
        center>
        <div class="login_div_password login_div_password2">
          <el-input class="pwd_input" type="text" v-model="useremail" disabled="disabled" :placeholder="$t('Email')" style="color:#606266;"></el-input>
        </div>
        <div class="login_div_password" style="position:relative;">
            <el-input class="pwd_input" type="password" v-model="verifyInfo.mailCode" @focus="hideIsCodeErr" :placeholder="$t('E-mailcode')" style="width:183px;"></el-input>
            <button class="pwd_btn" :disabled="counting" @click="getTakeCoinVerifyCode" >
                <countdown v-if="counting"
                           :time="60000"
                           :leadingZero="false"
                           @countdownend="countDownEnd">
                  <template slot-scope="props" ><span v-if="props.seconds">{{ props.seconds }}{{"s" + $t('Resend')}}</span>
                    <span  v-else>{{$t('60s Resend')}}</span>
                  </template>
                </countdown>
                <span v-else-if="reSendTag">{{$t('Resend')}}</span>
                <span v-else>{{$t('Send code')}}</span>
              </button>

				<div class="findpassword_error" style="padding-left: 0;z-index:2000;position:absolute;top:10px;left:350px;min-width:105px;white-space:nowrap;" v-show="isCodeErr">
					<!-- 请输入验证码 -->
					<p class="findpassword_error_1" ref='box' style="min-width:20px;">{{$t('scode')}}</p>
				</div>
			</div>
			<div class="login_div_password"  style="position:relative;">
				<el-input class="pwd_input" type="password" v-model="verifyInfo.pinCode" @focus="hidePinCodeErr" :placeholder="$t('pinPassword')"></el-input>
				<div class="findpassword_error" style="padding-left: 0;z-index:2000;position:absolute;top:10px;left:350px;min-width:118px;white-space:nowrap;" v-show="isPinCodeErr">
					<!-- 请输入交易密码 -->
					<p class="findpassword_error_1" ref='box' style="min-width:20px;">{{$t('pinPassword')}}</p>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
        <el-button class="dialog-confirm-btn" @click="addAddress">{{$t('Confirm')}}</el-button>
	    </span>
		</el-dialog>

		<transition name="slide-fade">
			<div class="shadow" v-show="showSetPinCodeTips">
				<!-- 未认证操作 -->
				<div class="transaction">
				<div><img src="~@/assets/img/jiaoyi.png"/></div>
				<div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
					<ul>
						<!-- 请先设置交易密码 -->
					<li>{{$t('Please set up funds password first')}}</li>
					<!-- 只有完成实名认证才可以进行交易 -->
					<li style="padding:0 10px;">{{$t('Only when real name certification is completed can the transaction be conducted')}}~</li>
					<li>
						<p class="later" @click="hideTips">{{$t('CancelLater')}}</p>
						<router-link class="toAuthenticate" @click.native="hiddenHide" to='/account/security'>{{$t('goSet')}}</router-link>
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
	import countdown from '@xkeshi/vue-countdown'
	export default {
		name: 'WithDrawAddressManagement',
		data() {
			return {
				isPinCodeErr: false,
				isCodeErr: false,
				counting: false,
				addingAddress: false,
				showSetPinCodeTips:false,
				userEmail: '',
				reSendTag: false,
				verifyInfo: {
					newAddress: '',
					pinCode: '',
					mailCode: ''
				},
				options: [],
				selectedCoin: 'ETH',
				addressList: []
			}
		},
		computed: {
			useremail() {
				return this.$store.getters.useremail
			}
		},
		components: {
			countdown
		},
		created() {
			this.selectedCoin = this.$route.query.coin_name
      this.getCoinList()
			this.getAddressList()
		},
		methods: {
			countDownEnd() {
				this.counting = false
				this.reSendTag = true
      },
      // 新增获取所有币种列表
      getCoinList() {
        let data = {}
        api.getCoinList(data).then(res => {
          console.log(res)
          if(res.error_code == 1000){
            let list = res.data
            let newArr = []
            for(let i=0;i<list.length;i++){
              let name = list[i].plate_en.toUpperCase()
              newArr.push({
                label: name,
                value: name
              })
            }
            this.options = newArr.reverse()
          }
        })
      },
			// 获取提币地址列表
			getAddressList() {
				api.withdrawAddressList()
					.then(res => {
						if(res.error_code == 1000) {
							this.addressList = res.data
						} else {
							this.$message({
								message: res.error_desc,
                                iconClass: 'errorMessage',
								type: 'error',
								duration: 800
							})
						}
					}).catch(err => {})
			},

			// 发送验证邮件
			getTakeCoinVerifyCode() {
				if(this.counting) return
				this.counting = true
				api.getTakeCoinVerifyCode()
					.then(res => {
						if(res.error_code == 1000) {
							this.$message({
								// '发送成功'
								message: this.$t('Sent successfully'),
                				iconClass: 'successMessage',
								type: 'success',
								duration: 800
							})
						}
					}).catch(err => {})
			},
			// 弹出验证窗口
			preAddAddress() {
        if(!this.selectedCoin){
          this.$message({
            message: this.$t('chooseChoinTip'),
            iconClass: 'errorMessage',
            type: 'error',
            duration: 1000
          })
          return
        }

				for(let i=0;i<this.addressList.length;i++){
					if(this.addressList[i].plate_en === this.selectedCoin && this.addressList[i].address === this.verifyInfo.newAddress){
                         this.$message({
							//  '请勿添加重复的提币地址'
							message: this.$t('noRepeat'),
							iconClass: 'errorMessage',
							type: 'error',
							duration: 1000
						})
						return
					}
					// return
				}

				// if(this.verifyInfo.newAddress == this.addressList[0].address){
				// 	alert(1)
				// }
				if(this.$store.getters.hasSettedPinCode == 0){
					this.showSetPinCodeTips = true
					return
				}else if(this.verifyInfo.newAddress == '') {
					this.$message({
						// '请先填写提币地址'
						message: this.$t('fillIn'),
            			iconClass: 'errorMessage',
						type: 'error',
						duration: 800
					})
					return
				}

				this.addingAddress = true
			},
			// 重置弹出框
			resetPop() {
				this.addingAddress = false
				this.verifyInfo.pinCode = ''
				this.verifyInfo.mailCode = ''
				this.verifyInfo.userEmail = ''
			},
			clearDialog(){
				this.resetPop()
				this.isCodeErr = false
				this.isPinCodeErr = false
			},
			// 添加地址
			addAddress() {

				//表单验证
				if(this.verifyInfo.mailCode == '') {
					this.isCodeErr = true
					return
				} else if(this.verifyInfo.pinCode == '') {
					this.isPinCodeErr = true
					return
				}

				var data = {
					coin_name: this.selectedCoin, // 币英文名称
					address: this.verifyInfo.newAddress, // 提币地址
					password: this.verifyInfo.pinCode, // 交易密码
					code: this.verifyInfo.mailCode //邮箱验证码
				}
				api.addWithdrawAddress(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.$message({
								// '添加成功'
								message: this.$t('success'),
                                iconClass: 'successMessage',
								type: 'success',
								duration: 800
							})
							this.counting = false
							this.resetPop()
							let self = this
							let getAddressListTimer = setTimeout(() => {
								self.getAddressList()

							}, 1000);
						} else {
							this.$message({
								message: res.error_desc,
                                iconClass: 'errorMessage',
								type: 'error',
								duration: 800
							})
						}
					})
			},
			// 删除地址
			deleteAddress(item,index) {
				var data = {
					address_id: item.address_id
				}
				api.deleteWithdrawAddress(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.$message({
								//  '删除成功'
								message: this.$t('deleted'),
                                iconClass: 'successMessage',
								type: 'success',
								duration: 800
              })
              this.addressList.splice(index,1)
							// this.getAddressList()
						}
					}).catch(err => {

					})
			},
			hideIsCodeErr() {
				this.isCodeErr = false
			},
			hidePinCodeErr() {
				this.isPinCodeErr = false
			},
			hiddenHide(){
                document.body.style.overflow = 'auto'
			},
			hideTips() {
				this.showSetPinCodeTips = false
				document.body.style.overflow = 'auto'
			},

		}
	}
</script>
<style rel="stylesheet/scss" scoped>
	li {
		list-style: none;
	}

	.zuo {
		width: 200px;
		height: 940px;
		background: #1a232c;
		float: left;
	}

	.sjx_main {
		width: 987px;
		height: 1233px;
		float: right;
	}

	.sjx_section {
		width: 987px;
		height: 246px;
		background: #191f27;
	}

	.sjx_sec1 {
		width: 890px;
		margin: 0 auto;
		height: 246px;
	}

	.section_title {
		line-height: 87px;
		border-bottom: 1px solid #232935;
		color: #525d6f;
		font-size: 12px;
	}

	.section_title span {
		color: #c8cdd3;
	}

	.address {
		margin-top: 17px;
		height: 130px;
	}

	.address_left,
	.address_right {
		float: left;
	}

	.address_left {
		width: 126px;
	}

	.address_left .el-select {
		width: 124px;
		height: 46px;
		border: 1px solid #444c57;
		line-height: 46px;
		background: #151922;
	}

	.address_left p {
		font-size: 12px;
		color: #67778c;
		line-height: 40px;
	}

	.address_right {
		width: 637px;
		margin-left: 15px;
	}

	.address_right p {
		font-size: 12px;
		color: #67778c;
		line-height: 40px;
	}

	.address_right input {
		width: 485px;
		height: 42px;
		background: #151922;
		border: 1px solid #444c57;
		color: #f5feed;
	}

	.address_right button {
		width: 100px;
		height: 46px;
		background: #585efa;
		border: none;
		color: #f5feed;
		margin-left: 12px;
		cursor: pointer;
	}

	.sjx_section2 {
		width: 987px;
		height: 972px;
		background: #191f27;
		margin-top: 15px;
	}


	.address_list {
		width: 890px;
		margin: 0 auto;
		height: 680px;
	}

	.address_list_title {
		width: 890px;
		height: 89px;
		line-height: 89px;
		border-bottom: 1px solid #232935;
		color: #67778c;
		font-size: 15px;
	}

	.address_list_section {
		width: 890px;
		border-bottom: 1px solid #232935;
	}

	.clear {
		overflow: hidden;
		border-bottom: 1px solid #232935;
	}

	.clear li {
		float: left;
		height: 80px;
		line-height: 80px;
		/* border-top: 1px solid #232935; */
	}

	.clear li:first-child {
		width: 100px;
		text-align: center;
	}

	.clear li:nth-child(2) {
		width: 660px;
	}

	.clear li:nth-child(3) {
		width: 130px;
		text-align: center;
	}

	.clear li p:first-child {
		line-height: 80px;
		color: #d0d1d2;
		font-size: 12px;
	}

	.clear li p:nth-child(2) {
		line-height: 80px;
		color: red;
		font-size: 14px;
	}

	.address_list_section_head {
		width: 890px;
		border-bottom: 1px solid #232935;
	}

	.clear-head {
		overflow: hidden;
		border: none!important;
	}

	.clear-head li {
		float: left;
	}

	.clear-head li:first-child {
		width: 100px;
		text-align: center;
	}

	.clear-head li:nth-child(2) {
		width: 660px;
	}

	.clear-head li:nth-child(3) {
		width: 130px;
		text-align: center;
	}

	.clear-head li p:first-child {
		line-height: 40px;
		color: #67778c;
		font-size: 12px;
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
		color: red;
		line-height: 60px;
		width: 270px;
		height: 60px;
		border: none;
	}

	.login_div_password {
		background: url('~@/assets/img/index9.png') no-repeat left;
	}

	.login_div_password2 {
		background: url('~@/assets/img/email.png') no-repeat left;
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

	.pwd_btn {
		width: 88px;
		height: 37px;
		border: 1px solid #5d5dfb;
		color: #5d5dfb;
		font-size: 12px;
		background: #fff;
	}

	.pwd_btn:disabled {
		color: #ccc;
		border: 1px solid #CCC;
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
.shadow {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 30;
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
  /* height: 163px; */
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
</style>
