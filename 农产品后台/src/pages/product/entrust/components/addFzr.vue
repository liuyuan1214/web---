<template>
	<el-dialog
    title="选择负责人" 
    :show-close="true"
		:append-to-body="true"
    :visible.sync="showDialog"
    @close="closeAdd"
     width="1000px">
		<section class="addIpCollectStation">
	    <s-header @headerContentSearch="search">
	      <g-mes-input label="类型：">
	        <el-input v-model.trim="stationCode" size="small" placeholder="请输入内容"></el-input>
	      </s-input>             
	      <s-input label="状态：">
	        <el-input v-model.trim="stationText" size="small" placeholder="请输入内容"></el-input>
	      </s-input>
	    </s-header>
	    <el-table
	      :data="tableData2"
	      style="width: 100%">
	      <el-table-column
	        label="站点编号"
	        width="">
	        <template slot-scope="scope">
	          <span style="margin-left: 10px">{{ scope.row.stationCode }}</span>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="站点描述"
	        width="">
	        <template slot-scope="scope">
	          {{ scope.row.stationText }}
	        </template>
	      </el-table-column>
	      <el-table-column label="操作" width="180">
	        <template slot-scope="scope" >
	          <el-button
	            size="mini"
	            type="primary"
	            @click="handleSelected(scope.$index, scope.row)">选择</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	    <el-pagination
	    	:small="true"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="currentPage"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="10"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="pageTotal">
	    </el-pagination>
	  </section>
</el-dialog>
</template>

<script type="text/javascript">
  import {http,fetch} from '@/js/http'
  import {mapGetters} from 'vuex';
  export default {
  	data(){
  		return {
  			showDialog:true,
  			tableData2:[],
  			currentPage:1,
  			pageTotal:0,
  			stationCode:'',
  			stationText:'',
        numPerPage:10,
  		}
  	},
  	created(){
  		this.getTableData()
  	},
  	components:{
  	},
  	methods:{
  		getTableData(obj = {}){
  			const {
  				stationCode,
  				stationText,
					numPerPage,
					currentPage
  			} = this;
	  		const data = {
	  			"numPerPage": numPerPage,
	        "pageNum": currentPage,
	        "fuzzyStationCode": stationCode,
	        "fuzzyStationText": stationText,
	  		}
	  		fetch.post('/manage/stations/page',{...data,...obj}).then((res)=>{
	        this.tableData2 = res.data.data;
	        this.pageTotal = res.data.totalCount
	     	})
	  	},
	  	search(){
	  		this.currentPage = 1;
	  		this.getTableData();
	  	},
	  	handleSizeChange(idx){
        this.numPerPage = idx;
        this.getTableData();
	  	},
	  	handleCurrentChange(idx){
	  		this.currentPage = idx;
	  		this.getTableData({pageNum:idx})
	  	},
	  	handleSelected(idx,row){
	  		this.$emit('select',row)
        this.$emit('close')
	  	},
	  	closeAdd(){
				this.$emit('close')
      },
  	}
  }

</script>