<template>
<div class="f-df linkitem">
    <img v-if="imgurl"  @click="$router.push({name:pageRoute})" class="pageImg f-cp" :src="'./static/navigation/'+imgurl+'.png'" alt="">
    <div class="f-f1">
        <div class="pageName">{{pageName}}</div>
        <div class="intro">{{intro}}</div>
    </div>
</div>
</template>


<script>
export default {
    data(){
    	return {
    		
    	}
    },
    props:{
        imgurl:{
            type:String,
            default:''
        },
        pageName:{
            type:String,
            default:''
        },
        pageRoute:{
            type:String,
            default:''    
        },
        intro:{
            type:String,
            default:''
        }
    },
	mounted(){
		
	}
}
</script>

<style scoped lang="scss">
.linkitem{
    width:350px;
    .pageImg:hover{
        transform:scale(1.2)
    }
    .pageImg{
        transition:all 0.3s;
        width:90px;
        height:150px;
    }
    .pageName{
        font-size:24px;
        color:#666;
        line-height:80px;
    }
    .intro{
        font-size:20px;
        color:#999;
    }
}

</style>
