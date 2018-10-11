<template>
  <div>
    <el-container class="fs-container">
      <el-aside class="leftside" style="width:370px;">
        <div class="inner-wrapper">
          <el-container class="dash">
            <el-aside class="left-pic" style="width:88px;margin:23px 0;">
              <img class="left-pic" :src="tradeCurrencyInfo.bigpic" alt=""/>
            </el-aside>
            <el-main class="right-word">
              <div class="right-l1">{{curDuad}}  {{tradeCurrencyInfo.order_price}}</div>
              <div class="right-l2">≈  {{(tradeCurrencyInfo.order_price * 6.31).toFixed(2)}}CNY</div>
              <div class="right-l3" :class="tradeCurrencyInfo.p >= 0?'green':'red'">{{curPrice}}%</div>
              <div class="right-15">24H {{$t('VOL')}} {{tradeCurrencyInfo.a}} {{img}}</div>
              <div class="right-l4">{{$t('High')}}：{{tradeCurrencyInfo.high}} {{$t('Low')}}：{{tradeCurrencyInfo.low}}</div>
            </el-main>
          </el-container>
          <!-- 市场 -->
          <div class="cur-price">
            <div class="tabs-header">
              <i :class="showMarket?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                 @click="toggleShowMarket"></i>
              {{$t('Markets')}}
            </div>
            <el-tabs type="border-card" class="market-table">
              <el-tab-pane v-show="showMarket" :label="usdtShow">
                <div class="market-list-header">
                  <span class="rel1"></span>
                  <span class="rel2">{{$t('Coin')}}</span>
                  <span class="rel3">{{$t('Last Price')}}</span>
                  <span class="rel4">{{$t('24H Change')}}</span>
                </div>
                <div class="vuebar-element" v-bar="{preventParentScroll:true,scrollThrottle:50}"> <!-- el1 -->
                  <div>
                    <div class="market-list" :class="{'active':curIndex == index}" @click="changeDuadByLine(item,index)"
                      v-for="(item,index) in marketListUSDT" :key="index">
                      <span class="rel1"><img class="tiny-icon" :src="item.pic"/></span>
                      <span class="rel2">{{item.name.toUpperCase()}}</span>
                      <span class="rel3">{{item.order_price}}</span>
                      <span class="rel4" :class="item.positive ?'fall':'rise'">{{Math.abs(item.p)}}%</span>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 交易 -->
          <div class="exchange">
            <div class="tabs-header">
              <i :class="showDeal?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                 @click="toggleShowDeal"></i>
              {{$t('Order')}}
            </div>
            <el-tabs type="border-card" v-model="exchange.orderType" class="market-table"
                     @tab-click="tips.limitAmountNotInput =false">
              <el-tab-pane v-show="showDeal" name="limitprice" :label="limitOrder">
                <div class="tips">
                  {{$t('Available')}}：<span v-if="exchange.balance">{{exchange.balance}}</span><span v-else>0</span> USDT
                  <!-- 可用为空时，显示0 -->
                </div>
                <div class="deal-form">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="amount-label">
                        {{$t('Price')}}
                      </div>
                      <el-input class="amount-input" type="number" step="0.01"  v-model.number="exchange.limitPriceDeal.price"
                        @keyup.native="num(exchange.limitPriceDeal.price)">
                        <template slot="append">{{currency}}</template>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <div class="amount-label">
                        {{$t('Amount')}}
                      </div>
                      <!-- 请输入数量 -->
                      <el-tooltip class="item" effect="dark" :content="$t('Please enter the quantity')" placement="right" manual
                        v-model="tips.limitAmountNotInput">
                        <!-- TODO 上面做了修改  v-model="tips.limitAmountNotInput && !exchange.limitPriceDeal.amount" -->
                        <el-input class="amount-input" type="number" step="0.0001" :min="0" v-model.number="exchange.limitPriceDeal.amount"
                          @keyup.native="amount(exchange.limitPriceDeal.amount)"
                          @focus="tips.limitAmountNotInput=false">
                          <template slot="append">{{tradeCurrency}}</template>
                        </el-input>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <div style="padding: 10px;"></div>
                  <!--<el-slider
                    v-model="exchange.limitPriceDeal.percent"
                    :min="0"
                    :max="limitSliderMax"
                    @change="computeLimitAmount"
                  ></el-slider>-->
                  <div class="amount-tips">{{$t('Totaling')}} : {{allprice}} USDT</div>
                  <div class="btn-wrapper" style="width:289px;">
                    <el-button
                      v-if="$store.getters.loggedIn"
                      type="purchase"
                      value="purchase"
                      @click="addDelegate($event)">{{$t('Buy')}}
                    </el-button>

                    <el-button
                      v-if="$store.getters.loggedIn"
                      type="sell"
                      value="sell"
                      @click="addDelegate($event)">{{$t('Sell')}}
                    </el-button>
                    <el-button
                      v-if="!$store.getters.loggedIn"
                      type="noLogin"
                      value="purchase"
                      @click="$router.push('/user/login')">{{$t('Login')}}
                    </el-button>
                    <el-button style="margin-left:16px;"
                      v-if="!$store.getters.loggedIn"
                      type="noLogin"
                      value="purchase"
                      @click="$router.push('/user/regist')">{{$t('Sign Up')}}
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="marketprice" :label="MarketOrder">
                <div class="tips">
                  {{$t('Available')}}：{{exchange.balance}} USDT
                </div>
                <div class="tips-big">
                  *{{$t('Market price priority')}}
                </div>

                <div class="deal-form">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="amount-label">{{$t('Totalbuy')}}</div>
                      <el-input
                        :class="exchange.marketPriceDeal.buyDisable?'amount-input':'amount-input'"
                        type="number"
                        step="0.01"
                        name="buy" v-model.number="exchange.marketPriceDeal.price"
                        @focus="getFocus($event)"
                        :min="0"
                        @keyup.native="getBuyKeyup"
                        :placeholder="$t('Totalbuy')">
                        <template slot="append">{{currency}}</template>
                      </el-input>
                    </el-col>
                    <el-col :span="12">
                      <div class="amount-label">{{$t('Amountsell')}}</div>
                      <el-input :class="exchange.marketPriceDeal.sellDisable?'amount-input':'amount-input'"
                        type="number"
                        step="0.01"
                        name="sell"
                        :placeholder="$t('Amountsell')"
                        :min="0"
                        v-on:focus="getSellFocus($event)"
                        @blur="getSellBlur"
                        @keyup.native="getSellKeyup"
                        v-model.number="exchange.marketPriceDeal.amount">
                        <template slot="append">{{tradeCurrency}}</template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <!--<el-slider
                    v-model="exchange.marketPriceDeal.percent"
                    :show-stops="true"
                    :min="0"
                    :max="marketSliderMax"
                    @change="computeMarketAmount"></el-slider>-->
                    <!--TODO-->
                  <!--<el-row :gutter="10" style="position: relative;top: -15px;">
                  	<el-col :span="12">
                  		<div v-if="exchange.marketPriceDeal.buyDisable" style="text-align: left;font-size: 12px;">{{exchange.marketPriceDeal.amount}} {{sliderUnit}}</div>
                  		<div v-else style="text-align: left;font-size: 12px;">{{exchange.marketPriceDeal.price}} {{sliderUnit}}</div>
                  	</el-col>
                  	<el-col :span="12">
                  		<div style="text-align: right;font-size: 12px;">{{marketSliderMax}}
                  			{{sliderUnit}}</div>
                  	</el-col>
                  </el-row>-->
                  <div style="padding: 10px;"></div>
                  <div class="btn-wrapper" style="width:289px;">
	                    <el-button type="purchase"
                      v-if="$store.getters.loggedIn"
                      value="purchase"
	                    @click="addDelegate($event)"
	                    :disabled="exchange.marketPriceDeal.buyDisable">{{$t('Buy')}}
                    </el-button>
                    <el-button type="sell"
                      v-if="$store.getters.loggedIn"
                      value="sell"
                      @click="addDelegate($event)"
                      :disabled="exchange.marketPriceDeal.sellDisable">{{$t('Sell')}}
                    </el-button>
                    <el-button
                      v-if="!$store.getters.loggedIn"
                      type="noLogin"
                      value="purchase"
                      @click="$router.push('/user/login')">{{$t('Login')}}
                    </el-button>
                    <el-button style="margin-left:16px;"
                      v-if="!$store.getters.loggedIn"
                      type="noLogin"
                      value="purchase"
                      @click="$router.push('/user/regist')">{{$t('Sign Up')}}
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 持有 -->
          <div class="mycoins" v-if="isLogin">
            <div class="normal-header">
              <i :class="showMyCoin?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                 @click="toggleShowMyCoin"></i>
              {{$t('Hold')}}
            </div>
            <div v-show="showMyCoin" class="mycoin-list-header pad15">
              <span class="rel1">{{$t('Coin')}}</span>
              <span class="rel2">{{$t('Available')}}</span>
              <span class="rel4">{{$t('Action')}}</span>
            </div>
            <div v-show="showMyCoin" class="mycoins-table">
              <div class="vuebar-element"
                v-bar="{preventParentScroll:true,scrollThrottle:50}">
                <div>
                  <div class="mycoin-list" v-for="(item,index) in mycoins" :key="index">
                    <span class="rel1">{{item.currency.toUpperCase()}}</span>
                    <span class="rel2">{{item.available}}</span>
                    <span class="rel4">
                                            <el-button class="add-coin" @click="addCoin(item,index)" type="text"
                                                       size="small">{{$t('Deposit')}}</el-button>
                                            <!--<el-button class="get-coin" @click="getCoin(item,index)" type="text"
                                                       size="small">{{$t('Withdraw ')}}</el-button>-->
                                        </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 公告  -->
          <div class="boardcast">
            <div class="normal-header">
              <i :class="showNotice?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                 @click="toggleShowNotice"></i>
              {{$t('Announcement')}}
              <router-link class="normal-header-more" to="/notice" v-if="showNotice == true">{{$t('More')}}</router-link>
            </div>
            <div v-show="showNotice" class="vuebar-element" v-bar="{preventParentScroll:true,scrollThrottle:50}">
              <div>
                <ul class="notice-list">
                  <li class="notice-li" @click="jumpNotice(item)" v-for="(item,index) in noticeList" :key="index">
                    <span class="notice-squre">·</span>{{item.notice_title}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main class="rightside">
        <div class="kline">
          <div class="kline-header">
            <i :class="showKline?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
              @click="toggleShowKline"></i>
            <el-select v-model="curDuad" style="width:100px;" class="kLineTitle" @change="changeDuad">
              <el-option
                v-for="item in currencyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="height:480px;" v-show="showKline">
            <iframe id="show-iframe" frameborder=0  allowtransparency="true" name="showHere" scrolling=auto allowfullscreen :src="iframUrl"></iframe>
          </div>
        </div>
        <div class="exchange-table" v-if="isLogin">
          <div class="exchange-table-header cur-delegation">
            <i :class="showCurDelegate?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
               @click="toggleShowCurDelegate"></i>
            {{$t('Orders')}}
          </div>
          <el-table v-show="showCurDelegate" class="center-table"
                    :data="curDelegation"
                    ref="curDelegateTable"
                    style="padding:6px 0;width:100%;">
            <el-table-column
              prop="time"
              :label="$t('Date')"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="duad"
              :label="$t('Pairs')"
            >
              <template slot-scope="scope">
                {{scope.row.duad.toUpperCase()}}
              </template>
            </el-table-column>
            <el-table-column
              prop="direction"
              :label="$t('Bid/Ask')">
              <template slot-scope="scope">
                <span :class="scope.row.direction == 1?'buy-direction':'sell-direction'">{{scope.row.direction == 1 ? $t('Buy') :$t('Sell')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('Price') + priceLabel">
            </el-table-column>
            <el-table-column
              prop="number"
              :label="$t('Amount') + amountLabel"
              width="140">
            </el-table-column>
            <el-table-column
              prop="total"
              :label="$t('Total')+ '(USDT)' "
              width="140">
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
              :label="$t('Action')"
              width="100">
              <template slot-scope="scope">
                <el-button @click="cancelDelegate(scope.row)" type="text" size="small">{{$t('CancelOrder')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="exchange-table" v-if="isLogin">
          <div class="exchange-table-header cur-delegation">
            <i :class="showHisDelegate?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
               @click="toggleShowHisDelegate"></i>
            {{$t('Order History')}}
          </div>
          <el-table v-show="showHisDelegate"
                    ref="hisDelegateTable"
                    @expand-change="expandLine"
                    class="center-table hisDelegateTable"
                    :data="hisDelegation"
                    style="width: 100%;padding:6px 0;">
            <el-table-column
              prop="time"
              :label="$t('Date')"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="duad"
              :label="$t('Pairs')"
            >
              <template slot-scope="scope">
                {{scope.row.duad.toUpperCase()}}
              </template>
            </el-table-column>
            <el-table-column
              prop="direction"
              :label="$t('Bid/Ask')">
              <template slot-scope="scope">
                <span :class="scope.row.direction == 1?'buy-direction':'sell-direction'">{{scope.row.direction == 1 ? $t('Buy') : $t('Sell')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"

              :label="$t('Price') + priceLabel">
              <template slot-scope="scope">
              	<span v-if="typeof(scope.row.price) == 'string'">{{$t(scope.row.price)}}</span>
              	<span v-else>{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
                prop="number"
                label="数量">
            </el-table-column> -->
            <el-table-column
              prop="number"
              :label="$t('ordering')">
            </el-table-column>
            <el-table-column
              prop="deal"
              :label="$t('Executed') + dealLabel">
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
            <el-table-column
              type="expand"
              prop=""
              :label="$t('Action')"
              width="100"
            >
              <template slot-scope="props">
                <div class="details">
                  <ul class="details_title">
                    <li>{{$t('Date')}}</li>
                    <li>{{$t('Price') + priceLabel}}</li>
                    <li>{{$t('Amount') + amountLabel}}</li>
                    <li>{{$t('Totalturn') + turnoverLabel}}</li>
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
                  <div v-if="!props.row.loading && props.row.detailList.length ==0" class="details_loading"> {{$t('No Records')}}</div>
                  <div v-if="props.row.loading" class="details_loading">
                    <i class="el-icon-loading"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="delHistory(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column> -->
          </el-table>
        </div>
        <el-row :gutter="16">
          <el-col :span="17" class="orderBook" style="padding-right:2px;">
            <div class="exchange-table" ref="change">
              <div class="exchange-table-header cur-delegation">
                <i :class="showDeep?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                  @click="toggleShowDeep"></i>{{$t('Order Book')}}
              </div>
              <el-row v-show="showDeep" :gutter="8">
                <el-col :span="12">
                  <el-table class="center-table realTimeBuy"
                            ref="realTimeBuy"
                            row-class-name="setCursor"
                            :data="realTimeDeal.buy"
                            @cell-click="changePrice"
                            style="width: 100%;padding:6px 0;">
                    <el-table-column
                      prop="role"
                      :label="$t('Bids')"
                    >
                    	<template slot-scope="scope">
                    		<span class="buying">{{scope.row.role}}</span>
                    	</template>
                    </el-table-column>
                    <el-table-column
                      prop="amount"
                      :label="$t('Amount') + amountLabel"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="allamount"
                      :label="$t('Sum') + allAmountLabel">
                    </el-table-column>
                    <el-table-column
                      prop="order_price"
                      :label="$t('Price') + priceLabel">
                    </el-table-column>
                    <el-table-column width="0">
                      <template slot-scope="scope">
                        <b class="bg" v-bind:style="{ top: scope.$index*31+ 'px', width: scope.row.numtemp }"></b>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12">
                  <el-table class="center-table realTimeSell"
                            :data="realTimeDeal.sell"
                            @cell-click="changePrice"
                            ref="realTimeSell"
                            style="width: 100%;padding:6px 0;">
                    <el-table-column
                      prop="order_price"
                      :label="$t('Price') + priceLabel"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="allamount"
                      :label="$t('Sum') + allAmountLabel">
                    </el-table-column>
                    <el-table-column
                      prop="amount"
                      width="90"
                      :label="$t('Amount') + amountLabel"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="role"
                      :label="$t('Asks')">
                      <template slot-scope="scope">
                    		<span class="sell">{{scope.row.role}}</span>
                    	</template>
                    </el-table-column>
                    <el-table-column width="0">
                      <template slot-scope="scope">
                        <b class="bg" v-bind:style="{ top: scope.$index*31+ 'px', width: scope.row.numtemp }"></b>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="7" class="orderBookNext">
            <div class="exchange-table" ref="changeTwo">
              <div class="exchange-table-header cur-delegation">
                <i :class="showRealTime?'arrow-right el-icon-arrow-right i_roate':'arrow-right el-icon-arrow-right'"
                   @click="toggleShowRealTime"></i>
                {{$t('Realtime transactions')}}
              </div>
              <el-table v-show="showRealTime" class="exchange-table center-table trades-table"
                        :data="realTimeDealList"
                        ref="realTimeDeal"
                        @cell-click="changePrice"
                        style="width: 100%;padding:6px 0;box-sizing:border-box;">
                <el-table-column
                  prop="order_time"
                  :label="$t('Date')"
                >
                </el-table-column>
                <el-table-column
                  prop="direction"
                  :label="$t('Bid/Ask')">
                  <template slot-scope="scope">
                    <span :class="scope.row.direction == 1?'buy-direction':'sell-direction'">{{scope.row.direction == 1 ? $t('Buy') : $t('Sell')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="order_price"
                  :label="$t('Price') + priceLabel">
                </el-table-column>
                <el-table-column
                  prop="processed_amount"
                  :label="$t('Amount') + amountLabel">
                </el-table-column>

              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <transition name="slide-fade">
      <div class="shadow" v-show="showSetPinCodeTips">
        <!-- 未认证操作 -->
        <div class="transaction" v-if="$store.getters.hasSettedPinCode == 0">
          <div><img src="~@/assets/img/jiaoyi.png"/></div>
          <div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
            <ul>
              <!-- 请先设置交易密码 -->
              <li>{{$t('Please set up funds password first')}}</li>
              <!-- 只有完成实名认证才可以进行交易 -->
              <li style="padding:0 10px;">{{$t('Only when real name certification is completed can the transaction be conducted')}}~</li>
              <li>
                <p class="later" @click="hideTips">{{$t('CancelLater')}}</p>
                <!-- 去设置 -->
                <router-link class="toAuthenticate" @click.native="hiddenHide" to='/account/security'>{{$t('goSet')}}</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="transaction" v-else-if="$store.getters.authState == 1 || $store.getters.authState == 2">
          <div><img src="~@/assets/img/jiaoyi.png"/></div>
          <div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
            <ul>
              <li></li>
              <!-- 只有完成实名认证才可以进行交易 -->
              <li style="padding:0 10px;">{{$t('Only when real name certification is completed can the transaction be conducted')}}~</li>
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

    <transition name="slide-fade">
      <div class="shadow" v-show="showNoLoginTips">
        <!-- 未登录操作 -->
        <div class="transaction" >
          <div><img src="~@/assets/img/jiaoyi.png"/></div>
          <div class="transactionCode" style="padding-bottom:20px;box-sizing: border-box;">
            <ul>
              <li></li>
              <!-- 只有完成登录才可以进行交易 -->
              <li style="padding:0 10px;">{{$t('Only after completing the login can you trade')}}~</li>
              <li>
                <p class="later" @click="hideTips">{{$t('CancelLater')}}</p>
                <router-link class="toAuthenticate" @click.native="hiddenHide" to='/user/login'>{{$t('GoLogin')}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  // import Vue from 'vue'
  // import VueWebsocket from "vue-websocket";
  // Vue.use(VueWebsocket, "wss://54.65.108.119:9541")
  import ScrollBar from 'vue2-scrollbar'
  import {api} from '@/static/api'
  import {functionDeclaration} from 'babel-types';
  // import ReconnectingWebSocket from 'reconnecting-websocket'
  export default {
    name: 'CoinExchange',
    props: {},
    data() {
      return {
        limitSliderMax: 0,
        marketSliderMax:0,
        sliderUnit: 'USDT',
        // 折叠开关
        tips: {
          limitAmountNotInput: false,
          marketAmountNotInput: false,
        },
        usdtShow:'USDT',
        showNoLoginTips:false,
        showMarket: true,
        showDeal: true,
        showMyCoin: true,
        showNotice: true,
        showKline: true,
        showCurDelegate: true,
        showHisDelegate: true,
        showDeep: true,
        showRealTime: true,
        imgshow: require('@icon64/eth.png'),
        imghide: require('@icon64/btc.png'),
        // 定时器
        curDelegateTimmer: null,
        hisDelegateTimmer: null,
        getAssetsTimmer: null,
        // 当前市场列表选择的项下标
        curIndex: 0,
        curIndexAsset: -1,
        showSetPinCodeTips: false,
        // 当前目标货币
        curDuad: '',
        currency: '',
        tradeCurrency: '',
        tradeCurrencyInfo: {
          name: '',
          order_price: 0,
          p: 0,
          high: 0,
          low: 0,
          star: 0
        },
        socket_1: null,
        socketUrl: '',
        barContainerStyle: {
          width: '6px',
          backgroundColor: '#202832'
        },
        barStyle: {
          width: '6px',
          backgroundColor: '#344253'
        },
        price: {
          usdt: [],
          ut: []
        },
        marketListUSDT: [],
        marketListUT: [],
        mycoins: [],
        exchange: {
          orderType: 'limitprice',
          focusChoose: 'buy',
          balance: 0,
          percent: 0,
          // price:0,
          marketPriceDeal: {
            percent: 0,
            amount: 0,
            price: 0,
            sellDisable: true,
            buyDisable: true
          },
          limitPriceDeal: {
            percent: 0,
            amount: 0,
            price: 0,
            buyDisable: true,
            sellDisable: true
          }
        },
        noticeList: [],
        currencyOptions: [
          {
            value: 'BTC/USDT',
            label: 'BTC/USDT'
          },
          {
            value: 'ETH/USDT',
            label: 'ETH/USDT'
          }
        ],
        curDelegation: [],
        hisDelegation: [],
        realTimeDeal: {
          buy: [],
          sell: []
        },
        realTimeDealList: [],
        historydatamd5: '',
        // 委托量比较基准
        historyCompare: 0,
        historyCompareIndex: 0,
        setLimitPriceBySelf: false  // 设置现价价格时会被ws覆盖 手动设置价格时设置为true ，切换币种时设置为false
      }
    },
    components: {
      ScrollBar
    },
    computed: {
      lang(){
        if(this.$store.getters.getLang == localStorage.getItem('lang')){
             return this.$store.getters.getLang
			  }else {
            return localStorage.getItem('lang')
        }
      },
      limitOrder(){
        return this.showDeal == true?this.$t('Limit Order'):''
      },
      MarketOrder(){
        return this.showDeal == true?this.$t('MarketOrder'):""
      },
      // numBanlance(){
      //    return this.exchange.balance
      // },
      isLogin() {
        return this.$store.getters.loggedIn
      },
      allprice() {
        return (this.exchange.limitPriceDeal.price * this.exchange.limitPriceDeal.amount).toFixed(4)
      },
      iframUrl() {
        return 'https://frontend.unione.io/kline/versiontwo?from=' + this.currency + '&to=' + this.tradeCurrency + '&1524016170='
        // return 'http://localhost:3001/'
      },
      curPrice() {
        if (this.tradeCurrencyInfo) {
          return Math.abs(this.tradeCurrencyInfo.p)
        } else {
          return 0
        }
      },
      priceLabel() {
        return '(' + this.currency + ')'
      },
      dealLabel() {
        return '(' + this.tradeCurrency + ')'
      },
      amountLabel() {
        return '(' + this.tradeCurrency + ')'
      },
      allAmountLabel() {
        return '(' + this.tradeCurrency + ')'
      },
      turnoverLabel() {
        return '(' + this.currency + ')'
      },
      img() {
        return this.tradeCurrency
      }
    },
    created() {

      if (this.$route.query.base != 'USDT') {
        this.$router.push({path: '/exchange/coinexchange'})
      }
      this.changeLan()
      this.getNotice()
    },
    mounted() {
      // this.showTips()
      var self = this
      this.getDuad()
      if(this.$store.getters.loggedIn && JSON.parse(localStorage.getItem('__uinfo')).loggedin){
        this.curDelegateTimmer = setInterval(function () {
          self.getCurDelegate()
        }, 5000)
	      this.hisDelegateTimmer = setInterval(function () {
	        self.getHisDelegate()
	      }, 5000)
	      this.getAssetslist()
        this.userAccount()
      }
      // this.getAssetsTimmer = setInterval(function () {
	    //     self.getAssetslist()
	    // }, 5000)
      // this.getNotice()
    },

    watch: {
      // numBanlance(){
      //     this.getAssetslist()
      // }
        lang(){
          this.changeLan()
        }
    },
    beforeDestroy() {
      var self = this
      clearInterval(self.curDelegateTimmer)
      clearInterval(self.hisDelegateTimmer)
      clearInterval(self.getAssetsTimmer)
    },
    methods: {
      changePrice(row, column, cell, event) {
        this.setLimitPriceBySelf = true
        if (row && row.order_price && this.exchange.orderType == 'limitprice') {
          this.exchange.limitPriceDeal.price = row.order_price
        }
      },
      // 重置比表货币
      getDuad() {
        // 获取当前货币和交易对
        this.tradeCurrency = this.$route.query.tradeCurrency ? this.$route.query.tradeCurrency : (this.currencyOptions[0].value).split('/')[0]
        this.currency = this.$route.query.base ? this.$route.query.base : (this.currencyOptions[0].value).split('/')[1]
        this.curDuad = this.tradeCurrency + '/' + this.currency

        this.getWsByCurrency()
        if(this.$store.getters.loggedIn && JSON.parse(localStorage.getItem('__uinfo')).loggedin){

          this.getCurDelegate()
          this.getHisDelegate()
        }
      },
      // 切换币种
      changeDuad(e) {
        console.log(this.currencyOptions)
        this.setLimitPriceBySelf = false
        this.tradeCurrency = this.curDuad.split('/')[0]
        this.currency = this.curDuad.split('/')[1]

        let msgIndex = 0
        for(let i=0;i<this.currencyOptions.length;i++){
          if(this.curDuad == this.currencyOptions[i].value){
            msgIndex = i
            break
          }
        }
        if(this.currencyOptions[msgIndex].is_recharge == 0){
          this.$message({
            message: this.$t('coinNotExchange'),
            iconClass: 'errorMessage',
            duration: 2000
          })
        }
        this.$router.push({
          path: '/exchange/coinexchange',
          query: {tradeCurrency: this.tradeCurrency, base: this.currency}
        })
        this.getWsByCurrency()
        if(this.$store.getters.loggedIn && JSON.parse(localStorage.getItem('__uinfo')).loggedin){
          this.getAssetslist()

        }
        // this.getCurDelegate()
        // this.getHisDelegate()
      },

      changeDuadByLine(item, index) {
        console.log(item)
        this.setLimitPriceBySelf = false
        this.curIndex = index
        this.tradeCurrency = (item.currency || item.name).toUpperCase()
        // this.$router.currentRoute.query.tradeCurrency = this.tradeCurrency
        // 暂时未开放交易
        if(item.is_recharge == 0){
          this.$message({
            message: this.$t('coinNotExchange'),
            iconClass: 'errorMessage',
            duration: 2000
          })
        }
        this.$router.push({
          path: '/exchange/coinexchange',
          query: {tradeCurrency: this.tradeCurrency, base: this.currency}
        })
        this.curDuad = this.tradeCurrency + '/' + this.currency
        this.exchange.marketPriceDeal.amount = 0
        this.getWsByCurrency()
        if(this.$store.getters.loggedIn && JSON.parse(localStorage.getItem('__uinfo')).loggedin){
          this.getCurDelegate()
          this.getAssetslist()
          this.getHisDelegate()

        }
      },
      // changeDuadByLineAsset(item){
      //     this.curIndexAsset = index
      //     this.tradeCurrency = (item.currency || item.name).toUpperCase()
      //     this.curDuad = this.tradeCurrency + '/' + this.currency
      //     this.getWsByCurrency()
      //     this.getCurDelegate()
      //     this.getHisDelegate()
      // },
      // 根据当前货币获取接口
      getWsByCurrency() {
        var self = this
        var data = {
          currency: this.currency,
          trade_currency: this.tradeCurrency
        }
        api.getWsByCurrency(data)
          .then(res => {
            if (res.error_code == 1000) {
              this.socketUrl = 'wss://' + res.port_info.ip + '/sb/?port=' + res.port_info.pan_port
              this.initWs()
            }
          }).catch(err => {
        })
      },
      initWs() {
        var self = this
        if (this.socket_1) {
          this.socket_1.close()
          this.socket_1 = null
        }
        this.socket_1 = new WebSocket(this.socketUrl)
        this.socket_1.onmessage = function (data) {

          var res = JSON.parse(data.data)
          self.setKlineOption(res.price)
          self.normalizeCurPrice(res)
          self.normalizeRealTime(res.sb)
          if(res.nb){
            self.realTimeDealList = res.nb
          }else{
            self.realTimeDealList = []
          }
          // 如果有则赋值到市价交易默认值
          console.log(res)
          if(res.sbprice){
            if ((res.sbprice.order_price || res.sbprice.order_price == 0) && (self.setLimitPriceBySelf == false)) {  //
              self.exchange.limitPriceDeal.price = res.sbprice.order_price
            }

          }
        }
      },
      // 设置交易对
      setKlineOption(data){
        // TODO 未来切换交易对
        let usdtData = data.usdt
        let arrTemp = []
        let strTemp = '/USDT'
        for(let i=0;i<usdtData.length;i++){
          let name = usdtData[i].name.toUpperCase() + strTemp
          arrTemp.push({
            label: name,
            value: name,
            is_recharge: usdtData[i].is_recharge
          })
        }
        this.currencyOptions = arrTemp
      },
      normalizeRealTime(res) {
        var self = this
        self.realTimeDeal.buy = []
        self.realTimeDeal.sell = []
        for (var i = 0, imax = res.buy.length; i < imax; i++) {
          var item = {}
          item.allamount = res.buy[i].allamount
          item.amount = res.buy[i].amount
          item.order_price = res.buy[i].order_price
          item.role = this.$t('Bid') + (i + 1).toString()
          self.realTimeDeal.buy.push(item)
        }
        for (var i = 0, imax = res.sell.length; i < imax; i++) {
          var item = {}
          item.allamount = res.sell[i].allamount
          item.amount = res.sell[i].amount
          item.order_price = res.sell[i].order_price
          item.role = this.$t('Ask') + (i + 1).toString()
          self.realTimeDeal.sell.push(item)
        }
        let buy = this.realTimeDeal.buy
        let sell = this.realTimeDeal.sell
        if(buy.length > 0){
          this.setBgForTable(buy,'amount')
        }
        if(sell.length >0){
          this.setBgForTable(sell,'amount')
        }
      },
      normalizeCurPrice(res) {
        var self = this
        this.tradeCurrencyInfo = res.one
        this.marketListUSDT = res.price.usdt
        this.marketListUT = res.price.ut
        for (var i in this.marketListUSDT) {
          self.marketListUSDT[i].icon = '$'
          self.marketListUSDT[i].positive = self.marketListUSDT[i].p >= 0 ? true : false
          // this.marketListUSDT.forEach((o,i)=>{
          if (self.marketListUSDT[i].name.toUpperCase() == this.tradeCurrency) {
            this.curIndex = i
          }
          // })
        }
        for (var i in this.marketListUT) {
          self.marketListUT[i].icon = '$'
          self.marketListUT[i].positive = self.marketListUSDT[i].p >= 0 ? true : false
        }
      },
//    computeLimitAmount() {
//      console.log(this.exchange.limitPriceDeal.price, this.exchange.limitPriceDeal.percent)
//      this.$message({
//      	message: this.exchange.limitPriceDeal.price,
//      	iconClass: 'successMessage',
//      	duration: 3000
//      })
//      if (this.exchange.limitPriceDeal.price == 0) {
//        this.exchange.limitPriceDeal.amount = 0
//        return
//      } else {
//        // this.exchange.limitPriceDeal.amount = (Math.floor(this.exchange.balance / this.exchange.limitPriceDeal.price * this.exchange.limitPriceDeal.percent / 100))
//        this.exchange.limitPriceDeal.amount = this.exchange.limitPriceDeal.percent
//      }
//      console.log('限价交易：', this.exchange.limitPriceDeal.amount)
//    },

      getFocus(e) {
        this.exchange.focusChoose = e.target.name
        this.exchange.marketPriceDeal.amount = 0
        this.exchange.marketPriceDeal.sellDisable = true
        // 这里计算好slider的最大值
        this.marketSliderMax = Math.floor(this.exchange.balance)
        this.sliderUnit = 'USDT'
      },
      getSellFocus(e){
      	this.exchange.focusChoose = e.target.name
      	this.exchange.marketPriceDeal.price = 0
      	this.exchange.marketPriceDeal.buyDisable = true
      	this.changeMarketSliderInfo()
      },
      getSellBlur(){
      	this.marketSliderMax = 0
      	// 滑块单位
      	this.sliderUnit = ''
      },
      // 市价 改变滑块显示单位 和最大值
      changeMarketSliderInfo(){
      	if(this.mycoins){
      		this.marketSliderMax = Math.floor(this.mycoins[1].available)
      		this.sliderUnit = this.mycoins[1].currency.toUpperCase()
      	}
      	// 滑块单位
      },
      getBuyKeyup(e) {
        if (!/^\d*\.?\d{0,8}$/.test(Number(e.target.value))) {
          const num = Number(e.target.value).toFixed(9)
          const numTwo = num.substring(0, num.lastIndexOf('.') + 9)
          this.exchange.marketPriceDeal.price = numTwo
        }
        if (Number(e.target.value) > 0) {
        	this.exchange.marketPriceDeal.percent = this.exchange.marketPriceDeal.price
          this.exchange.marketPriceDeal.buyDisable = false
          this.exchange.marketPriceDeal.sellDisable = true

          this.exchange.marketPriceDeal.amount = 0
        } else {
          this.exchange.marketPriceDeal.sellDisable = false
        }
      },
      getSellKeyup(e) {
        if (!/^\d*\.?\d{0,4}$/.test(Number(e.target.value))) {
          const num = Number(e.target.value).toFixed(5)
          const numTwo = num.substring(0, num.lastIndexOf('.') + 5)
          this.exchange.marketPriceDeal.amount = numTwo
        }
        if (Number(e.target.value) > 0) {
        	this.exchange.marketPriceDeal.price = 0
        	this.exchange.marketPriceDeal.percent = this.exchange.marketPriceDeal.amount
          this.exchange.marketPriceDeal.buyDisable = true
          this.exchange.marketPriceDeal.sellDisable = false
        } else {
          this.exchange.marketPriceDeal.buyDisable = false
        }
      },
      computeMarketAmount() {
        if (this.exchange.focusChoose == 'sell') {
          // 市价卖
          this.exchange.marketPriceDeal.amount = this.exchange.marketPriceDeal.percent
          if (this.exchange.marketPriceDeal.amount > 0) {
            this.exchange.marketPriceDeal.buyDisable = true
          } else {
            this.exchange.marketPriceDeal.buyDisable = false
          }
          return
        } else{
          // 市价买
          this.exchange.marketPriceDeal.price = this.exchange.marketPriceDeal.percent
          if (this.exchange.marketPriceDeal.price > 0) {
            this.exchange.marketPriceDeal.sellDisable = true
          } else {
            this.exchange.marketPriceDeal.sellDisable = false
          }
        }
      },
      // 获取当前委托
      getCurDelegate() {
        var data = {
          currency: this.currency,
          trade_currency: this.tradeCurrency,
          page: 1
        }
        api.curDelegate(data)
          .then(res => {
            // console.log("当前委托",res)
            this.curDelegation = res.entrusts
          }).catch(err => {

        })
      },

      setBgForTable(data,param){   // 数据 ，类名，
        // TODO 对参数类型的判断
        // 修改为买入和卖出的数据
        let dataFix = new Array.concat(this.realTimeDeal.buy)
        dataFix = dataFix.concat(this.realTimeDeal.sell)
        let lenFix = dataFix.length
        let dataHis = data
        let len = dataHis.length
        if(lenFix){
          if(lenFix >= 1){
            for(let i=0;i<lenFix;i++){
              if(this.historyCompare < dataFix[i][param]){
                this.historyCompare = dataFix[i][param]
              }
            }
          }
        }
        if(this.historyCompare){
          for(let j=0;j<len;j++){
            let numTemp = ''
            let temp = j
              let numTempNum = data[temp][param] / this.historyCompare*100
              if(numTempNum < 1){
                numTemp = '1%'
              }else{
                numTemp = numTempNum + '%'
              }
              data[temp].numtemp = numTemp

          }
        }

      },
      // 获取历史委托
      getHisDelegate() {
        var data = {
          currency: this.currency,
          trade_currency: this.tradeCurrency,
          page: 1
        }
        api.hisDelegate(data)
          .then(res => {

            if (this.historydatamd5 != res.md5_entrusts) {
              this.hisDelegation = res.entrusts
              this.historydatamd5 = res.md5_entrusts

            }
          }).catch(err => {

        })
      },
      checkAmountInput() {
        if (this.exchange.orderType == 'limitprice') {

          if (!this.exchange.limitPriceDeal.amount) {
            this.tips.limitAmountNotInput = true;
          }
        } else {
          if (!this.exchange.marketPriceDeal.amount) {
            this.tips.marketAmountNotInput = true;
          }
        }
      },
      // 新增委托
      addDelegate($event) {
      	var userinfo = JSON.parse(localStorage.getItem('__uinfo'))
	      if (userinfo && userinfo.email != '') {
	        // 调用接口
        this.checkAmountInput()


        if (this.$store.getters.hasSettedPinCode == 0 || this.$store.getters.authState == 1 || this.$store.getters.authState == 2) {
          this.showSetPinCodeTips = true
          document.body.style.overflow = 'hidden'
          return
        }

        const trade_type = $event.currentTarget.value == 'purchase' ? 1 : 2


        var deal = this.exchange.orderType == 'limitprice' ? this.exchange.limitPriceDeal : this.exchange.marketPriceDeal

        var orderType = this.exchange.orderType == 'limitprice' ? 0 : 1
        // 如果市价
        if (this.exchange.orderType == 'limitprice') {
          deal = this.exchange.limitPriceDeal
        } else {
          deal = JSON.parse(JSON.stringify(this.exchange.marketPriceDeal))
          // 如果是买，将price字段变为amount
          if (trade_type == 1) {
            deal.amount = deal.price
            deal.price = 0
          } else if (trade_type == 2) {
            deal.price = 0
          }
        }


        // 如果是限价，检查总额是否超出
        if (this.exchange.orderType == 0 && this.exchange.limitPriceDeal.amount * this.exchange.limitPriceDeal.price > this.exchange.balance) {
          this.$message({
            // '交易额超过当前账户余额'
              message: this.$t('Turnover'),
              iconClass: 'errorMessage',
              duration: 1000
            })
          return
        }
        if(!this.exchange.limitPriceDeal.price && orderType == 0){
        	this.$message({
            // '交易价格不得为空'
              message: this.$t('noPrice'),
              iconClass: 'errorMessage',
              duration: 1000
            })
          return
        }
        var data = {
          order_amount: deal.amount,  //订单数量
          order_price: Number(deal.price),          //订单价格
          order_type: orderType,                    //订单类型，0 限价单，1市价单
          currency: this.currency,                 //基础货币，货币符号 CNY,BTC，ETH，UT等
          trade_currency: this.tradeCurrency,     //交易货币，货币符号 CNY,BTC，ETH，UT等
          trade_type: trade_type               //交易类型，0买单，1买单
        }
        if(data.order_amount <= 0){
          return
        }
        api.addDelegate(data)
          .then(res => {
            this.userAccount()
            this.getCurDelegate()
            // 如果此次是限价交易，则重新获取一次当前价格
            if (orderType == 0) {
              this.exchange.limitPriceDeal.price = this.tradeCurrencyInfo.order_price
            }
            // 清空市价交易额和卖出数量 和限价 数量
            this.exchange.limitPriceDeal.amount = 0
            this.exchange.marketPriceDeal.price = 0
            this.exchange.marketPriceDeal.amount = 0
            this.initWs()  // 这里为了委托量底色在交易后实时变化
            this.$message({
              // '新增委托成功'
              message: this.$t('Added'),
              type: 'success',
              iconClass: 'successMessage',
              duration: 1000
            })
            this.getAssetslist()
          })
	      }else{
	      	this.showTips()
	      	return
	      }
      },
      // 取消委托
      cancelDelegate(row) {
        var data = {
          order_id: row.id,
          order_type: row.order_type,
          currency: row.currency,
          trade_currency: row.trade_currency
        }
        api.cancelDelegate(data)
          .then(res => {
            //  '撤销委托成功'
            this.$message({
              message: this.$t('Revocation'),
              iconClass: 'successMessage',
              type: 'success',
              duration: 1000
            })
            // TODO 未来时间需要缩短
            setTimeout(()=>{
              // 撤销返还可用
              this.getAssetslist()
              this.userAccount()
            },1000)
            this.getCurDelegate()
            this.getAssetslist()
          })
      },
      // 改变语言
      changeLan() {
        let langs = {
          "zh-cn": {
            name:"简体中文",
            code:1
          },
          "en-us": {
            name:"English",
            code:0
          }
        }
        let params = {
          type: langs[this.lang].code
        };
        api.setUserLanguage(params)
          .then(res => {
            this.getNotice();
          })
          .catch(err => {
          });
      },
      getNotice() {
        this.noticeList = []
        var data = {
          type: 1
        }
        api.getNotice(data)
          .then(res => {
            if (res.error_code == 1000) {
              console.log(res,'res')
              this.noticeList = res.data
            }
          }).catch(err => {

        })
      },
      getAssetslist() {
        var data = {
          currency: this.currency,
          trade_currency: this.tradeCurrency
        }
        // api.getAssetslist(data)
        api.accountPair(data)
          .then(res => {
            if (res.error_code == 1000) {
              this.mycoins = res.assets_list
              this.limitSliderMax = Math.floor(this.exchange.balance / this.exchange.limitPriceDeal.price)
              if(this.mycoins){
              	this.sliderUnit = this.mycoins[1].currency.toUpperCase()
              }
            }
          }).catch(err => {

        })
      },
      // 提币
      getCoin(item) {
        if (this.$store.getters.hasSettedPinCode == 0 || this.$store.getters.authState == 1 || this.$store.getters.authState == 2) {
          this.showSetPinCodeTips = true
          document.body.style.overflow = 'hidden'
          return
        }
        this.$router.push({name: 'coinoption', path: '/property/coinoption', params: {dealId: item.id, type: 2}})

      },
      // 冲币
      addCoin(item) {
        // if (this.$store.getters.hasSettedPinCode == 0 || this.$store.getters.authState == 1 || this.$store.getters.authState == 2) {
        //   this.showSetPinCodeTips = true
        //   document.body.style.overflow = 'hidden'
        //   return
        // }
        this.$router.push({name: 'coinoption', path: '/property/coinoption', params: {dealId: item.id, type: 1}})
      },
      userAccount() {
        var data = {
          currency: this.currency
        }
        api.userAccount(data)
          .then(res => {
            if (res.error_code == 1000) {
              console.log(res.available)
              this.exchange.balance = res.available
            }
          }).catch(err => {

        })
      },
      jumpNotice(item) {
        this.$router.push({path: '/notice/detail', query: {id: item.notice_id}})
      },
      expandLine(row, expandedRows) {
        var self = this
        if (row.detailList && row.detailList.length >= 0) {
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
            if (res.error_code == 1000) {
              this.$set(row, 'detailList', res.entrusts)
              this.$set(row, 'loading', false)
            }
          }).catch(err => {
        })
      },
      // 切换
      toggleShowMarket() {
        this.tips.limitAmountNotInput = false
        this.showMarket = !this.showMarket
        if(this.usdtShow == 'USDT'){
          this.usdtShow = ''
        }else{
          this.usdtShow = 'USDT'
        }
      },
      toggleShowDeal() {
        this.showDeal = !this.showDeal
      },
      toggleShowMyCoin() {
        this.showMyCoin = !this.showMyCoin
      },
      toggleShowKline() {
        this.showKline = !this.showKline

      },
      toggleShowCurDelegate() {
        this.showCurDelegate = !this.showCurDelegate
        this.$nextTick(() => {
          this.$refs.curDelegateTable.doLayout()
        })
      },
      toggleShowHisDelegate() {
        this.showHisDelegate = !this.showHisDelegate
        this.$nextTick(() => {
          this.$refs.hisDelegateTable.doLayout()
        })
      },
      toggleShowDeep() {
        if(this.$refs.change.style.height == '40px'){
          this.$refs.change.style.height = '703px'
        }else{
          this.$refs.change.style.height = '40px'
        }
        this.showDeep = !this.showDeep
        this.$nextTick(() => {
          this.$refs.realTimeBuy.doLayout()
          this.$refs.realTimeSell.doLayout()
        })
      },
      toggleShowRealTime() {
        if(this.$refs.changeTwo.style.height == '40px'){
          this.$refs.changeTwo.style.height = '703px'
        }else{
          this.$refs.changeTwo.style.height = '40px'
        }
        this.showRealTime = !this.showRealTime
        this.$nextTick(() => {
          this.$refs.realTimeDeal.doLayout()
        })
      },
      toggleShowNotice() {
        this.showNotice = !this.showNotice
      },
      //限价价格只能输入两位小数
      num(e) {
        // btc eth 限制两位 其他限制为4位
        console.log(this.tradeCurrency)
        this.setLimitPriceBySelf = true
        if (!e) return
        if(this.tradeCurrency == 'BTC' || this.tradeCurrency == 'ETH'){
         if (!/^\d*\.?\d{0,2}$/.test(e)) {
            const num = Number(e).toFixed(3)
            const numTwo = num.substring(0, num.lastIndexOf('.') + 3)
            this.exchange.limitPriceDeal.price = numTwo
          }
        }else{
          if (!/^\d*\.?\d{0,4}$/.test(e)) {
            const num = Number(e).toFixed(4)
            const numTwo = num.substring(0, num.lastIndexOf('.') + 5)
            this.exchange.limitPriceDeal.price = numTwo
          }

        }

      },
      //限价数量只能输入四位小数
      amount(e) {
      	this.exchange.limitPriceDeal.percent = 0
        if (!e) return
        if (!/^\d*\.?\d{0,4}$/.test(e)) {
          let num = Number(e).toFixed(5)
          let numTwo = num.substring(0, num.lastIndexOf('.') + 5)
          this.exchange.limitPriceDeal.amount = numTwo
        }
        let max = 0
        // if(this.exchange.balance){
        // 	max = Math.floor(this.exchange.balance / this.exchange.limitPriceDeal.price)
        // }
        if(max){
        	if(this.exchange.limitPriceDeal.amount > max){
        		this.exchange.limitPriceDeal.amount = max
        		this.exchange.limitPriceDeal.percent = max
        	}else if(this.exchange.limitPriceDeal.amount == 0){
        		this.exchange.limitPriceDeal.percent = 0 // 滑块
        	}else{
        		this.exchange.limitPriceDeal.percent = this.exchange.limitPriceDeal.amount
        	}
        }
      },
      hiddenHide() {
        document.body.style.overflow = 'auto'
      },
      hideTips() {
        this.showSetPinCodeTips = false
        this.showNoLoginTips = false
        document.body.style.overflow = 'auto'
      },
      showTips() {
        if (this.isLogin == false) {
          this.showNoLoginTips = true
          document.body.style.overflow = 'hidden'
        } else if (this.$store.getters.hasSettedPinCode == 0 || this.$store.getters.authState == 1) {
          this.showSetPinCodeTips = true
          document.body.style.overflow = 'hidden'
        }
      }
    }
  }
</script>
<style lang='scss' scoped >
  @import './exchange.scss';
</style>
