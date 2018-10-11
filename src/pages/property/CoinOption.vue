<template>
	<div class="coinoption" style="height:1233px;">
		<div class="sjx_main">
			<div class="sjx_section">
				<div class="section_title">
					<div class="top-title">
						 {{$t('Estimated Value')}}：
						 {{balance}}
						&nbsp;&nbsp;BTC<span style="font-size:14px;color:#67778c;"> ≈ {{balanceCny}} CNY</span>
						<span>
							<el-checkbox class="hiddeSmallAccount" v-model="hiddeSmallAccount">{{$t('Hide small balances')}}</el-checkbox>
						</span>
						<div class="quikc-nav">
							<router-link class="quikc-link" to='/property/financialrecords' style="margin-right:26px;">{{$t('History')}}</router-link>
							<router-link class="quikc-link" to='/property/withdrawaddressmanagement'>{{$t('Withdraw Address Management')}}</router-link>
						</div>
					</div>
				</div>

				<el-table class="exchange-table coinlist" :data="assetsList" style="width: 100%">
					<el-table-column prop="currency" :label="$t('Coin')">
						<template slot-scope="scope">
							{{scope.row.currency.toUpperCase()}}
						</template>
					</el-table-column>
					<el-table-column prop="available" :label="$t('Available')">
					</el-table-column>
					<el-table-column prop="frozen" :label="$t('On orders')">
					</el-table-column>
					<el-table-column prop="options" :label="$t('Action')" style='position: relative;'>
						<template slot-scope="scope">
							<el-popover popper-class="xm-popover" :disabled="scope.row.is_recharge == 0" offset=0 @hide="hideRechargeDialog" placement="bottom-end" width="765" trigger="click">
								<div>
									<!-- 充币地址 -->
									<p class="popover-titter">{{$t('Charging address')}}</p>
								</div>
								<!-- 充币地址申请 -->
								<button v-if="rechargeInfo.showGetAddressBtn" v-show="btnShow" @click="rechargeCoin" style="cursor:pointer;">{{$t('Application')}}</button>
								<span v-if="rechargeInfo.showAddress">{{rechargeInfo.rechargeAddress}}</span>
								<!-- 复制 -->
								<button v-if="rechargeInfo.showAddress" type="button" v-clipboard:copy="rechargeInfo.rechargeAddress" v-clipboard:success="onCopy" v-clipboard:error="onError" style="cursor:pointer;">{{$t('copy')}}</button>
								<p class="popover-hint">{{$t('Prompt')}}</p>
								<ul>
									<!-- 请勿向上述地址重置任何非BTC资产，否则资产将不可找回 -->
									<li>{{$t('tionePrev')}}
                    {{scope.row.currency.toUpperCase()}}
                    {{$t('tioneNext')}}。</li>
									<!-- 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，6次网络确认后可提币 -->
									<li>{{$t('titwo')}}。</li>
									<!-- 最小充值金额：0.001BTF，小于最小金额的充值将不会上账 -->
									<li>{{$t('tithreePrev')}}
                    <span style="margin:0;" v-if="scope.row.currency.toUpperCase() == 'BTC'">0.001BTC</span>
                    <span style="margin:0;" v-else-if="scope.row.currency.toUpperCase() == 'USDT'">100.00USDT</span>
                    <span style="margin:0;" v-else-if="scope.row.currency.toUpperCase() == 'ETH'">0.01ETH</span>
                    <span style="margin:0;" v-else-if="scope.row.currency.toUpperCase() == 'OMG'">0.1 OMG</span>
                    <span style="margin:0;" v-else>0</span>
                    {{$t('tithreeNext')}}。</li>
									<!-- 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮箱通知您 -->
									<li>{{$t('tifour')}}。</li>
									<!-- 请务必确认电脑及浏览器安全，防止信息被篡改或泄露 -->
									<li>{{$t('tifive')}}。</li>
								</ul>
								<el-button slot="reference" type="text" size="small" class='recharge' :class="{noCoin:scope.row.is_recharge == 0}" @click="openRechargeDialog (scope.row)">{{$t('Deposit')}}</el-button>
							</el-popover>

							<el-dialog title="" class="upcoin" :visible.sync="upcoinDlsg" :show-close="false">
								<div class="xm-pop xm-coin-dlsg">
									<div>
										<p class="pop-titter" style="text-indent:15px;">{{$t('Withdraw Address')}}</p>
									</div>
									<!-- <input type="text" class="pop-titter-div" v-model="Mention" /> -->
									<!-- <div class="pop-titter-div" >{{withdrawInfo.withdrawAddress}}</div> -->
									<el-select class="pop-titter-div" v-model="withdrawInfo.selectedAddress">
										<el-option v-for="item in withdrawInfo.withdrawAddress" :key="item.address" :label="item.address" :value="item.address">
										</el-option>
									</el-select>
									<p style="margin-top: 10px;">{{$t('Amount')}}</p>
									<p style="margin-top: 3px;" class="xm-can-ast">
										<span>{{$t('Avalia')}} :{{withdrawInfo.avaliable}}</span>
										<span>{{$t('Limit')}}:{{withdrawInfo.limitMax}}</span>
									</p>
									<span class="combo">
								<input class="combo combo-text" style="text-indent:15px;" type="number" v-model.number="withdrawInfo.amount" @keyup="calFee">
								<!-- 逻辑修改为点击提币按钮 选择的币种的手续费 限额就已经固定 -->
								<!-- <input class="combo combo-text" style="text-indent:15px;" type="number" v-model.number="withdrawInfo.amount"> -->
								<span style="margin-right: 10px;color:#9ea2f9;">{{currencyUpCase}}</span>
									</span>
									<div style="overflow:hidden;">
										<div id="xm_num">
											<p style="margin-left: 15px;font-size:12px;color: #9ea2f9;">
                        <el-row>
                          <el-col :span="12">
                            <span>{{$t('fee')}}</span>
                          </el-col>
                          <el-col :span="12" style="text-align:right;padding-right:15px">
                            <span>{{withdrawInfo.fee}}-{{withdrawInfo.fee}}</span>
                          </el-col>
                        </el-row>
                      </p>
											<span class="combo">
								<!-- <input class="combo combo-text1" v-model="fee"/>  -->
								<span class="combo combo-text1" style="text-indent:15px;">{{withdrawInfo.fee}}</span>
											<span style="padding-right:15px;line-height:35px;color:#9ea2f9;">
									{{currencyUpCase}}
								</span>

											</span>
										</div>
										<div id="xm_num">
											<p style="margin-left: 15px;font-size:12px;color: #9ea2f9;">{{$t('Actual Amount')}}</p>
											<span class="combo">
										<!-- <input class="combo combo-text2" v-model="readAmount" /> -->
										<span class="combo combo-text2" style="text-indent:15px;">
											{{withdrawInfo.realAmount}}
										</span>
											<span style="padding-right:15px;line-height:35px;color:#9ea2f9;">
											{{currencyUpCase}}
										</span>
											</span>
										</div>
									</div>

									<p class="popover-hint">{{$t('Prompt')}}</p>
									<ul>
										<!-- 最小提币数为 -->
										<li>{{$t('numCoins')}}：
											<span v-if="withdrawInfo.limitMin">{{withdrawInfo.limitMin}}</span>
											<span v-else>0</span>
											。
										</li>
										<!-- 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系 -->
										<li>{{$t('coinOne')}}</li>
										<!-- 请务必确认电脑及浏览器安全，防止信息被篡改或泄露 -->
										<li>{{$t('coinTwo')}}。</li>
									</ul>
									<!-- 提币 -->
									<button
										style="cursor: pointer;position: absolute;top: 306px;left: 570px; height: 50px;width: 200px;background:rgba(76,178,249,0.4);border:1px solid #aeb2ff;border-radius: 2px;color: #fcfcf2;font-size:16px;"
										@click="openVerifyDialog">{{$t('Withdraw')}}</button>
								</div>

							</el-dialog>
							<el-button type="text" style="margin-left:10px;" size="small" class="tibi" :disabled="scope.row.is_recharge == 0" :class="{noCoin : scope.row.is_recharge == 0}" ref='index++' @click='openWithdrawDialog(scope.row)'>{{$t('Withdraw')}}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 模态框 -->
		<el-dialog :title="$t('Fund password')" :visible.sync="withdrawInfo.showVarifyModal" width="394px" @close="resetPop" center>
			<!--<div class="login_div_password login_div_password2">
				<el-input class="pwd_input" type="text" v-model="verifyInfo.userEmail" placeholder="输入邮箱地址"></el-input>
			</div>
			<div class="login_div_password">
				<el-input class="pwd_input" type="password" v-model="verifyInfo.mailCode" placeholder="邮箱验证码" style="width:183px;"></el-input>
				<button class="pwd_btn" :disabled="counting" @click="getTakeCoinVerifyCode">
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

			</div>-->
			<div class="login_div_password">
				<!-- 交易密码填写 -->
				<el-input class="pwd_input" type="password" v-model="verifyInfo.pinCode" :placeholder="$t('pinPassword')"></el-input>
			</div>
			<span slot="footer" class="dialog-footer exchange-foot">
					<el-button class="dialog-confirm-btn" :disabled="withdrawCoinDisabled" @click="withdrawCoin">{{$t('Confirm')}}</el-button>
				</span>
		</el-dialog>

			<transition name="slide-fade">
				<div class="shadow" v-show="showNoLoginTips">
					<!-- 未实名认证弹窗 -->
					<div class="transaction">
						<div><img src="~@/assets/img/jiaoyi.png"/></div>
						<div class="transactionCode">
							<ul>
							<li></li>
							<!-- 请先进行实名认证 -->
							<li v-if="this.$store.state.userInfo.authState == 1">{{$t('realName')}}~</li>
							<!-- 审核未通过请重新进行实名认证 -->
							<li v-else-if="this.$store.state.userInfo.authState == 2">{{$t('Real-name certification failed to re-certify')}}~</li>
							<li>
								<p class="later" @click="hideTips">{{$t('CancelLater')}}</p>
								<!-- 去认证 -->
								<router-link class="toAuthenticate" @click.native="hiddenHide" to='/account/identityverify'>{{$t('Authenticate')}}</router-link>
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
	import { add, sub,mul, div } from '@/static/calute'

	export default {
		name: 'CoinOption',
		data() {
			return {
				// 资产统计
				marketListUSDT: [],
				thisSocketUrl:'',
				thisSocket:null,

				upcoinDlsg: false, // 提币弹窗dlsg
				hiddeSmallAccount: false, // 隐藏小额资产
				btnShow: true,
				counting: false,
				reSendTag: false,
				showNoLoginTips:false,
				balance: 0,
				balanceCny: 0,
				verifyInfo: {
					userEmail: '',
					mailCode: '',
					pinCode: ''
				},
				rechargeInfo: {
					showAddress: false,
					showGetAddressBtn: false,
					rechargeAddress: '',
					plate: ''
				},
				withdrawInfo: {
					showVarifyModal: false,
					selectedAddress: '',
					withdrawAddress: [],
					avaliable: 0,
					fee: 0,
					amount: 0,
					realAmount: 0,
					limitMax: 0,
					limtMin: '',
					currency: ''
				},
				assetsList: [
					// {
					// 	currency: 'BTC',
					// 	available: 182.000000,
					// 	frozen: 182.00000,
					// }
				],
				assetsListCopy: '',
        allCoinsLimits: [],
        withdrawCoinDisabled: false // 输入交易密码后不可连续点击
			}
		},
		components: {
			countdown
		},
		watch:{
			hiddeSmallAccount(){
				let data = this.assetsList
				if(this.hiddeSmallAccount){
					for(let i=data.length -1;i>=0;i--){
						if( (Number(data[i].available) <= 0) && (Number(data[i].frozen) <= 0)){
							data.splice(i,1)
						}
          }
					this.assetsList = data
				}else{
					this.assetsList = JSON.parse(this.assetsListCopy)
				}
			}
		},
		computed: {
			currencyUpCase(){
				return this.withdrawInfo.currency.toUpperCase()
			}
		},
		beforeDestroy() {
			var self = this;
			clearInterval(self.getUserDataTimmer);
		},
		created() {
			this.getAllcoinsLimit()
			this.getPortAll()
			this.getAssetsList()
		},
		mounted() {},
		methods: {
			// 获取所有币种提币限制
			getAllcoinsLimit(){
				let data = {}
				api.withdrawCoinLimit(data).then(res => {
					if(res.error_code == 1000){
						this.allCoinsLimits = res.data
					}
				})
			},
			//获取用户数据
			getUserData() {
			var data = {};
				if(this.$store.getters.loggedIn){
					api.getUserData(data).then(res => {
						if (res.error_code == 1000) {
							// store修改为提交中
							// console.log("res", res);
							this.$store.dispatch("changeAuthState", {
								authState: res.data.authentication_status
							});
						}
					});

				}
			},
			countDownEnd() {
				this.counting = false
				this.reSendTag = true
			},
			onCopy: function(e) {
				// '复制成功'
				this.$message({
          			iconClass: 'successMessage',
					message: this.$t('copySuccess'),
					type: 'sucess',
					duration: 1000
				})
			},
			onError() {
				// '复制失败，请重试'
				this.$message({
          			iconClass: 'errorMessage',
					message: this.$t('copyFailed'),
					type: 'error',
					duration: 1000
				})
			},
			// 重置弹出框
			resetPop() {
				this.addingAddress = false
				this.verifyInfo.pinCode = ''
				this.verifyInfo.mailCode = ''
				this.verifyInfo.userEmail = ''
			},
			// 获取资产列表
			getAssetsList() {
				api.getAssetslist()
					.then(res => {
						if(res.error_code == 1000) {
							this.assetsList = res.assets_list
							this.assetsListCopy = JSON.stringify(res.assets_list)
						}
					}).catch(err => {

					})
			},
			// 点击充币按钮
			openRechargeDialog(row) {
        if(row.is_recharge == 0){
			// 充币部分不开放
          this.$message({
            message: this.$t('notCharge'),
            iconClass: 'errorMessage',
            duration: 1000
          })
        }
				this.rechargeInfo.plate = row.currency
				this.getAddressPre()
				this.btnShow = true
			},
			// 隐藏
			hideRechargeDialog() {
				this.rechargeInfo.showAddress = false
				this.rechargeInfo.showGetAddressBtn = false
				this.rechargeInfo.rechargeAddress = ''
			},
			// 发送邮箱验证码
			getTakeCoinVerifyCode() {
				if(this.counting) return
				this.counting = true
				var data = {
					coin_name_en: this.withdrawInfo.currency,
					userEmai:this.verifyInfo.userEmai
				}
				api.sendWithdrawCode(data)
					.then(res => {
						if(res.error_code == 1000) {
							// '发送成功'
							this.$message({
								iconClass: 'successMessage',
								message: this.$t('Sent successfully'),
								duration: 1000
							})
						}
					}).catch(err => {})
			},
			// 是否已经获取地址
			getAddressPre() {
				var data = {
					plate: this.rechargeInfo.plate
				}
				api.getAddress(data)
					.then(res => {
            if(res.error_code){
              if(res.error_code == 1000) {
                if(res.address_status.status == 0) {
                  this.rechargeInfo.showGetAddressBtn = true
                } else if(res.address_status.status == 1) {
                  this.rechargeInfo.showGetAddressBtn = false
                  this.rechargeInfo.showAddress = true
                  this.rechargeInfo.rechargeAddress = res.address_status.address
                }
              }
            }else{
              this.rechargeInfo.showGetAddressBtn = true
            }
					}).catch((err) => {
          })
			},
			// 获取充币地址
			rechargeCoin() {
				var data = {
					plate: this.rechargeInfo.plate
				}
				api.getRechargeAddress(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.rechargeInfo.rechargeAddress = res.user_address
							this.rechargeInfo.showAddress = true
							this.btnShow = false
						}
					}).catch(err => {
					})
			},
			resetInfo() {
				this.withdrawInfo.selectedAddress = ''
				this.withdrawInfo.avaliable = 0
				this.withdrawInfo.fee = 0
				this.withdrawInfo.amount = 0
				this.withdrawInfo.realAmount = 0
			},
			// 点击提币按钮
			openWithdrawDialog(row) {
				this.getUserData()
				var self = this

				if (this.$store.state.userInfo.authState == 1 || this.$store.getters.authState == 2 ) {
					this.showNoLoginTips = true
					document.body.style.overflow = 'hidden'
					return
				}else if(this.$store.state.userInfo.authState == 3){
					// '资料审核中请稍后再试...'
					this.$message({
						 message:this.$t('review'),
						 iconClass:'errorMessage',
						 type:'error',
						 duration:1000
					})
					return
				}

				// 重置

				this.resetInfo()

				this.withdrawInfo.currency = row.currency
				var data = {
					coin_name: row.currency.toUpperCase()
				}
				api.getWithdrawAddress(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.withdrawInfo.withdrawAddress = res.data
							if(this.withdrawInfo.withdrawAddress.length > 0) {
								this.withdrawInfo.selectedAddress = this.withdrawInfo.withdrawAddress[0].address
							}

							// 这里设置提币限制
							let len = this.allCoinsLimits.length
							if(len) {
								for(let i=0;i<len;i++){
									if(row.currency.toUpperCase() == this.allCoinsLimits[i].symbol){
										this.withdrawInfo.fee = this.allCoinsLimits[i].fee
										this.withdrawInfo.limitMax = this.allCoinsLimits[i].upperLimit
										this.withdrawInfo.limitMin = this.allCoinsLimits[i].lowLimit + '' + row.currency.toUpperCase()
										break
									}
								}
							}

							this.upcoinDlsg = true
						} else if(res.error_code == 4004) {
							// '提币地址为空,3秒后跳转添加提币地址...'
							this.$message({
								message: this.$t('nocoin'),
								iconClass: 'errorMessage',
								type: 'error',
								duration: 1000
							})
							setTimeout(function() {
								self.$router.push({
									name: 'withdrawaddressmanagement',
									query:{coin_name:row.currency.toUpperCase()}
								})
							}, 3000)
						} else if(res.error_code == 4003) {
							this.$message({
								message: res.error_desc,
								iconClass: 'errorMessage',
								type: 'error',
								duration: 1000
							})
							setTimeout(function() {
								self.$router.push({
									name: 'security'
								})
							}, 3000)
						}
						this.withdrawInfo.currency = row.currency
					}).catch(err => {

					})

				var data = {
					currency: row.currency
				}
				api.userAccount(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.withdrawInfo.avaliable = res.available
						}
					}).catch(err => {})
			},
			openVerifyDialog() {
        // 最小限制字段
        // TODO 最大限额 usdt 600000 btc 200 eth 2000 omg 150000
				let coin_name = this.withdrawInfo.currency.toUpperCase()
				let minNum = 0
				let maxNum = 0
				for(let i=0;i<this.allCoinsLimits.length;i++){
					if(coin_name == this.allCoinsLimits[i].symbol.toUpperCase()){
						minNum = this.allCoinsLimits[i].lowLimit
						maxNum = this.allCoinsLimits[i].upperLimit
						break
					}
				}

        if(this.withdrawInfo.amount < minNum){
          // '最小提币数量为200USDT'
          this.$message({
            message: this.$t('minNumber') + minNum + coin_name,
            iconClass: 'errorMessage',
            duration: 1000
          })
          return
        }else if(this.withdrawInfo.amount > maxNum){
                this.$message({
            message: this.$t('maxNumber') + minNum + coin_name,
            iconClass: 'errorMessage',
            duration: 1000
          })
          return
        }
				// }else if(coin_name == 'BTC'){
				// 	if(this.withdrawInfo.amount < minNum){
				// 		// '最小提币数量为0.01BTC'
				// 		this.$message({
				// 			message: this.$t('minNumBtc'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
				// 		return
				// 	}else if(this.withdrawInfo.amount > maxNum){
        //     this.$message({
				// 			message: this.$t('maxNumBtc'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
        //     return
        //   }
				// }else if(coin_name == 'ETH'){
				// 	if(this.withdrawInfo.amount < minNum){
				// 		// '最小提币数量为0.015ETH'
				// 		this.$message({
				// 			message: this.$t('minNumEth'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
				// 		return
				// 	}else if(this.withdrawInfo.amount > maxNum){
        //     this.$message({
				// 			message: this.$t('maxNumEth'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
        //     return
        //   }
				// }else if(coin_name == 'OMG'){
				// 	if(this.withdrawInfo.amount < minNum){
				// 		// '最小提币数量为0.015ETH'
				// 		this.$message({
				// 			message: this.$t('minNumOMG'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
				// 		return
				// 	}else if(this.withdrawInfo.amount > maxNum){
        //     this.$message({
				// 			message: this.$t('maxNumOMG'),
				// 			iconClass: 'errorMessage',
				// 			duration: 1000
				// 		})
        //     return
        //   }
				// }
				// 超出余额
				if(this.withdrawInfo.amount > this.withdrawInfo.avaliable){
					// '可用资金不足'
					this.$message({
						message: this.$t('funds'),
						iconClass: 'errorMessage',
						duration: 1000
					})
					return
				}
				if(this.withdrawInfo.amount >0){
					this.withdrawInfo.showVarifyModal = true
				}else{
					// '请输入正确的提币数量'
					this.$message({
						message: this.$t('correct'),
						iconClass: 'errorMessage',
						duration: 1000
					})
				}
			},
			// 提币
			withdrawCoin() {
        this.withdrawCoinDisabled = true
        debugger
				var data = {
					count: this.withdrawInfo.amount,
					coin_name_en: this.withdrawInfo.currency,
					password: this.verifyInfo.pinCode,
					code: this.verifyInfo.mailCode,
					address: this.withdrawInfo.selectedAddress
				}
				api.withdrawCoin(data)
					.then(res => {
            debugger
            this.withdrawCoinDisabled = false
            debugger
						this.resetPop()
						if(res.error_code == 1000) {
							// '提取成功'
							this.$message({
								iconClass: 'successMessage',
								message: this.$t('extracted'),
								duration: 1000
							})
							this.withdrawInfo.showVarifyModal = false
							this.upcoinDlsg = false
						}else{
              this.withdrawInfo.amount = 0
              this.withdrawInfo.showVarifyModal = false
              this.upcoinDlsg = false
							this.$message({
								iconClass:'errorMessage',
								message:res.error_desc,
								duration:1000
							})
							return
						}
					}).catch(err => {
            this.withdrawCoinDisabled = false
					})
			},
			calFee() {
				// 计算实际到账
				if(this.withdrawInfo.amount <= 0) {
					this.withdrawInfo.realAmount = 0
					return
				}
				this.withdrawInfo.realAmount = sub(this.withdrawInfo.amount, this.withdrawInfo.fee)
				if(this.withdrawInfo.realAmount < 0){
					// this.withdrawInfo.amount = 0
					this.withdrawInfo.realAmount = 0 // 如果实际到账小于0 则实际到账为0
				}
			},
			hiddenHide() {
				document.body.style.overflow = 'auto'
			},
			hideTips() {
				this.showNoLoginTips = false
				document.body.style.overflow = 'auto'
			},

			getPortAll(){
				var data ={

				}
				api.getPortAll(data)
				.then(res => {
					if(res.error_code == 1000){
						this.thisSocketUrl = 'wss://' + res.port_info[0].ip + '/sb/?port=' + res.port_info[0].pan_port
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
				this.thisSocket.onmessage = function(data) {
				var res = JSON.parse(data.data)
				self.marketListUSDT = res.price.usdt
				let num = 0
				let v = 0
        let price = 0
				for(let i=0;i<self.assetsList.length;i++){
					let coinType = self.assetsList[i].currency.toUpperCase()
					if(coinType == "USDT"){
						num += Number(self.assetsList[i].available)
						num += Number(self.assetsList[i].frozen)
						continue
          }

					for(let j=0;j<self.marketListUSDT.length;j++){
						if(coinType == self.marketListUSDT[j].name){
							num += mul(Number(self.assetsList[i].available), self.marketListUSDT[j].order_price)
							num += mul(Number(self.assetsList[i].frozen), self.marketListUSDT[j].order_price)
            }
						if(self.marketListUSDT[j].name == "BTC"){
							v = self.marketListUSDT[j].order_price // btc 对 usdt 的价格
						}
					}
        }
        price = mul(v,6.31) // 对cny的价格
        if(v){
          // 解决NAN bug
          let balance = div(num,v).toFixed(8)
          self.balance = String(balance)
          self.balanceCny = String(mul(balance,price).toFixed(2))

        }else{
          self.balance = 0
          self.balanceCny = 0
        }
			}
			}


		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	li {
		list-style: none;
	}

	.top-title {
		font-size: 18px;
		line-height: 32px;
		height: 32px;
		color: #c2c3ca;
		margin-bottom: 15px;
		position: relative;
		text-align: left;
	}

	// .coinlist {
	// 	text-align: center;
	// }
	.combo {
		background-color: #5056E0;
		border: 0px solid;
		height: 35px;
		display: inline-block;
		white-space: nowrap;
		margin: 10px 15px;
		vertical-align: top;
		// line-height: 30px;
	}

	.combo .combo-text {
		font-size: 18px;
		color: #FFFFFF;
		border: 0px;
		line-height: 20px;
		height: 20px;
		margin: 0;
		padding: 0px 2px;
		vertical-align: baseline;
		border: 0px solid;
		height: 35px;
		width: 675px;
	}

	.combo .combo-text1 {
		font-size: 18px;
		color: #FFFFFF;
		border: 0px;
		margin: 0;
		padding: 0px 2px;
		line-height: 35px;
		border: 0px solid;
		width: 300px;
		outline: none;
		text-align: left;
	}

	.combo .combo-text2 {
		font-size: 18px;
		color: #FFFFFF;
		border: 0px;
		margin: 0;
		line-height: 35px;
		padding: 0px 2px;
		border: 0px solid;
		width: 300px;
		outline: none;
		text-align: left;
	}

	.sjx_main {
		width: 987px;
		height: 1233px;
		background: #191f27;
		overflow: hidden;
	}

	.sjx_section {
		width: 890px;
		margin: 0 auto;
	}

	.section_title {
		border-bottom: 1px solid #232935;
		color: #525d6f;
		font-size: 12px;
		padding-top: 20px;
	}

	.section_title span {
		color: #c8cdd3;
	}

	.quikc-nav {
		font-size: 14px;
		color: #718198;
		float: right;
		.quikc-link,
		.quikc-link:hover,
		.quikc-link:visited {
			color: #718198;
		}
	}
	/* 充币内容 */

	.charge_title {
		width: 915px;
		height: 53px;
		border-bottom: 1px solid #232935;
	}

	.charge_title li {
		line-height: 53px;
		float: left;
	}

	.charge_title li:first-child {
		width: 222px;
		;
		text-indent: 30px;
	}

	.charge_title li:nth-child(2) {
		width: 217px;
		text-align: center;
	}

	.charge_title li:nth-child(3) {
		width: 275px;
		text-align: center;
	}

	.charge_title li:nth-child(4) {
		width: 174px;
		text-align: center;
	}

	.charge li {
		color: #dee1e8;
	}
	/* 提币内容*/

	.charge_title2 li:first-child {
		width: 190px;
	}

	.charge_title2 li:nth-child(2) {
		width: 118px;
	}

	.charge_title2 li:nth-child(3) {
		width: 154px;
	}

	.charge_title2 li:nth-child(4) {
		width: 130px;
	}

	.charge_title2 li:nth-child(5) {
		width: 170px;
		text-align: center;
	}

	.charge_title2 li:nth-child(6) {
		width: 133px;
		text-align: center;
	}
	/* 提币弹窗 */

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
  height: 330px;
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
  height: 163px;
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
