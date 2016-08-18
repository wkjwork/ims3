'use strict';

define(function (require, exports, module) {

    // depend on these components
    var templates = require('common/templates'),
        config = require('common/config'),
        util = require('common/util'),
        toast = require('common/toast'),
        getClassAndTerm = require('pages/terminal/getTermClassAndTerm.js');

    // global variables
    var requestUrl = config.serverRoot,
        projectName = config.projectName,
        nDisplayItems = 10,
        _pageNO = 1,
        last;

    // 初始化页面
    exports.init = function () {
        checkCheck();
        loadPage(_pageNO);

        //获取已选频道ids
        function getChannelIds() {
            var ids = new Array();
            $("#channel-table input[type='checkBox']:checked").each(function (i, e) {
                ids.push(Number($(e).parent().parent().parent().attr('chnID')));
            })
            return ids;
        }

        registerEventListeners();
        //筛选审核状态
        if (util.getLocalParameter('config_checkSwitch') == '1') {
            $('#chn_toBeCheckedDiv button').each(function (i, e) {
                $(this).click(function () {
                    $(this).siblings().removeClass('btn-primary');
                    $(this).siblings().addClass('btn-defalut');

                    var isFocus = $(this).hasClass('btn-primary');
                    $(this).removeClass(isFocus ? 'btn-primary' : 'btn-defalut');
                    $(this).addClass(isFocus ? 'btn-defalut' : 'btn-primary');
                    loadPage(1);
                })
            })

            //提交审核
            $('#chn_submit').click(function () {

                if (!$('#chn_submit').attr('disabled')) {

                    var data = {
                        "project_name": config.projectName,
                        "action": "submitToCheck",
                        "ChannelIDs": getChannelIds()
                    }
                    util.ajax(
                        'POST',
                        config.serverRoot + '/backend_mgt/v2/channels',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert('已提交');
                                loadPage(_pageNO);
                            } else {
                                alert('提交失败');
                            }
                        }
                    )
                }
            })

            //审核通过
            $('#chn_pass').click(function () {

                if (!$('#chn_pass').attr('disabled')) {
                    var data = {
                        "project_name": config.projectName,
                        "action": "checkPass",
                        "ChannelIDs": getChannelIds()
                    }
                    util.ajax(
                        'POST',
                        config.serverRoot + '/backend_mgt/v2/channels',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert('已审核');
                                loadPage(_pageNO);
                            } else {
                                alert('审核失败');
                            }
                        }
                    )
                    alert('处理中...');
                }
            })

            //审核不通过
            $('#chn_unpass').click(function () {

                if (!$('#chn_unpass').attr('disabled')) {
                    var ids = getChannelIds();
                    var unpassChn = [];
                    for (var i = 0; i < ids.length; i++) {
                        //ids[i].failInfo="这里是审核不通过的反馈信息"
                        var a = {"channelID": ids[i], "failInfo": "这里是审核不通过的反馈信息"}
                        unpassChn[i] = a;

                    }
                    var data = {
                        "project_name": config.projectName,
                        "action": "checkFailed",
                        "CheckFeedBack": unpassChn
                    }
                    util.ajax(
                        'POST',
                        config.serverRoot + '/backend_mgt/v2/channels',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert('已审核');
                                loadPage(_pageNO);
                            } else {
                                alert('审核失败');
                            }
                        }
                    )
                }
            })
        }

    };

    exports.loadPage = function(){
        loadPage(_pageNO);
    }

    function registerEventListeners() {
        $('#channel-table').delegate('input[type="checkbox"]', 'ifClicked', function (ev) {
            onSelectedItemChanged($(this.parentNode).hasClass('checked') ? -1 : 1);
        });
        $('#channel-table').delegate('tr', 'click', function (ev) {
            var self = this;
            $('#channel-table tr').each(function (idx, el) {
                $(el).iCheck('uncheck');
            });
            $(self).iCheck('check');
            onSelectedItemChanged();
        });
        $('#channel-table').delegate('.btn-channel-detail', 'click', function (ev) {
            var channelId = getChannelId(ev.target);
            ev.stopPropagation();
        });
        $('#channel-list-controls .select-all').click(function (ev) {
            var hasUncheckedItems = false;
            $('#channel-table div').each(function (idx, el) {
                if (!(hasUncheckedItems || $(el).hasClass('checked'))) {
                    hasUncheckedItems = true;
                }
            });
            $('#channel-table tr').each(function (idx, el) {
                $(el).iCheck(hasUncheckedItems ? 'check' : 'uncheck');
            });
            onSelectedItemChanged();
        });
        $('#channel-list-controls .btn-publish').click(publishChannel);
        $('#channel-list-controls .btn-publish-later').click(publishChannelLater);
        $('#channel-list-controls .btn-delete').click(deleteChannel);

        //搜索事件
        $("#channelSearch").keyup(function (event) {
            if (event.keyCode == 13) {
                onSearch(event);
            }
        });
        $("#channelSearch").next().click(onSearch);
        function onSearch(event) {
            last = event.timeStamp;         //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
            setTimeout(function () {          //设时延迟0.5s执行
                if (last - event.timeStamp == 0) //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
                {
                    loadPage(_pageNO);
                }
            }, 500);
        }

    }

    function publishChannel() {
        var channelID = $(".checked").parent().parent().attr("chnID");
        util.cover.load('resources/pages/terminal/getTermClassAndTerm.html');
        getClassAndTerm.channelID = channelID;
        getClassAndTerm.title = '发布到...';
        getClassAndTerm.save = function (data) {
            //var cList = JSON.stringify(data.categoryList);
            //var tList = JSON.stringify(data.termList);
            var post_data = JSON.stringify({
                project_name: config.projectName,
                action: 'publishChannel',
                channelID: channelID,
                categoryList: data.categoryList,
                termList: data.termList
            });
            var url = config.serverRoot + '/backend_mgt/v2/termcategory';
            util.ajax('post', url, post_data, function (msg) {
                if (msg.rescode == 200) {
                    alert("频道发布成功！")
                    util.cover.close();
                    loadPage(_pageNO);
                }
                else {
                    alert("频道发布失败！")
                    util.cover.close();
                }
            });


        }
    }

    function publishChannelLater() {
        var channelID = $(".checked").parent().parent().attr("chnID");
        util.cover.load('resources/pages/terminal/getTermClassAndTerm.html');
        getClassAndTerm.channelID = channelID;
        getClassAndTerm.title = '发布到...';
        getClassAndTerm.save = function (data) {
            //var cList = JSON.stringify(data.categoryList);
            //var tList = JSON.stringify(data.termList);
            var post_data = JSON.stringify({
                project_name: config.projectName,
                action: 'publishPreDownloadChannel',
                channelID: channelID,
                categoryList: data.categoryList,
                termList: data.termList
            });
            var url = config.serverRoot + '/backend_mgt/v2/termcategory';
            util.ajax('post', url, post_data, function (msg) {
                if (msg.rescode == 200) {
                    alert("频道预发布成功！")

                }
                else {
                    alert("频道预发布失败！")
                }
            });
            util.cover.close();
            loadPage(_pageNO);
        }
    }

    function copyChannel() {
        var data = JSON.stringify({
            Action: 'Copy',
            Project: projectName,
            ChannelID: getCurrentChannelId()
        });
        util.ajax('post', requestUrl + '/backend_mgt/v1/channels', data, function (res) {
            alert(Number(res.rescode) === 200 ? '复制成功' : '复制失败');
        });
    }

    function deleteChannel() {
        if (confirm("确定删除该频道？")) {
            var data = JSON.stringify({
                action: 'Delete',
                project_name: projectName
            });
            util.ajax('post', requestUrl + '/backend_mgt/v2/channels/' + getCurrentChannelId(), data, function (res) {
                alert(Number(res.rescode) === 200 ? '删除成功' : '删除失败');
                loadPage(_pageNO);
            });
        }
    }

    function onSelectedItemChanged(adjustCount) {
        var selectedCount = typeof(adjustCount) === 'number' ? adjustCount : 0;
        $('#channel-table div').each(function (idx, el) {
            if ($(el).hasClass('checked')) {
                selectedCount++;
            }
        });
        var hasUncheckedItems = selectedCount !== ($('#channel-table tr').size() - 1);
        $('#channel-list-controls .select-all>i')
            .toggleClass('fa-square-o', hasUncheckedItems)
            .toggleClass('fa-check-square-o', !hasUncheckedItems);
        $('#channel-list-controls .btn-delete').prop('disabled', selectedCount !== 1);

    }

    function getChannelId(el) {
        var idAttr;
        while (el && !(idAttr = el.getAttribute('chnid'))) {
            el = el.parentNode;
        }
        return Number(idAttr);
    }

    function getCurrentChannelId() {
        return Number($('#channel-table div.checked')[0].parentNode.parentNode.getAttribute('chnid'));
    }

    // 加载页面数据
    function loadPage(pageNum) {
        // loading
        $("#channel-table tbody").html('<i class="fa fa-refresh fa-spin" style="display:block; text-align: center; padding:10px;"></i>');
        var CheckLevel = -1;
        if ($('#chn_toBeCheckedDiv button.btn-primary').length > 0) {
            CheckLevel = $('#chn_toBeCheckedDiv button.btn-primary').attr('value');
        }
        var pager = {
            page: String(pageNum),
            total: '0',
            per_page: String(nDisplayItems),
            orderby: 'ID',
            sortby: '',
            keyword: $('#channelSearch').val(),
            status: ''
        };
        var data = JSON.stringify({
            action: 'GetPage',
            project_name: projectName,
            CheckLevel: CheckLevel,
            Pager: pager
        });
        util.ajax('post', requestUrl + '/backend_mgt/v2/channels', data, render);
    }

    // 渲染界面
    function render(json) {
        //翻页
        var totalPages = Math.ceil(json.Pager.total / nDisplayItems);
        totalPages = Math.max(totalPages, 1);
        $('#channel-table-pager').jqPaginator({
            totalPages: totalPages,
            visiblePages: config.pager.visiblePages,
            first: config.pager.first,
            prev: config.pager.prev,
            next: config.pager.next,
            last: config.pager.last,
            page: config.pager.page,
            currentPage: _pageNO,
            onPageChange: function (num, type) {
                _pageNO = num;
                if (type === 'change') {
                    $(".select-all i").attr("class", "fa fa-square-o");
                    loadPage(_pageNO);
                }
            }
        });

        $("#channel-table tbody").empty();
        //拼接
        if (json.Channels != undefined) {
            var chnData = json.Channels;
            var check_th = '';
            if (util.getLocalParameter('config_checkSwitch') == '1') {
                check_th = '<th class="chn_check">审核状态</th>';
            }

            $("#channel-table tbody").append('<tr>' +
                '<th class="chn_checkbox" style="width:32px;"></th>' +
                '<th class="chn_name">频道名</th>' +
                check_th +
                '<th class="chn_create">创建人</th>' +
                '<th class="chn_createTime">创建时间</th>' +
              //  '<th class="chn_detail">发布详情</th>'+
                '</tr>');
            if (chnData.length != 0) {
                for (var x = 0; x < chnData.length; x++) {
                    // 审核状态
                    var check_td = '';
                    var check_status = '';
                    if (util.getLocalParameter('config_checkSwitch') == '1') {
                        var status;
                        check_status = "check_status=" + chnData[x].CheckLevel;
                        switch (chnData[x].CheckLevel) {
                            case 0:
                                status = '待提交';
                                break;
                            case 1:
                                status = '待审核';
                                break;
                            case 2:
                                status = '已通过';
                                break;
                            case 3:
                                status = '未通过';
                                break;
                            default:
                                break;
                        }
                        check_td = '<td class="chn_check">' + status + '</td>';
                        var chntr = '<tr ' + check_status + ' chnID="' + chnData[x].ID + '" chnCU="' + chnData[x].CreateUserName + '">' +
                            '<td class="chn_checkbox"><input type="checkbox" id="chn_cb" class="chn_cb" chnID="' + chnData[x].ID + '" url="' + chnData[x].URL + '"></td>' +
                            '<td class="chn_name" title="' + chnData[x].Name + '"><b><a href="#channel/edit?id=' + chnData[x].ID + '">' + chnData[x].Name + '</a></b></td>' +
                            check_td +
                            '<td class="chn_create" title="' + chnData[x].CreateUserName + '">' + chnData[x].CreateUserName + '</td>' +
                            '<td class="chn_createTime" title="' + chnData[x].CreateTime + '">' + chnData[x].CreateTime + '</td>' +
                           // '<td class="chn_detail" title="' + chnData[x].CreateUserName + '"><a>发布详情</a></td>' +
                            '</tr>';
                        $("#channel-table tbody").append(chntr);
                    } else {
                        for (var x = 0; x < chnData.length; x++) {

                            // 未审核状态
                            var check_td = '';
                            var check_status = '';
                            var chntr = '<tr ' + check_status + ' chnID="' + chnData[x].ID + '" chnCU="' + chnData[x].CreateUserName + '">' +
                                '<td class="chn_checkbox"><input type="checkbox" id="chn_cb" class="chn_cb" chnID="' + chnData[x].ID + '" url="' + chnData[x].URL + '"></td>' +
                                '<td class="chn_name" title="' + chnData[x].Name + '"><b><a href="#channel/edit?id=' + chnData[x].ID + '">' + chnData[x].Name + '</a></b></td>' +
                                check_td +
                                '<td class="chn_create" title="' + chnData[x].CreateUserName + '">' + chnData[x].CreateUserName + '</td>' +
                                '<td class="chn_createTime" title="' + chnData[x].CreateTime + '">' + chnData[x].CreateTime + '</td>' +
                               // '<td class="chn_detail" title="' + chnData[x].CreateUserName + '"><a>发布详情</a></td>' +
                                '</tr>';
                            $("#channel-table tbody").append(chntr);
                        }
                    }
                }
            }else{
                $("#channel-table tbody").empty();
                $('#channel-table-pager').empty();
                $("#channel-table tbody").append( '<h5 style="text-align:center;color:grey;">（空）</h5>');
            }
            checkCheckBtns();
        }

        //复选框样式
        $('#channel-table input[type="checkbox"]').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
        //
        $(".icheckbox_flat-blue").parent().parent().click(function () {
            $(".table-responsive input[type='checkbox']").iCheck("uncheck");
            if ($(this).find("input").prop("checked") == true) {
                $(this).find("input").prop("checked", false);
                $(this).find("div").prop("class", "icheckbox_flat-blue");
                $(this).find("div").prop("aria-checked", "false");
            } else {
                $(this).find("input").prop("checked", true);
                $(this).find("div").prop("class", "icheckbox_flat-blue checked");
                $(this).find("div").prop("aria-checked", "true");
            }
            checkCheckBtns();
        })
        $(".icheckbox_flat-blue ins").click(function () {
            checkCheckBtns();
        })

        //校验批量操作的审核功能
        function checkCheckBtns() {
            if (util.getLocalParameter('config_checkSwitch') == '0') {
                var checked = $("#channel-table input[type='checkBox']:checked");
                //判断选中个数
                if (checked.length != '1') {
                    $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                    $('#channel-list-controls .btn-publish').attr('disabled', true);
                    $('#channel-list-controls .btn-delete').prop('disabled', true);
                } else {
                        $('#channel-list-controls .btn-publish-later').attr('disabled', false);
                        $('#channel-list-controls .btn-publish').attr('disabled', false);
                        $('#channel-list-controls .btn-delete').prop('disabled', false);
                }
            } else {
                if (util.getLocalParameter('config_canCheck') == '0') {
                    var checked = $("#channel-table input[type='checkBox']:checked");
                    //判断选中个数
                    if (checked.length != '1') {
                        $('#chn_submit').attr('disabled', true);
                        $('#chn_pass').attr('disabled', true);
                        $('#chn_unpass').attr('disabled', true);
                        $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                        $('#channel-list-controls .btn-publish').attr('disabled', true);
                        $('#channel-list-controls .btn-delete').prop('disabled', true);
                    } else {
                        //已通过
                        if ($(checked).parent().parent().parent().attr('check_status') == '2') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', false);
                            $('#channel-list-controls .btn-publish').attr('disabled', false);
                            if (config.userName == $(checked).parent().parent().parent().attr('chnCU')) {
                                $('#channel-list-controls .btn-delete').prop('disabled', false);
                            } else {
                                $('#channel-list-controls .btn-delete').prop('disabled', true);
                            }
                        }
                        //未通过
                        else if ($(checked).parent().parent().parent().attr('check_status') == '3') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                            if (config.userName == $(checked).parent().parent().parent().attr('chnCU')) {
                                $('#channel-list-controls .btn-delete').prop('disabled', false);
                            } else {
                                $('#channel-list-controls .btn-delete').prop('disabled', true);
                            }
                        }
                        //待审核
                        else if ($(checked).parent().parent().parent().attr('check_status') == '1') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                            if (config.userName == $(checked).parent().parent().parent().attr('chnCU')) {
                                $('#channel-list-controls .btn-delete').prop('disabled', false);
                            } else {
                                $('#channel-list-controls .btn-delete').prop('disabled', true);
                            }
                        }
                        //待提交
                        else {
                            $('#chn_submit').attr('disabled', false);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                            if (config.userName == $(checked).parent().parent().parent().attr('chnCU')) {
                                $('#channel-list-controls .btn-delete').prop('disabled', false);
                            } else {
                                $('#channel-list-controls .btn-delete').prop('disabled', true);
                            }
                        }
                    }
                }else {
                    var checked = $("#channel-table input[type='checkBox']:checked");
                    if (checked.length != '1') {
                        $('#chn_submit').attr('disabled', true);
                        $('#chn_pass').attr('disabled', true);
                        $('#chn_unpass').attr('disabled', true);
                        $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                        $('#channel-list-controls .btn-publish').attr('disabled', true);
                        $('#channel-list-controls .btn-delete').prop('disabled', true);
                    } else {
                        //已通过和未通过
                        if ($(checked).parent().parent().parent().attr('check_status') == '2') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', false);
                            $('#channel-list-controls .btn-publish').attr('disabled', false);
                        }
                        else if ($(checked).parent().parent().parent().attr('check_status') == '3') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                        }
                        //待审核
                        else if ($(checked).parent().parent().parent().attr('check_status') == '1') {
                            $('#chn_submit').attr('disabled', true);
                            $('#chn_pass').attr('disabled', false);
                            $('#chn_unpass').attr('disabled', false);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                        }
                        //待提交
                        else {
                            $('#chn_submit').attr('disabled', false);
                            $('#chn_pass').attr('disabled', true);
                            $('#chn_unpass').attr('disabled', true);
                            $('#channel-list-controls .btn-publish-later').attr('disabled', true);
                            $('#channel-list-controls .btn-publish').attr('disabled', true);
                        }
                    }
                }
            }
        }

        //发布详情
        $('.chn_detail').click(function(e){
            var self = $(this);
            e.preventDefault();
            e.stopPropagation();
            var chnID = self.parent().attr('chnID');
            exports.chnID = chnID;
            util.cover.load('resources/pages/channel/published_detail.html');
        })
        //mark
        //$('#channel-table>tbody').html('');
