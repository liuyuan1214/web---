//农事操作，根据传入的参数不同，显示不同的组件，可以编辑可以新增
<template>
   <div v-if="JSON.stringify(form)!='{}'">
   <component :is="edittype+'Form'" @closeForm="$emit('closeForm')" :form="form"></component>
    </div>
       <div v-else>
            <component :is="edittype+'Form'" @closeForm="$emit('closeForm')"></component>
    </div>
</template>
<script>
import csForm from './csForm.vue';
import fzForm from './fzForm.vue';
import myForm from './myForm.vue';
import sfForm from './sfForm.vue';
import swForm from './swForm.vue';
import tpForm from './tpForm.vue';
import zsForm from './zsForm.vue';
export default {
    components:{
        csForm,
        fzForm,
        myForm,
        sfForm,
        swForm,
        tpForm,
        zsForm
    },
    props:{
        edittype:{
            type:String,
            default:'sf'
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
