<script type="text/javascript">
	export default {
		data() {
			return {
				// 页码参数
				pageNo: 1,
				pageSize: 10,// 每页数量
			}
		},
		props: {
			totalCount: {
				type: Number,
				default: 0
			},
			getData: {
				type: Function,
				default: new Function
			},
			tableData: {
				type: Array,
				default: function () {
					return [];
				}
			},
			tableHeader: {
				type: Array,
				default: function () {
					return [];
				}
			}
        },
        methods:{
			getDataByPage() {
				this.getData({
					pageNo: this.pageNo,
					pageSize: this.pageSize,
                })
			},
			// 改变每页页码
			handleSizeChange(idx) {
				this.pageSize = idx || 10;
				this.pageNo = 1;
				this.getDataByPage();
			},
            handleCurrentChange(idx){
                this.pageNo=idx;
                this.getDataByPage()
            },
            prevChange(step){
                this.pageNo=this.pageNo+step;
                this.getDataByPage();
            }
        },
        render(h){
            return h('div',
                {"class":'f-mt20'},
                [
                    h('el-table',
                        {
                        attrs:{
                            data:this.tableData,
                            'tooltip-effect':'light'
                        },
                        ref:'table',
                        },[
                            this.tableHeader.map((item,i)=>{
                                let options = {
                                    prop:item.prop,
                                    label:item.label,
                                    width:item.width || '',
                                    'show-overflow-tooltip':true
                                }
                                if(item.formatter){
                                Object.assign(options,{formatter:item.formatter})
                                }
                                if(item['render-column']){
                                return h('el-table-column',{
                                    attrs:options,
                                    scopedSlots: {
                                    default: props => {return item['render-column'](h,props.row,props.$index)}
                                    },
                                });
                                }else{
                                    return h('el-table-column',{
                                        attrs:options,
                                        scopedSlots: {
                                        default: props => {
                                            if(item.formatter) return item.formatter(props.row[item.prop])
                                            else
                                            return props.row[item.prop]
                                        }
                                        }
                                    });
                                }
                            })
                        ] 
                    ),
                    h('el-pagination',
                        {
                        attrs:{
                            background:true,
                            currentPage:this.pageNo,
                            pageSizes:[10, 20, 50, 100],
                            layout:"total, sizes, prev, pager, next, jumper",
                            total:this.totalCount
                        },
                        on:{
                            "size-change":(item)=>{this.handleSizeChange(item)},
                            "current-change":(item)=>{this.handleCurrentChange(item)},
                            "prev-click":(item)=>{this.prevChange(-1)},
                            "next-click":(item)=>{this.prevChange(1)}
                        }
                        }
                    ) 
                ]
            )
        }
}
</script>
