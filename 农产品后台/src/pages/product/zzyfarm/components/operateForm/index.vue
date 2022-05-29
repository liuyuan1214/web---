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
import sfForm from './sfForm.vue';
import gdForm from './gdForm.vue';
import fzForm from './fzForm.vue';
import xjForm from './xjForm.vue';
import csForm from './csForm.vue';
import ggForm from './ggForm.vue';
import glForm from './glForm.vue';
export default {
    components:{
        sfForm,
        gdForm,
        fzForm,
        xjForm,
        csForm,
        ggForm,
		glForm
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
