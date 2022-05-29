<script>
	import util from '@/js/util'
	export default {
		name:"sHeader",
		data(){
			return {

			}
		},
		render(h){
			return h(
				'div',
				{
					'class':['f-df','f-fww','header-content'],
					'attrs':{
						'sw-mode':'wrap',
					},
				},
				[
					this.$slots.default,
					h('div',{
						'class':['g-mes-button', 'f-df', 'f-aic']
						},
						h('el-button',{
								attrs:{'primary'},
								on:{
									click:this.search
								},
							},'查询'),this.$slots.btn]
					),
				]
			)
		},
		methods:{
			search(){
				this.$emit('headerContentSearch')
			}
		},
		props:{
			needReset:{
				type:Boolean,
				default:true,
			},
			needSearch:{
				type:Boolean,
				default:true,
			},
			data: {
				type: Object,
				default: null
			}

		}
	}

</script>

<style lang="scss" scoped>
@import '../../css/theme-default.scss';
.header-content{
	margin:10px;
	padding-bottom :10px;
	border-bottom:1px solid #333333;
	min-width:400px;
}
.g-mes-button{
	padding-left:40px;
	.baseColor{
		background:$mesMenuColor;
	}
	button{
		margin-right:10px;
	}
}

</style>

