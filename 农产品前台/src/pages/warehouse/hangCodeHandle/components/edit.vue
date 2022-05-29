//农事操作，根据传入的参数不同，显示不同的组件，可以编辑可以新增
<template>
   <component :is="pctype+'farm'" @closeForm="$emit('closeForm')" :form="form" :checkRow="checkRow"></component>
</template>
<script>
import fmfarm from 'pages/product/fmfarm/components/pcedit.vue';
import zzyfarm from 'pages/product/zzyfarm/components/pcedit.vue';
import scfarm from 'pages/product/scfarm/components/pcedit.vue';
import syjfarm from 'pages/product/syjfarm/components/pcedit.vue';
import xmfarm from 'pages/product/xmfarm/components/pcedit.vue';
export default {
     provide(){
        return {
            pcInfo:this.form
        }
     },
    components:{  
        fmfarm,
        zzyfarm,
        scfarm,
        syjfarm,
        xmfarm
    },
    props:{
        pctype:{
            type:String,
            default:'fm'
        },
        checkRow:{
                type: Object,
            default: function() {
                return {};
            }
        },
        form:{
            type:Object,
            default:function(){
                return {}
            }
        }
    }
}
</script>
