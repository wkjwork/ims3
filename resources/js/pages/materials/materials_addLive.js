define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var MTR = require("pages/materials/materials_list.js");


    exports.init = function () {
        loadPage();
    }

    function loadPage() {
        //关闭窗口
        $(".CA_close").click(function () {
            close();
        });


        if ($("#mtr_edit").attr("edit_type") == "直播") {			//修改
            $("#mtr_alTitle").html("编辑直播源");
            var mtrId;
            for (var x = 0; x < $(".mtr_cb").length; x++) {
                if ($(".mtr_cb:eq(" + x + ")").get(0).checked) {
                    mtrId = $(".mtr_cb:eq(" + x + ")").attr("mtrID");
                }
            }

            var data = JSON.stringify({
                action: 'GetOne',
                project_name: UTIL.getCookie("project_name"),
            });
            var url = CONFIG.serverRoot + '/backend_mgt/v1/materials/' + mtrId;
            UTIL.ajax('post', url, data, function (msg) {
                var mtrName = msg.Material[0].Name
//	            var name = mtrName.substring(0, mtrName.indexOf('.'));
                var url = msg.Material[0].URL;
                $("#ULmtr_name").val(mtrName);
                $("#ULmtr_name").attr("mtrtype", mtrName);
                $("#ULmtr_address").val(url);
            });

            $("#ULmtr_add").click(function () {
                if (!inputCheck()) return;
                onSubmit(mtrId);
            })
        } else {													//添加
            $("#mtr_alTitle").html("添加直播源");
            $("#ULmtr_add").click(function () {
                if (!inputCheck()) return;
                onSubmit();
            })
        }
    }

    //关闭窗口
    function close() {
        $("#cover_area").html("");
        $("#cover_area").css("display", "none");
    }

    //获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var strHour = date.getHours();
        var strMin = date.getMinutes();
        var strSec = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHour >= 0 && strHour <= 9) {
            strHour = "0" + strHour;
        }
        if (strMin >= 0 && strMin <= 9) {
            strMin = "0" + strMin;
        }
        if (strSec >= 0 && strSec <= 9) {
            strSec = "0" + strSec;
        }
        var currentdate = date.getFullYear() + seperator1 + month
            + seperator1 + strDate + " " + strHour + seperator2
            + strMin + seperator2 + strSec;
        return currentdate;
    }

    function onSubmit(mtrId) {

        var mtrName = $("#ULmtr_name").val();
        var mtrUrl = $("#ULmtr_address").val();

        if (mtrId == null) {
            var action = "Post";
            var material = {
                name: mtrName,
                name_eng: '',
                url_name: mtrUrl,
                description: '',
                is_live: '1',
                Download_Auth_Type: 'None',
                Download_Auth_Paras: '',
                size: '0',
                md5: '',
                duration: '0',
                create_time: getNowFormatDate(),
                CreateUser: $('#USER-NAME').html()
            };
            var data = JSON.stringify({
                action: action,
                project_name: UTIL.getCookie("project_name"),
                material: material,
            });
            var url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
            UTIL.ajax('post', url, data, function (msg) {
                if (msg.rescode == 200) {
                    $("#mtrLive").trigger("click");
                    close();
                    alert("添加成功");
                } else {
                    alert("添加失败");
                }
            });
        } else {
            var action = "Put";
            var Data = {
                Name: mtrName,
                URL: mtrUrl,
            };
            var data = JSON.stringify({
                action: action,
                project_name: UTIL.getCookie("project_name"),
                Data: Data,
            });
            var url = CONFIG.serverRoot + '/backend_mgt/v1/materials/' + mtrId;
            UTIL.ajax('post', url, data, function (msg) {
                if (msg.rescode == 200) {
                    var pageNum = $("#materials-table-pager li.active").find("a").text();
                    MTR.loadPage(pageNum, 5);
                    close();
                    alert("修改成功");
                } else {
                    alert("修改失败");
                }
            });
        }


    }

    //检测文本框事件
    function inputCheck() {
        var errormsg = "";
        if ($("#ULmtr_name").val() == "") {
            errormsg += "请输入直播源名称！\n";
        }
        if ($("#ULmtr_address").val() == "") {
            errormsg += "请输入直播源地址！";
        }
        if (errormsg != "") {
            alert(errormsg);
            return false;
        }else {
        	return true;
        }
    }
})
