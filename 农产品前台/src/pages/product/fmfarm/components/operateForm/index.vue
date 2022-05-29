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
import cmForm from './cmForm.vue';
import csForm from './csForm.vue';
import fxForm from './fxForm.vue';
import gmForm from './gmForm.vue';
import myForm from './myForm.vue';

export default {
    components:{
        cmForm,
        csForm,
        fxForm,
        myForm,
		gmForm,

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
