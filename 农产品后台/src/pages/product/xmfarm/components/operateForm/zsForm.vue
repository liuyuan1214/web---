/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form cpwh" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.zsjlId?'编辑':'新增'}}转舍信息</div>
      <el-form-item label="转出场所" >
        <el-input v-model.trim="this.pcInfo.cdmc" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="转出产品">
        <el-input v-model.trim="this.pcInfo.ztncpmc" placeholder="请输入" disabled></el-input>
      </el-form-item>
	  	      <el-form-item label="存栏数" prop="cls" class="f4">
        <el-input  v-model.trim="this.pcInfo.cls" type="number"   disabled>
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>
      <el-form-item label="转出日期" prop="zsrq">
            <el-date-picker
              v-model.trim="form.zsrq"
              type="date"
              style="width:100%"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>  
      <el-form-item label="转入场所" prop="zrcsmc" class="f-pr f4">
		  <el-input placeholder="请选择" v-model.trim=form.zrcsmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="isSeldk=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>		  
      </el-form-item> 
	      <el-form-item label="转入数" prop="cls" class="f4">
        <el-input  v-model.trim="this.pcInfo.cls"  disabled  >
        <template slot="append" v-if="pcInfo.dw">{{pcInfo.dw}}</template>
      </el-input>
    </el-form-item>	  

      <el-form-item label="图片" prop="imgList">
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
         <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入"  :maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round  @click="closeForm(false)">取 消</el-button>
      </el-form-item>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    <el-dialog
      title="选择转入场所"
      :append-to-body="true"
      :visible.sync="isSeldk"
      width="800px"
    >
      <sel-dk @seldk="selDk" :csmc="pcInfo.csmc"></sel-dk>	  
    </el-dialog> 
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import fetch from 'fetch/axios/';
  import selDk from '../components/selDk.vue' ;
  import timeFormat from 'common/tools/timeFormat';
  export default {
    inject:['pcInfo'],
    components:{
      selDk
    },
    data(){
      const commonValidate = {required: true, message: '必填项', trigger: ['blur','change']}
      return {
        disabled:false,
        oldncpmc:'',
        dialogVisible:false,
        dialogImageUrl:'',
		isSeldk:false,
        rules:{
            zsrq:commonValidate,
			zrcsmc:commonValidate,
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
				    zccsdm:'',
				    zccsmc:'',
				    jcrq:'',
				    ncpmc:'',
				    zcpc:'',
				    ncpdm:'',
				    zsl:'',
				    zsrq:timeFormat.one(new Date()),
				    zrcsdm:'',
				    zrcsmc:'',
				    zsjlId:'',
                    imglists:[],
                    attaUrl:'',
					zzjlId:'',
                }
            }
        },
        //khtype:{
        //    type:Array,
        //    default:()=>{
        //        return []
        //    }
        //}
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      this.oldncpmc=this.form.ncpmc;
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let {		
				zccsdm,
				zccsmc,
				jcrq,
				ncpmc,
				zcpc,
				ncpdm,
				zsl,
				bz,
				zsrq,
				zrcsdm,
				zrcsmc,
				zsjlId,
                attaUrl,
            } = this.form;
            let {
              zzpc,
              csmc,
            } = this.pcInfo;
            //用户参数
            let {scjyztId,qydm,userId} = this.userInfo;
            let params =  {
				zccsdm:this.pcInfo.csmc,
				zccsmc:this.pcInfo.cdmc,
				jcrq:this.pcInfo.qprq,
				ncpmc:this.pcInfo.ncpmc,
				ncpdm:this.pcInfo.ncpdm,
				zsl:this.pcInfo.cls,
				zsrq,
				zrcsdm,
				zrcsmc,
                pic:attaUrl,
				bz,
				zsjlId,
				scjyztId,
				zzjlId:this.pcInfo.zzjlId,
				zcpc:this.pcInfo.zzpc,
				qydm:this.pcInfo.qydm,
				cjr:userId,
            }
            fetch({
              url:'/scgl/ns/saveZsjl/',
              method:'post',
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
      close(rowlist){
        this.trpDialogVisable = false;
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
        this.form.attaUrl = this.form.attaUrl!=""? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面
      selDk(row){
        this.form.zrcsdm = row.sccsId;
        this.form.zrcsmc = row.csmc;
        this.isSeldk=false;
      }
    }
  }
</script>

<style>
.cpwh .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.cpwh .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>



