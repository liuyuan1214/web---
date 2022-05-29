/*编辑*/
<template>
  <div style="margin:20px 20px 50px 20px;">
    <div class="f-df zx-info">
      <div class="zx-info-left">
        <div class="zx-item">
          <span class="zx-label">质询时间：</span>
          <span class="zx-content">{{form.askTime}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">状态：</span>
          <span class="zx-content">{{form.state==1?'未完结':'完结'}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">农产品：</span>
          <span class="zx-content">{{form.ncpmc}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">批次号：</span>
          <span class="zx-content">{{form.batchNo}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">被质询单位：</span>
          <span class="zx-content">{{form.companyName}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">质询人：</span>
          <span class="zx-content">{{form.askerName}}</span>
        </div>
        <div class="zx-item">
          <span class="zx-label">质询内容：</span>
          <span class="zx-content">{{form.content}}</span>
        </div>
      </div>
      <!--<div class="f-df f-aic" v-if="form.state==1">
        <el-button style="width:100px;margin:0 50px;" round @click="closeZx()" type="primary">完 结</el-button>
      </div>-->
    </div>
    <div  class="subtitle f-mt10">质询情况</div>
    <div v-if="form.listInfo.length">
      <div v-for="(item,index) in form.listInfo" class="info-item" :Key="index">
            <div>
              <span class="info-name">{{item.asker}}</span>
              <span class="info-time">{{item.askDate}}</span>
            </div>
            <div class="info-content">{{item.content}}</div>
          </div>
    </div>
    <div v-else class="f-pl20">
      暂无质询信息
    </div>
    <div  style="width:900px;padding-left:20px;" v-if="form.state==1" >
      <el-input
       class="f-mt20 f-mb20"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 10}"
        v-model.trim="content"
        placeholder="请输入质询信息"
      ></el-input>
      <div class="f-tac">
        <el-button
          round
          type="primary"
          @click="submitForm"
          :disabled="disabled"
        >{{disabled?'提交中':'提 交'}}</el-button>
        <el-button round @click="closeForm(false)">取 消</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data() {
    return {
      disabled: false,
      loading: false,
      content:'',
      isEdit: true,
      qylist: [],
      zxInfo:''
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
		       questionId: "", 
            origName: "",
            asker: "",
            content: "",
            summary: "",
            xtczzd: "",
            qyid: "",
            listInfo:[],
        };
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    submitForm() {
      //this.$refs.form.validate(valid => {
       // if (valid) {
	       if(!this.content){
          this.$message.error('请填写质询信息！')
          return;
          }
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            companyName,
            attaUrl,
            id,
            rbly,
            creator
          } = this.form;
          //用户参数
          let { userId,yhxm} = this.userInfo;
          let params = {
            questionId:this.form.id, 
            origName:this.form.companyName,
            asker:this.userInfo.yhxm,
            content:this.content,
            summary:0,
            xtczzd:1,
            qyid:this.form.askOrgiId,
            creator: userId,
            operator: userId,
          };
          fetch({
            url: "/scgl/ns/saveQuestionInfo/",
            method: "post",
            data: params
          })
            .then(res => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
            })
            .catch(res => {
              this.$message.error(res.errorMess);
              this.disabled = false;
            });
       // } else {
       //   this.$message.error("请按要求填写");
       //   return false;
        //}
      //});
    },
    closeZx() {
      this.$confirm("此操作将完结该质询信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "is-round",
        confirmButtonClass: "is-round",
        type: "warning"
      })
        .then(() => {
          fetch({
            url: "/scgl/ns/updateQuestionState/",
            method: "post",
            data: {
              id: this.form.id,
              state: 2
            }
          })
            .then(res => {
              this.$message.success("操作成功！");
              this.form.state = 2;
            })
            .catch(res => {
              this.$message.success(res.errorMess);
            });
        })
        .catch(() => {});
    },
    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    }
  }
};
</script>

<style lang="scss" scoped>
.zx-info {
  border: 1px solid #d2d2d2;
  padding-right: 200px;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 0 10px #d2d2d2;
  padding: 20px;
  line-height: 40px;
  width: 1350px;
  .zx-info-left {
    border-right: 2px dashed #eee;
    flex: 1;
    .zx-item {
      width: 49%;
      display: inline-block;
      .zx-label {
        width: 100px;
        padding-right: 10px;
        display: inline-block;
        text-align: right;
        color: #999;
      }
      .zx-content {
        color: #606266;
      }
    }
  }
}
.subtitle {
  height: 35px;
  margin: 20px 0 20px 0;
  line-height: 35px;
  font-size: 18px;
  color: #fff;
  padding: 0 20px;
  display: inline-block;
  background: #417f04;
  border-top-right-radius: 18px;
}
.info-item{
   width:900px;
   padding-left:20px;
   line-height:35px;
   >div{
     display:flex;
   }
  .info-name{
    width:150px;
    color: #999;
  }
  .info-time{
    color:#606266;
  }
  .info-content{
    font-size:16px;
  }
}
</style>


