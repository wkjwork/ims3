define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
	var USERS = require("pages/user/users_list.js");


    exports.init = function () {
		//加载用户信息
		var uID = Number(USERS.userID);
		var uName1 = USERS.userName;
		var uEmail = USERS.userEmail;
		var uDes = USERS.userDes;
		var uPass = USERS.userPass;
		var rID = Number(USERS.roleID);
		var type = USERS.type;
        var _pageNO = Number(USERS.pageNum);
		if(type==="edit"){
		$("#user_name1").val(uName1);
		$("#email1").val(uEmail);
		$("#description1").val(uDes);
		$("#password1").val(uPass);
		$("#password1")[0].focus();
		$("#user_name1")[0].focus();
        //确定
        $("#user_create1").click(function () {
        	var uName = $("#user_name1").val();
			var uPassword = $("#password1").val();
			var uEmail = $("#email1").val();
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //验证邮箱的正则表达式
			var uDescription = $("#description1").val();
			if(uPassword==="" || uName===""){
				alert("用户名或密码不能为空！");
				$("#user_name1")[0].focus();
				return false;
				}
			var data1 = JSON.stringify({
				project_name:CONFIG.projectName,
				action:'GetByUserNameCount',
				UserName:uName,
				UserID:uID
				})
			var url1 = CONFIG.serverRoot + '/backend_mgt/v2/userdetails';
			UTIL.ajax('post',url1,data1,function(msg){
				if(msg.UserCount===1){
					alert("用户名已存在！")
					$("#user_name1")[0].focus();
					return false;
					}else if(!reg.test(uEmail) && uEmail!=""){
                        alert("邮箱格式不正确");
                        $("#email1")[0].focus();
                        return false;
                } else{
						var name = {
							USERNAME: uName,
							PASSWORD: uPassword,
							EMAIL:uEmail,
							RoleID:rID,
							Description:uDescription,
							isValid:1				
						}
						var data = JSON.stringify({
							project_name:CONFIG.projectName,
							action:'PUT',
							Data: name
						});
						var url = CONFIG.serverRoot + '/backend_mgt/v2/userdetails/'+uID;
						UTIL.ajax('post', url, data, function(msg){
							if(msg.rescode == 200){
								UTIL.cover.close();
								alert("修改用户成功");
							}
							else{
								alert("修改用户失败")
								}	
							USERS.loadUsersPage(_pageNO);
						});
						}
				})
            
        });
		}
		else if(type==="add"){
			$("#password1").parent().css("display","block");
			$("#user_name1").val("");
			$("#password1").val("");
			$("#email1").val("");
			$("#description1").val("");
			$(".modal-title").html("<i class='fa fa-user-plus'></i>新建用户");
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //验证邮箱的正则表达式
			//确定
			$("#user_create1").click(function () {
				var uName = $("#user_name1").val();
				var uPassword = $("#password1").val();
				var uEmail = $("#email1").val();
				var uDescription = $("#description1").val();
				if(uName==="" || uPassword===""){
					alert("用户名或密码不能为空！");
					 $("#user_name1")[0].focus();
					 type = "";
					return false
					}else if(!reg.test(uEmail) && uEmail!=""){
                    alert("邮箱格式不正确");
                    $("#email1")[0].focus();
                    return false;
                }
                var name = {
					USERNAME: uName,
					PASSWORD: uPassword,
					EMAIL:uEmail,
					RoleID:-1,
					Description:uDescription,
					isValid:1				
				}
				var data = JSON.stringify({
					project_name:CONFIG.projectName,
					action:'POST',
					Data: name
				});
				var url = CONFIG.serverRoot + '/backend_mgt/v2/userdetails';
				UTIL.ajax('post', url, data, function(msg){
					if(msg.rescode == 200){
						UTIL.cover.close(); 
						type = "";   
						alert("添加用户成功");
                        USERS.loadUsersPage(1);
					}else if(msg.rescode==500){
						type = ""; 
						alert("用户名已存在!");
						$("#user_name1").focus();
					}else{
						type = ""; 
						alert("添加用户失败")
                        USERS.loadUsersPage(1);
						}
				});
        });
			}
		 //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
			type = ""; 
			//USERS.loadUsersPage(pageNum);
        });
    }
})
