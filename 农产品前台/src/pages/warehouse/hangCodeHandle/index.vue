/*产品维护*/
<template>
  <div>
    <page-name v-model="isShowBack"></page-name>
    <v-table v-if="!isEdit && !isCgEdit" @edit="edit" ref="table"></v-table>
    <v-edit
      class="editFzr"
      :pctype="pctype"
      v-if="isEdit"
      :form="pcInfo"
      :checkRow="checkRow"
      @closeForm="closeForm"
    ></v-edit>
    <v-cgedit v-if="isCgEdit"  @closeForm="closeForm" :form="pcInfo"></v-cgedit>
  </div>
</template>

<script>
import vEdit from "./components/edit";
import vCgedit from "./components/cgedit";
import vTable from "./components/table";
import { mapGetters } from "vuex";
import timeFormat from "common/tools/timeFormat";
import fetch from "fetch/axios";
export default {
  name:'warehouseHandle',
  components: {
    vEdit,
    vCgedit,
    vTable
  },
  data() {
    return {
      isEdit: false, // 判断显示table 还是 编辑弹框
      isShowBack: false,
      isCgEdit: false,
      checkRow: { id: "" },
      pcInfo: { zzpc: "" }
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    getPzInfo(zzpc) {
      return new Promise(resolve => {
        var query = {
          url: "/scgl/ns/pageZzjl/",
          method: "get",
          data: {
            searchkey: zzpc,
            scjyztId: this.userInfo.scjyztId
          }
        };
        fetch(query).then(res => {
          resolve(res.list.data);
        });
      });
    },
    getPz(row) {
      this.getPzInfo(row.zzpc).then(res => {
        if (!res || res.length == 0) {
          this.$message.error("查不到该批次信息，请联系管理员！");
          return;
        } else {
          let pctypelist = {
            "1": "zzy",
            "2": "sc",
            "3": "xm",
            "4": "syj",
            "5": "xm"
          };
          this.pctype = pctypelist[res[0].bb];
          if (!this.pctype) {
            this.pctype = "zzy";
          }
          if (row.checkStatus == 1) {
            this.checkRow.id = row.id;
          } else {
            this.checkRow.id = "";
          }
          this.pcInfo = res[0];
          this.isEdit = true;
        }
      });
    },
    edit(row) {
      if (row.gmly == 1) {
        this.getPz(row);
      } else {
        this.pcInfo = row;
        this.isCgEdit = true;
      }
      this.isShowBack = true;
    },
    closeForm(isRefresh) {
      this.isEdit = false;
      this.isCgEdit = false;
      this.isShowBack = false;
    }
  },
  watch: {
    isShowBack(newVal) {
      if (!newVal) {
        this.isEdit = false;
        this.isCgEdit = false;
      }
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



