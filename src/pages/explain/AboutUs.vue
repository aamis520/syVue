<template>
 <section>
     <div class="about" v-if="langType == 'zh-cn'">
        <p class="title">{{$t('About Us')}}</p>

        <p class="about_mian">
           AUSTRALIAN  EQUITY EXCHANGE CENTER（AUEC交易所），于2018年成立于NEW SOUTH WALES AUSTRALIA，是一家面向全
           球用户的专业数字资产交易平台。专注为全球用户提供安全、便捷和舒适的数字资产交易服务。AUEC提供新南威尔士州法律许可
           范围内的数字资产交易及相关服务，并已获得澳大利亚证券投资委员会（ASIC）颁发的数字资产交易牌照。<br />
            AUEC建立了一整套科学完善的交易制度，同时以领先的技术搭建出稳定高效的交易系统。并由传统金融、密码学、互联网金融、区
            块链技术研究者、AI智能、品牌营销等领域资深专家组成专业团队。致力于为数字资产投资者提供安全便捷的交易场所。<br />
            AUEC坚持以用户利益为核心，秉承开放、自由、分享的互联网精神，致力于为全球客户提供卓越的综合性数字货币服务。
        </p>
    </div>
      <div class="about english" v-if="langType == 'en-us'">
       <p class="title">{{$t('About Us')}}</p>

        <p class="about_mian">
            Australian Equity Exchange Center (AUEC), founded in August 2017 in New South Wales Australia,
            is a worldwide professional digital asset exchange platform. AUEC focuses on providing safe,
             steady and comfortable digital asset exchange services to the users. AUEC provides digital asset
              transaction and related services within the limits permitted by law in New South Wales. AUEC has
              also obtained the digital asset exchange license issued by Australian Securities and Investment Commission (ASIC).<br />

            AUEC has established a set of scientifically trading system, with leading technology to make it stable
            and highly-efficient. Led by experts, AUEC builds a team which has sound experience in traditional finance,
             cryptography, internet finance, blockchain technology, AI, marketing. Our team focuses on providing stable
             and efficient exchange platform for AUEC users.<br />

           AUEC insists that users' interests as its first priority, adhering to the spirit of openness,
           freedom, and sharing of internet. AUEC is also dedicated to provide global users with excellent
            comprehensive digital asset services.
        </p>
    </div>
 </section>
</template>
<script>
	import { api } from '@/static/api'
	import { nationalityInfo } from '@/static/dataConfig'
	import { Validate } from '@/static/common'
	import countdown from '@xkeshi/vue-countdown'

	export default {
		name: 'AboutUs',
		props: {

    },
    computed:{
      langType(){
        return this.$store.getters.getLang
      }
    }
	}
</script>
<style lang="scss" scoped>
	/* 右侧  */
	.about{
        width: 987px;
        padding: 60px 80px;
        box-sizing: border-box;
    }
    .title{
        font-size: 26px;
        color: #fff;
    }
    .about_mian{
        font-size: 14px;
        color: #4d5f77;
        line-height: 35px;
        margin-top: 60px;
    }
    .english .about_mian{
      line-height: 24px
    }
</style>
