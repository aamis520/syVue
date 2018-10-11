<template>
    <!-- 交易记录 -->
    <div class="financial-record" style="width: 1200px;height: 940px;">
      <div class="sjx_main">
       <div class="sjx_section">
         <div class="section_title">
            <router-link class="option" to="/property/coinoption" style="outline:none;color:#67778c;">{{$t('Assets Center')}}</router-link>
            <i class="el-icon-arrow-right"></i><span>{{$t('History')}}</span>
         </div>
         <div class="sjx_btn">
           <div class="btn_section">
             <p v-for="(item,index) in arr" :key="index" @click="toggle(index)" :class="{active:index == active}" :if="index == 0?item=$t('Deposit') : item=$t('Withdraw') ">{{item}}</p>
           </div>
         </div>
         <!--充币内容-->
         <div v-show="active==0" class="charge_section" >
           <el-table class="exchange-table coinlist" :data="rechargeRecordList" style="width: 100%">
              <el-table-column prop="add_time" :label="$t('Date')">
              </el-table-column>
              <el-table-column prop="currency" :label="$t('Coin')">
                <template slot-scope="scope">
                  <span v-if="scope.row.currency">{{scope.row.currency.toUpperCase()}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="number" :label="$t('Amount')">
              </el-table-column>
              <el-table-column prop="log_status" :label="$t('Status')">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1000">{{$t('successful')}}</span>
                </template>
            	</el-table-column>
				    </el-table>

            <div class="page-wrapper" v-if="recordPaged.total_page > 1">
              <el-pagination :page-size="10" :background="true" layout="prev, pager, next" :total="recordPaged.total" @current-change="RecordList">
              </el-pagination>
            </div>

         </div>
         <!--提币内容-->
         <div v-show="active==1" class="charge_section">
           	<el-table class="exchange-table coinlist" :data="withdrawRecordList" style="width: 100%">
              <el-table-column prop="add_time" :label="$t('Date')">
              </el-table-column>
              <el-table-column prop="currency" :label="$t('Coin')">
                <template slot-scope="scope">
                  <span v-if="scope.row.currency">{{scope.row.currency.toUpperCase()}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="number_withdraw" :label="$t('Apply Amount')"></el-table-column>
              <el-table-column prop="fee" :label="$t('fee')"></el-table-column>
              <el-table-column prop="number_account" :label ="$t('Actual Amount')"></el-table-column>
              <el-table-column prop="log_status" :label="$t('Status')">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == '3'">
                    <a style="color:#4c54f9 ;font-size:12px;" :href="scope.row.url" target="_blank">{{$t('Coined')}}</a>
                  </span>
                  <span v-else-if="scope.row.status == '4'">
                    <a style="color:#4c54f9 ;font-size:12px;" :href="scope.row.url" target="_blank">{{$t('moneyAccount')}}</a>
                  </span>
                  <span v-else-if="scope.row.status == 0 || scope.row.status ==1">{{$t('Processing')}}</span>
                  <span v-else-if="scope.row.status == 2">{{$t('Invoice confirmation')}}</span>
                  <span v-else-if="scope.row.status == 5">{{$t('Refuse')}}</span>
                  <span v-else-if="scope.row.status == 6">{{$t('Manual')}}</span>
                  <span v-else-if="scope.row.status == 7">{{$t('abnormal')}}</span>
                </template>
              </el-table-column>
				    </el-table>

            <div class="page-wrapper" v-if="withdrawPaged.total_page > 1">
              <el-pagination :page-size="10" :background="true" layout="prev, pager, next" :total="withdrawPaged.total" @current-change="withdrawList">
              </el-pagination>
            </div>
         </div>
       </div>
    </div>
    </div>
</template>

<script>
import { api } from '@/static/api'
export default {
    name:'FinancialRecords',
    data(){
      return{
        active:0,
        arr:[
          "充币",
          "提币"
        ],
        withdrawPaged:{},
        recordPaged:{},
        withdrawRecordList:[],
        rechargeRecordList:[]
      }
    },
    computed:{
      langType(){
        return this.$store.getters.getLang
      }
    },
    watch:{
      langType(){
         this.getRechargeRecordList()
         this.getWithdrawRecordList()
      }
    },
    methods:{
      toggle(index){
        this.active = index
        this.$router.push({
          path: '/property/financialrecords/' + index
        })
        if(index == 0){
          this.getRechargeRecordList()

        }else{
          this.getWithdrawRecordList()

        }
      },
      withdrawList(p) {
				this.getWithdrawRecordList(p)
			},
      getWithdrawRecordList(p = 1){
        var data = {
          page:p
        }
        api.assetsWithdrawRecord(data).then(res => {
          if(res.error_code == 1000){
            this.withdrawRecordList = []
            this.withdrawRecordList = res.assets_list
            this.withdrawPaged = res.paged
          }
        })
      },
      RecordList(p){
        this.getRechargeRecordList(p)
      },
      getRechargeRecordList(p = 1){
        var data = {
          page:p
        }
        api.assetsRechargeRecord(data).then(res => {
          if(res.error_code == 1000){
            this.rechargeRecordList = []
            this.rechargeRecordList = res.assets_list
            this.recordPaged = res.paged
          }
        })
      }
    },
    mounted() {
      this.getRechargeRecordList()
      this.getWithdrawRecordList()
    },
    created(){
      if(this.$route.params.type){
        this.active = this.$route.params.type
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
 li{list-style: none;}
  .sjx_main{width: 987px;background: #191f27;}
  .sjx_section{width: 890px;margin: 0 auto;height:1233px;}
  .section_title{line-height: 87px;border-bottom: 1px solid #202234;color: #525d6f;font-size: 12px;}
  .section_title span{color: #c8cdd3;}
  .sjx_btn{height:92px;border-bottom: 1px solid #202234;overflow: hidden;}
  .btn_section{width: 220px;height: 34px;margin: 30px auto;border-radius: 2px;overflow: hidden;}
  .btn_section p{width:110px;height: 34px;line-height: 34px;float: left;text-align: center;font-size:14px;color: #bcbfc8;cursor: pointer;background: #202234;}
  /*切换按钮*/
  .active{background: #4c54f9!important;color: #f6fbff!important;}
  /* 充币内容 */
  .charge_title{width:890px;height: 53px;border-bottom: 1px solid #202234;}
  .charge_title li{line-height: 53px;float: left;font-size: 12px;color: #8d9fb8;}
  .charge_title li:first-child{width:222px;;text-indent: 30px;}
  .charge_title li:nth-child(2){width: 217px;text-align: center;}
  .charge_title li:nth-child(3){width: 275px;text-align: center;}
  .charge_title li:nth-child(4){width: 174px;text-align: center;}
  .charge li{color:#ddd;font-size: 14px;}
  /* 提币内容*/
  .charge_title2 li:first-child{width: 185px;}
  .charge_title2 li:nth-child(2){width: 118px;}
  .charge_title2 li:nth-child(3){width: 154px;}
  .charge_title2 li:nth-child(4){width: 130px;}
  .charge_title2 li:nth-child(5){width: 170px;text-align: center;}
  .charge_title2 li:nth-child(6){width: 133px;text-align: center;}

</style>

