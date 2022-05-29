/**
 * 用户信息，版本切换的uri
 */
export const user={
    //用户登录
    login:{
        url:"/jduc/user/userLogin/",
        method:"get"
    },
    //修改用户密码
    modifyPwd:{
        url:"/jduc/user/modifyPwd/",
        method:"post"
    },
    //用户信息-初始化
    pageZtyhByQyid:{
        url:"/jcqy/qy/pageZtyhByQyid/",
        method:"get"
    },
    //用户信息-保存/修改
    saveUser:{
        url:"/jcqy/qy/saveUser/",
        method:"post"
    },
    //用户信息-验证用户信息唯一性
    checkUserIsExistQY :{
        url:"/jcqy/qy/checkUserIsExistQY/",
        method:"get"       
    },
    //用户信息-停用、启用
    updateUser :{
        url:"/jcqy/qy/updateUser/",
        method:"post"       
    },
    //企业信息-初始化数据
    getScjyqyById :{
            url:"/jcqy/qy/getScjyqyById/",
            method:"get"       
    }, 
       //企业信息-企业信息保存 
    saveScjyqy :{
        url:"/jcqy/qy/saveScjyqy/",
        method:"post"
    }, 
        //企业信息-根据企业ID得到图片信息LIST
    listJcQypicByQyId :{
            url:"/jcqy/qy/listJcQypicByQyId/",
            method:"get"
    },
    delJcQypic:{
        url:"/jcqy/qy/delJcQypic/",
        method:"post"   
    },
    saveJcQypic:{
        url:"/jcqy/qy/saveJcQypic/",
        method:"post"   
    }
}
