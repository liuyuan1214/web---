/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}地块负责人信息</div>
      <el-form-item label="负责人姓名" prop="nhxm">
        <el-input v-model.trim="form.nhxm" placeholder="请输入" :maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="xb" >
        <el-radio-group v-model.trim="form.xb">
          <el-radio :label="'1'">男</el-radio>
          <el-radio :label="'2'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input v-model.trim="form.lxdh" placeholder="请输入" :maxlength="15" ></el-input>
      </el-form-item>

      <!-- <el-form-item label="身份证号" prop="sfzhs" v-if="form.nhId!=''">
        <el-input v-model.trim="form.sfzhs" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" placeholder="请输入" @focus="colsesfzh" :maxlength="18" show-word-limit></el-input>
      </el-form-item> -->

        <el-form-item label="身份证号" prop="sfzh" >
        <el-input v-model.trim="form.sfzh" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" placeholder="请输入" @focus="colsesfzh" :maxlength="18" show-word-limit></el-input>
      </el-form-item>
       <!-- <el-form-item label="身份证号"  v-else>
        <el-input v-model.trim="form.sfzh" placeholder="请输入" :maxlength="18" show-word-limit></el-input>
      </el-form-item> -->
      <el-form-item label="地址">
        <el-input v-model.trim="form.dz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入" :maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click="closeForm(false)">取 消</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  export default {
    data(){
			const sjIsExist = (rule, value, callback)=>{
        let{nhId,lxdh} = this.form;
        var params2 ={
          str:lxdh,
          type:2,
          qyid:this.userInfo.qyid
        }
        if(nhId){
          params2.nhId=nhId;
        }
        this.$fetch.api_base.dkfzr_exist(params2).then((res)=>{
            if(res.bean==1){
              callback(new Error('该联系电话已使用！'));
            }else{
               callback();
            }
        })
      };
			const sfzhIsExist = (rule, value, callback)=>{
        let{nhId,sfzh} = this.form;
        var params2 ={
          str:sfzh,
          type:1,
          qyid:this.userInfo.qyid
        }
        if(nhId){
          params2.nhId=nhId;
        }
        this.$fetch.api_base.dkfzr_exist(params2).then((res)=>{
            if(res.bean==1){
              callback(new Error('该身份证号已使用！'));
            }else{
               callback();
            }
        })
      };
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      // const checkCardNos = { validator, message: '长度在18个字符', trigger: 'blur' }
      const checkCardNo = { validator: exec.checkCardNo, trigger: 'blur' }
			const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }
      return {
        disabled:false,
        rules:{
            nhxm:[commonValidate],
            xb:commonValidate,
            lxdh:[commonValidate,checkPhone,{ validator: sjIsExist, trigger: 'blur' }],
            sfzh:[commonValidate,{ validator: sjIsExist, trigger: 'blur' }]
           
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb: '1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
     
    },
    mounted(){
    
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          // console.log(124)
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //身份证正则验证
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 

            //新增字段 
            let { nhId,nhxm,sfzh,xb,dz, bz,lxdh,sfky,sfsc,cdbsk} = this.form;
            //用户参数
            let {qydm,qyid,ztdm,scjyztId,userId:czr } = this.userInfo;
            //系统时间
            var  date = new Date();
            var czrq = date.getFullYear()  + '-'+ (date.getMonth()+1) +'-'+(date.getDate())
            let params = {nhxm,sfzh,xb,dz, bz,lxdh,sfky:1,sfsc:'',cdbsk:'',qydm,qyid,ztdm,scjyztId,czr,czrq}
            if(nhId){
              params.nhId = nhId;
            }else{
              if(reg.test(sfzh) === false){
                 this.disabled=false;
                return  this.$message.error('身份证号不合法!')
              }
            }
            if(sfzh.length!=18&&sfzh.length!=15){
                this.disabled=false;
                return  this.$message.error('身份证号必须15位或者18位')
            }
           
            this.$fetch.api_base.dkfzr_save(params).then((res)=>{
              this.$message.success('操作成功！')
              setTimeout(()=>{
                 this.closeForm(false);
              },100)
              
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
        this.$emit("closeForm",true);
      },
      colsesfzh(){
        this.form.sfzh = ''
      }
    }
  }
</script>

 <style scoped lang="scss">
//     .form{
//         width:550px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
</style>
