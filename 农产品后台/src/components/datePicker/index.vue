<template>
      <el-date-picker
           class="f-mr10"
            v-model.trim="selDateRange"
            @change	="selChange"
            type="daterange"   :unlink-panels="true"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd" 
            size="small"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
</template>

<script>
	export default {
		name: "datePicker",
		data(){
			return {
        selDateRange:null,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },
           {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近二年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
			}
		},
		props:{

    },
    created(){
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth()>=9? now.getMonth()+1 : '0'+(now.getMonth() + 1);
      var date = now.getDate()>9?now.getDate():'0'+now.getDate();
      var startDay = year-1 + '-' + month + '-' + date;
      var endDay = year + '-' + month + '-' + date;
      this.selDateRange = [startDay,endDay ];
      this.selChange();
    },
    methods:{
      selChange(){
        this.$emit('selChange',this.selDateRange)
      }
    }
	}
</script>

<style lang="scss" scoped>
	.g-mes-input-small{
    width:280px;
    height:40px;
    .text{
      width:90px;
      margin-right:10px;
      padding-left:10px;
      font-size:12px;
      justify-content:flex-end;
    }
    .content{
    	overflow:hidden;
    }
  }
  .g-mes-input-large{
    height:40px;
    .text{
      width:90px;
      margin-right:10px;
      padding-left:10px;
      font-size:12px;
      justify-content:flex-end;
    }
    .content{
    	overflow:hidden;
    }
  }
</style>


