define(function(require, exports, module) {
	
	var CONFIG = require('common/config'),
      UTIL = require("common/util.js"),
      _snap,
	    _snapCheck;

  exports.termID;
  exports.init = function() {

    // close
    $('#term_snap_close').click(function(){
      if(_snapCheck){
        clearTimeout(_snapCheck);
      }
      if(_snap){
        clearTimeout(_snap);
      }
      UTIL.cover.close();
    })

    snap();

    // 截屏超时
    _snapCheck = setTimeout(function(){
      if($('#snap_box').length === 0){
        return;
      }

      // console.log('check snap wait time');

      if($('#snap_info').css('display') !== 'none'){
        if(_snap){
          clearTimeout(_snap);
        }
        $('#snap_info').html('截屏超时，请重试');
      }
    },CONFIG.termSnapWait)

  };

  function snap(){

    if($('#snap_box').length === 0){
      return;
    }

    var data = {
      "project_name": CONFIG.projectName,
      "action": "getInfo",
      "ID": exports.termID
    }

    // console.log('get SnapshotPicURL');
    
    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot + '/backend_mgt/v2/term', 
      JSON.stringify(data), 
      function(data){
        if(data.SnapshotPicURL === ''){
          _snap = setTimeout(function(){
            snap();
          },CONFIG.termSnapInterval)
        }else{
          var img = new Image();
          img.src = data.SnapshotPicURL;
          img.onload = function(){
            $('#snap_info').css('display','none');
            $('#snap_box').css('background','url('+img.src+') no-repeat').css('background-size','contain');
          }
        }
      }
    );
  }
	
});
