/*往来单位*/
<template>
  <div>
    <page-name v-model="isEdit"></page-name>
    <page-name v-model="isEditt"></page-name>
    <v-table v-if="!isEdit&&!isEdit2" @edit="edit" @editt="editt" ref="table"></v-table>
    <v-edit v-if="isEdit" @closeForm="closeForm"></v-edit>
    <v-editt v-if="isEdit" @closeForm="closeForm"></v-editt>
  </div>
</template>

<script>
import vEdit from "./component/edit.vue";
import vEditt from "./component/editt.vue";
import vTable from "./component/table";
export default {
  name: "print",
  components: {
    vEdit,
    vTable,
    vEditt
  },
  data() {
    return {
      isEdit: false, // 判断显示table 还是 编辑弹框
      isEditt: false // 判断显示table 还是 编辑弹框
    };
  },
  methods: {
    edit(row = {}) {
      this.isEdit = true;
      this.editRow = row;
      this.isPrintDialog = false;
    },
    editt(row = {}) {
      this.isEditt = true;
      this.editRow = row;
      this.isPrintDialog = false;
    },
    closeForm(isRefresh) {
      this.isEdit = !this.isEdit;
      //if(isRefresh){
      //更新table的数据
      // this.$refs.table.search();
      // this.$refs.table.$refs.stable.getDataByPage();
      //}
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
.editFzr {
  margin-left: 150px;
}
</style>



