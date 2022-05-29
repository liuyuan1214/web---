/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form cpwh-edit" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldncpmc?'编辑':'新增'}}自检信息</div>
      <el-form-item label="检测日期" prop="czsj" >
            <el-date-picker
              v-model.trim="form.czsj"
              :disabled="sjly!='2'?false:true"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="样品来源" prop="jclx">
          <el-radio v-model.trim="form.jclx" label="1" @change="jclxChange">基地生产</el-radio>
          <el-radio v-model.trim="form.jclx" label="2" @change="jclxChange">外来采购</el-radio>
      </el-form-item>
      <el-form-item label="样品名称" prop="ncpmc" class="f-pr">
          <el-input  v-model.trim=form.ncpmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="jcncpDialogVisable=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="关联批次" prop="zzpc">
        <el-input v-model.trim="form.zzpc"  disabled></el-input>
      </el-form-item>
      <el-form-item label="检测项目" prop="jcxm">
          <el-select v-model.trim="form.jcxm" size="small" :disabled="sjly!='2'?false:true" placeholder="请选择">
            <el-option
              v-for="(item,index) in testItems"
              :key="index"
              :label="item.sjzdMc"
              :value="item.sjzdMc">
            </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="检测性质" prop="jcxzlx">
          <el-radio v-model.trim="form.jcxzlx" label="2" >定性</el-radio>
          <el-radio v-model.trim="form.jcxzlx" label="1" >定量</el-radio>
      </el-form-item>
      <el-form-item label="检测值" prop="yzl">
        <el-input v-model.trim="form.yzl"  :maxlength="10" :disabled="sjly!='2'?false:true" ></el-input>
      </el-form-item>
      <el-form-item label="检测结论" prop="jcjl">
          <el-radio v-model.trim="form.jcjl" label="1">合格</el-radio>
          <el-radio v-model.trim="form.jcjl" label="2">不合格</el-radio>
      </el-form-item>
      <el-form-item label="检测人员">
        <el-input v-model.trim="form.jcr" placeholder="请输入" :maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="attaUrl">
        <el-upload  
                 :http-request="uploadImg"
         :before-upload="beforeAvatarUpload"
          :limit="9"
          action="''"
          :auto-upload="true"
          name="clientFile"
          :file-list="form.imglists"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
          multiple
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        备注：最多上传9张，支持jpg，png格式图片
      </el-form-item>
      <el-form-item label="备注">
         <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入" :maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round  @click="closeForm(false)">取 消</el-button>
      </el-form-item>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
      <!-- 选择所属分类 -->
      <el-dialog
        title="选择样品名称"
        width="900px"
        :visible.sync="jcncpDialogVisable"
      >
        <sel-sample @selSample="selSample" :sampleType="form.jclx"></sel-sample>
      </el-dialog>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import selSample from './selSample.vue'
  import fetch from 'fetch/axios'
  export default {
    components:{
      selSample
    },
    data(){
        //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
      const ncpmcExist = (rule, value, callback)=>{
              var params ={
                ncpMc:this.form.ncpmc,
                scjyztId:this.userInfo.scjyztId
              }
              //edit
              if(this.oldncpmc && this.form.ncpmc ===this.oldncpmc ){
                callback();
              }
              this.$fetch.api_base.cpwh_exist(params).then((res)=>{
              if(res.bean==1){
                  callback(new Error('该农产品名称已存在'));
              }else{
                  callback();
              }
        })
      };
      const zlmc =  (rule, value, callback)=>{
        if(this.form.zlmc){
          callback();
        }else{
           callback(new Error());
        }
      }
      const commonValidate = {required: true, message: '必填项', trigger: ['blur','change']}
      return {
        disabled:false,
        oldncpmc:'',
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        testItems:[],
        rules:{
            czsj:commonValidate, 
            jclx:commonValidate, 
            ncpmc:commonValidate, 
            zzpc:commonValidate, 
            jcxm:commonValidate, 
            jcxzlx:commonValidate, 
            yzl:commonValidate,
            attaUrl1:{required: true, message: '必填项', trigger: 'select'}
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  jyjcId:'',
                  zzjlId:'',
                  zzpc:'',
                  ncpmc:'',
                  jcxm:'',
                  jcjl:'1',
                  bz:'',
                  czsj:'',
                  czr:'',
                  imglists:[],
                  jclx:'1',
				  jcxzlx:'2',
                  jcr:'',
                  attaUrl:'',
                  yzl
                }
            }
        },
        sjly:{
            type:String,
            default:'1'
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      this.oldncpmc=this.form.ncpmc;
      this.getTestItems(); 
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
         if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { 
                  jyjcId,
                  zzjlId,
                  zzpc,
                  ncpmc,
                  jcxm,
                  jcjl,
                  bz,
                  czsj,
                  jclx,
                  jcr,
                  yzl,
                  cjr,
                  qyid,
                  csmc,
				  jcxzlx,
                  attaUrl
            } = this.form;
            //用户参数
            let {qydm,ztdm,scjyztId,userId:czr,csid} = this.userInfo;
            let params =  {
                  zzjlId,
                  zzpc,
                  ncpmc,
                  csmc,
                  jcxm,
                  jcjl,
                  bz,
                  czsj,
                  czr,
                  jclx,
                  jcr,
                  scjyztId,
				  jcxzlx,
                  yzl,
				          qyid:this.userInfo.qyid,
                  pic:attaUrl
            }
            //编辑新增则是当前用户id;
            if(jyjcId){
              params.jyjcId = jyjcId;
              params.cjr = czr;
            }else{
              params.cjr = czr;
            }
            fetch({
              method:'post',
              url:'/jcgl/jc/saveJcjl/',
              data:params
            }).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch((res)=>{
               this.$message.error(res.errorMess)
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        }
      )},
      getTestItems(){
            fetch({
              method:'get',
              url:'/utilmodel/qy/getDataByCy/',
              data:{
                sjzdLxbm:'QYZJ',
                hy:this.userInfo.hydm
              }
            }).then((res)=>{
              this.testItems = res.list;
            })
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      },
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
           beforeRemove(file,fileList){
        console.log('删除之前');
        var delIndex = fileList.findIndex(item=>{return item.url===file.url});
        var attaUrl = this.form.attaUrl.split(',');
        attaUrl.splice(delIndex,1);
        this.form.attaUrl=attaUrl.join(',');
        return true;
      },
        beforeAvatarUpload(file){
            const isJPG = file.type==='image/jpeg' || file.type==='image/jpg' ||  file.type==='image/png';
            const isLt3M = file.size / 1024 / 1024 < 3;
            if(!isJPG){
                this.$message.error('请上传图片格式为JPG、JPEG或者JNP！')
            }
            if(!isLt3M){
               this.$message.error('图片大小不能超过3M！')   
            }
             return isJPG && isLt3M;
      },
      //上传图片
      uploadImg(item,callback){
            let formData = new FormData();
            formData.append("clientFile", item.file);
            var query =  {
              url:'/utilmodel/uploadFile/',
              method:'upload',
              data:formData
            }
            fetch(query).then(res=>{
                this.addImg(res);
            })
        }, 
      //上传图片成功
      addImg(response, file){
        this.form.attaUrl = this.form.attaUrl && this.form.attaUrl!=""? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面
      selSample(row){
        this.jcncpDialogVisable=false;
        this.form.ncpmc = row.ztncpmc || row.wareName;  //不同的样品来源，字段不同
        this.form.zzpc = row.zzpc || row.batchno;
        this.form.zzjlId = row.zzjlId ||  row.purchId;
        this.form.csmc = row.csmc || row.supId;
      },
      //切换检测报告类型时，环境检测为手动输入，无批次信息，无地块id, 农产品检测：选择代入，切换时需要清空数据
      jclxChange(){
        this.form.ncpmc = "";
        this.form.zzpc = "";
        this.form.csmc = "";
        this.form.zzjlId = "";
      }
    }
  }
</script>

<style>
.cpwh-edit .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.cpwh-edit .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.cpwh-edit .el-date-editor.el-input, .cpwh-edit .el-date-editor.el-input__inner {
    width: 100%;
}
</style>