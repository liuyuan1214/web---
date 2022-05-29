
function toBrowser(typenum){
			if(typenum==1){
				window.location.href="http://browser.360.cn/";
			}else if(typenum==2){
				window.location.href="https://www.google.cn/chrome/";				
			}else{
				window.location.href="https://ie.sogou.com/";
			}
}
(function($){
	window.wxc = window.wxc || {};
	window.wxc.xcConfirm = function(popHtml,hasQrCode) {
	    var btnType = window.wxc.xcConfirm.btnEnum;
		var config={
				//属性
				title: "警告",
				icon: "0 -96px",//黄色叹号
				btn: btnType.ok
		}
		var $txt = $("<p>").html(popHtml);//弹窗文本dom
		var $browser = $("<div>").html(
			'<div class="browser"  onclick="toBrowser(1)"><img src="./static/alert/b360.png" alt="360浏览器" /><p>360浏览器</p></div><div class="browser" onclick="toBrowser(2)" ><img src="./static/alert/chrome.png" alt="谷歌浏览器" /><p>谷歌浏览器</p></div><div class="browser" onclick="toBrowser(3)"><img src="./static/alert/sougou.png"  alt="搜狗浏览器" /><p>搜狗浏览器</p></div>'
		);//弹窗插件容器
		$borwsers = $("<div>").append($txt).append($browser)
		$borwsers.addClass('f-dib');
		var $tt = $("<span>").addClass("tt").text(config.title);//标题
		var icon = config.icon;
		var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition",config.icon) : "";
		var btn = config.btn;//按钮组生成参数
		
		var popId = creatPopId();//弹窗索引
		
		var $box = $("<div>").addClass("xcConfirm");//弹窗插件容器
		var $layer = $("<div>").addClass("xc_layer");//遮罩层
		var $popBox = $("<div>").addClass("popBox");//弹窗盒子
		var $txtBox = $("<div>").addClass("txtBox");//弹窗内容主体区
		var $ok = $("<a>").addClass("sgBtn").addClass("ok").text("确定");//确定按钮
		//建立按钮映射关系
		var btns = {
			ok: $ok
		};
		
		init();
		
		function init(){
			
			creatDom();
			bind();
		}
		
		function creatDom(){
			$popBox.append(
				$txtBox.append($borwsers)
			)
			if(hasQrCode){
				var $qrcode= $("<div>").html(
					'<div class="qrcode"><img src="./static/alert/qrcode.png" alt="小程序二维码" /><p>或者扫码直接浏览小程序</p></div>'
				);
				$qrcode.addClass('f-dib');
				$popBox.append(
					$txtBox.append($qrcode)
				)	
			}
			$box.attr("id", popId).append($layer).append($popBox);
			$("body").append($box);
		}
	
		//生成按钮组
		function creatBtnGroup(tp){
			var $bgp = $("<div>").addClass("btnGroup");
			$.each(btns, function(i, n){
				if( btnType[i] == (tp & btnType[i]) ){
					$bgp.append(n);
				}
			});
			return $bgp;
		}

		//重生popId,防止id重复
		function creatPopId(){
			var i = "pop_" + (new Date()).getTime()+parseInt(Math.random()*100000);//弹窗索引
			if($("#" + i).length > 0){
				return creatPopId();
			}else{
				return i;
			}
		}
	};
	
	//按钮类型
	window.wxc.xcConfirm.btnEnum = {
		ok: parseInt("0001",2) //确定按钮
	};
	
	//触发事件类型
	window.wxc.xcConfirm.eventEnum = {
		ok: 1
	};
	
	//弹窗类型
	window.wxc.xcConfirm.typeEnum = {
		warning: "warning"
	};

})(jQuery);