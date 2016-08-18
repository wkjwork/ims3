define(function(require, exports, module) {
	
	var CONFIG = require('common/config'),
      UTIL = require("common/util.js"),
      TREE = require("common/treetree.js"),
      _tree;

  exports.save;
  exports.title;

  exports.init = function() {
    $('#sTermClass-title').html(exports.title);
    initTree();

    // 关闭
    $('#single-term-class-close').click(function(){
      UTIL.cover.close();
    })

    // 保存
    $('#single-term-class-save').click(function(){
      var data = _tree.getSelectedNodeID();
      if(data.length === 0){
        alert('请选择分类');
      }else{
        exports.save(data[0].nodeId);
      }
    })
  }

  function initTree(){
    var dataParameter = {
      "project_name": CONFIG.projectName,
      "action": "getTree"
    };

    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot+'/backend_mgt/v2/termcategory', 
      JSON.stringify(dataParameter),
      function(data){
        if(data.rescode === '200'){
          data = data.TermTree.children;
          _tree = {domId: 'single-termclass-tree', checkMode: 'single'};
          _tree = TREE.new(_tree);
          _tree.createTree($('#'+_tree.domId), data);
          // 选中、打开第一个结点
          var li = $('#'+_tree.domId).find('li:nth(0)');
          _tree.openNode(li);
        }else{
          alert('获取终端分类失败');
        }
      }
    );
  }
	
});
