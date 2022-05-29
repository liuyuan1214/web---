/*页面的整体布局*/
<template>
    <div  class="page-title f-f1">
        <vue-qr v-if="zzpc" :bgSrc='config.logo' :logoSrc="config.imagePath" :text="config.value" :size="230"></vue-qr>
    </div>
</template>
<script type="text/javascript">
  import VueQr from 'vue-qr'
    import { mapGetters } from 'vuex' 
import {pjConfig} from 'fetch/axios/config'
  export default{
    components: { VueQr },
    data(){
      return{
        config: {
          value: '',//显示的值、跳转的地址
          logo:'',
          imagePath: '' //中间logo的地址
        },
        version:'zzy'
      }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    props:{
        zzpc: {                
            type: String,                
            default: ''            
        }
    },
    created(){
        let pctypelist={
              "1":"zzy",
              "2":"sc",
              "3":"xm",
              "4":"syj",
              "5":"xm"
        }
        this.config.imagePath=`./static/version/v${this.userInfo.nyVersion}.png`;
        this.version = pctypelist[this.userInfo.nyVersion];
        this.config.value = pjConfig.farm_info_url  +'/sales/nscz!orZzpcTraceHungZzpcPc.action?batchNo='+this.zzpc
    }
  }
</script>