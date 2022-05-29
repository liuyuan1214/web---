<template>

    <div class="main-info">
      <div class="subtitle">基本信息</div>
      <div class="baseinfo">
         <div class="f-df row">
            <div class="title">企业名称</div>
            <div class="f-f1"><span>{{infos.ztmc}}</span></div>
            <div class="title"><span class="must-icon">*</span>企业简称</div>
            <div class="f-f1">
              <el-input  :class="reqiredKeys.ztjc?'border-red':''" placeholder="请输入" :maxlength="16" type="text" v-if="edit" v-model.trim="infos.ztjc"/>
              <span v-else>{{infos.ztjc}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title"><span class="must-icon">*</span>法人代表</div>
            <div class="f-f1">
              <el-input  :class="reqiredKeys.frdb?'border-red':''"  placeholder="请输入" :maxlength="20" show-word-limit type="text" v-if="edit" v-model.trim="infos.frdb"/>
              <span v-else>{{infos.frdb}}</span>
            </div>
            <div class="title">主要产业</div>
            <div class="f-f1"><span>{{infos.industryName}}</span></div>
         </div>
         <div class="f-df row">
            <div class="title"><span class="must-icon">*</span>联系人</div>
            <div class="f-f1">
                            <el-input :class="reqiredKeys.lxr?'border-red':''"  placeholder="请输入" :maxlength="20" show-word-limit v-if="edit" v-model.trim="infos.lxr"/>
              <span v-else>{{infos.lxr}}</span>
            </div>
            <div class="title"><span class="must-icon">*</span>联系电话</div>
            <div class="f-f1">
              <el-input :class="reqiredKeys.lxdh?'border-red':''"   placeholder="请输入" :maxlength="20" show-word-limit type="number" v-positiveNumber  v-if="edit" v-model.trim="infos.lxdh" />
              <span v-else>{{infos.lxdh}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title"><span class="must-icon">*</span>企业地址</div>
            <div class="f-f1">
              <el-input  :class="reqiredKeys.dz?'border-red':''" placeholder="请输入" :maxlength="60"  show-word-limit type="text" v-if="edit" v-model.trim="infos.dz"/>
              <span v-else>{{infos.dz}}</span>
            </div>		
            <div class="title"><span class="must-icon">*</span>坐标</div>
            <div class="f-f1 f-df f-pr">
              <template  v-if="edit" >
                            
                          <el-input ><span slot="prefix">x：{{infos.xzb}}<span class="f-pr20 f-pl20"></span>y：{{infos.yzb}}</span><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
                            <div class="f-pa" @click="selxyzbDialog=true" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
              </template>
              <span v-else>x：{{infos.xzb}}<span class="f-pr20 f-pl20"></span>y：{{infos.yzb}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title">GS1企业位置码</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入"  :maxlength="20" v-if="edit" type="number" v-positiveNumber  v-model.trim="infos.positCode"/>
              <span v-else>{{infos.positCode}}</span>
            </div>
            <div class="title">从业人数</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="20" type="number" v-positiveNumber v-if="edit"  v-model.trim="infos.cyrs"/>
              <span v-else>{{infos.cyrs}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title"><span class="must-icon">*</span>主体面积(亩)</div>
            <div class="f-f1">
                            <el-input :class="reqiredKeys.zdmj?'border-red':''"  placeholder="请输入" :maxlength="10" show-word-limit type="number" v-positiveNumber v-if="edit"  v-model.trim="infos.zdmj"/>
              <span v-else>{{infos.zdmj}}</span>
            </div>
            <div class="title"><span class="must-icon">*</span>种养殖面积(亩)</div>
            <div class="f-f1">
                            <el-input :class="reqiredKeys.scmj?'border-red':''"  placeholder="请输入" :maxlength="10" show-word-limit type="number" v-positiveNumber v-if="edit" v-model.trim="infos.scmj"/>
              <span v-else style="padding:0 10px">{{infos.scmj}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title"><span class="must-icon">*</span>主体类别</div>
            <div class="f-f1">
              <el-select :class="reqiredKeys.nyzt?'border-red':''"  v-model.trim=infos.nyzt v-if="edit" style="width:100%;">
                <el-option value ="1" label="农业龙头企业"></el-option>
                <el-option value ="2" label="专业合作社"></el-option>
                <el-option value="3" label="家庭农场"></el-option>
                <el-option value="4" label="其他"></el-option>
              </el-select>
              <span v-else>{{infos.nyzt==1? '农业龙头企业':infos.nyzt==2 ?'专业合作社':infos.nyzt==3 ?'家庭农场':'其他'}}</span>
            </div>
            <div class="title"><span class="must-icon">*</span>主体级别</div>
            <div class="f-f1">
              <el-select :class="reqiredKeys.company?'border-red':''"  v-model.trim=infos.company v-if="edit" style="width:100%;">
                <el-option value ="1" label="县级"></el-option>
                <el-option value ="2" label="市级"></el-option>
                <el-option value="3" label="省级"></el-option>
                <el-option value="4" label="国家级"></el-option>
                <el-option value="5" label="其他"></el-option>
              </el-select>
              <span v-else>{{infos.company==1? '县级':infos.company==2 ?'市级':infos.company==3 ?'省级':infos.company==4?'国家级':'其他'}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title">公司邮箱</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="20" type="text" v-if="edit" v-model.trim="infos.gsyx"/>
              <span v-else>{{infos.gsyx}}</span>
            </div>
            <div class="title">公司网址</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="120" type="text" v-if="edit" v-model.trim="infos.gswz"/>
              <span v-else>{{infos.gswz}}</span>
            </div>
         </div>
         <div class="f-df row f-pr">
            <div class="title height100 f-pa"  style="display: flex; align-items: center;justify-content:center">公司简介</div>
            <div class="f-f1" style="margin-left:200px">
              <el-input  placeholder="请输入，500字以内"  :maxlength="500" show-word-limit type="textarea" :autosize="{ minRows: 3, maxRows: 10}"  v-if="edit" v-model.trim="infos.qyjs"/>
              <span v-else>{{infos.qyjs}}</span>
              </div>
         </div>
      </div>
      <div class="subtitle f-mt30">工商注册信息</div>
      <div class="baseinfo">
         <div class="f-df row">
			<div class="title">统一社会信用代码</div>
            <div class="f-f1"><span>{{infos.tyshxydm}}</span></div>
            <div class="title">经营状态</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="30" type="text" v-if="edit" v-model.trim="infos.jyzt"/>
              <span v-else>{{infos.jyzt}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title">注册资本</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="30" show-word-limit type="text" v-if="edit" v-model.trim="infos.zczb"/>
              <span v-else>{{infos.zczb}}</span>
            </div>
            <div class="title">登记机关</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" :maxlength="30" show-word-limit type="text" v-if="edit" v-model.trim="infos.djjg"/>
              <span v-else>{{infos.djjg}}</span>
            </div>
         </div>
         <div class="f-df row">
            <div class="title">成立日期</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" type="text" v-if="edit" v-model.trim="infos.clrq"/>
              <span v-else>{{infos.clrq}}</span>
            </div>
            <div class="title">核准日期</div>
            <div class="f-f1">
                            <el-input  placeholder="请输入" type="text" v-if="edit" v-model.trim="infos.fzrq"/>
              <span v-else>{{infos.fzrq}}</span>
            </div>
         </div>
		      <div class="f-df row f-pr">
            <div class="title f-pa height100" style="display: flex; align-items: center;justify-content:center">经营范围</div>
            <div class="f-f1" style="margin-left:200px;">
                            <el-input  placeholder="请输入" :maxlength="500" show-word-limit  type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-if="edit" v-model.trim="infos.jyfw"/>
              <span v-else style="padding:10px">{{infos.jyfw}}</span>
            </div>
         </div>
         </div>
         <div class="f-tac f-mt30" v-if="!edit">
              <el-button round @click="edit=!edit" type="primary" size="medium">修 改</el-button>
         </div>
         <div class="f-tac f-mt30" v-else>
             <el-button round @click="submit" type="primary" size="medium">保 存</el-button>
             <el-button round @click="edit=!edit" size="medium">取 消</el-button>
         </div>
        <el-dialog title="选择坐标" :append-to-body="true" :visible.sync="selxyzbDialog" width="900px">
          <selxyzb style="width:850px;height:600px;" @selxyzb="selxyzb" :xy="{x:infos.xzb,y:infos.yzb}" ></selxyzb>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import selxyzb from "./selxyzb";

    export default {
        data(){
            return {
               selxyzbDialog:false,
                infos:{},
                edit:false,
                reqiredKeys:{'ztjc':false,'frdb':false,'lxdh':false,'lxr':false,'zdmj':false,'scmj':false,'company':false,'nyzt':false}
            }
        },
        components:{
          selxyzb
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          this.getZtInfo();
        },
       methods:{
          selxyzb(obj){
              this.infos.xzb = obj.x;
              this.infos.yzb = obj.y;
              // this.infos.xyzb = 'x:'+obj.x + ',y:' + obj.y;
              this.selxyzbDialog =false;
          },
          getZtInfo(){
            var params ={scjyqyId: this.userInfo.qyid}
            this.$fetch.api_user.user_comInfo(params).then((res)=>{
                let {company,xzb,yzb,qyjs,ztdm,ztmc,frdb,scpz,lxr,lxdh,dz,cyrs,zdmj,scmj,ztlb,ztjc,nyzt,qydm,industryName} = res.bean;
                let {tyshxydm,jyzt,scjyqyId,positCode,gsyx,gswz,zczb,yyqx,clrq,fzrq,djjg,jyfw} = res.beanTemp;
                this.infos = {qydm,company,nyzt,xzb,yzb,qyjs,ztdm,ztmc,frdb,scpz,lxr,lxdh,dz,cyrs,zdmj,scmj,ztlb,ztjc,tyshxydm,jyzt,scjyqyId,positCode,gsyx,gswz,zczb,yyqx,clrq,fzrq,djjg,jyfw,industryName}
            })
          },
          submit(){
            let {nyzt,qydm,company,xzb,yzb,qyjs,ztdm,ztmc,frdb,scpz,lxr,lxdh,dz,cyrs,zdmj,scmj,ztlb,ztjc,tyshxydm,jyzt,scjyqyId,positCode,gsyx,gswz,zczb,yyqx,clrq,fzrq,djjg,jyfw} = this.infos;
            let params = {nyzt,industryId:this.userInfo.industryId,nyVersion:1,qydm,company,xzb,yzb,qyjs,ztdm,ztmc,frdb,scpz,lxr,lxdh,dz,cyrs,zdmj,scmj,ztlb,tyshxydm,ztjc,jyzt,scjyqyId,positCode,gsyx,gswz,zczb,yyqx,clrq,fzrq,djjg,jyfw};
            //检验参数是否存在
            var isPass = true;
            for(var item in this.reqiredKeys){
              if(!params[item]){
                isPass = false;
                this.reqiredKeys[item]=true;
              }else{
                this.reqiredKeys[item]=false;
              }
            }
            if(!isPass){
               this.$message.error('请按要求填写信息！');
              return 
            }
            this.$fetch.api_user.user_comSave(params).then(res=>{
                this.$message.success('保存成功！')
                this.edit=!this.edit;
            }).catch(res=>{
               this.$message.error('保存失败！');
            })
          },

      }
    }
</script>

<style lang="scss" scoped>
   .baseinfo{
     border-top:1px solid #ececec;
     border-left:1px solid #ececec;
     line-height:36px;
     .title{
       width:200px;
       line-height: 40px;
       height:40px;
       text-align:center;
     }
     .row>div{
       border-right:1px solid #ececec;
       border-bottom:1px solid #ececec;
       line-height:39px;
     }
     .row span{
       padding-left:10px;
       display: inline-block;
     }
   }
   .subtitle{
    margin-bottom:16px;
    font-weight:bold;
    color:#383838;
   }
   input,select{
      height: 40px;
      width: 100%;
      box-sizing: border-box;
      padding-left:10px;
      background-color: rgba(247, 247, 247, 0.1);
   }
   .must-icon{
     font-size:18px;
     color:red;
     padding-right:3px;
   }
   .height100{
      height:100% !important;
   }
</style>
<style lang="scss">
  .main-info .border-red{
     border-color:red;
     input{
          border-radius: 0 !important;
          border: 2px solid red !important;
     }
   }
    .main-info .el-input__prefix {
        color: #333;
    }
</style>


