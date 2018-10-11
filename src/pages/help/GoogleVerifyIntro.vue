<template>
	<div style="overflow:hidden;">
		<div class="settingMain">
			<div class="section">
				<p class="section_title">新手帮助 <i class="el-icon-arrow-right"></i><span>如何验证谷歌验证码</span></p>

				<h5 class="title_1">如何设置谷歌验证码</h5>
				<p class="one">
					一、使用手机下载谷歌验证器。iOS用户登录AppStore搜索"Authenticator"，安卓用户登录应用商店或利用手机<br /> 浏览器搜索“谷歌验证器”下载。
					<br /> iOS版下载链接：
					<a href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8">https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8</a><br /> 安卓版下载链接：
					<a href="http://shouji.baidu.com/software/22417419.html">http://shouji.baidu.com/software/22417419.html</a>
				</p>
				<p class="title_2">安卓版谷歌验证器扫码下载</p>

				<p class="one two">
					二、iOS手机用户：请打开谷歌验证器APP，点击右上角"+"，选择"扫描条形码"。<br /> 安卓手机用户：无法扫描条形码，请您选择“手动输入验证码”，按下图输入相关信息后选择“√”保存。
				</p>

				<p class="one">
					三、扫描火币绑定页面中显示的二维码或手动输入下图红框中所示密钥，此时您手机中的谷歌验证器APP将生成<br /> 一串6位数字的验证码，填入空格，点击绑定。
				</p>

				<p class="one">
					四、在新的页面输入邮箱验证码/短信验证码，邮箱验证码有效期是30分钟，短信验证码有效期是10分钟，谷歌<br /> 验证码有效期是30秒。如果您频繁尝试，但是仍提示您谷歌验证码错误，请您将手机和电脑的时间同步一下，调
					<br /> 成一致。
				</p>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'GoogleVerifyIntro'
	}
</script>
<style scoped>
	.settingMain {
		width: 1200px;
		height: 943px;
		margin: 0 auto;
		background: #191f27;
		margin-top: 40px;
	}
	
	.section {
		width: 1120px;
		height: 943px;
		margin: 0 auto;
	}
	
	.section_title {
		font-size: 14px;
		color: #434f63;
		line-height: 52px;
	}
	
	.section_title span {
		color: #c2c3ca;
	}
	
	.title_1,
	.title_2 {
		font-size: 22px;
		color: #fefefe;
		margin-top: 60px;
		text-indent: 17px;
	}
	
	.title_2 {
		font-size: 18px;
		color: #cfd0d1;
	}
	
	.one {
		font-size: 18px;
		color: #cfd0d1;
		margin: 30px 0 0 17px;
		line-height: 40px;
	}
	
	.one a {
		color: #cfd0d1;
	}
	
	.one a:visited {
		color: #cfd0d1!important;
	}
	
	.two {
		margin-top: 20px;
	}
</style>