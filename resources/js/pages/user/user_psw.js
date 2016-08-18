define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
	var USERS = require("pages/user/users_list.js");
	var INDEX = require("pages/index.js")


    exports.init = function () {
		var type = INDEX.type;
        var _pageNO = Number(USERS.pageNum);
		if(type){
			uName = INDEX.userName;
			$(".modal-title").html("<i class='fa fa-user'></i>修改密码")
			$("#user_name").val(uName);
			$("#password").val("");
			$("#password1").val("");
			//提交
			$("#user_reset_psw").click(function () {
				var uName = $("#user_name").val();
				var uPassword = $("#password").val();
				var uPassword1 = $("#password1").val();
				if(uName===""){
					alert("用户名不能为空！");
					 $("#user_name")[0].focus();
					return false
					}else if(uPassword===""){
						alert("密码不能为空！");
						 $("#password")[0].focus();
						return false
						}else if(uPassword1===""){
							alert("密码不能为空！");
							 $("#password1")[0].focus();
							return false
							}else if(uPassword!=uPassword1){
								alert("密码不一致，请重新输入！");
								$("#password")[0].focus();
								return false
								}else{
				var psw = {
					PASSWORD: uPassword			
				}
				var data = JSON.stringify({
					project_name:CONFIG.projectName,
					action:'UpdateUserPassByUserName',
					Data: psw
				});
				var url = CONFIG.serverRoot + '/backend_mgt/v2/userdetails/'+uName;
				UTIL.ajax(
					'post', url, data, 
					function(msg){
						if(msg.rescode == 200){  
							alert("修改密码成功");
							UTIL.cover.close(); 
							USERS.loadUsersPage(_pageNO);
						}else{
							alert("修改密码失败")
						}			
					}
				);
				}
			});
			}else{
			var uName = USERS.userName1;
			$("#user_name").val(uName);
			var uID = USERS.userID1;
			$("#password").val("");
			$("#password1").val("");
			//提交
			$("#user_reset_psw").click(function () {
				var uName = $("#user_name").val();
				var uPassword = $("#password").val();
				var uPassword1 = $("#password1").val();
				if(uName===""){
					alert("用户名不能为空！");
					 $("#user_name")[0].focus();
					return false
					}else if(uPassword===""){
						alert("密码不能为空！");
						 $("#password")[0].focus();
						return false
						}else if(uPassword1===""){
							alert("密码不能为空！");
							 $("#password1")[0].focus();
							return false
							}else if(uPassword!=uPassword1){
								alert("密码不一致，请重新输入！");
								$("#password")[0].focus();
								return false
								}else{
									var psw = {
										PASSWORD: uPassword			
									}
									var data = JSON.stringify({
										project_name:CONFIG.projectName,
										action:'UpdateUserPass',
										Data: psw
									});
									var url = CONFIG.serverRoot + '/backend_mgt/v2/userdetails/'+uID;
									UTIL.ajax('post', url, data, function(msg){
										if(msg.rescode == 200){
											UTIL.cover.close();   
											alert("重置密码成功");
										}else{
											alert("重置密码失败")
											}	
										USERS.loadUsersPage(_pageNO);
									});
								}
			});
			}
		
		 //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
        });
    }
})
