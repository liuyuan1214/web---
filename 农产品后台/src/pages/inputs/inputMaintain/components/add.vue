/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="addtrp" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'申请'}}投入品信息</div>
      <el-form-item label="农资大类" prop="agriProdType" >
        <el-select v-model.trim="form.agriProdType"  placeholder="请选择农资大类"   @change="form.category='';getTypes('xiaolei')">
            <el-option
              v-for="item in zldms"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">

            </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="农资小类" prop="category">
          <el-select v-model.trim="form.category" placeholder="请选择农资小类">
            <el-option
              v-for="item in ejs"
              :key="item.sjzdBm"
              :label="item.sjzdMc"
              :value="item.sjzdBm">
            </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="agriProdName">
        <el-input v-model.trim="form.agriProdName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="model">
        <el-input v-model.trim="form.model" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model.trim="form.unit" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="生产单位" prop="scdw">
        <el-input v-model.trim="form.scdw" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="登记证号" prop="djzh">
        <el-input v-model.trim="form.djzh" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品条码">
        <el-input v-model.trim="form.codes" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.comment" placeholder="请输入"></el-input>
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
            agriProdType:commonValidate,
            scdw:commonValidate,
            model:commonValidate,
            unit:commonValidate,
            agriProdName:commonValidate,
            nhxm:[commonValidate],
            category:commonValidate
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    agriProdType:'',
                    scdw:'',
                    djzh:'',
                    agriProdName:'',
                    model:'',
                    unit:'',
                    codes:'',
                    zt:1,
                    category:''
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
            params.hy=this.userInfo.hydm;
          }else{
            params.zldm=this.form.agriProdType;
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
            // let params = {nhxm,sfzh,xb,dz, comment,lxdh,sfky:1,sfsc:'',cdbsk:'',qydm,qyid,ztdm,scjyztId,czr}
            Object.assign(params,{
              scjyztId,
			  delFlag:1,
              lx:1,
              sqrq,
			  areaCode:this.userInfo.areaCode,
			  bizId:this.userInfo.qyid,
			  cjr:this.userInfo.userId,
			  bizName:this.userInfo.ztmc,
              sbqyId:qyid
            });
            var query = {
              url:'/nzsyBizAgriLib/saveNzsqb/',
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