/*往来单位*/
<template>
  <div>
    <page-name v-model="isEdit"></page-name>
    <v-table v-if="!isEdit" @editrow="editrow"></v-table>
    <v-edit v-if="isEdit" :form="editRow" @closeForm="pcClose"></v-edit>
  </div>
</template>

<script>
import vTable from "./component/table";
import fetch from "fetch/axios/";
import { mapGetters } from "vuex";
import vEdit from "./component/edit.vue";
export default {
  name:'zxInfo',
  components: {
    vEdit,
    vTable
  },
  data() {
    return {
      editRow:{},
      isEdit: false // 判断显示table 还是 编辑弹
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    // editrow(row) {
    //   this.editRow = row;
    //   this.isEdit = true;
    // },
      editrow(row){
          fetch({
            url: "/scgl/ns/getJgQuestionById/",
            method: "get",
            data:{id: row.id}
          })
            .then(res => {
              this.editRow= res.bean;
              this.isEdit = true;
            })
            .catch(res => {
              this.$message.error(res.errorMess);
            });
    },
    pcClose() {
      this.isEdit = false;
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



