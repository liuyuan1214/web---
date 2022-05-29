/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" inline class="eidtform" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mt10 f-mb10">{{id?'编辑':'新增'}}原料采购订单</div>
      <div class="f-tar" style="margin-right:25px;">
          <el-form-item label="录单日期" style="margin-bottom:5px;">
            {{form.addTime &&form.addTime.split(' ')[0]}}
        </el-form-item>
        <el-form-item label="订单号" style="margin-bottom:5px;">
          {{form.purchNo}}
        </el-form-item>
      </div>
      <el-form-item label="供应商名称" prop="supName" class="f-pr f4">
          <el-input  v-model.trim=form.supName><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="supNameDialogVisable=true" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="采购日期" prop="purchDate" class="f4">
            <el-date-picker
              v-model.trim="form.purchDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="联系人" class="f4" >
        <el-input v-model.trim="form.supContact" placeholder="请输入" :maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="supTel" class="f4">
        <el-input v-model.trim="form.supTel" placeholder="请输入" :maxlength="16" ></el-input>
      </el-form-item>
      <el-form-item label="供应商地址" prop="supAddr" class="f2">
        <el-input v-model.trim="form.supAddr" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注" class="f2">
        <el-input   v-model.trim="form.remark" placeholder="请输入" :maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <!-- <div class="f-f1">订单总价：<span class="f-red">{{getTotalPrice}}元</span></div>-->
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
	      <!--<el-table-column
	        label="商品编号"
          prop="wareCode">
	      </el-table-column>-->
	      <el-table-column
	        label="产品名称"
          prop="wareName">
	      </el-table-column>
	      <el-table-column
	        label="规格"
          prop="wareSpec">
	      </el-table-column>
	      <el-table-column
	        label="单位"
          prop="wareUnit"
		  width="120">
	      </el-table-column>
	      <el-table-column
	        label="数量"
          prop="buyNum"
		  width="120">
            <template slot-scope="scope" >
              <el-input type="number" v-positiveNumber v-model.number="scope.row.buyNum"></el-input>
	        </template>
	      </el-table-column>
	    
	      <el-table-column
	        label="批次号"
          width="300"
          prop="batchno">
	      </el-table-column>
	      <el-table-column label="操作" width="180">
	        <template slot-scope="scope" >
	          <el-button
	            size="mini"
	            type="danger"
	            @click="deleteNcp(scope.$index, scope.row)">删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
      <div class="f-m10">制单人：{{form.zdr || userInfo.yhxm}}</div>
      <div class="f-mt20 f-tac" >
              <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
              <el-button  round  @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>
    <el-dialog
      title="选择商品"
	  v-dialogDrag
      :append-to-body="true"
      :visible.sync="selNcpVisable"
      width="950px"
    >
      <sel-ncp style="margin:0 auto;"  v-if="selNcpVisable" :selIds="selIds" @selNcp=selNcp @close="selNcpVisable=false"></sel-ncp>  
    </el-dialog> 
    <el-dialog
      title="选择供应商"
	  v-dialogDrag
      :append-to-body="true"
      :visible.sync="supNameDialogVisable"
      width="950px"
    >
      <sel-supname style="margin:0 auto;"  @selsup=selsup></sel-supname>  
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
        supNameDialogVisable:false,
        oldkhmc:'',
        tableData2:[],
        selIds:[],
		delIds:[],
        purchDate:null,
        rules:{
            purchDate:commonValidate,
            supName:commonValidate,
            supTel:{validator:checkPhone,trigger: "blur"}
        },
        form:{
          supName:'',
          addTime:timeFormat.one(new Date()),
          addUserId:'',
          zje:'',
          purchDate:timeFormat.one(new Date()),
          purchNo:'',
          remark:'',
          yhxm:'',
          supTel:'',
          supContact:'',  //联系人
          supAddr:'',
          zdr:'',
          listDetail:[]
        }
      }
    },
    props:{
        id:{
          type:[String,Number],
          default:''
        },
        khtype:{
            type:Array,
            default:()=>{
                return []
            }
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
          totalPrice += Number(((item.buyPrice || 0)*(item.buyNum || 0)).toFixed(2))
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
              url:'/cggl/cg/getPurchInfoById/',
              method:'get',
              data:{
                id:this.id
              }
          }).then(res=>{
            res.bean?this.form = res.bean:'';
            if(firstLoad){
              this.form.listDetail.map(item=>{
                this.selIds.push({ztncpId:item.wareId})
              })
            }
          }).catch(()=>{
            this.loading = false; 
          })
      },
      getPurchNo(){
          fetch({
              url:'/cggl/cg/getPurchSno/',
              method:'get',
              data:{
                date:new Date().getFullYear(),
                companyId:this.userInfo.scjyztId
              }
          }).then(res=>{
            this.form.purchNo = res.bean;
          })
      },
      //删除商品
      deleteNcp(index,row){
        if(row.id){
          fetch({
              method:'post',
              url:'/cggl/purch/updateStatus/',
              data:{
                id:row.id
              }
            }).then((res)=>{
              if(res.bean==0){
                this.selIds.splice(index,1);
                var delItem = this.form.listDetail.splice(index,1);
                if(delItem [0] && delItem[0].id){
                  this.delIds.push(delItem[0].id) ; 
                }
              }else{
                this.$message('该商品已被使用，不能删除！')
              }
            })
        }else{
            this.selIds.splice(index,1);
            this.form.listDetail.splice(index,1);
        }

      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(!this.form.listDetail.length){
              this.$message.error('请添加商品！')
              return false;
            }
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { purchNo,
                  purchDate,
                  supId,
                  supName,
                  supContact,
                  supTel,
                  supAddr,
                  remark,
                  addUserId,
                  zdr,
                  id
            } = this.form;
            //用户参数
            let {scjyztId,yhxm,userId} = this.userInfo;
            var wareIds=[];
			var detailIds=[];
            var buyPrices=[];
            var buyNums=[];
            this.form.listDetail.forEach(item => {
                wareIds.push(item.wareId);
				detailIds.push(item.id);
                buyPrices.push(item.buyPrice);
                buyNums.push(item.buyNum);
            });
            let params = {   
                  id, 
                  purchNo,
                  purchDate,
                  supId,
                  supName,
                  supContact,
                  supTel,
                  supAddr,
                  remark,
                  addUserId:userId,
                  status:1,
                  zje:this.getTotalPrice,
                  zdr:zdr?zdr:yhxm,
				  delIds:String(this.delIds),
                  wareIds:String(wareIds),
				  detailIds:String(detailIds),
                  buyPrices:String(buyPrices),
                  buyNums:String(buyNums),
                  companyId:scjyztId
            }
            fetch({
              method:'post',
              url:'/cggl/cg/savePurchSingle/',
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
          var {ncpmc,LNcpdm,ggxh,dw,zzpc,ztncpId,id} = row;
          //判断页面中是否有该商品
          
          if(this.form.listDetail.findIndex(item=>{return item.wareId==ztncpId})!=-1){
            return;
          }

          this.selIds.push({ztncpId:ztncpId})
          this.form.listDetail.push({
            "wareName": ncpmc,
            "wareCode": LNcpdm,
            "wareId":ztncpId,
			"id":0,
            "wareSpec": ggxh,
            "wareUnit": dw,
            "buyPrice":'',
            "buyNum":'',
            "batchno":zzpc
          })
        })
      },
	  //类别好供应商后，填充到页面
      selsup(row){
        let {khId,khmc,lxr,lxdh,dz} = row;
        this.form.supId= khId;
        this.form.supName= khmc;
        this.form.supContact= lxr;
        this.form.supTel= lxdh;
        this.form.supAddr= dz;
        this.supNameDialogVisable = false;
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



