<template>
	<div id="drag">
		<div class="drag_bg weui-btn_primary" :style="{width:curW + 20 +'px'}"></div>
		<div class="drag_text" onselectstart="return false;" unselectable="on" :class="[isDragOk ? 'whitecolor':'graycolor']">{{text}}</div>
		<div class="handler" :style="{left:curW+'px'}" :class="[isDragOk ? 'handler_ok_bg':'handler_bg']"></div>
	</div>
</template>

<script>
	export default {
		name: 'Slider',
		props: {},
		data() {
			return {
				curW: 0,
				isMove: false, //是否在运动
				isDragOk: false, //是否拖动成功
				maxWidth: 0, //拖动的最大宽度
				element: {},
				currentPos: {
					x: 0,
					y: 0
				}
			}
		},
		created() {},
		computed:{
			text(){
        		return this.isDragOk? this.$t('Verified'):this.$t('Please slide to verify!')
			}
		},
		mounted() {
			var self = this;
			this.element = document.querySelector('.handler');
			this.getMaxWidth();
			window.addEventListener('resize', function() {
				self.getMaxWidth()
			});
			window.addEventListener('orientationchange', function() {
				self.getMaxWidth()
			});

			this.element.addEventListener('touchstart', self.touchstartFun, false);
			document.querySelector('body').addEventListener('touchmove', self.touchmoveFun, false);
			document.querySelector('body').addEventListener('touchend', self.touchendFun, false);

			this.element.addEventListener('mousedown', self.touchstartFun, false);
			document.querySelector('body').addEventListener('mousemove', self.touchmoveFun, false);
			document.querySelector('body').addEventListener('mouseup', self.touchendFun, false);

			(function drawAnimate() {
				if(self.curW <= self.maxWidth) {
					window.requestAnimationFrame(drawAnimate, 1000 / 60);
					self.curW = self.currentPos.x;
				} else {
					self.curW = self.currentPos.x = self.maxWidth;
				}
			})()
		},
		watch: {},
		methods: {
			touchstartFun(e) {
				if(this.isDragOk) {
					e.preventDefault();
					return;
				}
				this.isMove = true;
				this.curW = this.currentPos.x = this.getCurrentPosition(e).x;
			},
			touchmoveFun(e) {
				if(this.isMove && this.curW > 0 && this.curW < this.maxWidth) {
					this.currentPos.x = this.getCurrentPosition(e).x;
				} else if(this.isMove && this.curW >= this.maxWidth) {
					this.curW = this.currentPos.x = this.maxWidth;
					this.isDragOk = true;
					// console.log(this.isDragOk,'slide')
					this.$emit('slidercomplete', this.isDragOk)
				}
			},
			touchendFun(e) {
				this.isMove = false;
				if(this.curW < this.maxWidth) {
					this.curW = this.currentPos.x = 0;
				}
			},

			getCurrentPosition(event) {
				var xPos, yPos, rect;
				rect = document.getElementById('drag').getBoundingClientRect();
				//event = event.originalEvent;
				//判断是touch，还是鼠标事件
				if(event.type.indexOf('touch') !== -1) {
					xPos = event.touches[0].clientX - rect.left;
					yPos = event.touches[0].clientY - rect.top;
				}

				//鼠标事件
				else {
					xPos = event.clientX - rect.left;
					yPos = event.clientY - rect.top;
				}
				return {
					x: xPos,
					y: yPos
				}
			},
			getMaxWidth() {
				if(document.querySelector("#drag") && document.querySelector(".handler")){
				// 解决控制台 报clientWidth null错
				this.maxWidth = document.querySelector("#drag").clientWidth - document.querySelector(".handler").scrollWidth;

				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#drag {
		font-weight: bold;
		position: relative;
		background-color: #e8e8e8;
		/* width: 100%; */
		text-align: center;
		border-radius: 999px;
		width: 312px;
		height: 40px;
		line-height: 40px;
		background: url('~@/assets/img/index12.png') no-repeat center;
		border-radius: 999px;
		font-size: 14px;
		overflow: hidden;
	}

	#drag .drag_bg {
		background: #656dfc;
		height: 40px;
		width: 0;
		border-top-left-radius: 999px;
		border-bottom-left-radius: 999px;
		margin-left: 0;
	}

	#drag .drag_text {
		position: absolute;
		top: 0px;
		width: 100%;
		-moz-user-select: none;
		-webkit-user-select: none;
		user-select: none;
		-o-user-select: none;
		-ms-user-select: none;
		border-radius: 999px;
	}

	.drag_text.graycolor {
		border-radius: 999px;
		color: #bfbfbf;
	}

	.drag_text.whitecolor {
		border-radius: 999px;
		color: #ffffff;
	}

	#drag .handler {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 40px;
		height: 40px;
		/* border: 1px solid #656dfc; */
		cursor: move;
	}

	.handler_bg {
		background: #656dfc url('~@/assets/img/arrow.png') no-repeat center;
		color: #fff;
		border-radius: 999px;
	}

	.handler_ok_bg {
		background: #656dfc url('~@/assets/img/arrow.png') no-repeat center;
		color: #fff;
		border-radius: 999px;
	}
</style>
