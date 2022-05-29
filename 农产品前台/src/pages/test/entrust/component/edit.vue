/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="120px" class="form cpwh-edit" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}委托检测信息</div>
      <el-form-item label="报告日期" prop="testDate" >
            <el-date-picker
              v-model.trim="form.testDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="检测报告类型" prop="jclx">
          <el-radio v-model.trim="form.jclx" label="1" :disabled="form.id?true:false" >农产品检测</el-radio>
          <el-radio v-model.trim="form.jclx" label="2" :disabled="form.id?true:false" >环境检测</el-radio>
      </el-form-item>
      <el-form-item label="样品来源" prop="yply" v-if="form.jclx==1">
          <el-radio v-model.trim="form.yply" label="1" @change="yplyChange">基地生产</el-radio>
          <el-radio v-model.trim="form.yply" label="2" @change="yplyChange">外来采购</el-radio>
      </el-form-item>
      <el-form-item label="样品名称" prop="ypmc" class="f-pr" v-if="form.jclx==1">
          <el-input  v-model.trim=form.ypmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="jcncpDialogVisable=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="样品名称" prop="ypmc" class="f-pr" v-if="form.jclx==2">
          <el-input  v-model.trim=form.ypmc placeholder="请输入" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="关联批次" prop="zzpc" v-if="form.jclx==1">
        <el-input v-model.trim="form.zzpc"  :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="报告编号" prop="testSno">
        <el-input v-model.trim="form.testSno" placeholder="请输入" :maxlength="32" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item label="检测机构" prop="testCompanyName">
        <el-input v-model.trim="form.testCompanyName" placeholder="请输入" :maxlength="32" show-word-limit></el-input>
      </el-form-item>
	       <!--  <el-form-item label="检测机构" prop="testCompanyName">
          <el-autocomplete
              v-model="form.testCompanyName"
               :maxlength="32"
			   show-word-limit
              :fetch-suggestions="querySearch"
              placeholder="请输入"
          >
          </el-autocomplete>
      </el-form-item>-->
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
         <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.remark" placeholder="请输入" :maxlength="100" show-word-limit></el-input>
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
        <sel-sample @selSample="selSample" :sampleType="form.yply"></sel-sample>
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
      const commonValidate = {required: true, message: '必填项', trigger: ['blur','change']}
      return {
        disabled:false,
        oldncpmc:'',
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        rules:{
            testDate:commonValidate,
            jclx:commonValidate,
            yply:commonValidate,
            ypmc:commonValidate,
            zzpc:commonValidate,
            testSno:commonValidate,
            testCompanyName:commonValidate,
            attaUrl:commonValidate
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  id:'',
                  scjyztId:'',
                  zzpc:'',
                  testDate:'',
                  testSno:'',
                  testCompanyName:'',
                  userId:'',
                  pic:'',
                  jclx:'1',
                  ypmc:'',
                  yply:'1',
                  remark:'',
                  attaUrl:'',
                  imglists:[]
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
            let { 
              id,
              zzpc,
              testDate,
              testSno,
              testCompanyName,
              jclx,
              ypmc,
              yply,
              attaUrl,
              remark
            } = this.form;
            //用户参数
            let {scjyztId,userId} = this.userInfo;
            let params =  {
                  scjyztId,userId,
                  zzpc,
                  testDate,
                  testSno,
                  testCompanyName,
                  jclx,
                  ypmc,
                  yply,
                  remark,
                  pic:attaUrl
            }
            //编辑参数
            if(id){
              params.id = id;
            }
            fetch({
              method:'post',
              url:'/jcgl/jc/saveTestInfo/',
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
        });
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
	    //querySearch(queryString, cb) {
        //var options = [
        //  {value:'丽水蓝城农科检测技术有限公司'},
        //  {value:'谱尼测试集团股份有限公司'},
        //  {value:'丽水市质量技术监督检测院'},
        //  {value:'浙江金正检测有限公司'},
        //  {value:'农业部茶叶质量监督检验测试中心'},
        //  {value:'农业部农产品及转基因产品质量安全监督检验测试中心(杭州)'},
        //];
        //var results = queryString ? options.filter(item=>{return item.value.indexOf(queryString)>-1}) : options;
        //results = results?results:[];
        // cb(results);
      //}, 
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
        this.form.attaUrl = this.form.attaUrl? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面, || 前面的是基地生产 选择样本的数据，之后是外来采购返回的数据
      selSample(row){
        this.jcncpDialogVisable=false;
        this.form.ypmc = row.ztncpmc || row.wareName;  //1-基地生产 2-外来采购 样品名称字段不同
        this.form.zzpc = row.zzpc || row.batchno;      //只有农产品检测才有
        this.form.csmc = row.csmc || row.supId;
        this.form.zzjlId =row.zzjlId ||  row.purchId;  
      },
      //切换检测报告类型时清空数据
      yplyChange(){
        this.form.ypmc = '';
        this.form.zzpc = '';     
        this.form.csmc = '';     
        this.form.zzjlId = '';
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