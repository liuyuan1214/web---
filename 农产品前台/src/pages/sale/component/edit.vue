/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" inline class="eidtform" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mt10 f-mb10">{{id?'编辑':'新增'}}销售订单</div>
      <!-- <div style="padding:0 200px 0 0;"> -->
        <div class="f-tar" style="margin-right:25px;">
            <el-form-item label="录单日期" style="margin-bottom:5px;">
              {{form.czsj.split(' ')[0]}}
          </el-form-item>
          <el-form-item label="订单号" style="margin-bottom:5px;">
            {{form.xsdh}}
          </el-form-item>
        </div>
        <el-form-item label="客户单位" prop="khmc" class="f-pr f4">
            <el-input  v-model.trim=form.khmc><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
            <div class="f-pa" @click="khmcDialogVisable=true" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
        </el-form-item>
        <el-form-item label="销售日期" prop="xsrq" class="f4">
              <el-date-picker
                v-model.trim="form.xsrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人" prop="lxr" class="f4" >
          <el-input v-model.trim="form.lxr" placeholder="请输入" :maxlength="30" ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh" class="f4">
          <el-input v-model.trim="form.lxdh" placeholder="请输入" :maxlength="30" ></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="xssdz" class="f2">
          <el-input v-model.trim="form.xssdz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="备注" class="f2">
          <el-input   v-model.trim="form.bz" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
        </el-form-item>
      <!-- </div> -->
      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">订单总价：<span class="f-red">{{getTotalPrice}}元</span></div>
        <div class="f-f1 f-tar">
          <el-button type="primary" round  size="medium" @click="selNcpVisable=true"  style="padding:9px 25px" icon="el-icon-plus
">商 品</el-button>
        </div>
      </div>
	    <el-table
	      :data="form.listDetail"
        empty-text="请添加商品"
	      style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
	      <el-table-column
	        label="产品名称"
          prop="ncpmc">
	      </el-table-column>
	      <el-table-column
	        label="规格"
          prop="ggxh">
	      </el-table-column>
	      <el-table-column
	        label="单位"
          width="100"
          prop="dw">
	      </el-table-column>
	      <el-table-column
	        label="余量"
          width="80"
          prop="yl">
	      </el-table-column>
	      <el-table-column
	        label="数量"
          prop="sl"
		  width="150">
            <template slot-scope="scope" >
                <el-input-number  :max="scope.row.yl" :min="0" :class="[scope.row.sl>scope.row.yl?'border-red':'']" style="width:130px;text-align:left;" :controls="false" v-model.number="scope.row.sl"></el-input-number>
                <span class="f-red f-fs12" v-if="scope.row.sl>scope.row.yl">超过库存！</span>
          </template>
	      </el-table-column>
	      <el-table-column
	        label="单价（元）"
          width="140"
          prop="dj">
          	  <template slot-scope="scope" >
                <el-input-number  :min="0" style="width:130px;text-align:left;"  :controls="false" v-model.number="scope.row.dj"></el-input-number>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="金额（元）"
          prop="num"
		  width="120">
	        <template slot-scope="scope" >
              {{((scope.row.dj || 0)*(scope.row.sl || 0)).toFixed(2)}} 
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="追溯批次" 
          v-if="id"		
          prop="zsm">
	      </el-table-column>
	      <el-table-column
	        label="批次信息"
          prop="xszzpc">
	      </el-table-column>
	      <el-table-column label="操作" width="100">
	        <template slot-scope="scope" >
	          <el-button
	            size="mini"
	            type="danger"
	            @click="deleteNcp(scope.$index, scope.row)">删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
      <div class="f-m10">制单人：{{form.zdr || userInfo.yhxm}}</div>
      <div class="f-mt20 f-tac">
              <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
              <el-button  round  @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>
    <el-dialog
      title="选择商品"
      :append-to-body="true"
      :visible.sync="selNcpVisable"
      width="950px"
    >
      <sel-ncp style="margin:0 auto;" :selIds="selIds" v-if="selNcpVisable" @selNcp=selNcp @close="selNcpVisable=false"></sel-ncp>  
    </el-dialog> 
    <el-dialog
      title="选择销售商"
      :append-to-body="true"
      :visible.sync="khmcDialogVisable"
      width="950px"
    >
      <sel-supname style="margin:0 auto;" v-if="khmcDialogVisable"  @selsup=selsup></sel-supname>  
    </el-dialog> 
