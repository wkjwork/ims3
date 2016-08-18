define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
	var LIST = require("pages/channel/list.js");


    exports.init = function () {
        var cID = LIST.chnID;
		var termList = $("#termList").html();
		var term = $("#term").html();
        console.log(cID+termList+term);


        //列表分类点击事件
        function chnChoise(obj) {
            $("#chnChoise li").removeClass('active');
            obj.parent().attr("class", "active");
        }


        //点击事件
        $('#chnpub').click(function () {
            chnChoise($(this));
            //显示已发布的相关信息
            $("#termList").html('发布信息');
            $("#term").html('发布信息');
        })
        $('#chnpre').click(function () {
            chnChoise($(this));
            //显示已预发布的相关信息
            $("#termList").html('预发布信息');
            $("#term").html('预发布信息');
        })


        //确定
        $('#chnSubmit').click(function(){
            UTIL.cover.close();
            type = "";
        })

		 //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
			type = "";
        });
    }
})
