

    export default {
        data(){
            return {
                taskData:[],
                multipleSelection:[],
            }
        },
        props:{
          selIds:{
            type:Array,
            default:function(){
              return []
            }
          }
        }, 
       methods:{
        // 选中table已有数据
        toggleSelection(rows) {
          rows = rows.filter(item=>{
            if(!this.selIds.find(hasSelItem=>{ return hasSelItem.zttrpId==item.zttrpId})){
              return item;
            }
          })
          rows = this.selIds.concat(rows);
          if (rows) {
            rows.forEach(row => {
              this.$nextTick(() => {
                var checked = this.tableData.find(tableRow => {
                  return tableRow.zttrpId == row.zttrpId})
                this.$refs.multipleTable.toggleRowSelection(checked)
              })
            })
          } else {
            this.$refs.multipleTable.clearSelection()
          }
        },
        // 表格单选事件
        select(selection, row) {
        let allRows = selection.filter(item => !!item)

        // 根据表格单选事件确定取消是取消了哪一行
        if (allRows.find(item => item.zttrpId == row.zttrpId)) {
            // 选中新增一行
            this.addRows([row])
        } else {
            // 取消删除一行
            this.removeRows([row])
        }
        },
        // 表格全选事件
        selectAll(selection) {
        // 如果有则是全选否则就是全取消
        if (selection.length >= 1) {
            this.addRows(this.tableData)
        } else {
            this.removeRows(this.tableData)
        }
        },
            // 添加选中行
        addRows(rows) {
        for (let key of rows) {
            // 如果选中的数据中没有这条就添加进去
            if (
            !this.taskData.find(item => {
                return item.zttrpId == key.zttrpId
                })
            ) {
            this.taskData.push(key)
            }
        }
        },
    // 取消选中行
        removeRows(rows) {
        if (this.taskData.length > 0) {
            for (let row of rows) {
            this.taskData = this.taskData.filter(item => item.zttrpId != row.zttrpId)
            }
        }
        }
}
}

