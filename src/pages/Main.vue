<template>
	<div>
		<topline></topline>
		<navibar></navibar>
		<div class="main-back">
			<router-view/>
		</div>
		<foot></foot>
	</div>
</template>

<script>
	import Topline from '@/components/Topline'
	import Navibar from '@/components/Navibar'
	import Foot from '@/components/Foot'
	export default {
		name: 'Main',
		props: {

		},
		data() {
			return {

			}
		},
		components: {
			Topline,
			Navibar,
			Foot
		},
		created() {

		},
		mounted() {

		},
		watch: {

		},
		methods: {

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.main-back {
		background-color: #151920;
    overflow: hidden;
    min-height: 800px;
	}
</style>
