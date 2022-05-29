/*sf*/
<template>
    <div class="table">
        <div class="table-header">
         <slot></slot>
        </div>
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="csrq"
            label="摇蜜日期"
            >
        </el-table-column>
        <el-table-column
            prop="obString"
            label="摇蜜产品"
        >
        </el-table-column>
        <el-table-column
            prop="csl"
            label="摇蜜量">
        </el-table-column>
        <el-table-column
            prop="dw"
            label="单位">
        </el-table-column>
		<el-table-column
            prop="ObInt"
            label="摇蜜批次"
        >
        </el-table-column>
        <el-table-column
            prop="bz"
            label="备注"
        >
        </el-table-column>
        <el-table-column
            prop="address"
              width="150"
			  v-if="pcInfo.zt==1 && pageName==='farm'"
            label="操作">
        <template slot-scope="scope">
            <el-button  size="mini" class="edit"  @click="$emit('operate','cs',scope.row)">修 改</el-button>
        </template>
        </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
    export default {
        inject:['zzpc','pcInfo','pageName'],
        data(){
            return {
                //table参数
                loading:false,
                totalCount:0,
                tableData: [],
            }
        },
        computed:{
            ...mapGetters({
                userInfo:'getUserInfo',
            })
        },  
        created(){
            this.getTableData();
        },
        methods:{
        /*
        *获取table的数据
        */
        getTableData(obj={pageSize:10,pageNo:1}){
            this.loading = true;
            let {type,searchkey,selDateRange} = this;
            var params =  {
                scjyztId:this.userInfo.scjyztId,
                searchkey,
                type
            };
            //合并组件的pageSize 和 pageNo 参数
            Object.assign(params,obj);
            var query = {
                method:'get',
                url:'/scgl/ns/listFmYm/',
                data:{
                    zzpc:this.zzpc
                }  
            }
            fetch(query).then(res=>{
                this.tableData = res.list;
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
            }
        }
    }
</script>
<style scoped lang="scss">
    .table-header{
      margin: 20px 0;         
    }
</style>