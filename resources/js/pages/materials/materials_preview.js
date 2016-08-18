define(function (require, exports, module) {
    var UTIL = require("common/util.js");
    var MTR = require("pages/materials/materials_list.js");
    var MTRCTRL = require("pages/channel/mtrCtrl.js");
    var ADDMTR = require("pages/channel/addMtr.js");

    var zdata; //即将预览的文件
    var index = 0;
    exports.init = function(){
        zdata = null;
        //关闭预览
        $(".mtrView_close").each(function(){
            $(this).click(function(){
                MTR.viewData = undefined;
                MTRCTRL.viewData = undefined;
                ADDMTR.viewData = undefined;
                $("#mtrPrevieBg").remove();
                $("#cover_area").hide();
            });
        });

        if (MTR.viewData != undefined){
            zdata = MTR.viewData;
        } else if (MTRCTRL.viewData != undefined) {
            zdata = MTRCTRL.viewData;
        } else if (ADDMTR.viewData != undefined) {
            zdata = ADDMTR.viewData;
        }
        if (zdata.Download_Auth_Type == undefined) {
            var mtrUrl = UTIL.getRealURL(zdata.download_auth_type, zdata.url);
        }else {
            var mtrUrl = UTIL.getRealURL(zdata.Download_Auth_Type, zdata.URL);
        }
        if (zdata.Type_ID == undefined) {
            var typeId = zdata.type_id;
        }else {
            var typeId = zdata.Type_ID;
        }
        index = 0;

        if(typeId == 1){//视频
            $("#mtrView_videoArea").css("display","block");
            $("#mtrView_video").attr("src",mtrUrl);
            $("#mtrView_videoArea").find("embed").attr("src",mtrUrl);
            document.getElementById("mtrView_video").addEventListener('canplaythrough',function(){
                index++;
            });
            var t = setInterval(function(){
                if(index == 0){
                    $("#mtrView_video").attr("src",mtrUrl);
                    $("#mtrView_videoArea").find("embed").attr("src",mtrUrl);
                }else{
                    clearInterval(t);
                }
            },1000);
        }else if(typeId == 2){//图片
            if(zdata.file_size > 5000000){
                if(confirm("图片内存占用比较大,可能会造成浏览器卡顿，确定要继续预览吗？")){
                    $("#mtrView_picArea").css("display","block");
                    $("#mtrView_picArea").find("img").attr("src",mtrUrl);
                }else{
                    $("#mtrPrevieBg").remove();
                }
            }else{
                $("#mtrView_picArea").css("display","block");
                $("#mtrView_picArea").find("img").attr("src",mtrUrl);
            }
        } else if(typeId == 3){//音频
            $("#mtrView_audioArea").css("display","block");
            $("#mtrView_audio").attr("src",mtrUrl);
            $("#mtrView_audioArea").find("embed").attr("src",mtrUrl);
            document.getElementById("mtrView_audio").addEventListener('canplaythrough',function(){
                index++;
            });
            var t = setInterval(function(){
                if(index == 0){
                    $("#mtrView_audio").attr("src",mtrUrl);
                    $("#mtrView_audioArea").find("embed").attr("src",mtrUrl);
                }else{
                    clearInterval(t);
                }
            },1000);
        }
    }
})