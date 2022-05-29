/*编辑*/
<template>
  <div>
    <div style="margin:20px 20px 50px 20px;">
      <div class="f-df zx-info">
        <div class="zx-info-left">
          <div class="zx-item">
            <span class="zx-label">挂码时间：</span>
            <span class="zx-content">{{form.hungDate}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">挂码人：</span>
            <span class="zx-content">{{form.hunger}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">农产品：</span>
            <span class="zx-content">{{form.ncpMc}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">状态：</span>
            <span class="zx-content">{{form.checkStatus==1?'未完结':'完结'}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">开始码：</span>
            <span class="zx-content">{{form.codeStart}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">结束码：</span>
            <span class="zx-content">{{form.codeEnd}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">挂码数：</span>
            <span class="zx-content">{{form.codeTotal}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">批次号：</span>
            <span class="zx-content">{{form.zzpc}}</span>
          </div>
          <div class="zx-item">
            <span class="zx-label">提交单位：</span>
            <span class="zx-content">{{form.ztMc}}</span>
          </div>
        </div>
        <div class="f-df f-aic f-pr20 f-pl20" v-if="form.checkStatus==1" style="border-left: 2px dashed #eee;">
          <el-button round @click="updateHungCheck" type="primary">批次审核</el-button>
        </div>
      </div>
    </div>
    <div class="f-tac mt20" style=" width: 80%;">
      <el-button round @click="closeForm">取 消</el-button>
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
      content: "",
      isEdit: true,
      qylist: [],
      zxInfo: ""
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          checkStatus: 1,
          checkDate: null,
          checkOpinion: null,
          checker: null,
          codeEnd: "",
          codeStart: "",
          codeTotal: "",
          csId: "",
          csmc: "",
          cyid: "",
          hungDate: "",
          hunger: "",
          ncpMc: "",
          qydm: "",
          ztMc: "",
          zzpc: ""
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
    updateHungCheck(checkStatus) {
      this.$alert(`是否确定提交审核？`, "结束", {
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
                id: this.form.id,
                checkStatus: 2
              }
            };
            fetch(params)
              .then(res => {
                this.form.checkStatus = 2;
                this.$message.success("操作成功！");
              })
              .catch(error => {
                this.$message.error(error.errorMess);
              });
          }
        }
      });
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
  width: 80%;
  .zx-info-left {
    
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
  background: #2695b3;
  border-top-right-radius: 18px;
}
.info-item {
  width: 900px;
  padding-left: 20px;
  line-height: 35px;
  > div {
    display: flex;
  }
  .info-name {
    width: 150px;
    color: #999;
  }
  .info-time {
    color: #606266;
  }
  .info-content {
    font-size: 16px;
  }
}
</style>


