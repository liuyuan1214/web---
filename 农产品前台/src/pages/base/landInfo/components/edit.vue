/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldscmc?'编辑':'新增'}}地块信息</div>
      <el-form-item label="地块名称" prop="areaName">
        <el-input v-model.trim="form.areaName" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="大棚名称" prop="greenHouse" class="f-pr">
          <el-input  v-model="form.greenHouse"></el-input>
      </el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click="closeForm(false)">取 消</el-button>
      </el-form-item>
    </el-form>
</div>

</template>
<script>
 import {mapGetters} from 'vuex'
  export default {
    data(){
			const dkExist = (rule, value, callback)=>{
        var params ={
          csmc:this.form.csmc,
          ztdm:this.userInfo.ztdm
        }
        //edit
        if(this.oldscmc && this.form.csmc ===this.oldscmc ){
           callback();
        }
        this.$fetch.api_base.dk_exist(params).then((res)=>{
          if(res.bean==1){
            callback(new Error('该地块已存在'));
          }else{
            callback();
          }
        })
			};
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}

			const countLimitValidate = (rule, value, callback)=>{
				const pattern = /^[0-9]+$/;
				if (!pattern.test || value === 0) {
          callback(new Error('数值必须大于零'));
        }  else{
          callback();
        }
			};
      return {
        disabled:false,
        dktypes:[],
        selDK:[],
        oldscmc:'',
        fzrDialogVisable:false,
        rules:{
            areaName: [{ required: true, message: '请输入地块名称！', trigger: 'blur' }],
            greenHouse:  [{ required: true, message: '请输入大棚名称！', trigger: 'blur' }],
        },
      }
    },
    computed:{
      ...mapGetters({userInfo:'getUserInfo'})
    },
    created(){

    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    areaName:'',
                    greenHouse:'',
                }
            }
        }
    },
    methods: {
      selDKType(value){
        this.selDK = value.split('/');
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //用户参数
            console.log("提交中")
            let paramsAll ={
              areaName:this.form.areaName,
              greenHouse:this.form.greenHouse};
            console.log(paramsAll,"paramsAll")
            this.$fetch.api_base.addArea(paramsAll).then((res)=>{

              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.success('操作成功！')
               this.closeForm(true);
               this.disabled=false;
               
            })
          } else {
            this.$message.error('请按要求填写!!');
            return false;
          }
        });
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      }
    }
  }
</script>

 <style scoped lang="scss">
//     .form{
//         width:700px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
</style>
