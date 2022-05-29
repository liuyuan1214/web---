/**
 * @intro: 正则校验工具类.
 *
 */

export default new class Uri {
    constructor() {
    }
  
    //URI 解码
    checkPhone(value) {
        if(!(/^1[34578]\d{9}$/.test(value))){ 
            return false; 
        }else{
            return true;
        } 
    }
    checkPhone(rule, value, callback){
        if(!(/^1[34578]\d{9}$/.test(value))){ 
            callback(new Error('手机号有误，请重新填写'));
        }else{
            callback();
        } 
      }
    checkCardNo(rule, value, callback){
        if(!value){
            callback();
        }
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        if(reg.test(value)){
           callback();
        }else{
          callback(new Error('身份证有误，请重新填写'));
        }
      }
      testNum(rule, value, callback) {
        if(!value){ return true}
        value = value.replace(this.regTrim, "");
        if (isNaN(value)) {
            return callback(new Error('请输入数字'));
        }else{
          return true 
        }
    }
  }
  