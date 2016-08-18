define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
 
    var username=UTIL.getCookie('account');
    var project=UTIL.getCookie('project_name');

    exports.init = function () {
        $("#username").html(username + '@' + project);
        $("#bar").html(username+'@'+project);
        $("#USER-NAME").html(username);
        // 存储权限
        initUserConfigs();

    	checkJurisdiction();

    	//登出
        $("#logout").click(function () {
            window.location.href = "login.html";
        });
		//修改密码
		$("#repassword").click(function(){
				exports.type = "resetpsw";
				var uName = $("#USER-NAME").html();
				exports.userName = uName;
				UTIL.cover.load('resources/pages/user/user_psw.html');
			});
    };
    //上传弹层页面
    exports.upl = function () {
        $("#page_upload").load("resources/pages/materials/materials_upload.html");
        $("#page_upload").css("display", "flex");
    }

    function loadPage() {

        var page = window.location.hash.match(/^#([^?]*)/);
        
        //page = page === null ? 'terminal/list' : page[1];
        if (page == null){
    		if ($(".sidebar-menu li:eq(0) ul").length == 0){
        		page = $(".sidebar-menu li:eq(0)").find("a").attr("href").substring(1);
        	}else {
        		page = $(".sidebar-menu li:eq(0) ul li:eq(0)").find("a").attr("href").substring(1);
            }
        }else {
        	page = page[1];
        }

        //刷新菜单的焦点
        $(".sidebar-menu li").attr("class", "treeview");
        $(".sidebar-menu li ul li").removeAttr("class");
        $(".sidebar-menu").find("a").each(function () {
            if (page != null) {
                var activeHref = "#" + page;
                if ($(this).attr("href") == activeHref) {
                    if($(this).parent().attr("class") == null){					//二级菜单
                    	$(this).parent().attr("class", "active");
                    	$(this).parent().parent().parent().attr("class", "treeview active");
                    }else if ($(this).parent().attr("class") == "treeview"){	//一级菜单
                    	$(this).parent().attr("class", "treeview active");
                    }
                }
            }
        })

        //检查关闭弹窗
        UTIL.cover.close();
        UTIL.cover.close(2);

        // load页面
        $('#page_box').load('resources/pages/' + page + '.html');
    }

//    $(function(){
//    	var json_data = {
//    			"Project": "",
//		        "Action" : "Get"
//    	    }
//    	var url = CONFIG.serverRoot + "/backend_mgt/v1/projects"
//    	UTIL.ajax("post", url, json_data, render);
//    })

    //检索权限
    function checkJurisdiction(){
    	var data = JSON.stringify({
            action: 'GetFunctionModules',
            project_name: CONFIG.projectName,
            // UserName: $('#USER-NAME').html(),
            UserName: 'root',

        });
        var url = CONFIG.serverRoot + '/backend_mgt/v2/userdetails';
        UTIL.ajax('post', url, data, function(json){
        	var jdtData = json.FunctionModules;
        	for(var a = 0; a < jdtData.length; a++){
        		var moduleId = jdtData[a].ModuleID;
        		switch (moduleId) {
                case 1:		//终端管理
                	if (jdtData[a].ReadWriteAuth == 1){
                		$(".sidebar-menu").append('<li id="treeview_term" class="treeview">'+
                  	          '<a href="#"><i class="fa fa-dashboard"></i> <span>控制台</span> <i class="fa fa-angle-left pull-right"></i></a>'+
                  	          '<ul class="treeview-menu">'+
                  	          	'<li class="active"><a id="menu_termlist" href="#terminal/list"><i class="fa fa-television"></i> 终端</a></li>'+
                  	          	'<li><a id="menu_termlog" href="#termlog/list"><i class="fa fa-area-chart"></i> 日志</a></li>'+
                  	          '</ul>'+
                  	        '</li>');
                	}
                    break;
                case 2:		//频道管理
                	if (jdtData[a].ReadWriteAuth == 1){
	                	$(".sidebar-menu").append('<li id="treeview_channel" class="treeview">'+
	                	          '<a href="#"><i class="fa fa-rocket"></i><span>&nbsp;发布管理</span><i class="fa fa-angle-left pull-right"></i></a>'+
	                	          '<ul class="treeview-menu">'+

	                	            '<li><a href="#channel/list"><i class="fa fa-newspaper-o"></i> 频道</a></li>'+
                                    // '<li><a href="#channel/list"><i class="fa fa-circle-o"></i> 频道列表</a></li>'+
                                    // '<li><a href="#channel/edit"><i class="fa fa-circle-o"></i> 新建频道</a></li>'+
                                    // '<li><a href="#channel/list_check"><i class="fa fa-circle-o"></i> 频道审核</a></li>'+
	                	            // '<li><a href="#channel/edit"><i class="fa fa-circle-o"></i> 新建频道</a></li>'+

	                	          '</ul>'+
	                	        '</li>');
                	}
                    break;
                case 3:		//资源管理
                	if (jdtData[a].ReadWriteAuth == 1){
	                	$(".sidebar-menu").append('<li id="treeview_mtr" class="treeview">'+

	              	         
							   // '<a href="#materials/materials_list"><i class="fa fa-server"></i><span>&nbsp;资源存储</span><i class="fa fa-angle-left pull-right"></i></a>'+
	         //        	          '<ul class="treeview-menu">'+
	         //        	            '<li><a href="#materials/materials_list"><i class="fa fa-book"></i> 资源</a></li>'+
	         //        	            '<li><a href="#materials/materials_list_check"><i class="fa fa-book"></i> 资源审核</a></li>'+
	         //        	          '</ul>'+
	                	        

	              	          '<a href="#materials/materials_list">'+
	              	            '<i class="fa fa-server"></i> <span>资源存储</span>'+
	              	          '</a>'+

	              	        '</li>');
                	}
                    break;
                case 4:		//资源添加
                    break;
                case 5:		//模版管理
                	if (jdtData[a].ReadWriteAuth == 1){
	                	if ($("#treeview_channel ul").length == 0){
		                	$(".sidebar-menu").append('<li id="treeview_channel" class="treeview">'+
		              	          '<a href="#"><i class="glyphicon glyphicon-user"></i><span>&nbsp;模版</span><i class="fa fa-angle-left pull-right"></i></a>'+
		              	          '<ul class="treeview-menu">'+
		              	            '<li><a href="#layout/list"><i class="fa fa-object-group"></i> 模版列表</a></li>'+
		              	          '</ul>'+
		              	        '</li>');
	                	}else {
	                		$("#treeview_channel ul").append('<li><a href="#layout/list"><i class="fa fa-object-group"></i>节目模版</a></li>');
	                	}
                	}
                    break;
                case 6:		//用户管理
                	if (jdtData[a].ReadWriteAuth == 1){
	                	$(".sidebar-menu").append('<li id="treeview_user" class="treeview">'+
	                	          '<a href="#"><i class="fa fa-key"></i><span>&nbsp;管理员工具</span><i class="fa fa-angle-left pull-right"></i></a>'+
	                	          '<ul class="treeview-menu">'+
	                	            // '<li><a href="#user/users_list"><i class="glyphicon glyphicon-user"></i>审核</a></li>'+
                                    '<li><a href="#user/users_list"><i class="glyphicon glyphicon-user"></i> 用户管理</a></li>'+
                                    '<li><a href="#user/roles_list"><i class="fa fa-black-tie"></i> 角色权限</a></li>'+
                                    //'<li><a href="#funcmodule/list"><i class="fa fa-cube"></i> 功能模块</a></li>'+
                                    '<li><a id="menu_userlog" href="#userlog/list"><i class="fa fa-eye"></i> 操作日志</a></li>'+
	                	          '</ul>'+
	                	        '</li>');
	                    break;
                	}
                case 7:		//审核权限
                    break;
        		}
        	}
        	$(".sidebar-menu li:eq(0)").attr("class","treeview active");

        	window.onhashchange = loadPage;

            //选择资源
            $("#treeview_mtr").click(function () {
                $(".sidebar-menu li").attr("class", "treeview");
                $(".sidebar-menu li ul").css("display", "none");
                $("#treeview_mtr").attr("class", "treeview active");
                loadPage();
            })

            if ($(".sidebar-menu li").length == 0){
        		alert("您没有任何权限，请联系管理员！");
        	}else {
        		loadPage();
        	}
        });
    }


    function render(data) {
        var proData = data.Projects;
    }

    function initUserConfigs(){

        var data = {
          "project_name": CONFIG.projectName,
          "action": "GetKey",
          "key":"CheckLevel"
        }

        UTIL.ajax(
            'POST',
            CONFIG.serverRoot + '/backend_mgt/v2/userconfigs',
            JSON.stringify(data), 
            function(data){
                if(data.rescode === '200'){
                    UTIL.setLocalParameter('config_checkSwitch',data.UserConfigs[0].ConfigValue);
                    if(UTIL.getLocalParameter('config_checkSwitch') == '1'){
                        setUserConfig_check();
                    }
                }else{
                    console.log('获取审核权限开关失败');
                }
                
            }
        )
    }

    function setUserConfig_check(){
        var data = {
          "project_name": CONFIG.projectName,
          "action": "HasCheckModule"
        }

        UTIL.ajax(
            'POST',
            CONFIG.serverRoot + '/backend_mgt/v2/userdetails',
            JSON.stringify(data), 
            function(data){
                if(data.rescode === '200'){
                    UTIL.setLocalParameter('config_canCheck',data.hasCheckModule);
                }else{
                    console.log('获取是否有审核权限失败');
                }  
            }
        )
    }
});