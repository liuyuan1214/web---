/*地块负责人*/
<template>
  <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-input
          placeholder="分类名称"
          @keyup.enter.native="search"
          v-model.trim="findName"
          class="input-with-select f-vab"
          size="small"
        ></el-input>
        <el-button type="primary" size="small" style="padding:5px 15px" @click="search">
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>
      <div class="f-f1 f-tar"></div>
    </div>
    <s-table
      v-loading="loading"
      class="table"
      ref="stable"
      element-loading-text="拼命加载中"
      :tableData="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :tableHeader="tableHeader"
    ></s-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fetch from 'fetch/axios'
export default {
  data() {
    return {
      totalCount: 1,
      pageSize: 10,
      pageNo: 1,
      findName: "",
      //table参数
      tableHeader: [
        { label: "分类名称", prop: "agriProdName" },
        {
          label: "登记证号",
          prop: "djzh"
        },
        { label: "生产企业", prop: "scdw" },
        {
          label: "操作",
          prop: "delFlag",
          "render-column": this.renderEdit
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  props: {
    agriProdCode: {
      type:[String,Number],
      default:''
    }
    // sjbm: ""
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  watch:{
    agriProdCode(val){
      this.search();
    }
  },
  created() {
    console.log("=======" + this.agriProdCode);
    this.getTableData();
  },
  methods: {
    renderEdit(h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => {
            this.$emit("selsup", row);
          }}
        >
          选择
        </el-button>
      );
    },

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
    search() {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },

    getTableData(obj = {}) {
      this.loading = true;
      let params = {
        agriProdCode: this.agriProdCode,
        findName: this.findName
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      fetch({
        url:'/nzsyBizAgriLib/pageSysAgriLib/',
        method:'get',
        data:params
      }).then(res=>{
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
      // this.$fetch.api_goods
      //   .get_spfl(params)
      //   .then(res => {
      //     let { data, pageNo, totalCount } = res.list;
      //     this.tableData = data;
      //     this.totalCount = totalCount;
      //     this.currentPage = pageNo;
      //     this.loading = false;
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
