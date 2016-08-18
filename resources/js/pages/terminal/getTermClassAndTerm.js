define(function(require, exports, module) {
	
	var CONFIG = require('common/config'),
      UTIL = require("common/util.js"),
      TREE = require("common/treetree.js"),
      _tree,
      _pagesize = 7,
      _pageNO = 1,
      _checkList = [];

  exports.save;
  exports.title;
  exports.channelID;

  exports.init = function() {
    
    $('#term_sel_title').html(exports.title);
    initTree();
    initEvent();

    // 关闭
    $('#term_sel_cancel').click(function(){
      UTIL.cover.close();
    })

    // 保存
    $('#term_sel_save').click(function(){
      var categoryList = _tree.getSelectedNodeID();
      categoryList = JSON.parse(JSON.stringify(categoryList).replace(/nodeId/g,'categoryID'));
      var termList = _checkList;
      if(categoryList.length === 0 && termList.length ===0){
        alert('请选择终端分类/终端');
      }else{
        var data = [];
        data.categoryList = categoryList;
        data.termList = termList;
        exports.save(data);
      } 
    })
  }

  function initTree(){
    var dataParameter = {
      "project_name": CONFIG.projectName,
      "action": "getTree"
    };
    if(exports.channelID){
      dataParameter.channelID = Number(exports.channelID);
    }

    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot+'/backend_mgt/v2/termcategory', 
      JSON.stringify(dataParameter),
      function(data){
        if(data.rescode === '200'){
          data = data.TermTree.children;
          _tree = {domId: 'select-termclass-tree', checkMode: 'multiple'};
          _tree = TREE.new(_tree);
          _tree.createTree($('#'+_tree.domId), data);
          // 选中、打开第一个结点
          var li = $('#'+_tree.domId).find('li:nth(0)');
          _tree.openNode(li);
          _tree.setFocus(li);
          loadTermList();

          // 终端分类列表各项点击
          $('#select-termclass-tree li > a').each(function(i, e){
            $(this).click(function(e){
              loadTermList();
            })
          })
        }else{
          alert('获取终端分类失败');
        }
      }
    );
  }

  function initEvent(){

    // serach
    $('#term_sel_search').click(function(){
      loadTermList(_pageNO);
    })
    .change(function(){
      loadTermList(_pageNO);
    })

    // 全选，不全选
    $('#term－sel-list-select-all').click(function(){
      var check = $('#term－sel-list-select-all>i').hasClass('fa-square-o');
      $('#term－sel-list-select-all>i').toggleClass('fa-square-o', !check);
      $('#term－sel-list-select-all>i').toggleClass('fa-check-square-o', check);
      $('#term_sel_list tr input[type="checkbox"]').iCheck((check?'check':'uncheck'));
    })
    
  }

  function onCheckBoxChange(){
    
    // 设置是否全选
    var ifSelAll = ($('#term_sel_list tr').length === _checkList.length);
    $('#term－sel-list-select-all>i').toggleClass('fa-square-o', !ifSelAll);
    $('#term－sel-list-select-all>i').toggleClass('fa-check-square-o', ifSelAll);
  }

  _checkList.add = function(id, status){
    _checkList.push({'termID': ''+id, 'status': status});
  }

  _checkList.delete = function(id){
    for(var i = 0; i < _checkList.length; i++){
      if(_checkList[i].termID === id){
        _checkList.splice(i,1);
        return;
      }
    }
  }

  function loadTermList(pageNum){

    // loading
    $('#term_sel_list').html('<i class="fa fa-refresh fa-spin" style="display:block; text-align: center; padding:10px;"></i>');

    var dom = $('#select-termclass-tree').find('.focus');
    $('#select-termlist-title').html(_tree.getFocusName(dom));

    if(pageNum !== undefined){
      _pageNO = pageNum;
    }else{
      _pageNO = 1;
    }
    
    var searchKeyword = $.trim($('#term_sel_search').val());
    var termClassId = $('#select-termclass-tree').find('.focus').attr('node-id');

    var data = {
      "project_name": CONFIG.projectName,
      "action": "getTermList",
      "categoryID": termClassId,
      "Pager":{
        "total": -1,
        "per_page": _pagesize,
        "page": _pageNO,
        "orderby": "",
        "sortby": "",
        "keyword": searchKeyword,
        "status": ""
      }
    }

    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
      JSON.stringify(data), 
      function(data){
        if(data.rescode != 200){
          alert('获取终端列表出错：'+rescode.errInfo);
          return;
        }

        // set pagebar
        var totalCounts = Math.max(data.totalStatistic.totalTermNum, 1);

        $('#select-term-table-pager').jqPaginator({
          totalCounts: totalCounts,
          pageSize: _pagesize,
          visiblePages: 5,
          first: CONFIG.pager.first,
          prev: CONFIG.pager.prev,
          next: CONFIG.pager.next,
          last: CONFIG.pager.last,
          page: CONFIG.pager.page,
          currentPage: _pageNO,
          onPageChange: function (num, type) {
            _pageNO = num;
            if (type === 'change') {
              $('#select-term-table-pager').jqPaginator('destroy');
              loadTermList(_pageNO);
            }
          }
        });

        // term_sel_list
        var tl = data.termList.terms;
        $('#term_sel_list').empty();

        // 清空已选list
        _checkList.length = 0;

        for(var i = 0; i < tl.length; i++){

          var statusName = (tl[i].Online === 0)?'离线':((tl[i].Status === 'Running')?'运行':'休眠');
          var status = (tl[i].Online === 0)?'offline':((tl[i].Status === 'Running')?'running':'shutdown');

          var checked = '';
          if(Number(exports.channelID) === tl[i].Channel_ID){
            checked = 'checked="checked"';
            _checkList.add(tl[i].ID, tl[i].Status);
          }
          $('#term_sel_list').append('' + 
            '<tr tid="'+ tl[i].ID +'" status="' + status + '">' +
              '<td>' +
                '<input type="checkbox" '+checked+'>' +
              '</td>' +
              '<td>'+ tl[i].Name +'</td>' +
              '<td>'+ statusName +'</td>' +
              '<td>当前频道：'+ ((tl[i].CurrentPlayInfo==='')?'':JSON.parse(tl[i].CurrentPlayInfo).ChannelName) +'</td>' +
            '</tr>'
          );
        }

        // 复选
        // 复选全选按钮初始化
        var hasCheck = $('#term－sel-list-select-all>i').hasClass('fa-check-square-o');
        if(hasCheck){
          $('#term－sel-list-select-all>i').toggleClass('fa-square-o', true);
          $('#term－sel-list-select-all>i').toggleClass('fa-check-square-o', false);
        }


        // 列表选择按钮添加icheck
        $('#term_sel_list tr input[type="checkbox"]').iCheck({
          checkboxClass: 'icheckbox_flat-blue',
          radioClass: 'iradio_flat-blue'
        })
        .on('ifChecked', function(event){
           _checkList.add($(this).parent().parent().parent().attr('tid'),$(this).parent().parent().parent().attr('status'));
           onCheckBoxChange();
        })
        .on('ifUnchecked', function(event){
           _checkList.delete($(this).parent().parent().parent().attr('tid'));
           onCheckBoxChange();
        });

        // 点击
        $('#term_sel_list tr').each(function(i,e){

          // 点击整行
          $(e).click(function(){
            $('#term_sel_list tr input[type="checkbox"]').iCheck('uncheck');
            $(e).find('input[type="checkbox"]').iCheck('check');
            _checkList.length = 0;
            _checkList.add($(e).attr('tid'),$(e).attr('status'));
            onCheckBoxChange(); 
          })

        })
        if(_checkList.length > 0){
          onCheckBoxChange();
        }

      }
    )
  }
	
});
