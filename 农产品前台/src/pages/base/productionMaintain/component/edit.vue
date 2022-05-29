/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">传感器告警设置</div>
      <el-form-item label="传感器告警阈值最大值" prop="thresholdMax">
        <el-input v-model.trim="form.thresholdMax" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="传感器告警阈值最小值" prop="thresholdMin" class="f-pr">
          <el-input  v-model="form.thresholdMin"></el-input>
      </el-form-item>
      <el-form-item label="是否告警" prop="openAlert" class="f-pr">
          <el-radio-group v-model="form.openAlert">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="传感器ID" prop="sensorId" class="f-pr">
          <el-input :disabled="true" v-model="form.sensorId"></el-input>
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
            thresholdMax: [{ required: true, message: '请输入传感器告警阈值最大值！', trigger: 'blur' }],
            thresholdMin:  [{ required: true, message: '请输传感器告警阈值最小值！', trigger: 'blur' }],
            openAlert: [{ required: true, message: '请输入是否警告！', trigger: 'blur' }],
            sensorId:  [{ required: true, message: '请输入传感器ID！', trigger: 'blur' }],
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
                    thresholdMax:'',
                    thresholdMin:'',
                    openAlert:'',
                    sensorId:'',
                }
            }
        }
    },
    methods: {

      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //用户参数
            console.log("提交中")
            let paramsAll ={
              ...this.form};
            console.log(paramsAll,"paramsAll")
            this.$fetch.api_base.SensorUpdate(paramsAll).then((res)=>{

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