<!-- <div class="f-red">还未控制禁止输入负数，或者输入负数进行提醒</div> -->
</div>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import selNcp from './selNcp'  
  import selSupname from './selSupname'  
  import fetch from 'fetch/axios/';
   import timeFormat from 'common/tools/timeFormat';
  export default {
    components:{
      selNcp,
      selSupname
    },
    data(){
      //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
	   const khExist = (rule, value, callback)=>{
            var params ={
            khxm:this.form.khmc,
            qyid:this.userInfo.qyid
            }
            //edit
            if(this.oldkhmc && this.form.khmc ===this.oldkhmc ){
            callback();
            }
            this.$fetch.api_base.kh_exist(params).then((res)=>{
            if(res.bean==1){
                callback(new Error('该客户已存在'));
            }else{
                callback();
            }
            })
	    };
      function checkPhone(rule, value, callback){
        if(!value){
          return callback();
        }
        if(!(/^1[34578]\d{9}$/.test(value))){ 
            callback(new Error('手机号有误，请重新填写'));
        }else{
            callback();
        } 
      }
      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      return {
        disabled:false,
        selNcpVisable:false,
        khmcDialogVisable:false,
        oldkhmc:'',
        tableData2:[],
        selIds:[],
        xsrq:null,
        rules:{
            xsrq:commonValidate,
            khmc:commonValidate,
            lxdh:{validator:checkPhone,trigger: "blur"}
        },
        form:{
            czsj:timeFormat.one(new Date()),
            xsdId:'',
            khId:'',
            xsdh:'',
			yl:'',
            khmc:'',
            xsrq:timeFormat.one(new Date()),
            xsje:'',
            xssdz:'',
            lxdh:'',
            lxr:'',
            bz:'',
            czr:'',
            listDetail:[]
        }
      }
    },
    props:{
        id:{
          type:[String,Number],
          default:''
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      }),
      getTotalPrice:function(){
        var array = this.form.listDetail || [];
        var totalPrice = 0;
        for(var item of array){
          totalPrice += Number(((item.dj || 0)*(item.sl || 0 )).toFixed(2))
        }
        return totalPrice.toFixed(2);
      }
    },
    created(){
      this.oldkhmc=this.form.khmc
      if(this.id){
        this.getOrderInfo(true);
      }else{
        this.getPurchNo();
      }
    },
    methods: {
      //初始化数据
      getOrderInfo(firstLoad){
          fetch({
              url:'/Xsd/xs/getXsInfoById/',
              method:'get',
              data:{
                id:this.id
              }
          }).then(res=>{
            res.bean?this.form = res.bean:'';
            if(firstLoad){
              this.form.listDetail.map(item=>{
                this.selIds.push({id:item.id})
                //请求数据获得余量

                this.getYl(item);

              })
            }
          }).catch(()=>{
            this.loading = false; 
          })
      },
      //获取余量
      getYl(row){
         
          fetch({
              url:'/Xsd/xs/getPckcbById/',
              method:'get',
              data:{
                id:row.sfsc,
                scjyztId:this.userInfo.scjyztId
              }
          }).then(res=>{
            this.$set(row,'yl',Number(res.bean.yl) + Number(row.sl))
          })
      },
      getPurchNo(){
          fetch({
              url:'/Xsd/getPch/',
              method:'get',
              data:{
                type:'xsdh',
                year:new Date().getFullYear(),
                scjyztId:this.userInfo.scjyztId
              }
          }).then(res=>{
            this.form.xsdh =res.bean;
          })
      },
      //删除商品
      deleteNcp(index){
        this.selIds.splice(index,1);
        this.form.listDetail.splice(index,1);
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(!this.form.listDetail.length){
              this.$message.error('请添加商品！')
              return false;
            }
            for( var item of this.form.listDetail){
              if(item.sl>item.yl){
                 this.$message.error('数量不能大于库存量！')
                 return false;
              }
              if(!item.dj || !item.sl){
                this.$message.error(item.dj?'数量不能为空！':'单价不能为空！')
                 return
              }
            }
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let {            
              czsj,
              xsdId,
              khId,
              xsdh,
              xsrq,
              xsje,
              xssdz,
              lxdh,
              lxr,
              bz,
              czr,
              zdr,
              khmc,
              listDetail
            } = this.form;
            //用户参数
            let {scjyztId,userId,yhxm} = this.userInfo;
			var zspcs=[];
            var pckcbIds=[];
            var xsxmIds=[];
            var buyNums=[];
            var buyPrices=[];
            var zsms=[];
            this.form.listDetail.forEach(item => {
                pckcbIds.push(item.sfsc);
                zspcs.push(item.xszzpc);
                xsxmIds.push(item.xsxmId);
                buyNums.push(item.sl);
                buyPrices.push(item.dj);
                zsms.push(item.zsm);
            });
            let params = {   
                  xsdId,
                  khId,
                  xsdh,
                  xsrq,
                  xsje,
                  xssdz,
                  lxdh,
                  lxr,
                  bz,
                  khmc,
                  czr:czr?czr:userId,
                  zdr:zdr?zdr:yhxm,
                  czsj:czsj?czsj:timeFormat.four(new Date()),
                  xsje:this.getTotalPrice,
                  zje:this.getTotalPrice,
                  pckcbIds:String(pckcbIds),
				  zspcs:String(zspcs),
                  xsxmIds:String(xsxmIds),
                  buyPrices:String(buyPrices),
                  buyNums:String(buyNums),
                  zsms:String(zsms),
                  scjyztId,
                  qydm: this.userInfo.qydm,
                  ztdm: this.userInfo.ztdm,
            }  
            fetch({
              method:'post',
              url:'/Xsd/saveXsd/',
              data:params
            }).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.error('操作失败！')
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        });
      },
      selNcp(rowlist){
        rowlist.map(row=>{
          var {ncpmc,ncpid,gg,xgpc,dw,id,yl} = row;
          //判断页面中是否有该商品
          if( this.selIds.findIndex(item=>{return item.id===id})!=-1){
            return;
          }
          this.selIds.push({id:id})
          
          this.form.listDetail.push({
            "ncpmc": ncpmc,
            "ncpdm": ncpid,
            "xsxmId":0,     //新增商品，销售明细表id传0
            "sfsc":id,
            "ggxh": gg,
            "xszzpc":xgpc, 
            "zsm":'',
            "dw": dw,
            "yl":yl,
            "dj":'',
            "sl":''
          })
        })
      },
      getZspc(){
        
      },
      selsup(row){
        let {khId,khmc,lxr,lxdh,dz} = row;
        this.form.khId= khId;
        this.form.khmc= khmc;
        this.form.lxr= lxr;		
	    this.form.lxdh= lxdh;
		this.form.xssdz= dz;
        this.khmcDialogVisable = false;
        this.$refs.form.validateField('khmc')
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      }
    }
  }
</script>

<style scoped lang="scss">
  .eidtform{
    // width:100%;
    margin:0 30px;
    box-sizing: border-box;
  }
  .f4{
    width:calc(25% - 15px);
     box-sizing:border-box;
  }
  .f2{
    width:calc(50% - 15px);
    box-sizing:border-box;
  }
</style>

<style>
 .eidtform .el-form-item .el-form-item__content{
    width:calc(100% - 100px);
  }
 .eidtform .el-date-editor.el-input, .eidtform .el-date-editor.el-input__inner{
    width:100%;
  }
</style>

<style>
  .border-red input{
      border-color:orangered !important;
  }
</style>



