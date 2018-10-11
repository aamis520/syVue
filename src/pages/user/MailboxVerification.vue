<template>
    <div class="mailbox">
        <div class="verification">
            <div class="imgCode">
                <img src="~@/assets/img/mailbox.png" />
            </div>

            <div class="emailCode">
                <ul>
                    <li :class="this.lang != 'zh-cn'? 'liEn' : 'liCn'"></li>
                    <!-- 邮箱验证 -->
                    <li style="padding:0 10px;" v-if="query.type == 'email'">{{$t('E-mail verification')}}</li>
                    <li style="padding:0 10px;" v-if="query.type == 'phone'">手机验证</li>
                    <li :class="this.lang != 'zh-cn'? 'liEn' : 'liCn'"></li>
                </ul>
            </div>

            <div style="text-align:left;font-size:16px;color:#fefefe;margin-top:130px;" v-if="query.type == 'email'">
                <!-- 发送了一封验证邮件，请按照邮件中的提示完成您的注册 -->
                <!-- UNIONE已向你的邮箱 -->
                {{$t('youEmail')}} <span class="email">{{email}}</span>{{$t('youCode')}}
            </div>
            <!-- 已验证邮箱，去登录 -->
            <button class="mailbox_btn"  @click="login"><span>{{$t('verLogin')}}</span></button>
	          <div class="reRend" v-if="query.type == 'email'">
                  <!-- 未收到邮件，点此 -->
	          	<span>{{$t('noMail')}}</span>
	            <el-button size="small" type="text" :disabled="counting" @click="send">
                    <!-- 重新发送 -->
	            	<countdown v-if="counting"
									:time="60000"
									:leadingZero="false"
									@countdownend="countDownEnd">
									<template slot-scope="props" >
										<span v-if="props.seconds">{{ props.seconds }}s</span>
									</template>
								</countdown>
	            	<span>{{$t('Resend')}}</span>
	            </el-button>
	          </div>
            <div v-if="query.type == 'phone'" style="padding-bottom: 80px;">
                <div style="text-align:left;font-size:16px;color:#fefefe;margin:80px auto;">
                  UNIONE已向您的手机<span class="email">{{query.value}}</span>发送了验证码，验证码有效时长30分钟
                </div>
                <div>
                  <el-input style="background:transparent;"  placeholder="输入验证码" v-model="phoneYzm" class="phone_yzm">
                    <el-button slot="append" :disabled="countingYzm"  @click="resendPhoneYzm">
                      <countdown v-if="countingYzm"
                        :time="60000"
                        :leadingZero="false"
                        @countdownend="countYzmDownEnd">
                        <template slot-scope="props" >
                          <span v-if="props.seconds">{{ props.seconds }}s</span>
                        </template>
                      </countdown>
                      <span>重新发送</span>
                    </el-button>
                  </el-input>
                </div>
                <button class="mailbox_btn" style="margin-top:30px;" :disabled="phoneYzm == ''" :class="{ 'disabled': phoneYzm == '' }"
                  @click="finishRegist">
                  <span>完成注册</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { api } from "@/utils/api";
import { sendActiveEmail} from '../../utils/authApi'
import countdown from "@xkeshi/vue-countdown";
export default {
  name: "MailboxVerification",
  components: {
    countdown
  },
  data() {
    return {
      email: "",
      counting: true,  // 登陆接口会直接发邮件，所以这里直接开始计时
      reSendTag: false,
      lang: "en-us",
      isRegist: true,
      checkIsRegistTimmer: null,
      langs: {
        "zh-cn": {
          name: "简体中文",
          code: 1
        },
        "en-us": {
          name: "English",
          code: 0
        }
      },
      query:{},
      phoneYzm: '',
      countingYzm: false
    };
  },
  created() {

    this.email = this.$route.params.email;
    this.query = this.$router.currentRoute.query
    if (localStorage.getItem("lang")) {
      this.lang = localStorage.getItem("lang");
    }
  },
  watch: {
    langType() {
      if (localStorage.getItem("lang")) {
        this.lang = localStorage.getItem("lang");
      }
    }
  },
  computed: {
    langType() {
      return this.$store.getters.getLang;
    }
  },
  mounted() {

  },
  beforeDestroy() {
  },
  methods: {
    login() {

      this.$router.push({
        name: "login",
        path: "/user/login"
      });
    },
    send() {
      // 重新发送邮箱验证码
      if (this.counting) return

      if (this.email) {
        this.counting = true
        var params = new URLSearchParams();
        params.append('email',this.email)
        sendActiveEmail( params ).then(res => {
          console.log(res)
          this.$message({
            message: res.msg,
            iconClass: 'successMessage',
            duration: 1000
          })
        }).catch(err => {
          this.counting = false
        })
        // api.sendEmailAgain({ email: this.email }).then(res => {
        //   this.$message({
        //     // '邮件发送成功'
        //     message: this.$t("messSent"),
        //     iconClass: "successMessage",
        //     duration: 1000
        //   })
        // })
      }
    },
    resendPhoneYzm(){
      if(this.countingYzm) return
      if(this.query.type == 'phone' && this.query.value){
        this.countingYzm = true
      }
    },
    countYzmDownEnd(){
      this.countingYzm = false
    },
    finishRegist(){
      this.login()
    },
    countDownEnd() {
      this.counting = false;
      this.reSendTag = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.mailbox {
  width: 100%;
  height: 1020px;
  background: #151920;
  overflow: hidden;
}
.verification {
  width: 740px;
  height: 740px;
  background: #191f27;
  margin: 160px auto;
  padding: 0 115px;
  box-sizing: border-box;
  overflow: hidden;
}
.imgCode {
  margin-top: 80px;
  margin-bottom: 54px;
}
.emailCode ul {
  overflow: hidden;
}
.emailCode ul li {
  float: left;
  list-style: none;
  font-size: 22px;
  color: #fefefe;
}
.liEn {
  background: #232c38;
  width: 148px;
  height: 1px;
  margin-top: 16px;
}
.liCn {
  background: #232c38;
  width: 197px;
  height: 1px;
  margin-top: 16px;
}
.mailbox_btn {
  width: 312px;
  height: 49px;
  background: #4c54f9;
  border: none;
  font-size: 18px;
  color: #fcfcf2;
  margin-top: 140px;
  cursor: pointer; // 邮箱验证登陆暂时设置为不可点击
  span {
    display: inline-block;
    width: 312px;
    height: 49px;
    line-height: 50px;
  }
}
.mailbox_btn.disabled {
  cursor: not-allowed;
}
.mailbox_btn:hover span {
  background: rgba(255, 255, 255, 0.1);
}
.mailbox_btn:active span {
  background: rgba(0, 0, 0, 0.1);
}
.disabled:hover span {
  background: #4c54f9;
}
.email {
  color: #4c54f9;
}
.reRend {
  margin: 15px;
  span {
    color: #c2c3ca;
    font-size: 14px;
  }
  .el-button {
    margin-left: 4px;
    span {
      font-size: 14px;
      color: #4c54f9;
    }
  }
}
</style>

