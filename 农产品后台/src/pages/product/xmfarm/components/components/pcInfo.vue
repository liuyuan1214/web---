// 批次管理中的第一部分：批次信息
<template>
  <div class="f-df border">
    <!-- 如果不是编辑状态则去除input边框 -->
    <!-- v-if="form.cdmc || isEdit" 如果不为空或者是编辑状态display才为block -->
    <!-- value-format="yyyy-MM-dd"  结果才是想要的格式or格林尼治时间 -->
    <div :class="['pcinfo',isEdit?'':'editPcInfo']">
      <div class="f-pr">
        <label>养殖产品</label>
        <el-input class="input-item" v-if="form.ztncpmc"  :disabled="isEdit" v-model.trim="form.ztncpmc">
          <span v-if="isEdit" slot="suffix" class="f-fs24 f-pr10">···</span>
        </el-input>
        <div
          class="f-pa"
          v-if="isEdit"
          @click="fzrDialogVisable=true"
          style="top:0;right:0;left:0;bottom:0;opacity:0;"
        ></div>
      </div>
	  <div>
        <label>品种</label>
        <el-input
          class="input-item"
          v-if="form.trpdm || isEdit"
          placeholder="请输入"
          v-model.trim="form.trpdm"
          clearable
          :readonly="!isEdit"
        />
      </div>
      <div>
        <label>养殖场所</label>
        <el-input
          class="input-item"
          v-if="form.cdmc || isEdit"
          placeholder="请输入"
		  :disabled="isEdit"
          v-model.trim="form.cdmc"
          clearable
          :readonly="!isEdit"
        />
      </div>
      <div>
        <label>养殖批次</label>
        <el-input
          class="input-item"
          v-if="form.zzpc || isEdit"
          placeholder="请输入"
          :disabled="isEdit"
          v-model.trim="form.zzpc"
          clearable
          :readonly="!isEdit"
        />
      </div>
      <div>
        <label>进场日期</label>
        <el-date-picker
          class="input-item"
          v-model.trim="form.qprq"
          type="date"
          :readonly="!isEdit"
          v-if="form.qprq || isEdit"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div>
        <label>出生日期</label>
        <el-date-picker
          class="input-item"
          v-model.trim="form.zzrq"
          type="date"
          :readonly="!isEdit"
          v-if="form.zzrq || isEdit"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div>
        <label>预售日期</label>
        <el-date-picker
          class="input-item"
          v-model.trim="form.ysrq"
          type="date"
          :readonly="!isEdit"
          v-if="form.ysrq || isEdit"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div>
        <label>存栏数</label>
        <el-input
          class="input-item"
          v-if="form.cls  || isEdit"
          placeholder="请输入"
          v-model.trim="form.cls"
		  :disabled="isEdit"
          clearable
          :readonly="!isEdit"
        />
         <el-input
          class="input-item"
          v-else
          placeholder="请输入"
          v-model.trim="form.cls"
          readonly
        />
      </div>
      <div>
        <label>备注</label>
        <el-input
          class="input-item"
          v-if="form.bz || isEdit"
          placeholder="请输入"
          v-model.trim="form.bz"
          clearable
          :readonly="!isEdit"
        />
      </div>
	        <div>
        <label>状态</label>
        <el-input
          class="input-item"
          v-if="form.zt  || isEdit"
          placeholder="请输入"
		  :disabled="isEdit"
          v-model.trim="form.zt==1?'未完结':'已完结'"
          clearable
          :readonly="!isEdit"		  
        />
      </div>
    </div>
    <div class="f-df edit-btn" sw-mode="y" v-if="pageName && form.zt==1">
      <div class="f-f1" style="line-height:108px">
        <el-button round style="background-color:#ff8d02;border:0;color:#fff" @click="!isEdit?isEdit=true:savePcInfo()">{{isEdit?'保存批次':'修改批次'}}</el-button>
      </div>
      <div class="f-f1" style="line-height:108px">
        <el-button round style="background-color:#ff3333;border:0" type="info" @click="closePc()">结束批次</el-button>
      </div>
    </div>
	    <div class="f-df edit-btn" sw-mode="y" v-if="checkRow.id">
      <div class="f-f1" style="line-height:108px">
        <el-button round @click="updateHungCheck(2)"> 批次审核 </el-button>
      </div>
      <div class="f-f1" style="line-height:108px">
        <el-button round type="info" @click="updateHungCheck(3)"> 批次作废 </el-button>
      </div>
    </div>
    <div style="padding:20px 0 0 50px;">
      <div style="padding-bottom:10px;">批次信息查看(微信扫一扫)</div>
 <vueqr v-if="pcInfo.zzpc" :zzpc="pcInfo.zzpc"></vueqr>
    </div>
  </div>
