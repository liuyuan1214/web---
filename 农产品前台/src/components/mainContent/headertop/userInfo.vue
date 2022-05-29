<template>
  <div>
    <!-- 用户中心 -->
    <div class="f-pr30 f-fs18 f-cp">
          <span class="f-di f-pr30 f-pl50" style="color:#b5b2ad">|</span>
          <el-dropdown trigger="click" @command="handleCommand" class="f-fs18">
            <span class="el-dropdown-link f-fs18">
              欢迎你，{{getUserInfo?getUserInfo.yhxm:""}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">
                <span class="f-db">账户管理</span>
              </el-dropdown-item>
              <el-dropdown-item command="a">
                <span class="f-db">修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="b">
                <span class="f-db">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
    </div>
    <!-- 修改密码的弹框开始 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="400px"
      :before-close="closeForm"
    >
      <el-form
        :model="passwordData"
        status-icon
        :rules="rules2"
        ref="passwordData"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="password">
          <el-input type="password" v-model.trim="passwordData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model.trim="passwordData.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model.trim="passwordData.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
		提示：密码至少6个字符,且包含一个字母！
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePwd('passwordData')"  round>提交</el-button>
        <el-button @click="cancelForm('passwordData')" round>取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router, { resetRouter } from 'src/router/'

export default {
  data() {
    var checkPwd = (rule, value, callback) => {
	  var pattern1 = /([0-9]+)/;
      var pattern2 = /([A-Za-z]+)/;
      if (!value) {
        return callback(new Error("新密码不能为空"));
      }
        //没有数字、大写字母、小写字母时返回false，验证输入的密码不符合规则。
        if(!pattern1.exec(value) || !pattern2.exec(value)){
           return callback(new Error('必须包含字母数字！'));
        }
      if (value.length < 6 || value.length > 12) {
        callback(new Error("请输入6-12位字符"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordData.confirmPassword !== "") {
          this.$refs.passwordData.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordData.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      passwordData: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules2: {
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
        newPassword: [{ validator: checkPwd, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters({
      getUserInfo:"getUserInfo"
    })
  },
  methods: {
    //退出登录
    user_out() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass:'is-round',
        confirmButtonClass:'is-round',
        type: "warning"
      }).then(() => {
          this.$message.success('退出登录成功！');
          localStorage.removeItem('ncpUserInfo');
          // this.$store.dispatch('setUserInfo');
          setTimeout(()=>{
            this.$router.replace({ name: "login" });
          },300)
          resetRouter();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 20);
        }).catch(() => {});
    },
    //修改密码
    updatePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params={
            userId:String(this.getUserInfo.userId),
            oldPwd:this.$md5(this.passwordData.password),
            newPwd:this.$md5(this.passwordData.newPassword)
          }
          this.$fetch.api_user.user_modifyPwd(params).then((data)=>{
          if(data.pwdRes==1){
          this.$message.success('密码更新成功！')
          this.cancelForm(formName);
          }else if(data.pwdRes==2){
          this.$message.error('旧密码不匹配')
          this.passwordData.password="";
          this.passwordData.newPassword="";
          this.passwordData.confirmPassword="";
          }	
          }).catch(res=>{
            this.$message.error('旧密码错误，请重新输入')
            this.passwordData.password="";
            this.passwordData.newPassword="";
            this.passwordData.confirmPassword="";
          })
        } else {
          return false;
        }
      });
    },
    //关闭弹框的收尾工作,清空校验
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    closeForm(done) {
      this.$refs.passwordData.resetFields();
      done();
    },
    handleCommand(type) {
      switch (type) {
        case "a":
          this.dialogVisible = true;
          break;
        case "b":
          this.user_out();
          break;
        case "c":
          this.$router.push({path: '/user/userManage'})
          break;
        default:
          console.warn("无匹配");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
    .el-dropdown-link {
        color: #fff;
    }
</style>
