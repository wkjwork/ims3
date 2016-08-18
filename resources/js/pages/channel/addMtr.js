define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var MTRCTRL = require("pages/channel/mtrCtrl");
    var LAYOUTEDIT = require("pages/layout/edit");
    var nDisplayItems = 10;


    exports.init = function () {
        //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
        });

        //搜索
        $("#mtrChoiseSearch").keyup(function (event) {
            if (event.keyCode == 13) {
                var typeId = $("#mtrChoiseSearch").attr("typeId");
                onSearch(event);
            }
        });
        $("#mtrSearch").next().click(onSearch);

        //下拉框点击事件
        $("#mtr_typeChiose").change(function () {
            var typeId = $("#mtr_typeChiose").val();
            loadPage(1, Number(typeId));
        })

        //全选和全不选
        if ($("#mtr_addMtr").attr("is_choisebg") != "1") {
            $("#mtr_allCheck").click(function () {
                var clicks = $(this).data('clicks');
                if (clicks) {
                    //Uncheck all checkboxes
                    $("#mtr_choiseTable input[type='checkbox']").iCheck("uncheck");
                    $("#mtr_allCheck i").attr("class", "fa fa-square-o");
                } else {
                    //Check all checkboxes
                    $("#mtr_choiseTable input[type='checkbox']").iCheck("check");
                    $("#mtr_allCheck i").attr("class", "fa fa-check-square-o");
                }
                $(this).data("clicks", !clicks);
                mtrCb();
            });
        }

        $("#mtr_addStatus").hide();
        var type = $("#mtr_addMtr").attr("typeid");
        loadPage(1, Number(type));

        if ($("#mtr_addMtr").attr("is_choisebg") == "1") {
            $("#mtr_allCheck").hide();
            $("#mtr_addStatus").hide();
        }

        //保存
        $("#amtr_add").click(function () {
            if ($("#mtr_addMtr").attr("is_choisebg") == "1") { //添加背景图

                var mtrId = $("input:checkbox[class='amtr_cb']:checked").attr("mtrid");
                var url = $("input:checkbox[class='amtr_cb']:checked").parent().parent().next().find("a").attr("url");
                var datype = $("input:checkbox[class='amtr_cb']:checked").parent().parent().next().find("a").attr("datype");
                LAYOUTEDIT.updateBackground(mtrId, url, datype);
            } else {
                var datalist = [];
                for (var x = 0; x < $(".amtr_cb").length; x++) {
                    if ($(".amtr_cb:eq(" + x + ")").get(0).checked) {
                        var mtrData = JSON.parse(unescape($(".amtr_cb:eq(" + x + ")").parent().parent().parent().attr("data")));
                        datalist.push(mtrData);
                    }
                }
                MTRCTRL.getSelectedID(datalist);
            }
            UTIL.cover.close();
        })
    }

    function loadPage(pageNum, type) {
        // loading
        $("#mtr_choiseTable tbody").html('<i class="fa fa-refresh fa-spin" style="display:block; text-align: center; padding:10px;"></i>');
        //判断是否是视频控件选择列表
        if ($("#mtr_addMtr").attr("typeid") == "1") {
            if (type == 1) {
                $("#dp_action").html("视频");
            } else if (type == 2) {
                $("#mtr_choiseTitle").html("视频控件资源选择列表");
                $("#dp_action").html("图片");
            }
        } else {
            if (type == 2) {
                $("#mtr_choiseTitle").html("图片控件资源选择列表");
            }
            $("#mtr_dplist").remove();
        }

        //载入
        var mtrType;
        switch (type) {
            case 1:
                mtrType = "Video";
                $("#mtr_choiseTitle").html("视频控件资源选择列表");
                $("#mtrChoiseSearch").attr("placeholder", "搜索视频");
                $("#mtrChoiseSearch").attr("typeId", "1");
                break;
            case 2:
                mtrType = "Image";
                $("#mtrChoiseSearch").attr("placeholder", "搜索图片");
                $("#mtrChoiseSearch").attr("typeId", "2");
                break;
            case 3:
                mtrType = "Audio";
                $("#mtr_choiseTitle").html("音频控件资源选择列表");
                $("#mtrChoiseSearch").attr("placeholder", "搜索音频");
                $("#mtrChoiseSearch").attr("typeId", "3");
                break;
            case 4:
                mtrType = "WebText";
                $("#mtr_choiseTitle").html("文本控件资源选择列表");
                $("#mtrChoiseSearch").attr("placeholder", "搜索文本");
                $("#mtrChoiseSearch").attr("typeId", "4");
                break;
            case 5:
                mtrType = "Live";
                $("#mtr_choiseTitle").html("视频控件资源选择列表");
                $("#mtrChoiseSearch").attr("placeholder", "搜索直播");
                $("#mtrChoiseSearch").attr("typeId", "5");
                break;
            case 2:
        }
        var checkSwitch = UTIL.getLocalParameter('config_checkSwitch');
        if (checkSwitch == 1) {
            var status = "2";
        } else {
            var status = "";
        }

        var pager = {
            page: String(pageNum),
            total: '0',
            per_page: nDisplayItems,
            orderby: 'CreateTime',
            sortby: 'DESC',
            keyword: $('#mtrChoiseSearch').val(),
            status: status
        };
        var data = JSON.stringify({
            action: 'GetPage',
            project_name: CONFIG.projectName,
            material_type: mtrType,
            Pager: pager
        });
        var url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
        UTIL.ajax('post', url, data, add);

    }

    //将数据添加到列表
    function add(json) {
        $("#mtr_choiseTable tbody").empty();
        //翻页
        var totalCounts = Math.max(json.Pager.total, 1);
        $('#materials-table-pager').jqPaginator({
            totalCounts: totalCounts,
            pageSize: nDisplayItems,
            visiblePages: 5,
            first: CONFIG.pager.first,
            prev: CONFIG.pager.prev,
            next: CONFIG.pager.next,
            last: CONFIG.pager.last,
            page: CONFIG.pager.page,
            currentPage: Number(json.Pager.page),
            onPageChange: function (num, type) {
                if (type == 'change') {
                    $('#materials-table-pager').jqPaginator('destroy');
                    var typeId = $("#mtrChoiseSearch").attr("typeid");
                    loadPage(num, Number(typeId));
                }
            }
        });

        //拼接
        if (json.Materials != undefined) {
            var mtrData = json.Materials;
            $("#mtr_choiseTable tbody").append('<tr>' +
                '<th class="mtr_checkbox"></th>' +
                '<th class="mtr_choise_name">文件名</th>' +
                '<th class="mtr_size">大小</th>' +
                '<th class="mtr_time">时长</th>' +
                '<th class="mtr_choise_status">状态</th>' +
                '</tr>');
            if (mtrData.length != 0) {
                var material_type = mtrData[0].Type_Name;
                for (var x = 0; x < mtrData.length; x++) {
                    if (material_type == "文本" || material_type == "Live") {		//文本无预览效果
                        var mtr_choise_tr = mtrData[x].Name;
                    } else {
                        var mtrUrl = UTIL.getRealURL(mtrData[x].Download_Auth_Type, mtrData[x].URL);
                        var mtr_choise_tr = '<a url=' + mtrData[x].URL + ' datype='+mtrData[x].Download_Auth_Type+' target="_blank">' + mtrData[x].Name + '</a>';
                    }
                    var mtrtr = '<tr mtrid="' + mtrData[x].ID + '"  data="' + escape(JSON.stringify(mtrData[x])) + '">' +
                        '<td class="mtr_checkbox"><input type="checkbox" id="amtr_cb" class="amtr_cb" mtrid="' + mtrData[x].ID + '"></td>' +
                        '<td class="mtr_choise_name"><b>' + mtr_choise_tr + '</b></td>' +
                        '<td class="mtr_size">' + mtrData[x].Size + '</td>' +
                        '<td class="mtr_time">' + mtrData[x].Duration + '</td>' +
                        '<td class="mtr_choise_status"><span style="display: none;">已添加</span></td>' +
                        '</tr>';
                    $("#mtr_choiseTable tbody").append(mtrtr);
                }
                if (material_type == "文本" || material_type == "Live" || material_type == "Image") {		//文本和直播图片无时长
                    $(".mtr_time").empty();
                }
            }
            else {
                $("#mtr_choiseTable tbody").empty();
                $('#materials-table-pager').empty();
                $("#mtr_choiseTable tbody").append('<h5 style="text-align:center;color:grey;">（空）</h5>');
            }
        }
        //清空状态列
        $(".mtr_choise_status").empty();

        //预览操作
        $(".mtr_choise_name a").each(function(){
            $(this).click(function(){
                var z_index = parseInt($(this).parents("tr").index())-1;
                if(mtrData[z_index].Type_Name == "Video"){
                    var backSuffix = mtrData[z_index].URL.substring(mtrData[z_index].URL.lastIndexOf("."));
                    if(backSuffix != ".mp4" && backSuffix != ".ogg" && backSuffix != ".WebM" && backSuffix != ".MPEG4"){
                        alert("当前视频格式暂不支持预览！");
                        return;
                    }
                } else if(mtrData[z_index].Type_Name == "Audio"){
                    var backSuffix = mtrData[z_index].URL.substring(mtrData[z_index].URL.lastIndexOf("."));
                    if(backSuffix != ".mp3" && backSuffix != ".ogg" && backSuffix != ".wav"){
                        alert("当前音频格式暂不支持试听！");
                        return;
                    }
                }
                exports.viewData = mtrData[z_index];
                $("#cover_area").empty();
                var page = "resources/pages/materials/materials_preview.html";
                UTIL.cover.load(page);
            });
        });

        //复选框样式
        $('#mtr_choiseTable input[type="checkbox"]').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
        });
        //checkbox
        $(".icheckbox_flat-blue").parent().parent().click(function () {
            $("#mtr_choiseTable input[type='checkbox']").iCheck("uncheck");
            var obj = $(this).find("input");
            if ($(this).find("input").prop("checked") == true) {
                $(this).find("input").prop("checked", false);
                $(this).find("div").prop("class", "icheckbox_flat-blue");
                $(this).find("div").prop("aria-checked", "false");
            } else {
                $(this).find("input").prop("checked", true);
                $(this).find("div").prop("class", "icheckbox_flat-blue checked");
                $(this).find("div").prop("aria-checked", "true");
            }
            mtrCb();
        })
        $(".icheckbox_flat-blue ins").click(function () {
            if ($("#mtr_addMtr").attr("is_choisebg") == "1") {                      //添加背景图模块
                $("#mtr_choiseTable input[type='checkbox']").iCheck("uncheck");
                var obj = $(this).prev();
                if ($(this).prev().prop("checked") == true) {
                    $(this).prev().prop("checked", false);
                    $(this).parent().prop("class", "icheckbox_flat-blue");
                    $(this).parent().prop("aria-checked", "false");
                } else {
                    $(this).prev().prop("checked", true);
                    $(this).parent().prop("class", "icheckbox_flat-blue checked");
                    $(this).parent().prop("aria-checked", "true");
                }
            }
            mtrCb();
        })
        mtrCb();
    }

    //搜索事件
    function onSearch(event) {
        var typeId = $("#mtrChoiseSearch").attr("typeId");
        last = event.timeStamp;         //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        setTimeout(function () {          //设时延迟0.5s执行
            if (last - event.timeStamp == 0) //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
            {
                loadPage(1, Number(typeId));
            }
        }, 500);
    }

    //校验复选框勾选的个数
    function mtrCb() {
        var Ck = $(".mtr_checkbox div.icheckbox_flat-blue.checked").length;	//当前选中复选框个数
        var Uck = $(".mtr_checkbox div.icheckbox_flat-blue").length;			//复选框总个数
        //控制全选按钮全选或者不全选状态
        if (Uck != 0) {
            if (Ck == Uck) {
                $("#mtr_allCheck i").attr("class", "fa fa-check-square-o");
                $(".checkbox-toggle").data('clicks', true);
            } else {
                $("#mtr_allCheck i").attr("class", "fa fa-square-o");
                $(".checkbox-toggle").data('clicks', false);
            }
        }
    }
})
