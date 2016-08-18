define(function(require, exports, module) {

	exports.new = function(tree){
		return Tree.new(tree);
	}

	var Tree = {
	  new: function(t){

	    var tree = {};
	    tree.domId = t.domId;
	    tree.checkMode = t.checkMode;

	    tree.createTree = function(dom, data){

	      if(data.length === 0) {
	        return;
	      }

	      // 创建树
	      tree.createNode(dom, data);

        // 整行点击
        $('#'+ tree.domId +' li').each(function(i, e){

          // check click事件
          $(this).children('a').find('input[type$="checkbox"]').click(function(e){

            var dom = $(this).parent().parent();
            e.stopPropagation();
            if(tree.checkMode === 'multiple'){
              tree.checkChildren(dom);
              tree.checkParent(dom);
            }
          })

          // 整行点击
          $(this).children('a').click(function(e){

            var dom = $(this).parent();
            tree.setFocus(dom);

            // 树的展开收起
            if (dom.hasClass('open')) {
              tree.closeNode(dom);
            }else{
              tree.openNode(dom);
            }

          })
        })
	    }

      // 向下检查
      tree.checkChildren = function(dom){

        // 取消选择
        if (!dom.children('a').find('input[type$="checkbox"]').get(0).checked){
          dom.children('ul').find('li').each(function(i,e){
            $(e).find('input[type$="checkbox"]').get(0).checked = false;
          })
        }

        // 选择
        else{
          dom.children('ul').find('li').each(function(i,e){
            $(e).find('input[type$="checkbox"]').get(0).checked = true;
          })
        }
      }

      // 向上检查
      tree.checkParent = function(dom){
        /*var parent = dom.parent().parent();
        if( parent.children('ul').attr('id') == tree.domId ){
          return;
        }

        //取消选择
        if (!dom.children('a').find('input[type$="checkbox"]').get(0).checked){

          if( parent.children('a').find('input[type$="checkbox"]').get(0).checked ){

            parent.children('a').find('input[type$="checkbox"]').get(0).checked = false;

            if( parent.parent().attr('id') != tree.domId ){

              tree.checkParent(parent);

            }
          }

        //选择
        }else{

          var checked = true;

          parent.children('ul').find('li').each(function(i,e){
            if($(e).children('a').find('input[type$="checkbox"]').get(0).checked === false){
              checked = false;
              return false;
            }
          })

          if( checked ){

            parent.children('a').find('input[type$="checkbox"]').get(0).checked = true;

            if( parent.parent().attr('id') != tree.domId ){

              tree.checkParent(parent);

            }
          }

        }*/
      }

      tree.getSelectedNodeID = function(){
        var data = [];
        if(tree.checkMode === 'single'){
          $('#'+tree.domId + ' li.focus').each(function(i,e){
            var content = $.trim($(e).find('span').html());
            data.push({nodeId : Number($(e).attr('node-id')), nodeContent : content})
          })
        }else if(tree.checkMode === 'multiple'){
          getMultipleSelectedNodeID($('#'+tree.domId));
        }
        return data;

        function getMultipleSelectedNodeID(ul){
          ul.children('li').each(function(i,e){
            if($(e).children('a').find('input[type$="checkbox"]').get(0).checked){
              var content = $.trim($(e).find('span').html());
              data.push({nodeId : Number($(e).attr('node-id')), nodeContent : content})
            }
            else if($(e).hasClass('treeview')){
              getMultipleSelectedNodeID($(e).children('ul'))
            }
          })
        }
      }

      tree.getFocusName = function(dom){
        return dom.children('a').find('span').html();
      }

	    tree.addParentCss = function(dom){
	    	dom.addClass('treeview');
        var a = dom.children('a');
        var angle = $('<i class="glyphicon glyphicon glyphicon-chevron-right"></i>');
        a.prepend(angle);
        angle.next().remove();
        angle.click(function(e){
        	e.preventDefault();
		      e.stopPropagation();
        	var li = $(this).parent().parent();
					if (li.hasClass('open')) {
						tree.closeNode(li);
					}else{
						tree.openNode(li);
					}
        })
	    }

	    tree.showEditInput = function(dom,fn){
	    	var t = dom.children('a').find('span');
        if(t.css('display') === 'none'){
          var input = dom.children('a').find('div > input');
          input.focus();
          return;
        }
        t.css('display', 'none');

        var input_div = $('' +
        '<div class="input-group tree-input-group">' +
          '<input type="text" class="form-control">' +
          '<span class="input-group-addon"><i class="fa fa-check"></i></span>' +
        '</div>');

        var input = input_div.find('input');
        var done = input_div.find('span');
        input.val($.trim(t.html()));
        dom.children('a').append(input_div);
        input.focus();

        input.click(function(e){
          e.preventDefault();
          e.stopPropagation();
        })

        done.click(function(e){
          e.preventDefault();
          e.stopPropagation();
        })

        if(fn != undefined){
        	fn(input);
        }
	    }

      tree.openAncestorsNode = function(dom){
        var ul = dom.parent();
        if(ul.attr('id') === tree.domId){
          return;
        }
        else{
          var li = ul.parent();
          if (li.hasClass('open')){
            return;
          }
          else{
            tree.openNode(li);
            tree.openAncestorsNode(li);
          }
        }
      }

	    tree.openNode = function(dom){
	    	dom.addClass('open');
	    	dom.children('a').find('.fa-folder-o').removeClass('fa-folder-o').addClass('fa-folder-open-o');
	    }

	    tree.closeNode = function(dom){
	    	dom.removeClass('open');
	    	dom.children('a').find('.fa-folder-open-o').removeClass('fa-folder-open-o').addClass('fa-folder-o');
	    }

	    tree.setFocus = function(dom){
	    	$('#'+tree.domId).find('.focus').removeClass('focus');
        dom.addClass('focus');
	    }

      tree.cancelFocus = function(dom){
        dom.removeClass('focus');
      }

      tree.setMultipleFocus = function(dom){
        dom.addClass('focus');
      }

	    tree.createNode = function(dom, data){

        // 是否可选中
        var checkbox = '';
        if(tree.checkMode === 'multiple'){
          checkbox = '<input type="checkbox">';
        }

        for(var i = 0; i < data.length; i++){
          var treeview = '';
          var angle = '';

          // 是否有子结点
          if(data[i].children.length > 0){
            treeview = 'treeview';
            angle = '<i class="glyphicon glyphicon-chevron-right"></i>';
          }else{
              angle = '<i class="glyphicon" style="width:22px"></i>';
          }

          var li = $('' +
            '<li node-id="' + data[i].id + '" class="' + treeview + '">' +
              '<a>' + angle + checkbox +
              '<i class="fa fa-folder-o"></i><span> ' + data[i].name + '</span>' +
              '</a>' +
            '</li>');

          dom.append(li);

          // 判断是否为选中状态
          if(tree.checkMode === 'multiple'){
            var parentChecked = false;
            if(dom.prev('a').length > 0){
              parentChecked = (dom.prev('a').find('input[type$="checkbox"]').get(0).checked)?true:false;
            }
            if(data[i].isChecked === 1 || parentChecked){
              li.children('a').find('input[type$="checkbox"]').get(0).checked = true;
              tree.openAncestorsNode(li);
            }
          }

          if(treeview === 'treeview'){
            var ul = $('<ul class="tree-menu-2"></ul>');
            li.append(ul);
            tree.createNode(ul, data[i].children);
          }
        }

      }

	    return tree;
	  }
	}

});