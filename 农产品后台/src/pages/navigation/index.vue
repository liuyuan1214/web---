<template>
<div style="height:100%;width:90%" class="f-pr">
   <img src="../../../static/navigation/navigationbg.png" style="width:100%;height:100%" alt="">
   <linkitem v-for="(item,index) in introlist" :class="['f-pa', 'pose1']" :key="index" :style="item.pose"
    :imgurl="item.imgurl" :intro="item.intro" :pageName="item.pageName" :pageRoute="item.pageRoute"></linkitem>
</div>
</template>


<script>
import linkitem from './linkitem';
export default {
	name:'navigation',
    data(){
    	return {
			introlist:[
				{imgurl:'maininfo',pageName:'主体信息',pageRoute:'mainInfo',intro:'维护主体信息',pose:{top:'39.68%',left:'8.18%'}},
				{imgurl:'display',pageName:'企业展示',pageRoute:'display',intro:'维护企业图片信息',pose:{top:'15.64%',left:'18.12%'}},
				{imgurl:'landinfo',pageName:'地块信息',pageRoute:'landInfo',intro:'维护地块(场所)信息',pose:{top:'31.23%',left:'38.75%'}},
				{imgurl:'product',pageName:'产品维护',pageRoute:'productionMaintain',intro:'维护单位的产品信息',pose:{top:'60.69%',left:'30.12%'}},
				{imgurl:'inputinfo',pageName:'投入品维护',pageRoute:'inputMaintain',intro:'维护农事操作所需的投入品信息',pose:{top:'52.11%',left:'60.23%'}},
				{imgurl:'customer',pageName:'客户管理',pageRoute:'customer',intro:'维护客户信息',pose:{top:'22.31%',left:'71.25%'}},
				{imgurl:'storemaintion',pageName:'商铺维护',pageRoute:'storeMaintain',intro:'维护线上电商门店',pose:{top:'39.69%',left:'87.99%'}}
			]
    	}
	},
	components:{
		linkitem
	}
}
</script>

<style scoped lang="scss">
.pose1{
    top: 40%;
    left: 8%;
}

</style>
