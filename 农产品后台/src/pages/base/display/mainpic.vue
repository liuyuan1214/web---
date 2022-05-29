:http-request="uploads.uploadImg"   是一个函数，自定义传入参数  uploadImg:(item)=>{return this.uploadImg(item,4)   传入参数
limit 不显示filelist则limit 不为 0 不能触发自动上传功能
使用了http-request 拦截 则不能 监听 on-success函数
<template>
  <div class="ztpic">
    <div v-for="(uploads,index) in uploadlist" :key="index">
      <div class="subtitle f-mt20">{{uploads.title}}</div>
      <el-upload
        action="''"
        :auto-upload="true"
        :limit="uploads.limit"
        :http-request="uploads.uploadImg"
        :file-list="uploads.filelist"
        :show-file-list="index=='cover'||index=='coverlogo'?false:true"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :multiple="index=='cover'?false:true"
        list-type="picture-card">
        <img v-if="index=='cover' && uploads.filelist[0]" :src="uploads.filelist[0].attaUrl" class="avatar"
             style="width:148px;height: 148px; display: block;">
        <img v-else-if="index=='coverlogo' && uploads.filelist[0]" :src="uploads.filelist[0].attaUrl" class="avatar"
             style="width:148px;height: 148px; display: block;">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div v-if="uploads.remark">{{uploads.remark}}</div>
    </div>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import fetch from 'fetch/axios/'

  export default {
    data() {
      return {
        uploadlist: {
          cover: {
            title: '企业封面主图', filelist: [], remark: '', limit: 0, uploadImg: (item) => {
              return this.uploadImg(item, 4)
            }
          },
          coverlogo: {
            title: '企业logo', filelist: [], remark: '', limit: 0, uploadImg: (item) => {
              return this.uploadImg(item, 9)
            }
          },
          sfzs: {
            title: '企业法人身份证',
            filelist: [],
            remark: '注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多正反2张',
            limit: 2,
            uploadImg: (item) => {
              return this.uploadImg(item, 10)
            }
          },
          yyzzs: {
            title: '企业营业执照',
            filelist: [],
            remark: '注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多9张',
            limit: 9,
            uploadImg: (item) => {
              return this.uploadImg(item, 5)
            }
          },
          products: {
            title: '优质农产品',
            filelist: [],
            remark: '注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多9张',
            limit: 9,
            uploadImg: (item) => {
              return this.uploadImg(item, 1)
            }
          },
          honors: {
            title: '荣誉及资质',
            filelist: [],
            remark: '注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多9张',
            limit: 9,
            uploadImg: (item) => {
              return this.uploadImg(item, 2)
            }
          },
          baseland: {
            title: '基地环境及设施',
            filelist: [],
            remark: '注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多9张',
            limit: 9,
            uploadImg: (item) => {
              return this.uploadImg(item, 3)
            }
          }
        },
        dialogVisible: false,
        dialogImageUrl: ''
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
      })
    },
    created() {
      [0, 1, 2, 3, 4, 8, 9].forEach(item => {
        this.getPicList(item);
      })
    },
    methods: {
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error('请上传图片格式为JPG、JPEG或者JNP！')
        }
        if (!isLt3M) {
          this.$message.error('图片大小不能超过3M！')
        }
        return isJPG && isLt3M;
      },
      //上传图片
      uploadImg(item, picType) {
        let formData = new FormData();
        formData.append("clientFile", item.file);
        var query = {
          url: '/utilmodel/uploadFile/',
          method: 'upload',
          data: formData
        }
        fetch(query).then(res => {
          this.addImg(res, picType);
          this.$message.success('操作成功！')
        })
      },
      //上传图片成功后，添加进入数据库
      addImg(response, picType) {
        if (picType == 4) {
          // 设置响应式
          this.$set(this.uploadlist.cover.filelist, 0, {attaUrl: response.bean})
        } else if (picType == 9) {
          this.$set(this.uploadlist.coverlogo.filelist, 0, {attaUrl: response.bean})
        }
        var params = {
          qyId: this.userInfo.qyid,
          oldAttaName: '11.png',
          picType,
          uploadUserId: this.userInfo.userId,
          newAttaName: '1.png',
          format: 'png',
          attaUrl: response.bean
        };
        this.$fetch.api_user.user_compicsave(params).then(res => {
          this.$message.success('上传成功！')
        }).catch(res => {
          this.$message.erorr('删除失败！')
        })
      },
      //初始化获得图片
      getPicList(type) {
        let params = {
          qyId: this.userInfo.qyid,
          type: type + 1
        }
        this.$fetch.api_user.user_compiclist(params).then(res => {
          res.list.forEach(item => {
            item.url = item.attaUrl;
            item.name = item.oldAttaName;
          })
          let pictypes = ['products', 'honors', 'baseland', 'cover', 'yyzzs', '', '', '', 'coverlogo', 'sfzs'];
          this.uploadlist[pictypes[type]].filelist = res.list;
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file) {
        this.$fetch.api_user.user_compicdelete({id: file.attaId}).then(res => {
          this.$message.success('删除成功！')
        }).catch(res => {
          this.$message.erorr('删除失败！')
        })
      }
    }
  }
</script>

<style scoped>
  .subtitle {
    margin-bottom: 16px;
    font-weight: bold;
    color: #383838;
  }
</style>
