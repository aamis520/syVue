<template>
  <section>
      <div class="about"  v-if="langType == 'zh-cn'">
        <p class="title">{{$t('Disclaimer')}}</p>
        <div class="disclaimer_main">
            <p>
                第一条<br />
                本网站的宗旨是在不违反澳大利亚国家相关法律法规的前提下，尽可能地为全球广大数字资产爱好者
                及投资者提供专业的国际化水准的交易平台和金融产品。禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将冻结账户，立即报送有权机关。
            </p>
              <p>
                  第二条<br />
                    当有权机关出示相应的调查文件要求本站配合对指定用户进行调查时， 或对用户账户采取查封、冻结或者划转等措施时，本
                    站将按照有权机关的要求协助提供相应的用户数据，或进行相应的操作。 因此而造成的用户隐私泄露、账户不能操作及因此给所造成的损失等，本站不承担任何责任。
              </p>
          　　<p>
                  第三条<br />
                    本网站使用者因为违反本声明的规定而触澳大利亚国家相关法律的，本站作为服务的提供方，有义务对平台的规则
                    及服务进行完善， 但本站并无触澳大利亚国家相关法律的动机和事实，对使用者的行为不承担任何连带责任。
              </p>
          　　<p>
                 第四条<br />
                    凡以任何方式登录本网站或直接、间接使用本网站服务者，视为自愿接受本网站声明的约束。
              </p>
          　　<p>
                  第五条<br />
                    本声明未涉及的问题参见澳大利亚国家有关法律法规，当本声明与澳大利亚国家相关法律法规冲突时，以澳大利亚国家相关法律法规为准。
              </p>          　
        </div>

    </div>
      <div class="about english" v-if="langType == 'en-us'">
        <p class="title">{{$t('Disclaimer Clause')}}</p>
        <div class="disclaimer_main">
            <p>
                1.<br />
                 The aim of this website is to provide professional global level exchange platforms and financial products
                 for digital asset enthusiasts and investors around the world as far as possible without violating any Australian
                 laws and regulations. It is forbidden to use this website for all illegal transactions such as money laundering,
                 smuggling, and commercial bribery. If such incidents are found, this website will freeze the account and report
                 it to the authority immediately.
            </p>
              <p>
                  2.<br />
                    When the relevant authority presents investigation warrants and require this website to cooperate with
                    the investigation of designated users, or takes actions such as seizure, freezing or transfer towards
                     designated user account, this website will assist in providing relevant user info according to the
                     requirements of the relevant authorities, or take appropriate actions. As a result, this website is
                     not responsible for the designated user's privacy compromise, operation of account frozen, and the resulting loss.
              </p>
          　　<p>
                  3.<br />
                    Users of this site violates provisions of this statement and therefor have broken Australian laws.
                     As a service provider, this website has the obligation to improve the platform's system and services.
                      However, this website does not have any motives of breaking Australian laws, therefore will not bear
                       the liability for the designated user's criminal behavior.
              </p>
          　　<p>
                 4.<br />
                   Any user who logs into the Website in any form directly or indirectly uses the service of this
                    Website shall be deemed to voluntarily accept the restrictions of this website's disclaimer.
              </p>
          　　<p>
                 5.<br />
                   The issues not covered in this disclaimer should be referred to the Australian laws and regulations.
                    When this disclaimer conflicts with Australian laws and regulations, the Australian laws and regulations shall prevail.
              </p>          　
        </div>

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
    .disclaimer_main{
        font-size: 14px;
        color: #4d5f77;
        line-height: 28px;
        margin-top: 60px;
        p{
            // text-indent: 30px;
            line-height:40px;
        }
    }
    .english .disclaimer_main{
      line-height: 24px;
    }
</style>
