/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}打印机配置</div>
      <el-form-item label="选择打印机" prop="dyjmc" >
        <el-select v-model="form.dyjmc"  placeholder="请选择打印机"  @change="selDyjs">
          <el-option v-for="item in dyjs" :key="item.dyjmc" :label="item.dyjmc" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号" prop="dyjxh">
        <el-input v-model="form.dyjxh" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="打印纸宽" prop="dyjzk">
        <el-input v-model="form.dyjzk" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="dyjlx">
        <el-input v-model="form.dyjlxshow" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="编号(SN)" prop="dyjbh">
        <el-input v-model="form.dyjbh" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="密钥(KEY)" prop="dyjmy">
        <el-input v-model="form.dyjmy" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商户编码" prop="shbm">
        <el-input v-model="form.shbm" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="SIM卡" prop="sim">
        <el-input v-model="form.sim" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="设为默认" prop="mrdyj">
        <el-switch
          v-model="form.mrdyj"
          active-color="#00aac7"
          inactive-color="#c0c4cc">
        </el-switch>
      </el-form-item>
      <el-form-item label="打印机品牌" prop="dyjpp">
        <el-input v-model="form.dyjpp" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="form.bz" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click=closeForm>取 消</el-button>
      </el-form-item>
    </el-form>
</template>


<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'
  import fetch from 'fetch/axios/'
  export default {
    data(){
      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      const selValidate = {required: true, message: '必选项', trigger: 'blur'}
      return {
        disabled:false,
        dyjs:[],
        rules:{
          dyjmc:[selValidate,,],
          dyjbh:[commonValidate,,],
          dyjmy:[commonValidate,,],
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
               id:'',
                  sbbId:'',
                  dyjmc: '',
                  dyjxh: '',
                  dyjzk:'',
                  dyjlx: '',
                  dyjbh: '',
                  dyjmy: '',
                  shbn: '',
                  sim: '',
                  bz: '',
                  dyjpp: '',
                  lwfs: '',
                  ppbm: '',
                  mrdyj:false
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
      this.form.dyjlxshow = this.form.dyjlx==1?"小票打印机 ":this.form.dyjlx==2?"标签打印机":"";
      this.form.mrdyj = this.form.mrdyj==1?true:false;
      this.getDyjs();
    },
    methods: {
      getDyjs(){
        fetch({
          url:'/nzsyBizDyj/listDyjsb/',
          method:'get',
          data:{
          }
        }).then(res=>{
          this.dyjs = res.list;
        }).catch(()=>{
          this.loading = false;
        })
      },
      selDyjs(obj){
        this.form.sbbId = obj.id;
        this.form.dyjmc = obj.dyjmc;
        this.form.dyjxh = obj.dyjxh;
        this.form.dyjzk = obj.dyjzk;
        this.form.dyjlx = obj.dyjlx;
        this.form.lwfs = obj.lwfs;
        this.form.ppbm = obj.ppbm;
        this.form.dyjlxshow = obj.dyjlx==1?"小票打印机":"标签打印机";
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段
            let { id,sbbId,dyjmc,dyjxh,dyjzk,dyjlx,dyjbh,dyjmy,shbm,sim,bz,dyjpp,lwfs,ppbm} = this.form;
            //用户参数
            let {bizId,bizName} = this.userInfo;
            //传值参数
            let params = {id,sbbId,dyjmc,dyjxh,dyjzk,dyjlx,dyjbh,dyjmy,shbm,sim,bz,dyjpp,lwfs,ppbm};
            params.mrdyj=this.form.mrdyj?"1":"2";
            params.qyid=bizId;
            this.$fetch.api_base.dyj_save(params).then((res)=>{
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

