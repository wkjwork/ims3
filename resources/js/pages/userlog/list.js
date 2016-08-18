define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var templates = require('common/templates');
    var nDisplayItems = 10;
    var last;

    exports.init = function () {
        exports.loadUserlogPage(1); //加载默认页面

        //搜索
        $("#userlogSearch").keyup(function (event) {
            if (event.keyCode == 13) {
                onSearch(event);
            }
        });
        $("#userlogSearch").next().click(onSearch);
        function onSearch(event) {
            last = event.timeStamp;         //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
            setTimeout(function () {          //设时延迟0.5s执行
                if (last - event.timeStamp == 0) //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
                {
                    exports.loadUserlogPage(1);
                }
            }, 500);
        }

        //添加
        /*$("#user_add").click(function () {
         UTIL.cover.load('resources/pages/user/user_add.html');
         })*/
    }

    // 加载页面数据
    exports.loadUserlogPage = function (pageNum) {
        $("#userlogLisTitle").html("");
        $("#userlogTable tbody").html('<i class="fa fa-refresh fa-spin" style="display:block; text-align: center; padding:10px;"></i>');
        $(".fa.fa-check-square-o").attr("class", "fa fa-square-o");
        $("#userlogLisTitle").html("日志列表");

        var data = JSON.stringify({
            project_name: CONFIG.projectName,
            action: 'getUserLog',
            Pager: {
                "total": -1,
                "per_page": nDisplayItems,
                "page": pageNum,
                "orderby": "",
                "sortby": "desc",
                "keyword": $('#userlogSearch').val()
            }
        });
        var url = CONFIG.serverRoot + '/backend_mgt/v2/userlog';
        UTIL.ajax('post', url, data, render);
    }

    function render(json) {
        //翻页
        var totalPages = json.pagesNum;
        totalPages = Math.max(totalPages, 1);
        $('#userlog-table-pager').jqPaginator({
            totalPages: totalPages,
            visiblePages: CONFIG.pager.visiblePages,
            first: CONFIG.pager.first,
            prev: CONFIG.pager.prev,
            next: CONFIG.pager.next,
            last: CONFIG.pager.last,
            page: CONFIG.pager.page,
            currentPage: Number(json.curPage),
            onPageChange: function (num, type) {
                if (type === 'change') {
                    $('#userlog-table-pager').jqPaginator('destroy');
                    exports.loadUserlogPage(num);
                }
            }
        });
        $("#userlogTable tbody").html('');
        //拼接
        if (json.logList != undefined) {
            var rolData = json.logList;
            $("#userlogTable tbody").append('<tr>' +
            '<th class="User">用户名</th>' +
            '<th class="OperationObject">操作对象</th>' +
            '<th class="Datetime">时间</th>' +
            '<th class="Operation">操作</th>' +
                //'<th class="Detail">详情</th>'+
            '</tr>');
            if (rolData.length != 0) {
            for (var x = 0; x < rolData.length; x++) {
                var roltr = '<tr>' +
                    '<td class="User">' + rolData[x].User + '</td>' +
                    '<td class="OperationObject">' + rolData[x].OperationObject + '</td>' +
                    '<td class="Datetime">' + rolData[x].Datetime + '</td>' +
                    '<td class="Operation">' + rolData[x].Operation + '</td>' +
                        //'<td class="Detail">' + rolData[x].Detail + '</td>' +
                    '</tr>';
                $("#userlogTable tbody").append(roltr);
            }
        }else{
                $("#userlogTable tbody").empty();
                $('#userlog-table-pager').empty();
                $("#userlogTable tbody").append( '<h5 style="text-align:center;color:grey;">（空）</h5>');
            }
        }
    }
})
