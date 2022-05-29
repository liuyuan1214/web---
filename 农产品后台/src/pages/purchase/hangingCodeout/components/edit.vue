/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="120px" class="form cpwh-edit" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}产品挂码信息</div>
      <el-form-item label="挂码日期" prop="gmrq" >
            <el-date-picker
              v-model.trim="form.gmrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="挂码类型" prop="gmlx">
          <el-radio v-model.trim="form.gmlx" label="1" @change="gmlxChange" :disabled="form.id?true:false">成品挂码</el-radio>
          <el-radio v-model.trim="form.gmlx" label="2" @change="gmlxChange" :disabled="form.id?true:false">{{isCs?'原材料挂码':'采收挂码'}}</el-radio>
      </el-form-item>
      <el-form-item label="产品名称" prop="hcNcpmc" class="f-pr">
          <el-input  v-model.trim=form.hcNcpmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="jcncpDialogVisable=true"  style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="批次号" prop="zzpc">
        <el-input v-model.trim="form.zzpcshow"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="开始身份码" prop="codeStart">
        <el-input v-model.trim="form.codeStart"  v-positiveNumber placeholder="请输入12位身份码"  onkeyup="this.value=this.value.replace(/[^\d]/g,'');" maxlength="12" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="结束身份码" prop="codeEnd">
        <el-input v-model.trim="form.codeEnd"  v-positiveNumber  placeholder="请输入12位身份码" onkeyup="this.value=this.value.replace(/[^\d]/g,'');" maxlength="12" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="挂码数量(枚)" prop="codeTotalNum">
        <el-input v-model.trim="form.codeTotalNum"  type="number" v-positiveNumber  disabled></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload  
                 :http-request="uploadImg"
         :before-upload="beforeAvatarUpload"
          :limit="9"
          action="''"
          :auto-upload="true"
          name="clientFile"
          :file-list="form.imglists"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
         
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
        title="挂码选择"
        width="900px"
        :visible.sync="jcncpDialogVisable"
      >
        <sel-sample @selSample="selSample" :sampleType="form.gmlx" :isCs=isCs></sel-sample>
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
      const validateCode = (rule, value, callback)=>{
        //判断是否是数字
        if(!value ||  !exec.testNum(rule, value, callback)){
          callback(new Error('请输入数字'))
        }
        //判断码是否被挂过-填写开始/结束码时判断
        fetch({
          method:'get',
          // url:this.form.gmlx==1?'/Pcgm/checkCodeIsUseed/':'/Bzgm/wl/checkCodeIsUseed/',  //挂码类型不同，校验接口不同
          url:this.isCs?'/Bzgm/wl/checkCodeIsUseed/':'/Pcgm/checkCodeIsUseed/', 
          data: {
            code:value,
            [this.isCs?'idout':'id']:this.form.id,  // //外来采购和基地生产的id参数名不同
            scjyztId:this.userInfo.scjyztId
        }
         
        }).then((res)=>{
          if(res.bean==0){
            //比较大小
            var codeStart = Number(this.form.codeStart);
            var codeEnd = Number(this.form.codeEnd);
            if(codeStart && codeEnd){
              if(codeStart>codeEnd){
                callback(new Error('结束码不能小于开始码！'))
              }else{
                this.form.codeTotalNum = codeEnd-codeStart+1;
                callback() 
              }
            }
          }else{
            
            callback(new Error('已被挂过！'));
          }
        })
      }
      return {
        disabled:false,
        oldncpmc:'',
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        rules:{
            gmrq:commonValidate,
            gmlx:commonValidate,
            hcNcpmc:commonValidate,
            ypmc:commonValidate,
            zzpc:commonValidate,
            codeStart:[commonValidate,{ validator: validateCode, trigger: "blur" }],
            codeEnd:[commonValidate,{ validator: validateCode, trigger: "blur" }]
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                        id:'',
                        zzpcshow:'',
                        zzpc:'',
                        codeStart:'',
                        codeEnd:'',
                        codeTotalNum:'',
                        remark:'',
                        bz:'',
                        hcNcpid:'',
                        hcNcpmc:'',
                        gmrq:'',
                        gmlx:'',
                        pic:'',
                        attaUrl:'',
                        cspch:'',
                        imglists:[]
                }
            }
        },
        isCs:{
          type:Boolean,
          default:false
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    methods: {
      submitForm() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //基地生产-判断码是否被挂过（2）-提交时再判断一次
            fetch({
              method:'get',
              url:'/Pcgm/checkCode/', 
              data: {
                codeStart:this.form.codeStart,
                codeEnd:this.form.codeEnd,
                [this.isCs?'idout':'id']:this.form.id, // //外来采购和基地生产的id参数名不同
                qyId:this.userInfo.qyid,
                areaCode:this.userInfo.qydm
              }
            }).then(res=>{
                if(res.bean==2 || res.bean==3){
                  var errmsg=res.bean==2?'该码不在企业范围内！':'该码被挂过！'
                  this.$message.error(errmsg)
                  this.disabled=false;
                  return;
                }else{
                let { 
                  id,
                  zzpc,
                  codeStart,
                  codeEnd, 
                  codeTotalNum,
                  remark,
                  hcNcpid,
                  hcNcpmc,
                  gmrq,
                  gmlx,
                  attaUrl,
                  bz,
                  cspch
                } = this.form;
              //用户参数
                let {scjyztId,userId ,qyid} = this.userInfo;
                let params = {
                  zzpc,
                  codeStart,
                  codeEnd,
                  codeTotalNum,
                  remark:remark?remark:'0',
                  hcNcpid,
                  hcNcpmc,
                  gmrq,
                  addUserId:userId,
                  gmlx,
                  scjyztId,
                  qyid,
                  pic:attaUrl,
                  bz,
                  cspch,
                  id 
                }
                fetch({
                  method:'post',
                  url:this.isCs?'/cggl/cg/saveHungCodeOut/':'/Pcgm/saveHungCode/', 
                  data:params
                }).then((res)=>{
                  this.$message.success('操作成功！')
                  this.closeForm(true);
                  this.disabled=false;
                }).catch((res)=>{
                  if(res.rec == '2'){
                    this.$message.error('该批次未关联检测报告')
                  }else{
                    this.$message.error(res.errorMess)
                  }
                  this.disabled=false;
                })
              }
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
      handleRemove(file, fileList) {
        var attaUrl=[];
        fileList.forEach(item=>{
            if(!(/^blob:/ig.test(item.url))){
                attaUrl.push(item.url);
            }
        })
        attaUrl=attaUrl.join(',')
        this.form.attaUrl = attaUrl;
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
        this.form.hcNcpmc = row.ztncpmc || row.ncpMc ||row.wareName || row.ncpmc;  //1-基地生产 2-外来采购 样品名称字段不同
        if(this.form.gmlx==1){
            if(this.isCs){
              this.form.zzpcshow = String(row.zzpc)+'-'+row.packSno
            }else{
              this.form.zzpcshow = String(row.zzpc)+'-'+row.cspch+'-'+row.packSno;
            }
        }else{
            this.form.zzpcshow = row.zzpc || row.batchno;      
        }
        this.form.zzpc = row.zzpc || row.batchno;      
        this.form.remark =  row.packSno || '0';      
        this.form.hcNcpid =  row.ncpId || row.ncpmc || row.wareId;      
        this.form.cspch =  row.cspch || '';    
      },
      gmlxChange(){
        this.form.hcNcpmc='';
        this.form.zzpc='';
        this.form.hcNcpid = '';      
        this.form.remark='';
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
