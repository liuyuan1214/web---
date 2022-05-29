/**
 * 自定义指令
 */

import timeFormat from './date'
import { Message } from 'element-ui'
export default function(Vue){
	Vue.directive('auto-focus', {
	  inserted: function (el,bind) {
	    if(bind.value){
	      el.focus()
	    }
	  },
	  update (el,bind){
	    if(bind.value != bind.oldValue){
	    	el.focus()
	    }
	  }
	});

	Vue.directive('auto-select', {
	  inserted: function (el,bind) {
	    if(bind.value){
	      el.select()
	    }
	  },
	  update (el,bind){
	    if(bind.value){
	      el.select()
	    }
	  }
	});
	
	Vue.directive('permission',{ //权限按钮指令
		bind(el,binding){
	    let permissionList = router.currentRoute.meta.permission;
			if(!(permissionList && Vue.prototype.$ImeAuthUtils.hasPermssion(binding.value,permissionList))){
				el.parentNode.removeChild(el);
			}
		}
	});
	Vue.directive('maxlength', {  //仅仅在展示数据时可以，不会改变data原有值
		inserted(el, bind) {
		},
		update(el, bind){
			const dom = el.querySelector('input') || el; 
			Vue.nextTick(()=>{ //保证在本轮时间结束后修改值，因为此时的data中保存的值事没有被修改的还是原来的值所以需要在本轮事件结束后执行
				if(dom.nodeName === 'INPUT'){
					if(dom.value<0){
						Message({type:'error',message:'输入数字不能小于0!'})
						dom.value = Math.abs(dom.value);
					}
					var length = dom.getAttribute('inputlength');
					if(length){
						dom.value = String(dom.value).slice(0,length); 
					}
					const event = new Event('input');
					dom.dispatchEvent(event);
				}else{
					console.error("v-maxlength指令没有被正确使用,绑定的dom没有找到input子节点亦或绑定指令的dom本身不是input节点。")
				}
			})
		}
	});
	Vue.directive('upperCase', { 
		update(el, binding) {
			Vue.nextTick(()=>{
				const dom = el.querySelector('input') || el; 
				if(dom.nodeName === 'INPUT'){
					const event = new Event('input');
					dom.value = dom.value.toUpperCase(); 
					dom.dispatchEvent(event);
				}else{
					console.error("v-upperCase指令没有被正确使用,绑定的dom没有找到input子节点亦或绑定指令的dom本身不是input节点。")
				}
			})
		}
	});
	Vue.directive('positiveNumber', { 
		update(el, binding) {
			Vue.nextTick(()=>{
				const dom = el.querySelector('input') || el; 
				if(dom.nodeName === 'INPUT'){
					if(dom.value<0){
						const event = new Event('input');
						Message({type:'error',message:'输入数字不能小于0!'})
						dom.value = 0;
						dom.dispatchEvent(event);
					}
				}else{
					console.error("指令没有被正确使用,绑定的dom没有找到input子节点亦或绑定指令的dom本身不是input节点。")
				}
			})
		}
	});
	Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        // 获取弹框的dom
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        //鼠标显示移动cursor 
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        // 立即执行函数,获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = (() => {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr];
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr];
            }
        })() 
        
        //以上是基础设置

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;
            const screenWidth = document.body.clientWidth; // body当前宽度
            const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 

            const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
            const dragDomheight = dragDom.offsetHeight; // 对话框高度

            const minDragDomLeft = dragDom.offsetLeft;
            const maxDragDomLeft = screenWidth -(dragDom.offsetLeft + dragDomWidth);

            const minDragDomTop = dragDom.offsetTop;
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

            // 获取到的值带px 正则匹配替换
            let styL = sty(dragDom, 'left');
            let styT = sty(dragDom, 'top');

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
            } else {
                styL = +styL.replace(/\px/g, '');
                styT = +styT.replace(/\px/g, '');
            };

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离 
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -(minDragDomLeft);
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft;
                }

                if (-(top) > minDragDomTop) {
                    top = -(minDragDomTop);
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop;
                }

                // 移动当前元素  
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
            };
            // 鼠标抬起的时候，移除事件
            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

}

