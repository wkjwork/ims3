define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    exports.materialID;
    exports.materialName;

    exports.init = function () {
        $('#mvt_close').click(function(){
            UTIL.cover.close();
        })
        $('#mvt_title').html(exports.materialName);
        var data={
            "Project": CONFIG.projectName,
            "Action": "GetCheckText"
        }
        UTIL.ajax(
            'POST', 
            CONFIG.serverRoot + '/backend_mgt/v1/webmaterials/'+exports.materialID, 
            JSON.stringify(data),
            function(data){
                if(data == ''){
                    $('#mvt_content').html('无内容')
                }
                else{
                    $('#mvt_content').html(data);
                }
                
            },
            'text'
        )
        
    }

})
