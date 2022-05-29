<template>
	<div class="f-df f-aic" :class="[size == 'large' ? 'input-large' : 'input-small']">
	  <label class="text f-df f-aic f-jcc">{{label}}</label>
	  <div class="content f-df f-f1"><slot></slot></div>
	</div>
</template>

<script>
	export default {
		name: "gMesInput",
		data(){
			return {

			}
		},
		props:{
			label:String,
			size:{
				type:String,
				default:'small',
			}
		}
	}
</script>

<style lang="scss" scoped>
	.g-mes-input-small{
    width:280px;
    height:40px;
    .text{
      width:90px;
      margin-right:10px;
      padding-left:10px;
      font-size:12px;
      justify-content:flex-end;
    }
    .content{
    	overflow:hidden;
    }
  }
  .g-mes-input-large{
    height:40px;
    .text{
      width:90px;
      margin-right:10px;
      padding-left:10px;
      font-size:12px;
      justify-content:flex-end;
    }
    .content{
    	overflow:hidden;
    }
  }
</style>


