// 用户登录过期处理
import { MessageBox,Message } from 'element-ui';
import router form 'router/index.js';

const httpError = {
    init(data){
		if(data.code == "user-not-login"){ //"user-not-login"
			this.toLogin()
        }
    },
    toLogin(){
        setTimeout(()=>{
            this.control = false;
            localStorage.removeItem("ncpUserInfo");
            sessionStorage.clear();
            MessageBox.confirm('登录状态已过期，是否重新登录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                router.push('/login');
                setTimeout(()=>{
                    location.reload();
                },10)
            }).catch(() => {
            
            });
        },1500)
	}
}

export default httpError