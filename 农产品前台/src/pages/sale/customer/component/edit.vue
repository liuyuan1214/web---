/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="140px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.khId?'编辑':'新增'}}客户信息</div>
      <el-form-item label="客户名称" prop="khmc" >
        <el-input v-model.trim="form.khmc" placeholder="请输入" :maxlength="30" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item label="客户简称" prop="khjc">
        <el-input v-model.trim="form.khjc" placeholder="请输入":maxlength="16" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model.trim="form.lxr" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input v-model.trim="form.lxdh" placeholder="请输入" :maxlength="16" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码" >
        <el-input v-model.trim="form.tyshxydm" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model.trim="form.dz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入" :maxlength="128" show-word-limit></el-input>
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
      //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
	   const khExist = (rule, value, callback)=>{
            var params ={
            khxm:this.form.khmc,
            qyid:this.userInfo.qyid
            }
            //edit
            if(this.oldkhmc && this.form.khmc ===this.oldkhmc ){
            callback();
            }
            this.$fetch.api_base.kh_exist(params).then((res)=>{
            if(res.bean==1){
                callback(new Error('该客户已存在'));
            }else{
                callback();
            }
            })
	    };
      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      function checkPhone(rule, value, callback){
        if(!value){
          return callback();
        }
        if(!(/^1[34578]\d{9}$/.test(value))){ 
            callback(new Error('手机号有误，请重新填写'));
        }else{
            callback();
        } 
      }
      return {
        disabled:false,
        oldkhmc:'',
        rules:{
            khmc:[commonValidate,{ validator: khExist, trigger: 'select' }],
            lb:commonValidate,
            khjc:[commonValidate],
            lxdh:{ validator: checkPhone, trigger: 'blur' }   //有值手机号，无值则不校验
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    lb:'04',
                    khjc: '',
                    khmc:'',
                    lxr: '',
					tyshxydm:'',
                    lxdh: '',
                    dz: '',
                    bz: '',
                    sfky:'1'
                }
            }
        },
        isSup:{
          type:String,
          default:'',
        },
        khtype:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      this.oldkhmc=this.form.khmc
      if(this.isSup){
        this.form.lb= this.isSup;
      }
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { lb,khmc,khjc,lxr,tyshxydm,lxdh, bz,dz,sfky} = this.form;
            lb="01"
            //用户参数
            let {qydm,qyid,ztdm,scjyztId} = this.userInfo;
            //系统时间
            let params = {lb,khmc,khjc,lxr,tyshxydm,lxdh, bz,dz,sfky,qydm,qyid,ztdm,scjyztId}
            if(this.form.khId){
              params.khId = this.form.khId;
            }
            this.$fetch.api_base.kh_save(params).then((res)=>{
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



