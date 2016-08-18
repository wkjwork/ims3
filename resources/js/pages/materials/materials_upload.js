define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var MTR = require("pages/materials/materials_list.js");
    var _upl_list = new Array(); //记录上传xhr, status(success, uploading);
    var uploadQiniu = "0",
        Qiniu_UploadUrl = "",
        qiniu_url = "",
        domain = "";
    ;

    exports.init = function () {
        var DispClose = false;
        $(window).bind('beforeunload', function () {
            $("#Tbe_filesList tr").each(function () {
                if ($(this).attr("status") == "uploading") {
                    DispClose = true;
                }
            })
            if (DispClose) {
                return "当前正在上传文件，是否离开当前页面?";
            }
        })
        loadPage();
    }

    function loadPage() {
        exports.beginUpload();
        //显示上传页面
        $("#dpUpl").click(function () {
            $("#page_upload").css("display", "flex");
            $("#upload_box").css("display", "block");
        })

        //最小化上传窗口
        $('#BtMinimize').click(function () {
            alert("可点击右上方的云按钮重新打开上传页面！");
            $("#page_upload").css("display", "none");
            $("#dpUpl").css("display", "block");
        })

        //关闭上传窗口
        $("#BtClose").click(function () {
            var status = "";
            $("#Tbe_filesList tr").each(function () {
                if ($(this).attr("status") == "uploading") {
                    status = "uploading";
                }
            })
            if (status == 'uploading') {
                if (confirm("有资源正在上传，确定取消上传？")) {
                    //中断所有正在上传内容
                    for (var i = 0; i < _upl_list.length; i++) {
                        if (_upl_list[i].status == 'uploading') {
                            _upl_list[i].xhr.abort();
                        }
                    }
                    closeUpl_list();	//关闭上传窗口
                }
            } else {
                closeUpl_list();	//关闭上传窗口
            }
        });
    }

    //给上传列表添加信息
    exports.beginUpload = function () {
        if ($("#file")[0].files.length > 0) {
            var trLeng = $("#Tbe_filesList tr").length - 1;
            for (var x = trLeng, y = trLeng + 1, z = 0; x < $("#file")[0].files.length + trLeng; x++, y++, z++) {
                var file = $("#file")[0].files[z];
                var tr = '<tr id="upl_tr_' + x + '" status><td>' + y + '</td><td id="upl_mtrName">' + file.name + '</td>' +
                    '<td><div class="progress progress-xs progress-striped active">' +
                    '<div id="progressbar_' + x + '" class="progress-bar progress-bar-primary" style="width: 0%"></div></div></td>' +
                    '<td id="upl_speed_' + x + '"></td>' +
                    '<td id="upl_status_' + x + '"><a class="upl_cancle">取消上传</td></tr>';
                $("#Tbe_filesList tbody").append(tr);
            }
            //取消上传
            $(".upl_cancle").click(function () {
                var i = $(this).parent().parent().index() - 1;
                _upl_list[i].xhr.abort();
                $("#upl_tr_" + i).attr("status", "end");
                $("#progressbar_" + i).prop("class", "progress-bar progress-bar-danger");
                $("#upl_speed_" + i).html("");
                $("#upl_status_" + i).html("已取消");
                _upl_list[i].status = 'end';
            })

            $("#box_fileList").attr("status", "uploading");

            var data = JSON.stringify({
                project_name: CONFIG.projectName,
                action: "GetKey",
                key: "QiNiuUpload"
            })
            var url = CONFIG.serverRoot + '/backend_mgt/v2/userconfigs';
            UTIL.ajax('post', url, data, function (json) {
                uploadQiniu = json.UserConfigs[0].ConfigValue;
                upload();
            });
        }
    }

    //关闭上传窗口
    function closeUpl_list() {
        status = "";
        $("#page_upload").html("");
        $("#page_upload").css("display", "none");
        $("#file").prop("value", "");
        $("#dpUpl").css("display", "none");
        _upl_list.splice(0, _upl_list.length); //清空_upl_list
    }

    //定义upl_file
    function upl_file(xhr, status) {
        this.xhr = xhr;
        this.status = status;
    }

    //上传模块
    function upload() {
        $("#dpUpl").css("display", "block");
        if (uploadQiniu == "1") {
            //TODO, FIXME, 这里有个执行的先后顺序问题，一定要先拿到上传一些参数后，才能允许用户上传！！！
            var data = JSON.stringify({
                project_name: CONFIG.projectName,
                action: "getUploadParas"
            })
            var url = CONFIG.serverRoot + '/backend_mgt/v1/qiniu';
            UTIL.ajax('post', url, data, function (data) {
                var blkRet = data;
                Qiniu_UploadUrl = blkRet.uploadURL;
                domain = blkRet.domain;
                uploadToken = blkRet.uploadToken;
                if (Qiniu_UploadUrl == "") {
                    alert("Can not get Qiniu Upload Paras");
                    return;
                }
                up();
            })
        } else {
            up();
        }
        function up() {
            if ($("#file")[0].files.length > 0) {
                for (var a = 1, b = 0, c = 0; a < $("#Tbe_filesList tr").length; a++, b++) {
                    if ($("#upl_tr_" + b).attr("status") == "") {
                        Qiniu_upload($("#file")[0].files[c], b);
                        c++;
                    }
                }
            }
        }
    }

    // 上传
    function Qiniu_upload(f, num) {
        var xhr = new XMLHttpRequest();
        var formData, startDate;
        formData = new FormData();
        if (uploadQiniu == "0") {                 //普通上传
            xhr.open('POST', CONFIG.Resource_UploadURL, true);
        } else if (uploadQiniu == "1") {          //七牛上传
            var strS = f.name.split(".");
            var subS = strS[strS.length - 1];
            xhr.open('POST', Qiniu_UploadUrl, true);
            //时间戳和随机数做文件标记（key）
            var key = (new Date()).valueOf() + "_" + Math.floor((Math.random() * 1000000)) + "." + subS;
            formData.append('key', key);
            formData.append('token', uploadToken);
            qiniu_url = "http://" + domain + "/" + key;
        }
        formData.append('file', f);
        var taking;
        var xh = new upl_file(xhr);
        _upl_list.push(xh);

        //上传FTP
        xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var nowDate = new Date().getTime();
                taking = nowDate - startDate;
                var x = (evt.loaded) / 1024;
                var y = taking / 1000;
                var uploadSpeed = (x / y);
                var formatSpeed;
                if (uploadSpeed > 1024) {
                    formatSpeed = (uploadSpeed / 1024).toFixed(2)
                        + "Mb\/s";
                } else {
                    formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                }
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                $("#upl_tr_" + num).attr("status", "uploading");
                $("#progressbar_" + num).css("width", percentComplete + "%");
                $("#upl_speed_" + num).html(formatSpeed);
                if (num <= _upl_list.length) {
                    _upl_list[num].status = 'uploading';
                }
            }
        }, false);

        //入库
        xhr.onreadystatechange = function (response) {
            try {
                var fileName = f.name;
            } catch (e) {
            }
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                var blkRet = JSON.parse(xhr.responseText);
                var duration,
                    downloadAuthType,
                    md5,
                    url_name,
                    size;
                if (uploadQiniu == "0") {         //普通上传
                    duration = blkRet.duration;
                    downloadAuthType = "None";
                    md5 = blkRet.md5;
                    url_name = blkRet.upload_path;
                    size = blkRet.size;
                } else if (uploadQiniu == "1") {  //七牛上传
                    duration = "0";
                    downloadAuthType = "Qiniu";
                    md5 = "";
                    url_name = qiniu_url;
                    size = f.size;
                }
                var material = {
                    name: fileName,
                    name_eng: "",
                    url_name: url_name,
                    description: "",
                    is_live: "0",
                    Download_Auth_Type: downloadAuthType,
                    Download_Auth_Paras: "",
                    size: size,
                    md5: md5,
                    duration: duration,
                    create_time: getNowFormatDate(),
                    CreateUser: CONFIG.userName
                };
                var data = JSON.stringify({
                    action: 'Post',
                    project_name: CONFIG.projectName,
                    material: material
                });
                var url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
                UTIL.ajax('post', url, data, function (data) {
                    if (parseInt(data.rescode) == 200) {
                        $("#upl_tr_" + num).attr("status", "end");
                        $("#progressbar_" + num).prop("class", "progress-bar progress-bar-success");
                        $("#upl_speed_" + num).html("");
                        $("#upl_status_" + num).html("上传成功");
                        _upl_list[num].status = "end";
                        var status = "uploading";
                        //判断是否全部上传完毕
                        for (var b = 0, c = 0; b < _upl_list.length; b++) {
                            if (_upl_list[b].status == "end") {
                                c++;
                                if (c == _upl_list.length) {
                                    status = "end";
                                    //解除绑定
                                    $(window).unbind('beforeunload');
                                }
                            }
                        }
                        if (status == "end") {
                            $("#box_fileList").attr("status", "end");
                            var typeId = $("#mtrChoise li.active").attr("typeid");
                            if (typeId == "1" || typeId == "2" || typeId == "3") {
                                MTR.loadPage(1, Number(typeId));
                            }
                        }
                    } else {
                        $("#upl_tr_" + num).prop("status", "end");
                        $("#progressbar_" + num).prop("class", "progress-bar progress-bar-danger");
                        $("#upl_status_" + num).html("上传失败");
                        _upl_list[num].status = 'end';
                    }
                });
            } else if (xhr.status != 200 && xhr.responseText) {
                $("#upl_tr_" + num).prop("status", "end");
                $("#progressbar_" + num).prop("class", "progress-bar progress-bar-danger");
                $("#upl_status_" + num).html("上传失败");
            }
        };
        startDate = new Date().getTime();
        xhr.send(formData);
    };

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
})
