define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var MTR = require("pages/materials/materials_list.js");


    exports.init = function () {
        var mtrId;
        for (var x = 0; x < $(".mtr_cb").length; x++) {
            if ($(".mtr_cb:eq(" + x + ")").get(0).checked) {
                mtrId = $(".mtr_cb:eq(" + x + ")").attr("mtrID");
            }
        }
        loadPage(mtrId);

        //保存
        $("#Emtr_updata").click(function () {
        	if (!inputCheck()) return;
        	var mtrName = $("#Emtr_name").val() + "." + $("#Emtr_name").attr("mtrtype");
            var material = {
                Name: mtrName
            }
            var data = JSON.stringify({
                action: 'Put',
                project_name: CONFIG.projectName,
                Data: material
            });
            var url = CONFIG.serverRoot + '/backend_mgt/v1/materials/' + mtrId;
            UTIL.ajax('post', url, data, function(msg){
                if(msg.rescode == 200){
                    var typeId = $("#mtrChoise li.active").attr("typeid");
                    MTR.loadPage(1, Number(typeId));
                    close();
                	alert("修改成功");
                }else{
                	alert("修改失败");
                }
            });
        })
    }

    function loadPage(mtrId) {
        //关闭窗口
        $(".CA_close").click(function () {
            close();
        });

        //载入
        var data = JSON.stringify({
            action: 'GetOne',
            project_name: CONFIG.projectName,
        });
        var url = CONFIG.serverRoot + '/backend_mgt/v1/materials/' + mtrId;
        UTIL.ajax('post', url, data, edit);

    }

    //载入资源名
    function edit(json) {
        var mtrName = json.Material[0].Name
        var name = mtrName.substring(0, mtrName.indexOf('.'));
        $("#Emtr_name").val(name);
        $("#Emtr_name").attr("mtrtype", mtrName.substring(mtrName.lastIndexOf('.') + 1));
    }

    //关闭窗口
    function close() {
        $("#cover_area").html("");
        $("#cover_area").css("display", "none");
    }
    
    //检测文本框事件
    function inputCheck() {
        var errormsg = "";
        if ($("#Emtr_name").val() == "") {
            errormsg += "请输入资源名称！\n";
        }
        if (errormsg != "") {
            alert(errormsg);
            return false;
        }else {
        	return true;
        }
    }
})
