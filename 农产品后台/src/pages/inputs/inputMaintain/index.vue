/*产品维护*/
<template>
  <div>
    <page-name v-model="showBack"></page-name>
    <v-table @edit=edit v-show="!isAdd" @edits=edits ref="table"></v-table>
    <vEdits  v-if="isAdd" @closeForm="closeEdits"></vEdits>
    <el-dialog title="投入品提取" width="900px" v-if="isEdit" :visible.sync="isEdit" :before-close="closeDialog">
      <v-edit @close=close></v-edit>
    </el-dialog>
  </div>
</template>

<script>
import vEdit from './components/edit';
import vEdits from './components/edits';
import vTable from './components/table';
export default {
  name: 'inputMaintain',
  components: {
    vEdit,
    vEdits,
    vTable
  },
  data() {
    return {
      isEdit: false,   // 判断显示table 还是 编辑弹框
      isAdd: false,
      showBack: false,
      editRow: ''
    }
  },
  watch:{
      showBack(val){
          if(!val)this.isAdd = false;
      }
  },
  methods: {
    edit(row) {
      this.isEdit = true
      if (row.nhId) {
        this.editRow = row;
      } else {
        this.editRow = {
          nhId: '',
          nhxm: '',
          sfzh: '',
          xb: '1',
          dz: '',
          bz: '',
          lxdh: '',
          sfky: 1
        }
      }
    },
    edits() {
      this.showBack = true;
      this.isAdd = true;
    },
    close(isRefresh) {
      this.isEdit = !this.isEdit;
      if (isRefresh) {
        //更新table的数据
        this.$refs.table.$refs.stable1.getDataByPage();
      }
      this.$refs.table.$refs.stable2.getDataByPage();
    },
    closeEdits(){
        this.isAdd = false;
        this.$refs.table.$refs.stable1.getDataByPage();
        this.$refs.table.$refs.stable2.getDataByPage();
    },
    closeDialog(done) {
      this.$refs.table.$refs.stable2.getDataByPage();
      done();
    }
  }
}
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