//        json.Channels.forEach(function (el, idx, arr) {
//            /*var schedule_type = el.Overall_Schedule_Type === 'Regular' ? '常规' : '定时';
//            var schedule_params = {
//                'Sequence': '顺序',
//                'Percent': '比例',
//                'Random': '随机'
//            }[el.Overall_Schedule_Paras.Type];
//            schedule_params = schedule_params ? schedule_params : '其它';*/
//            var data = {
//                id: el.ID,
//                name: el.Name,
//				CheckLevel:"111",
//                schedule_type: '',//schedule_type,
//                schedule_params: '',//schedule_params,
//                version: el.Version
//            };
//            $('#channel-table>tbody').append(templates.channel_table_row(data));
//        });
//
//        $('#channel-table input[type="checkbox"]').iCheck({
//            checkboxClass: 'icheckbox_flat-blue',
//            radioClass: 'iradio_flat-blue'
//        });
    }

    function checkCheck() {
        if (util.getLocalParameter('config_checkSwitch') == '0') {
            $('#chn_submit').css('display', 'none');
            $('#chn_pass').css('display', 'none');
            $('#chn_unpass').css('display', 'none');
            $('#chn_toBeCheckedDiv').css('display', 'none');
        }
        else if (util.getLocalParameter('config_canCheck') == '0') {
            $('#chn_pass').css('display', 'none');
            $('#chn_unpass').css('display', 'none');
        }
    }
});