</template>
<script>
import { exec } from "common/tools";
import fetch from "fetch/axios";
// import 
export default {
    inject:['pcInfo','checkRow','pageName'],
  data() {
    return {
      isEdit: false
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          zzjlId: "",
          csmc: "",
          zttrpId: "",
          ztncpId: "",
          qprq: "",
          zzrq: "",
          qydm: "",
          sccsid: "",
          trpdm: "",
          ncpmc: "",
          zzmj: "",
          zzfs: "",
          zzl: "",
          ysl: "",
          ysrq: "",
          bz: "",
          czr: "",
          cjr: "",
          pic: "",
          attaUrl: "",
          imglists: []
        };
      }
    }
  },
  methods: {
    //结束批次
    closePc() {
      this.$alert("确定结束改种植记录？结束后不能进行相关操作！", "结束", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showCancelButton: true,
        cancelButtonClass: "is-round",
        confirmButtonClass: "is-round",
        callback: action => {
          if (action === "confirm") {
            var params = {
              url: "/scgl/ns/finishZzjl/",
              method: "post",
              data: {
                zzpc: this.form.zzpc,
				zt:2,
              }
            };
            fetch(params)
              .then(res => {
			    this.form.zt=2;
                this.$message.success("操作成功！");
                this.isEdit = false;
              })
              .catch(error => {
                this.$message.error(error.errorMess);
              });
          }
        }
      });
    },
	      updateHungCheck(checkStatus){
      this.$alert(`是否确定${checkStatus==3?'作废':'提交审核'}？`, "结束", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showCancelButton: true,
        cancelButtonClass: "is-round",
        confirmButtonClass: "is-round",
        callback: action => {
          if (action === "confirm") {
            var params = {
              url: "/Bzgm/gm/updateHungCheck/",
              method: "post",
              data: {
                id:this.checkRow.id,
                checkStatus,
              }
            };
            fetch(params)
              .then(res => {
                this.checkRow.id= '';
                this.$message.success("操作成功！");
              })
              .catch(error => {
                this.$message.error(error.errorMess);
              });
          }
        }
      });
    },
    //保存批次
    savePcInfo() {
      let {
        zzjlId,
        scjyztId,
        zttrpId,
        ztncpId,
        qprq,
        zzrq,
        qydm,
        sccsid,
        trpdm,
        ncpmc,
        zzmj,
        zzfs,
		cls,
        zzl,
        ysl,
        ysrq,
        bz,
        czr,
        cjr,
        attaUrl
      } = this.form;
      let params = {
        zzjlId,
        scjyztId,
        zttrpId,
        ztncpId,
        qprq,
        zzrq,
        qydm,
        sccsid:this.pcInfo.csmc,
        trpdm,
        ncpmc,
		zzpc:this.pcInfo.zzpc,
        zzmj,
        zzfs,
		cls,
        zzl,
        ysl,
        ysrq,
        bz,
        czr,
        cjr:czr,
        pic:attaUrl
      };

      fetch({
        method: "post",
        url: "/scgl/ns/saveZzjl/",
        data: params
      })
        .then(res => {
          this.$message.success("操作成功！");
          this.isEdit = false;
        })
        .catch(res => {
          this.$message.error(res.errorMess);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.pcinfo {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  // line-height: 40px;
  & > div {
    width: 50%;
    padding-right: 20px;
    box-sizing: border-box;
    display: flex;
    label {
      width: 100px;
      padding-right: 10px;
      display: inline-block;
      text-align: right;
      color: #999;
      line-height: 36px;
    }
    .input-item {
      flex: 1;
      color: #333;
    }
  }
}
.edit-btn {
  padding: 20px;
}
.border {
  border: 1px solid #d2d2d2;
  padding-right: 200px;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 0 10px #d2d2d2;
}
</style>

<style>
.editPcInfo .el-input__inner {
  border: 1px solid #fff !important;
}
.editPcInfo .el-input__icon ,.pcinfo  .el-input__icon{
    height: 36px;
}
</style>
