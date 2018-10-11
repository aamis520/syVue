<template>
  <!-- 订单 -->
  <div>
    <el-container class="order-container">
      <el-tabs class="order-tab" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('Orders')" name="current" style="width:100%;">
          <el-table
            :data="curDelegate"
            style="width:100%"
            ref="curDelegateTable"
          >
            <el-table-column
              prop="time"
              width="180"
              :label="$t('Date')">
            </el-table-column>
            <el-table-column
              prop="duad"
              :label="$t('Pairs')">
              <template slot-scope="scope">
                {{scope.row.duad.toUpperCase()}}
              </template>
            </el-table-column>
            <el-table-column
              prop="direction"
              :label="$t('Bid/Ask')">
              <template slot-scope="scope">
                            <span
                              :class="scope.row.direction_type == 1?'buy-direction':'sell-direction'">
                                {{scope.row.direction_type == 1 ? $t('Buy') : $t('Sell')}}
                            </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('Price')">
            </el-table-column>
            <el-table-column
              prop="number"
              :label="$t('Amount')">
            </el-table-column>
            <el-table-column
              prop="total"
              :label="$t('Total')">
            </el-table-column>
            <el-table-column
              prop="deal"
              :label="$t('Executed')">
            </el-table-column>
            <el-table-column
              prop="untreated"
              :label="$t('Unexecuted')">
            </el-table-column>
            <el-table-column
              :label="$t('Action')">
              <template slot-scope="scope">
                <el-button @click="cancelDetegate(scope.row)" type="text" size="small">{{$t('Cancel')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="page-wrapper" v-if="curPaged.total_page > 1">
            <el-pagination
              :page-size="10"
              :background="true"
              layout="prev, pager, next"
              :total="curPaged.total"
              @current-change="changeCurPage"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('Order History')" name="history" style="width:100%;">
          <el-table
            :data="hisDelegate"
            class="hisDelegate"
            @expand-change="expandLine"
            ref="hisDelegateTable"
            style="width:100%">
            <el-table-column
              prop="time"
              :label="$t('Date')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="duad"
              :label="$t('Pairs')">
              <template slot-scope="scope">
                {{scope.row.duad.toUpperCase()}}
              </template>
            </el-table-column>
            <el-table-column
              prop="direction"
              :label="$t('Bid/Ask')">
              <template slot-scope="scope">
                                <span
                                  :class="scope.row.direction_type == 1?'buy-direction':'sell-direction'">
                                    {{scope.row.direction_type == 1 ? $t('Buy') : $t('Sell')}}
                                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('Price')">
              <template slot-scope="scope">
                   <span v-if="typeof(scope.row.price) == 'string'">{{$t(scope.row.price)}}</span>
                   <span v-else>{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              :label="$t('Order Book')">
            </el-table-column>
            <el-table-column
              prop="deal"
              :label="$t('Executed')">
            </el-table-column>
            <el-table-column
              prop="average_price"
              :label="$t('Average Price')">
            </el-table-column>
            <el-table-column
              prop="status_name"
              :label="$t('Status')">
              <template slot-scope="scope">
              	<span v-if="scope.row.status == 1">{{$t('Some clinch a deal')}}</span>
                <span v-else-if="scope.row.status == 2">{{$t('Executed')}}</span>
                <span v-if="scope.row.status == 3">{{$t('Cancel')}}</span>
              </template>
            </el-table-column>
            <el-table-column type="expand"
                             prop=""
                             :label="$t('Action')"
                             width="60">
              <template slot-scope="props">
                <div class="details">
                  <ul class="details_title">
                    <li>{{$t('Date')}}</li>
                    <li>{{$t('Price')}}</li>
                    <li>{{$t('Amount')}}</li>
                    <li>{{$t('Totalturn')}}</li>
                    <li>{{$t('fee')}}</li>
                  </ul>
                  <ul v-if="!props.row.loading" v-for="(item,index) in props.row.detailList" :key="index"
                      class="details_section">
                    <li>{{item.time}}</li>
                    <li>{{item.price}}</li>
                    <li>{{item.number}}</li>
                    <li>{{item.total}}</li>
                    <li>{{item.fee}} {{item.trade_type == 1 ? item.trade_currency.toUpperCase() : "USDT"}}</li>
                  </ul>
                  <div v-if="!props.row.loading && props.row.detailList.length ==0" class="details_loading">
                    {{$t('No Records')}}
                  </div>
                  <div v-if="props.row.loading" class="details_loading">
                    <i class="el-icon-loading"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>

					<div class="page-wrapper" v-if="hisPaged.total_page>1">
						<el-pagination :page-size="10" :background="true" layout="prev, pager, next" :total="hisPaged.total" @current-change="changeHisPage">
						</el-pagination>
					</div>

        </el-tab-pane>
        <el-tab-pane :label="$t('Transaction History')" name="detail" style="width:100%;">
          <el-table
            :data="detailDelegate"
            ref="detailDelegateTable"
            style="width:100%">
            <el-table-column
              prop="time"
              :label="$t('Date')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="duad"
              :label="$t('Pairs')">
              <template slot-scope="scope">
                {{scope.row.duad.toUpperCase()}}
              </template>
            </el-table-column>
            <el-table-column
              prop="direction"
              :label="$t('Bid/Ask')">
              <template slot-scope="scope">
                            <span
                              :class="scope.row.trade_type == 1?'buy-direction':'sell-direction'">
                                {{scope.row.trade_type == 1 ? $t('Buy') : $t('Sell')}}
                            </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('Price')">
            </el-table-column>
            <el-table-column
              prop="number"
              :label="$t('Amount')">
            </el-table-column>
            <!-- <el-table-column
                prop="total"
                label="委托总数">
            </el-table-column> -->
						<el-table-column prop="total" :label="$t('Totalturn')">
						</el-table-column>
						<el-table-column prop="fee" :label="$t('fee')">
							<template slot-scope="scope">
								<span>
                  {{scope.row.fee}}&nbsp;{{scope.row.trade_type == 1 ? scope.row.trade_currency.toUpperCase() : "USDT"}}
                </span>
							</template>
						</el-table-column>
					</el-table>

					<div class="page-wrapper" v-if="detailPaged.total_page > 1">
						<el-pagination :page-size="10" :background="true" layout="prev, pager, next" :total="detailPaged.total" @current-change="changeDetailPage">
						</el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-container>
	</div>
</template>

<script>
  import {api} from '@/static/api'

	export default {
    name: 'Order',
    data() {
      return {
        activeName: 'current',
        curDelegate: [],
        curPaged: {},
        hisDelegate: [],
        hisPaged: {},
        detailDelegate: [],
        detailPaged: {},
        hisDetails: []
      }
    },
    components: {},
    created() {
      if(this.$route.params.category){
        this.activeName = this.$route.params.category
      }
    },
		mounted() {
			this.getCurDelegate()
			this.getHisDelegate()
			this.getDealDetail()
		},
		beforeDestroy() {},
		methods: {
			handleClick(tab) {
        let name =this.activeName
        this.activeName = tab.name
        if(this.activeName == 'current'){
          this.getCurDelegate()
        }else if(this.activeName == 'history'){
          this.getHisDelegate()
        }else if(this.activeName == 'detail'){
          this.getDealDetail()
        }
				this.$router.push({
					path: '/order/' + tab.name
				})
			},
			changeCurPage(p) {
				this.getCurDelegate(p)
			},
			changeHisPage(p) {
				this.getHisDelegate(p)
			},
			changeDetailPage(p) {
				this.getDealDetail(p)
			},

			getCurDelegate(p = 1) {
				var params = {
					page: p || 1
				}
				api.ordercurDelegate(params)
					.then(res => {
						if(res.error_code == 1000) {
							this.curDelegate = res.entrusts
							this.curPaged = res.paged
						}
					})
			},
			getHisDelegate(p = 1) {
				var params = {
					page: p
        }
				api.hisDelegate(params)
					.then(res => {
						if(res.error_code == 1000) {
              console.log(res)
							this.hisDelegate = res.entrusts
							this.hisPaged = res.paged
						}
          })
			},
			getDealDetail(p = 1) {
				var params = {
					page: p
				}
				api.delegateDetail(params)
					.then(res => {

						this.detailDelegate = res.entrusts
						this.detailPaged = res.paged

					})
			},
			cancelDetegate(row) {

				let params = {
					order_id: row.id,
					order_type: row.order_type,
					currency: row.currency,
					trade_currency: row.trade_currency
        }
        let self = this
        api.cancelDelegate(params).then((res) =>{
          if(res.error_code === 1000){
            // 撤销成功
            //'撤销委托成功'
            this.$message({
              message: this.$t('Revocation'),
              iconClass: 'successMessage',
              type: 'success',
              duration: 1000
            })
            // TODO
             let getCurrent = setTimeout(() => {
               self.getCurDelegate()
              }, 1300);
          }
        })
				// api.cancelDelegate(data).then((res) => {
        //     console.log(res)
        //     this.getCurDelegate()
				// 	})
			},
			expandLine(row, expandedRows) {
				var self = this
				if(row.detailList && row.detailList.length >= 0) {
					return
				}
				this.$set(row, 'loading', true)
				var data = {
					order_id: row.id,
					currency: row.currency,
					trade_currency: row.trade_currency,
					trade_type: row.direction
				}
				api.orderDetail(data)
					.then(res => {
						if(res.error_code == 1000) {
							this.$set(row, 'detailList', res.entrusts)
							this.$set(row, 'loading', false)
						}
					}).catch(err => {})
			}

		}
	}
</script>

<style lang='scss' scoped>
	.order-container {
		width: 1200px;
		min-height: 940px;
		padding: 0 20px;
		margin: 0 auto;
		background-color: #1a232c;
		margin-top: 30px;
		.order-tab {
			width: 100%;
		}
		.details {
			width: 100%;
			background: #151922;
			.details_title {
				overflow: hidden;
				li {
					list-style: none;
					width: 20%;
					height: 45px;
					line-height: 45px;
					float: left;
					color: #8d9fb8;
					text-align: center;
				}
			}
			.details_section {
				overflow: hidden;
				li {
					list-style: none;
					width: 20%;
					height: 45px;
					line-height: 45px;
					float: left;
					color: #f6f9ff;
					text-align: center;
				}
			}
			.details_loading {
				text-align: center;
				padding: 15px 0;
			}
		}
	}



</style>
