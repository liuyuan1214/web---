/*地块负责人*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>日期</label>
        <date-picker @selChange="(val)=>{selDateRange=val}"></date-picker>
        <el-button type="primary" size="small" style="padding:5px 15px" @click="search">
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>
      <div class="f-f1 f-tar">
        <el-button
          type="primary"
          size="medium"
          @click="$emit('edit')"
          round
          style="padding:9px 25px"
        >A4纸打印</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="$emit('editt')"
          round
          style="padding:9px 25px"
        >标签打印</el-button>
      </div>
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
import { timeFormat } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data() {
    return {
      selDateRange: null, //清空日期 是参数设置为null
      //table参数
      tableHeader: [
        { label: "开具日期", prop: "kjrq", width: "200" },
        { label: "农产品", prop: "ncpMc" },
        { label: "批次", prop: "zzpc" },
        { label: "重量", prop: "zl", width: "200" },
        { label: "打印份数", prop: "dysl", width: "150" },
        {
          label: "操作",
          prop: "sfky",
          width: "100",
          "render-column": this.renderEdit
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    setTimeout(() => {
      this.getTableData();
    }, 100);
    console.log(this.userInfo.userId);
    // this.getTableData();
  },
  methods: {
    /*render-column开始*/
    renderEdit(h, row) {
      return (
        <el-button
          size="mini"
          type="danger"
          onClick={() => {
            this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              cancelButtonClass: "is-round",
              confirmButtonClass: "is-round",
              type: "warning"
            })
              .then(() => {
                fetch({
                  url: "/hgzdy/delHgzdy/",
                  method: "post",
                  data: {
                    id: row.id,
                    cjr: this.userInfo.userId
                  }
                })
                  .then(res => {
                    this.$message.success("删除成功");
                    this.getTableData();
                  })
                  .catch(() => {
                    this.$message.error("删除失败");
                  });
              })
              .catch(() => {});
          }}
        >
          删除
        </el-button>
      );
    },
    /*render-column结束*/

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
    search() {
      this.$refs.stable.pageNo = 1;
      this.$refs.stable.getDataByPage();
    },
    getTableData(obj = { pageSize: 10, pageNo: 1 }) {
      this.loading = true;
      let { selDateRange } = this;
      let params = {
        qydm: this.userInfo.qydm,
        startDate: selDateRange ? selDateRange[0] : "",
        endDate: selDateRange ? selDateRange[1] : ""
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      fetch({
        url: "/hgzdy/pageHgzdy/",
        method: "post",
        data: params
      })
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
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

