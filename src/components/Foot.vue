<template>
    <div class="footer_back">
        <div class="au-footer">
            <div class="footer">
              <img class="footer_logo" src="@/assets/bottom-logo-auec.png" alt="">
              <ul class="links">
                  <router-link class="footbar" to="/explain/AboutUs">{{$t('About Us')}}</router-link>
                  <!-- <router-link class="footbar" to="/explain/Explain">{{$t('Company Profile')}}</router-link> -->
                  <router-link class="footbar" to="/explain/Agreement">{{$t('Agreement')}}</router-link>
                  <router-link class="footbar" to="/explain/Disclaimer">{{$t('Disclaimer')}}</router-link>
              </ul>
              <div style="color:#526079;font-size:14px;text-align:center;margin-bottom:10px;">
                <span style="margin-right:40px;">{{$t('serviceTel')}}：wenbie0508</span>
                <span>{{$t('telegram')}}：<a style="color:rgb(82, 96, 121);" target="view_window" href="https://t.me/unionde">https://t.me/unionde</a></span>
              </div>
          </div>
          <div class="copy">
                ©2018 AUEC Technology Chain
          </div>
        </div>
        <div class="tw-footer">
          <div>
            <el-row class="bot-row-up">
              <el-col :span="18">
                <p class="botLogo">
                  <img src="~@/assets/img/twLogoBot.png" alt="">
                </p>
                <ul class="links">
                  <router-link class="footbar" to="/explain/AboutUs">{{$t('About Us')}}</router-link>
                  <!-- <router-link class="footbar" to="/explain/Explain">{{$t('Company Profile')}}</router-link> -->
                  <router-link class="footbar" to="/explain/Agreement">{{$t('Agreement')}}</router-link>
                  <router-link class="footbar" to="/explain/Disclaimer">{{$t('Disclaimer')}}</router-link>
                </ul>
              </el-col>
              <el-col :span="6" style="position:relative;">
                <div class="tw-footer-right">
                  <a style="color:rgb(82, 96, 121);" target="view_window" href="https://t.me/unionde">
                    <img src="@/assets/img/twTelgram.png" alt="telegram">
                  </a>
                  <img src="@/assets/img/twWx.png" alt="weChat">
                  <!-- <a style="color:rgb(82, 96, 121);" target="view_window" href="https://t.me/unionde">
                    <img src="@/assets/img/twTelgram.png" alt="telegram">
                  </a> -->
                  <span class="twWeix">
                    {{$t('telegram')}}：<a target="view_window" href="https://t.me/unionde">https://t.me/unionde</a>
                    <br>
                    {{$t('serviceTel')}}：wenbie0508
                  </span>
                </div>
              </el-col>
            </el-row>

          </div>
          <hr style="border-top:1px solid #33373e">
          <div>
            <el-row class="bot-row-down">
              <el-col :span="12">©2018 101BITEX</el-col>
              <el-col :span="12" style="text-align:right">101BITEX powered by SY</el-col>
            </el-row>

          </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Foot',
    data(){
        return{

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
$twcolor: #269856;
.footer_back{
    background-color:#151920;
   width: 100%;
   overflow: hidden;
}
.footer{
    width: 600px;
    margin:0 auto;
    overflow: hidden;
}
.footer_logo{
    margin:94px auto 80px auto;
    display:block;
}
.footer .links{
    list-style:none;
    color:#526079;
    font-size: 16px;
    overflow: hidden;
    margin-bottom:110px;
}
.footer .links .footbar{
    float: left;
    text-align: center;
    color:#526079;
    width: 200px;
    display: block;
    height: 24px;
    line-height: 1.5;
}
.footer .links .footbar:hover{
    color: #4c54f9;
}
.copy{
    color:#526079;
    width: 100%;
    height: 40px;
    margin-top: 18px;
    line-height: 40px;
    background: #202832;
    font-size: 12px;
    text-align: center;
}
.tw-footer {
  display: none;
  .el-row{
    width: 1200px;
    margin: 0 auto;
  }
  .bot-row-up{
    margin: 80px auto;
    p {
      img{
        display: block;
        height: 36px;
      }
    }
  }
  .bot-row-down {
    width: 1200px;
    margin: 20px auto;
    font-size: 12px;
    color: #727272;
  }
}
.tw-footer .links {
  list-style:none;
  color:#526079;
  font-size: 16px;
  overflow: hidden;
  margin-top: 40px;
}
.tw-footer .links .footbar {
  float: left;
  text-align: left;
  color:#afb3b1;
  width: 120px;
  display: block;
  height: 24px;
  line-height: 1.5;
}
.tw-footer .links .footbar:hover{
    color: $twcolor;
}
.tw-footer .twWeix {
  display: inline-block;
  margin-left: 20px;
  line-height: 24px;
  font-size: 14px;
  color: #4a525f;
  a {
    color: #4a525f;
    &:hover {
      color: $twcolor;
    }
  }
}
.tw-footer-right {
  position: relative;
  top: 40px;
}
</style>
