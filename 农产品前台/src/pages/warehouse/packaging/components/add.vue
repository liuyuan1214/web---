/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="addtrp" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}投入品信息</div>
      <el-form-item label="类型" prop="nzdl" >
        <el-select v-model.trim="form.nzdl"  placeholder="请选择类别"   @change="form.nzdlMc='';getTypes('xiaolei')">
            <el-option
              v-for="item in zldms"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">

            </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="农资类别" prop="nzdlMc">
          <el-select v-model.trim="form.nzdlMc" placeholder="请选择农资类别">
            <el-option
              v-for="item in ejs"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdMc">
            </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="spmc">
        <el-input v-model.trim="form.spmc" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="spgg">
        <el-input v-model.trim="form.spgg" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="dw">
        <el-input v-model.trim="form.dw" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="生产单位" prop="scdw">
        <el-input v-model.trim="form.scdw" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="登记证号" prop="djzh">
        <el-input v-model.trim="form.djzh" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品条码">
        <el-input v-model.trim="form.sptm" placeholder="请输入"></el-input>
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
  import fetch from 'fetch/axios/'

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
			const checkCardNo = { validator: exec.checkCardNo, trigger: 'blur' }
			const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }

      return {
        disabled:false,
        zldms:[],
        ejs:[],
        rules:{
            nzdl:commonValidate,
            scdw:commonValidate,
            spgg:commonValidate,
            dw:commonValidate,
            spmc:commonValidate,
            nhxm:[commonValidate],
            nzdlMc:commonValidate
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    nzdl:'',
                    scdw:'',
                    djzh:'',
                    spmc:'',
                    spgg:'',
                    dw:'',
                    sptm:'',
                    zt:1,
                    nzdlMc:''
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
       this.getTypes("dalei"); 
    },
    methods: {
        getTypes(typeText){
          var params={
            sjzdLxbm:'TRPLX'
          }
          if(typeText==='dalei'){
            params.hy=1;
          }else{
            params.zldm=this.form.nzdl;
          }
          this.$fetch.api_base.cpwh_type(params).then(res=>{
             this[typeText==='dalei'?'zldms':'ejs']= res.list;
          })
        },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let params = this.form;
            //用户参数
            let {qydm,ztdm,scjyztId,qyid} = this.userInfo;
            //系统时间
            var  date = new Date();
            var sqrq = date.getFullYear()  + '-'+ (date.getMonth()+1) +'-'+(date.getDate())
            // let params = {nhxm,sfzh,xb,dz, bz,lxdh,sfky:1,sfsc:'',cdbsk:'',qydm,qyid,ztdm,scjyztId,czr}
            Object.assign(params,{
              qydm,
              ztdm,
              scjyztId,
              zt:1,
              sqrq,
              sbqyId:qyid
            });
            var query = {
              url:'/JcTrpWh/saveTrpSqb/',
              method:'post',
              data:params
            }
            fetch(query).then(res=>{
                this.$message.success('操作成功！')
                this.closeForm();
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

 <style  lang="scss">
  
  .addtrp{
    width:550px;
    .el-select{
      width:100%;
    }
  } 
</style>