define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var _mtrId;
    exports.init = function () {
        var DispClose = false;
        $(window).bind('beforeunload', function () {
            var editor = CKEDITOR.instances.editor1;//获取编辑器对象,editor1 为 textarea 的ID
            var data = editor.getData();//获取编辑器内容
            if (data != "") {
                DispClose = true;
            }
            if (DispClose) {
                return "当前正在编辑文本，是否离开当前页面?";
            }
        })

        if(UTIL.getLocalParameter('config_checkSwitch') == '0'){
            $('#Tmtr_viewlast').hide();
            $('#Tmtr_submit').hide();
        }
        loadPage();
        
        //销毁
        try{
        	var editor = CKEDITOR.instances['editor1'];
            if (editor) { editor.destroy(true); }
        }catch(e){}
        CKEDITOR.replace('editor1');
        //关闭窗口
        $("#Tmtr_back").click(function () {
            backList();
        });

        $('#Tmtr_viewlast').click(function(){
            var viewText = require("pages/materials/materials_viewText.js");
            var mtrId = location.hash.substring(location.hash.lastIndexOf('?id=')+4);
            viewText.materialID = mtrId;
            viewText.materialName = '已通过审核的内容';
            var page = "resources/pages/materials/materials_viewText.html";
            UTIL.cover.load(page);
        })
    }

    function loadPage() {
    	if (location.hash.indexOf('?id=') != -1){			//保存
    		$("#mtr_atTitle").html("编辑文本");
    		var mtrId = location.hash.substring(location.hash.lastIndexOf('?id=')+4);
            jsons ={};
            jsons["Action"] = "Get";
            jsons["Project"] = CONFIG.projectName;
            $.post(
                CONFIG.serverRoot + "/backend_mgt/v1/webmaterials/"+mtrId,
                JSON.stringify(jsons),
                function(data1){
                    var json = JSON.parse(data1);
                    $("#Tmtr_name").val(json.Materials[0].Name);
                },
                "text"
            );

            jsons1 ={};
            jsons1["Action"] = "GetText";
            jsons1["Project"] = CONFIG.projectName;
            $.post(
                CONFIG.serverRoot + "/backend_mgt/v1/webmaterials/"+mtrId,
                JSON.stringify(jsons1),
                function(data1){
                    CKEDITOR.instances['editor1'].setData(data1)
                },
                "text"
            );
            //保存
            $("#Tmtr_save").click(function () {
            	if(!inputCheck()) return;
                onSubmit(mtrId);
            })

            //保存并提交
            $("#Tmtr_submit").click(function () {
                if(!inputCheck()) return;
                onSaveAndSubmit(mtrId);
            })
    	}else {		
            //添加
            $('#Tmtr_viewlast').hide();
    		$("#mtr_atTitle").html("添加文本");
    		$("#Tmtr_save").click(function () {
    			if(!inputCheck()) return;
    			onSubmit();
            })

            //保存并提交
            $("#Tmtr_submit").click(function () {
                if(!inputCheck()) return;
                onSaveAndSubmit();
            })
    	}
    }

    //返回
    function backList() {
        var editor = CKEDITOR.instances['editor1'];
        if (editor) { editor.destroy(true); }
        location.hash = '#materials/materials_list';
    }

    function onSaveAndSubmit(mtrId){
        _mtrId = mtrId;
        var editor_data = CKEDITOR.instances.editor1.getData();
        if(mtrId == null){
            var url = CONFIG.serverRoot + "/backend_mgt/v1/webmaterials";
            var data = JSON.stringify({
                action : 'Post',
                project: CONFIG.projectName,
                name: $("#Tmtr_name").val(),
                content: editor_data
            })
            UTIL.ajax('POST', url, data, function (msg) {
                if (parseInt(msg.rescode) == 200) {
                    submit();
                } else {
                    alert("保存失败");
                }
            })
            //$.ajax({
            //    url: CONFIG.serverRoot + "/backend_mgt/v1/webmaterials?project=" + UTIL.getCookie("project_name") + "&action=Post&name=" + encodeURIComponent($("#Tmtr_name").val())
            //    + "&username=" + $('#USER-NAME').html() + "&token=" + UTIL.getCookie("token"),
            //    type: "POST",
            //    data: editor_data,
            //    dataType: "json",
            //    success: function (data, textStatus) {
            //        if (parseInt(data.rescode) == 200) {
            //            submit();
            //        } else {
            //            alert("保存失败");
            //        }
            //    }
            //});
        }else {
            var url = CONFIG.serverRoot + "/backend_mgt/v1/webmaterials";
            var data = JSON.stringify({
                action : 'Post',
                project: CONFIG.projectName,
                name: $("#Tmtr_name").val(),
                content: editor_data
            })
            UTIL.ajax('POST', url, data, function (msg) {
                if (msg.rescode == 200) {
                    submit();
                } else {
                    alert("保存失败");
                }
            })
            //$.ajax({
            //    url: CONFIG.serverRoot + "/backend_mgt/v1/webmaterials?project="+ UTIL.getCookie("project_name") +"&action=Update&ID="+ mtrId
            //    + "&name="+encodeURIComponent($("#Tmtr_name").val()) + "&username=" + $('#USER-NAME').html() + "&token=" + UTIL.getCookie("token"),
            //    type: "POST",
            //    data: editor_data,
            //    dataType: "json",
            //    success:function (data, textStatus){
            //        if (parseInt(data.rescode) == 200){
            //            submit();
            //        }else{
            //            alert("保存失败");
            //        }
            //    }
            //});
        }
        function submit(){
            var data2 = JSON.stringify({
              "project_name": CONFIG.projectName,
              "action": "submitToCheck",
              "material_type": "WebText",
              "MaterialIDs": [_mtrId]
            });
            UTIL.ajax(
                'POST', 
                CONFIG.serverRoot + '/backend_mgt/v1/materials', 
                data2,
                function(data){
                    if(data.rescode === '200'){
                        alert("保存并提交成功");
                        backList();
                        //解除绑定，一般放在提交触发事件中
                        $(window).unbind('beforeunload');
                    }else{
                        '提交失败'
                    }
                }
            )
        } 
    }

    function onSubmit(mtrId) {
    	var editor_data = CKEDITOR.instances.editor1.getData();
    	if(mtrId == null){
            var url = CONFIG.serverRoot + "/backend_mgt/v1/webmaterials";
            var data = JSON.stringify({
                action : 'Post',
                project: CONFIG.projectName,
                name: $("#Tmtr_name").val(),
                content: editor_data
            })
            UTIL.ajax('POST', url, data, function (msg) {
                if (msg.rescode == 200) {
                    alert("保存成功");
                    backList();
                    //解除绑定，一般放在提交触发事件中
                    $(window).unbind('beforeunload');
                    //$("#mtrText").trigger("click");
                } else {
                    alert("保存失败");
                }
            })
            //$.ajax({
            //    url: CONFIG.serverRoot + "/backend_mgt/v1/webmaterials?project=" + UTIL.getCookie("project_name") + "&action=Post&name=" + encodeURIComponent($("#Tmtr_name").val())
            //    + "&username=" + $('#USER-NAME').html() + "&token=" + UTIL.getCookie("token"),
            //    type: "POST",
            //    data: editor_data,
            //    dataType: "json",
            //    success: function (data, textStatus) {
            //        if (parseInt(data.rescode) == 200) {
            //            alert("保存成功");
            //            backList();
            //            //解除绑定，一般放在提交触发事件中
            //            $(window).unbind('beforeunload');
            //            //$("#mtrText").trigger("click");
            //        } else {
            //            alert("保存失败");
            //        }
            //    }
            //});
    	}else {
            var url = CONFIG.serverRoot + "/backend_mgt/v1/webmaterials";
            var data = JSON.stringify({
                action : 'Post',
                project: CONFIG.projectName,
                name: $("#Tmtr_name").val(),
                content: editor_data
            })
            UTIL.ajax('POST', url, data, function (msg) {
                if (msg.rescode == 200){
                    alert("保存成功");
                    backList();
                }else{
                    alert("保存失败");
                }
            })
    	    //$.ajax({
    	    //    url: CONFIG.serverRoot + "/backend_mgt/v1/webmaterials?project="+ UTIL.getCookie("project_name") +"&action=Update&ID="+ mtrId
             //   +"&name="+encodeURIComponent($("#Tmtr_name").val()) + "&username=" + $('#USER-NAME').html() + "&token=" + UTIL.getCookie("token"),
    	    //    type: "POST",
    	    //    data: editor_data,
    	    //    dataType: "json",
    	    //    success:function (data, textStatus){
    	    //        if (parseInt(data.rescode) == 200){
    	    //            alert("保存成功");
             //           back();
    	    //        }else{
    	    //            alert("保存失败");
    	    //        }
    	    //    }
    	    //});
    	}
        
    }
    
    //检测文本框事件
    function inputCheck(){
        var errormsg = ""; 
    	if ($("#Tmtr_name").val() == ""){
    		errormsg += "请输入文本资源名称！";
    	}
    	if (errormsg != ""){
    		alert(errormsg);
    		return false;
    	}else {
    		return true;
    	}
    	
    }
})
