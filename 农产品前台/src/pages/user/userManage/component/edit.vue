/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}账号信息</div>
      <el-form-item label="用户登录名" prop="username">
        <el-input v-model.trim="form.username" placeholder="请输入" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="yhxm">
        <el-input v-model.trim="form.yhxm" placeholder="请输入" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="sjhm">
        <el-input v-model.trim="form.sjhm" placeholder="请输入" :maxlength="11" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="xb" >
        <el-radio-group v-model.trim="form.xb">
          <el-radio :label="'1'">男</el-radio>
          <el-radio :label="'2'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号" prop="sfzh">
        <el-input v-model.trim="form.sfzh" placeholder="请输入" :maxlength="18" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round  @click="closeForm(false)">取 消</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  export default {
    data(){
      //使用了一个input没有的事件select  目的：只在最后提交之前触发地块负责人是否存在的校验

			const sfzhIsExist = (rule, value, callback)=>{
        let{sfzh} = this.form;
        var params ={
          str:sfzh,
          type:1,
          qyid:this.userInfo.qyid
        }
        if(this.form.ztyhId){
          params.ztyhId=this.form.ztyhId;
        }
        this.$fetch.api_user.user_exist(params).then((res)=>{
          if(res.bean==1){
            callback(new Error('该身份证号已使用！'));
          }else{
            callback();
          }
        })
      };
			const sjhIsExist = (rule, value, callback)=>{
        let{sjhm} = this.form;
        var params ={
          str:sjhm,
          type:2,
          qyid:this.userInfo.qyid
        }
        if(this.form.ztyhId){
          params.ztyhId=this.form.ztyhId;
        }
        this.$fetch.api_user.user_exist(params).then((res)=>{
          if(res.bean==1){
            callback(new Error('该手机号已被使用！'));
          }else{
            callback();
          }
        })
      };
			const yhmIsExist = (rule, value, callback)=>{
        let{username} = this.form;
        var params ={
          str:username,
          type:3,
          qyid:this.userInfo.qyid
        }
        if(this.form.ztyhId){
          params.ztyhId=this.form.ztyhId;
        }
        this.$fetch.api_user.user_exist(params).then((res)=>{
          if(res.bean==1){
            callback(new Error('该用户登录名已被使用！'));
          }else{
            callback();
          }
        })
      };
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
			const checkCardNo = { validator: exec.checkCardNo, trigger: 'blur' }
			const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }
       
      return {
        disabled:false,
        rules:{
            username:[commonValidate,,{ validator: yhmIsExist, trigger: 'blur' }],
            yhxm:commonValidate,
            xb:commonValidate,
            sjhm:[commonValidate,checkPhone,{ validator: sjhIsExist, trigger: 'blur' }],
            sfzh:checkCardNo
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    username: '',
                    yhxm: '',
                    sjhm:'',
                    xb: '1',
                    bz: '',
                    sfky:1
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { username,yhxm,xb, bz,sjhm,sfzh,yhdm,sfky} = this.form;
            //用户参数
            let {qydm,qyid,ztdm} = this.userInfo;
            //系统时间
            let params = {username,yhxm,xb, sfky,yhdm,bz,sfzh,sjhm,qyid,ztdm}
            if(this.form.ztyhId){
              params.ztyhId = this.form.ztyhId;
            }
            this.$fetch.api_user.user_save(params).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.error('操作失败！')
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
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

// <style scoped lang="scss">
//     .form{
//         width:550px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
// </style>