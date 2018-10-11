<template>
	<div class="login_banner">
		<router-view/>

	</div>
</template>
<script>
	import Navibar from '@/components/Navibar'
	import Topline from '@/components/Topline'
	import Foot from '@/components/Foot'

	export default {
		name: 'User',
		components: {
			Topline,
			Navibar,
			Foot
		}
	}
</script>

<style scoped>
	.login_banner {
		overflow: hidden;
		width: 100%;
		height: 1020px;
		background: #001428 url('~@/assets/img/index7.png') no-repeat center;
		text-align: center;
	}
</style>