<template>
	<div class="index_top">
		<div class="btc_eth" v-for="(item,index) in marketListUSDT" :key="index" v-if="item.name == 'BTC' || item.name == 'ETH'">
			{{item.name}}/CNY : <span :class="item.positive?'fall':'rise'">{{(item.order_price * usdtcny).toFixed(2)}}</span>
			<!-- ETH/CNY : <span>{{ethcny}}</span> -->
		</div>
		USDT/CNY : {{usdtcny}}
		<div class="lanage-selecter">
			<el-dropdown  size="mini" @command="changeLang" trigger="click">
				<span class="el-dropdown-link">
          {{langLabel}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
				<el-dropdown-menu class="lanage" slot="dropdown">
					<template v-for="(v,k) in langs">
						<el-dropdown-item :command="k"  :key="v.name">{{v.name}}</el-dropdown-item>
					</template>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { api } from "@/static/api";
export default {
  name: "Topline",
  props: {},

  data() {
    return {
      thisSocketUrl: "",
      thisSocket: null,
      marketListUSDT: [],
      btccny: "",
      ethcny: "",
      type: "",
      usdtcny: 6.31,
      lang: "en-us",
      langs: {
        "zh-cn": {
          name: "简体中文",
          code: 1
        },
        "en-us": {
          name: "English",
          code: 0
        }
      }
    };
  },
  created() {
    this.getPortAll();
    if (localStorage.getItem("lang")) {
      this.lang = localStorage.getItem("lang");
    }

    // this.$store.state.userInfo.language_node = this.langs.code
  },
  computed: {
    langLabel() {
      return this.langs[this.lang].name;
    }
  },
  mounted() {
    // var self = this
    // this.newsocket.onmessage = function(data) {
    // 	console.log('原始ws数据', data)
    // 	var res = JSON.parse(data.data)
    // 	console.log('ws数据：', res)
    // 	self.marketListUSDT = res.price.usdt
    // 	console.log('usdt数据', self.marketListUSDT)
    // 	for(var i in self.marketListUSDT) {
    // 		self.marketListUSDT[i].positive = self.marketListUSDT[i].p >= 0 ? true : false
    // 	}
    // }
  },
  watch: {},
  methods: {
    // 获取信息
    getInfo() {},
    changeLang(lang) {
      this.lang = lang;
      localStorage.setItem("lang", lang);
      this.$store.state.userInfo.lang = lang;
      this.$store.dispatch("changeLang", { lang: lang });
      this.$i18n.locale = lang;

      // if (this.$store.getters.loggedIn) {
        var data = {
          type: this.langs[lang].code
        };
        api
          .setUserLanguage(data)
          .then(res => {
            console.log(res);
          })
          .catch(err => {});
      // }
    },
    getPortAll() {
      var data = {};
      api.getPortAll(data).then(res => {
        if (res.error_code == 1000) {
          this.thisSocketUrl =
            "wss://" +
            res.port_info[0].ip +
            "/sb/?port=" +
            res.port_info[0].pan_port;
          this.initWs();
        }
      });
    },
    initWs() {
      var self = this;
      if (this.thisSocket) {
        this.thisSocket.close();
        this.thisSocket = null;
      }
      this.thisSocket = new WebSocket(this.thisSocketUrl);
      this.thisSocket.onmessage = function(data) {
        var res = JSON.parse(data.data);
        self.marketListUSDT = res.price.usdt;
        for (var i in self.marketListUSDT) {
          self.marketListUSDT[i].positive =
            self.marketListUSDT[i].p >= 0 ? true : false;
        }
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index_top {
  text-align: center;
  width: 100%;
  min-height: 35px;
  background: #07090b;
  font-size: 12px;
  line-height: 35px;
  color: #4e6780;
  height: auto;
}
.index_top .btc_eth:first-child {
  margin-left: 100px;
}

.btc_eth {
  display: inline;
}

.lanage-selecter {
  float: right;
  margin-right: 50px;
  height: 35px;
  overflow: hidden;
}

.el-dropdown-link {
  font-size: 12px;
  color: #67778c;
}

.index_top span {
  margin-right: 20px;
}

.rise {
  color: #a4454b;
}

.fall {
  color: #5ead6f;
}
.el-dropdown {
  cursor: pointer;
}
</style>
