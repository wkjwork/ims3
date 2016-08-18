define(function (require, exports, module) {
    var UTIL = require("common/util.js"),
        MTRCTRL = require("pages/channel/mtrCtrl");

    exports.init = function () {
        //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
        });

        //保存
        $("#btn-batchSubmit").click(function () {
            onSubmit();
        });

        loadPage();
    }

    /*
     *载入页面
     */
    function loadPage() {
        $("#batchDuration").inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
        if ($("#mtrCtrl_playType").val() == "Percent") {
            $(".batchOperation-time").show();
        } else {
            $(".batchOperation-time").hide();
        }
    }

    /*
     *保存事件
     */
    function onSubmit() {
        if ($("#batchDuration").val() != "") {
            var attr = $("#batchDuration").val().split(":");
            if (isNaN(attr[0]) || isNaN(attr[1]) || isNaN(attr[2])) {
                alert("请输入正确的资源播放时长！");
                $("#batchDuration").focus();
                return;
            }
        }
        var obj1,
            obj2;
        $("input:checkbox[class='mtr_cb']:checked").each(function () {
            obj1 = $(this).parents("tr").find(".mtrCtrl_time");
            obj2 = $(this).parents("tr").find(".mtrC_times");
            if ($("#batchDuration").val() != "") {
                if (obj1.attr("disabled") == undefined) {
                    obj1.val($("#batchDuration").val());
                    obj1.trigger("change");
                }
            }
            if ($("#batchTime").val() != "") {
                obj2.val($("#batchTime").val());
                obj2.trigger("change");
            }
        })
        UTIL.cover.close();
    }
})