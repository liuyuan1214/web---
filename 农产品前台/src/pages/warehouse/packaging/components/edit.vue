/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="130px" class="form cpwh-edit" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}加工包装信息</div>
      <el-form-item label="包装日期" prop="packDate" >
            <el-date-picker
              v-model.trim="form.packDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="包装类型" prop="packType">
          <el-radio v-model.trim="form.packType" :label="1" :disabled="form.id?true:false">加工包装</el-radio>
          <el-radio v-model.trim="form.packType" :label="2" :disabled="form.id?true:false">分拣包装</el-radio>
      </el-form-item>
      <el-form-item label="包装成品名称" prop="ncpmc" class="f-pr">
          <el-input v-model.trim=form.ncpmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="isSelPack=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <!--<el-form-item :label="form.dw?`成品数量(${form.dw})`:`成品数量`" prop="packToProductNum">
        <el-input type="number" v-positiveNumber v-model.trim="form.packToProductNum" placeholder="请输入" :maxlength="13"></el-input>
      </el-form-item>-->
	    <el-form-item label="成品数量" prop="packToProductNum" class="f4">
      <el-input v-model.trim="form.packToProductNum" @input="(value)=>{$nextTick(()=>{form.csl= String(value).slice(0,10)})}" placeholder="请输入" type="number">
         <template slot="append" v-if="form.dw">{{form.dw}}</template>
      </el-input>
    </el-form-item>

      <!-- 原材料信息 -->
      <div class="sub-title">原料信息</div>
      <el-form-item label="农产品名称" prop="ncpYlmc" class="f-pr">
          <el-input  :disabled="form.ncpmc && !form.id?false:true"   v-model.trim=form.ncpYlmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="form.ncpmc && !form.id?jcncpDialogVisable=true:''"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="原料批次" prop="zzpc">
        <el-input v-model.trim="form.zzpc"  :disabled="true"  ></el-input>
      </el-form-item>
	      <el-form-item label="原料余量" prop="syl" class="f4">
        <el-input  v-model.trim="form.syl" type="number"  :disabled="true">
        <template slot="append" v-if="form.ncpdw">{{form.ncpdw}}</template>
      </el-input>
    </el-form-item>
	    <el-form-item label="使用原料数量" prop="packNum" class="f4">
      <el-input v-model.trim="form.packNum" placeholder="请输入" type="number">
        <template slot="append" v-if="form.ncpdw">{{form.ncpdw}}</template>
      </el-input>
    </el-form-item>
       <!-- <el-form-item label="加工方法"  prop="handleWay" v-if="form.packType==1">
         <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.handleWay" placeholder="请输入" :maxlength="128"></el-input>
      </el-form-item> -->
      <el-form-item label="加工方法" prop="handleWay">
          <el-autocomplete
              v-model="form.handleWay"
               :maxlength="30"
			   show-word-limit
              :fetch-suggestions="querySearch1"
              placeholder="请输入内容"
          >
          </el-autocomplete>
        <!-- <el-input   v-model.trim="form.handleWay" placeholder="请输入" :maxlength="30" show-word-limit></el-input> -->
      </el-form-item>
      <el-form-item label="产品等级" prop="produceLevel">
          <el-autocomplete
              v-model="form.produceLevel"
               :maxlength="30"
			   show-word-limit
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
          >
          </el-autocomplete>
        <!-- <el-input   v-model.trim="form.produceLevel" placeholder="请输入" :maxlength="30" show-word-limit></el-input> -->
      </el-form-item>
      <el-form-item label="配料及添加剂"  v-if="form.packType==1">
         <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.yl" placeholder="请输入" :maxlength="128" show-word-limit></el-input>
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
          v-model="form.attaUrl"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
         
          multiple
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        备注：最多上传9张，支持jpg，png格式图片
      </el-form-item>
      <el-form-item label="备注">
         <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model.trim="form.remark" placeholder="请输入" :maxlength="128" show-word-limit></el-input>
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
        title="农产品选择"
        width="900px"
        :visible.sync="jcncpDialogVisable"
      >
        <sel-sample :ly=ly @selSample="selSample" :ncpdm="form.ncpdm"></sel-sample>
      </el-dialog>
      <!-- 选择所属分类 -->
      <el-dialog
        title="包装产品选择"
        width="900px"
        :visible.sync="isSelPack"
      >
        <sel-pack @selPack="selPack"></sel-pack>
      </el-dialog>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import selSample from './selSample.vue'
  import selPack from './selPack.vue'
  import fetch from 'fetch/axios'
  import timeFormat from 'common/tools/timeFormat';

  export default {
    components:{
      selSample,
      selPack
    },
    data(){
      const commonValidate = {required: true, message: '必填项', trigger: ['blur']}
      const validatePackNum = (rule, value, callback)=>{
         if(Number(value)<=Number(this.form.syl)){
           callback();
         }else{
           callback(new Error('使用原料数量超出库存！'));
         }
      }
      return {
        disabled:false,
        oldpackNum:'',
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        isSelPack:false,
        rules:{
		    packDate:commonValidate,
			packType:commonValidate,
			ncpmc:commonValidate,
			packToProductNum:commonValidate,
            testDate:commonValidate,
            jclx:commonValidate,
            yply:commonValidate,
            ypmc:commonValidate,
            zzpc:commonValidate,
			produceLevel:{required: true, message: '必填项', trigger: ['change']},
			handleWay:{required: true, message: '必填项', trigger: ['change']},
            testSno:commonValidate,
            packNum:[commonValidate,{ validator: validatePackNum, trigger: "blur" }],
            testCompanyName:commonValidate,
            // attaUrl:commonValidate
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  id:'',
                  zzpc:'',
                  csjlId:'',
                  packDate:'',
                  packType:1,
                  ncpId:'',
                  ncpmc:'',
                  packNum:'',
                  ncpdm:'',
                  packToProductNum:'',
                  handleWay:'',
                  produceLevel:'',
                  remark:'',
                  pic:'',
				          dwzl:'',
                  syl:'',
                  dw:'',
                  yl:'',
                  LNcpdm:'',
                  attaUrl:'',
                  imglists:[]
                }
            }
        },
        ly:{
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
        this.form.syl = Number(this.form.syl) + Number(this.form.packNum);
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
                  csjlId,
                  packDate,
                  packType,
                  ncpId,
                  ncpmc,
                  packNum,
                  packToProductNum,
                  handleWay,
                  produceLevel,
                  remark,
                  yl,
				  dwzl,
                  attaUrl,
                  imglists,
            } = this.form;
            //用户参数
            let {userId,scjyztId} = this.userInfo;
            let params =  {
                  id,
                  zzpc,
                  scjyztId,
                  csjlId,
                  packDate,
                  packType,
                  ncpId,
                  ncpmc,
                  packNum,
                  packToProductNum,
                  handleWay,
                  produceLevel,
                  remark,
                  pic:attaUrl,
				  dwzl,
                  yl,
				  lx:this.userInfo.nyVersion==5?2:1,
                  addUserId:userId,
              userId:userId,
            }
            fetch({
              method:'post',
              url:this.ly==1?'/Bzgm/ savePackRecord/':'/Bzgm/gm/savePackRecordOut/',
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
        querySearch(queryString, cb) {
        var options = [
          {value:'精品'},
          {value:'一级'},
          {value:'二级'},
        ];
        var results = queryString ? options.filter(item=>{return item.value.indexOf(queryString)>-1}) : options;
        results = results?results:[];
         cb(results);
      },
        querySearch1(queryString, cb) {
        var options = [
          {value:'粗加工'},
          {value:'深加工'},
        ];
        var results = queryString ? options.filter(item=>{return item.value.indexOf(queryString)>-1}) : options;
        results = results?results:[];
         cb(results);
      },
      closeForm(fresh=false){
        this.$emit("close",fresh);
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
        this.form.attaUrl = this.form.attaUrl? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面
      selSample(row){
        this.jcncpDialogVisable=false;
        this.form.syl= row.yl;
        this.form.zzpc = row.xgpc ||  '';
        this.form.ncpYlmc = row.ncpmc;
        this.form.csjlId = row.xgpcId;
        this.form.ncpdw = row.dw;

		
      },
      selPack(row){
        this.form.ncpId = row.ztncpId;
        this.form.ncpmc = row.ncpmc;
        this.form.ncpdm = row.ncpdm;
        this.form.dw = row.dw;
        this.isSelPack = false;
		this.form.dwzl = row.dwzl;
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

<style lang="scss" scoped>
.sub-title{
  text-align: center;
  margin:20px;
  position: relative;
  margin-left: 100px;
  &::before,&::after{
    display:inline-block;
    content:'';
    width:50px;
    position:absolute;
    height:0;
    top: 52%;
    width: 50px;
    height: 2px;
    background:#417f04;            
  }
   &::before{
     left:25%;
   }
   &::after{
     right:25%;
   }
}
</style>
