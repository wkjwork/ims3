define(function(require, exports, module){exports['channel_edit_main']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="channel-editor-wrapper"> <div class="channel-editor-header"> <button type="button" class="header-button-left glyphicon glyphicon-chevron-left btn-channel-editor-close"></button> <input class="direct-name-002 channel-editor-property" data-key="name" value="'+
((__t=(name))==null?'':__t)+
'"> <small class="direct-name-002-hint direct-name-hint" style="top: 18px; width: 24px; left: 75px"> <i class="glyphicon glyphicon-edit" style="color: white"></i> </small> <button type="button" class="header-button-left btn-channel-editor-saveSubmit pull-right"> <i class="glyphicon glyphicon-floppy-disk" style="position: relative;font-size: 15px; top: 3px"></i> 保存并提交 </button> <button type="button" class="header-button-left btn-channel-editor-saveRelease pull-right"> <i class="glyphicon glyphicon-floppy-disk" style="position: relative;font-size: 15px; top: 3px"></i> 保存并发布 </button> <button type="button" class="header-button-left btn-channel-editor-save pull-right"> <i class="glyphicon glyphicon-floppy-disk" style="position: relative;font-size: 15px; top: 3px"></i> 保存 </button> </div> <div class="channel-editor-body"> <div class="channel-program-list box box-default"> <div class="channel-program-list-timed"> <small style="position: absolute; bottom: 12px; right: 15px"> 点击添加新节目 <i class="glyphicon glyphicon-hand-up"></i> </small> <div class="box-header with-border" style="position: relative; z-index: 2; background: white; width: 256px"> <h3 class="box-title"> <i class="glyphicon glyphicon-time" style="position: relative; top: 3px; font-size: 16px"></i> 定时节目 </h3> <div class="tools"> <a class="btn btn-default btn-xs btn-program-delete" title="删除" data-program-type="Timed"><i class="glyphicon glyphicon-trash" style="font-size:12px"></i></a> <a class="btn btn-primary btn-xs btn-program-new" title="添加" data-program-type="Timed"><i class="glyphicon glyphicon-plus" style="font-size:12px"></i></a> </div> </div> <ul> </ul> </div> <div class="channel-program-list-regular"> <small style="position: absolute; bottom: 12px; right: 15px"> 点击添加新节目 <i class="glyphicon glyphicon-hand-up"></i> </small> <div class="box-header with-border" style="position: relative; width: 256px; background: white; z-index: 2; border-top: 1px solid #f4f4f4"> <i class="glyphicon glyphicon-repeat" style="position: relative; top: 2px; font-size: 14px; margin-right: 0"></i> <h3 class="box-title">常规节目</h3> <div class="tools"> <select class="channel-program-schedule-type btn-default btn" style="height: 24px; padding: 0; padding-left: 5px"> ';
 var type = JSON.parse(overall_schedule_params).Type; 
__p+=' ';
 if (type === 'Sequence') { 
__p+=' <option value="Sequence" selected="selected">顺序</option> ';
 } else { 
__p+=' <option value="Sequence">顺序</option> ';
 } 
__p+=' ';
 if (type === 'Random') { 
__p+=' <option value="Random" selected="selected">随机</option> ';
 } else { 
__p+=' <option value="Random">随机</option> ';
 } 
__p+=' ';
 if (type === 'Percent') { 
__p+=' <option value="Percent" selected="selected">随机</option> ';
 } else { 
__p+=' <option value="Percent">比例</option> ';
 } 
__p+=' </select> <a class="btn btn-default btn-xs btn-program-delete" title="删除" data-program-type="Regular"><i class="glyphicon glyphicon-trash" style="font-size:12px"></i></a> <a class="btn btn-primary btn-xs btn-program-new" title="添加" data-program-type="Regular"><i class="glyphicon glyphicon-plus" style="font-size:12px"></i></a> </div> </div> <ul> </ul> </div> </div> <div class="channel-program-editor box box-default"> 正在加载数据... </div> </div> </div> <script type="text/javascript">(function (obj,hint){\r\n\r\n    function getLength(str){  \r\n            var realLength = 0;  \r\n            for (var i = 0; i < str.length; i++){  \r\n                var charCode = str.charCodeAt(i);\r\n                \r\n                if (charCode >= 0 && charCode <= 128)   \r\n                realLength += 1;  \r\n                else   \r\n                realLength += 2;\r\n\r\n            }\r\n\r\n            return realLength;  \r\n        }  \r\n\r\n        //get name\r\n        var $obj = $(obj);\r\n        var t = $obj.val();\r\n        var length = getLength(t);\r\n        var width = parseFloat($obj.css(\'font-size\'));\r\n        var left = length * width/2 +77;\r\n\r\n        //get hint\r\n        var $hint = $(hint);\r\n        \r\n        //ux fix\r\n        $obj.css(\'cursor\',\'pointer\');\r\n\r\n        //reposition\r\n        $hint.css(\'left\',left);\r\n\r\n        //event\r\n        $hint.click(function(){\r\n            $obj.focus().val(t);\r\n        });\r\n        $obj.focus(function(){\r\n            $hint.css(\'display\',\'none\');\r\n            $obj.css(\'cursor\',\'\');\r\n        });\r\n        $obj.blur(function(){\r\n            $hint.css(\'display\',\'\');\r\n            $obj.css(\'cursor\',\'pointer\');\r\n            //reposition\r\n            var t = $obj.val();\r\n            var length = getLength(t);\r\n            var width = parseFloat($obj.css(\'font-size\'));\r\n            var left = length * width/2 +77;\r\n            $hint.css(\'left\',left);\r\n        });\r\n    }(\'.direct-name-002\',\'.direct-name-002-hint\'))</script>';
}
return __p;
};
exports['channel_edit_program']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="channel-program-header box-header with-border"> <input value="'+
((__t=(name))==null?'':__t)+
'" data-field="name" type="text" class="direct-name-003 form-control layout-edit-propoties-name" style="width:360px; height: 41px; top: 6px; position: absolute; font-weight: bold"> <small class="direct-name-003-hint direct-name-hint" style="top: 20px; width: 24px; left: 75px"> <i class="glyphicon glyphicon-edit" style="color: #555"></i> </small> <button class="btn-channel-preview btn btn-default pull-right" title="温馨提示：当前预览为最后一次保存的内容" is_preview="false" style="position: relative; top: 0px; margin-left: 15px"> <i class="fa fa-play-circle-o"></i> &nbsp&nbsp预览节目 </button> </div> <div class="channel-program-timer"> <div class="input-group"> <span class="input-group-addon" title="开始时间"> <i class="fa fa fa-calendar-check-o"></i> </span> <input type="date" class="form-control" data-field="lifetime_start" step="1" value="'+
((__t=(lifetime_start.match(/([^T]+)T/)[1]))==null?'':__t)+
'"> </div> <div class="input-group"> <span class="input-group-addon" title="失效时间"> <i class="fa fa-calendar-times-o"></i> </span> <input type="date" class="form-control" data-field="lifetime_end" step="1" value="'+
((__t=(lifetime_end.match(/([^T]+)T/)[1]))==null?'':__t)+
'"> </div> <div class="channel-editor-program-trigger input-group input-group-sm"> <div class="input-group-btn" style="float: left"> <button type="button" class="btn btn-danger btn-channel-setup-timer"> <i class="fa fa-fw fa-bomb"></i> <b>定时触发</b> </button> </div><!-- /btn-group --> <label type="text" class="form-control" style="width: calc(100% - 88px); height: 30px; overflow: hidden; float: right; display: inline; line-height: 25px"> <label class="timer-field timer-field-date"> <span></span> </label> <label class="timer-field timer-field-date"> <span></span> </label> <label class="timer-field timer-field-day"> <span></span> </label> <label class="timer-field"> <span></span> </label> <label class="timer-field"> <span></span> </label> <label class="timer-field"> <span></span> </label> </label> </div> <div class="input-group"> <span class="input-group-addon" title="生效时间"> <i class="fa fa-calendar-check-o"></i> </span> <input type="datetime-local" class="form-control" data-field="lifetime_start" step="1" value="'+
((__t=(lifetime_start))==null?'':__t)+
'"> </div> <p style="float: left; position: relative; top: 10px; left: 8px">-</p> <div class="input-group"> <span class="input-group-addon" title="失效时间"> <i class="fa fa-calendar-times-o"></i> </span> <input type="datetime-local" class="form-control" data-field="lifetime_end" step="1" value="'+
((__t=(lifetime_end))==null?'':__t)+
'"> </div> <div class="input-group" style="width: 150px"> <span class="input-group-addon" title="播放时长"> <i class="glyphicon glyphicon-time"></i> </span> <div class="program-duration-container"></div> </div> <div class="input-group" style="width: 100px"> <span class="input-group-addon" title="播放次数"> <i class="glyphicon glyphicon-time"></i> </span> <input type="number" class="form-control" data-field="count" value="'+
((__t=(count))==null?'':__t)+
'"> </div> </div> <div class="channel-program-body"> <div class="channel-program-layout"> <div class="channel-program-layout-header"> <span class="channel-program-layout-header-info">模版:'+
((__t=(layout.name))==null?'':__t)+
'</span> <span class="channel-program-layout-header-info">宽:'+
((__t=(layout.width))==null?'':__t)+
'</span> <span class="channel-program-layout-header-info">高:'+
((__t=(layout.height))==null?'':__t)+
'</span> </div> <div class="channel-program-layout-body"> </div> <div class="channel-program-layout-footer"> <ul></ul> </div> </div> <div class="channel-program-widget"> 正在加载数据 </div> </div> <script type="text/javascript">(function (obj,hint){\r\n\r\n    function getLength(str){  \r\n            var realLength = 0;  \r\n            for (var i = 0; i < str.length; i++){  \r\n                var charCode = str.charCodeAt(i);\r\n                \r\n                if (charCode >= 0 && charCode <= 128)   \r\n                realLength += 1;  \r\n                else   \r\n                realLength += 2;\r\n\r\n            }\r\n\r\n            return realLength;  \r\n        }  \r\n\r\n        //get name\r\n        var $obj = $(obj);\r\n        var t = $obj.val();\r\n        var length = getLength(t);\r\n        var width = parseFloat($obj.css(\'font-size\'));\r\n        var left = length * width/2 +57;\r\n\r\n        //get hint\r\n        var $hint = $(hint);\r\n        \r\n        //ux fix\r\n        $obj.css(\'cursor\',\'pointer\');\r\n\r\n        //reposition\r\n        $hint.css(\'left\',left);\r\n\r\n        //event\r\n        $hint.click(function(){\r\n            $obj.focus().val(t);\r\n        });\r\n        $obj.focus(function(){\r\n            $hint.css(\'display\',\'none\');\r\n            $obj.css(\'cursor\',\'\');\r\n        });\r\n        $obj.blur(function(){\r\n            $hint.css(\'display\',\'\');\r\n            $obj.css(\'cursor\',\'pointer\');\r\n            //reposition\r\n            var t = $obj.val();\r\n            var length = getLength(t);\r\n            var width = parseFloat($obj.css(\'font-size\'));\r\n            var left = length * width/2 +57;\r\n            $hint.css(\'left\',left);\r\n        });\r\n    }(\'.direct-name-003\',\'.direct-name-003-hint\'))</script>';
}
return __p;
};
exports['channel_edit_program_list_item']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<li class="program-list-item" data-id="'+
((__t=(id))==null?'':__t)+
'"> <div style="'+
((__t=(backgroundStyle))==null?'':__t)+
'"></div> <span>'+
((__t=(name))==null?'':__t)+
'</span> </li>';
}
return __p;
};
exports['channel_edit_timer']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="modal-content" id="channel-editor-timer"> <div class="modal-header"> <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title"> 定时触发 </h4> </div> <div class="modal-body timer-container"> <div class="granularity-selector btn-group" style=""> <button class="btn btn-default btn-sm" data-selector="month" style="width: 143px">年</button> <button class="btn btn-default btn-sm" data-selector="date" style="width: 143px">月</button> <button class="btn btn-default btn-sm" data-selector="day" style="width: 143px">周</button> <button class="btn btn-default btn-sm" data-selector="everyday" style="width: 143px">天</button> </div> <div class="month-selector"> <label>每年...月</label> ';
 if (months.length === 12) { 
__p+=' <input type="checkbox" class="check-all-month" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox" class="check-all-month"> ';
 } 
__p+=' <ul style="padding:0"><!-- <label>按月选择</label> --> ';
 var numbers = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","二十一","二十二","二十三","二十四","二十五","二十六","二十七","二十八","二十九","三十","三十一"]; 
__p+=' ';
 for ( var i = 0; i < 12; i++) { 
__p+=' <li data-id="'+
((__t=(i+1))==null?'':__t)+
'" data-selector="month" style="width: 80px; text-indent:8px"> <label> ';
 if (months.indexOf(i+1) !== -1) { 
__p+=' <input type="checkbox" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox"> ';
 } 
__p+=' '+
((__t=(numbers[i] + '月'))==null?'':__t)+
' </label> </li> ';
 } 
__p+=' </ul> </div> <div class="date-selector"> <label>每月第...天</label> ';
 if (dates.length === 31) { 
__p+=' <input type="checkbox" class="check-all-date" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox" class="check-all-date"> ';
 } 
__p+=' <ul style="padding:0"><!-- <label>按天选择</label> --> ';
 for ( var i = 0; i < 31; i++) { 
__p+=' <li data-id="'+
((__t=(i+1))==null?'':__t)+
'" data-selector="date" style="width: 50px; text-align: center"> <label> ';
 if (dates.indexOf(i+1) !== -1) {
__p+=' <input type="checkbox" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox"> ';
 } 
__p+=' '+
((__t=((i < 9) ? '0' + (i + 1) : (i + 1)))==null?'':__t)+
' </label> </li> ';
 } 
__p+=' </ul> </div> <div class="day-selector"> <label>每周...</label> ';
 if (days.length === 7) { 
__p+=' <input type="checkbox" class="check-all-day" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox" class="check-all-day"> ';
 } 
__p+=' <br> <ul style="padding: 0"><!-- <label>按天选择</label> --> ';
 for ( var i = 0; i < 7; i++) { 
__p+=' <li data-id="'+
((__t=(i+1))==null?'':__t)+
'" data-selector="day"> <label style="width: 76px; text-align: center"> ';
 if (days.indexOf(i+1) !== -1) {
__p+=' <input type="checkbox" checked="checked"> ';
 } else { 
__p+=' <input type="checkbox"> ';
 } 
__p+=' '+
((__t=('周' + numbers[i]))==null?'':__t)+
' </label> </li> ';
 } 
__p+=' </ul> </div> <div class="time-selector"> <div class="hour-selector" style="margin-bottom: 15px"> <label>每天第...小时</label> <select class="form-control select2" multiple="multiple" data-selector="hour" style="height: 36px"> ';
 if (hours.length === 24) { 
__p+=' <option value="*" selected="selected">每小时</option> ';
 } else { 
__p+=' <option value="*">每小时</option> ';
 } 
__p+=' ';
 for ( var i = 0; i < 24; i++) { if (hours.indexOf(i) !== -1 && hours.length !== 24) { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'" selected="selected">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 } else { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 }} 
__p+=' </select> </div> <div class="minute-selector" style="margin-bottom: 15px"> <label>每小时第...分钟</label> <select class="form-control select2" multiple="multiple" data-selector="minute" style="height: 36px"> ';
 if (minutes.length === 60) { 
__p+=' <option value="*" selected="selected"> ';
 } else { 
__p+=' <option value="*">每分钟</option> ';
 } 
__p+=' ';
 for ( var i = 0; i < 60; i++) { if (minutes.indexOf(i) !== -1 && minutes.length !== 60) { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'" selected="selected">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 } else { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 }} 
__p+=' </option></select> </div> <div class="second-selector" style="margin-bottom: 15px"> <label>每分钟第...秒</label> <select class="form-control select2" multiple="multiple" data-selector="second" style="height: 36px"> ';
 if (seconds.length === 60) { 
__p+=' <option value="*" selected="selected">每秒</option> ';
 } else { 
__p+=' <option value="*">每秒</option> ';
 } 
__p+=' ';
 for ( var i = 0; i < 60; i++) { if (seconds.indexOf(i) !== -1 && seconds.length !== 60) { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'" selected="selected">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 } else { 
__p+=' <option value="'+
((__t=(i))==null?'':__t)+
'">'+
((__t=((i < 10) ? '0' + i : i))==null?'':__t)+
'</option> ';
 }} 
__p+=' </select> </div> </div> </div> <div class="modal-footer"> <button id="single-term-class-save" type="button" class="btn btn-save btn-primary pull-right">保存</button> </div> </div>';
}
return __p;
};
exports['channel_edit_widget_item']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<li data-id="'+
((__t=(id))==null?'':__t)+
'"> <i class="wiget-mark" style="background-color: '+
((__t=(background_color))==null?'':__t)+
'"></i> <div>'+
((__t=(name))==null?'':__t)+
'</div> </li>';
}
return __p;
};
exports['channel_table_row']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<tr data-channel-id="'+
((__t=(id))==null?'':__t)+
'"> <td style="width: 32px"><input type="checkbox"></td> <td><a href="#channel/edit?id='+
((__t=(id))==null?'':__t)+
'" class="btn-channel-detail"><b><i class="fa fa-newspaper-o"></i>&nbsp&nbsp'+
((__t=(name))==null?'':__t)+
'</b></a></td> <td>调度类型:'+
((__t=(schedule_type))==null?'':__t)+
'</td> <td>调度参数:'+
((__t=(schedule_params))==null?'':__t)+
'</td> <td>版本:'+
((__t=(version))==null?'':__t)+
'</td><!-- <td>编辑</td> --> </tr>';
}
return __p;
};
exports['common_duration_input']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="duration-input-container form-control"> <input type="text" class="duration-input-text"> <input type="number" class="duration-input-hidden" value="'+
((__t=(duration))==null?'':__t)+
'"> <span class="duration-input-hour duration-display-item">'+
((__t=(hour))==null?'':__t)+
'</span> <span class="duration-display-item">:</span> <span class="duration-input-minute duration-display-item">'+
((__t=(minute))==null?'':__t)+
'</span> <span class="duration-display-item">:</span> <span class="duration-input-second duration-display-item">'+
((__t=(second))==null?'':__t)+
'</span> </div>';
}
return __p;
};
exports['layout_edit_main']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="layout-editor-wrapper" style="min-width: 1080px"> <div class="layout-editor-header"> <button type="button" class="header-button-left glyphicon glyphicon-chevron-left btn-layout-editor-back"></button> <h1 class="header-title">编辑模版</h1><!-- <button type="button" class="header-button-right glyphicon glyphicon-floppy-disk">保存</button> --> </div> <div class="layout-editor-body"> <div class="row" style="height: 100%"> <div class="col-md-12" style="height: 100%"> <div class="box" style="height: 100%"><!-- header --> <div class="box-header with-border"><!--edit--> <ul class="layout-editor-properties"> </ul> <button type="button" class="btn btn-default btn-layout-editor-exit">退出编辑</button> <button type="button" class="btn btn-primary btn-layout-editor-saveExit">保存并退出</button> <button type="button" class="btn btn-primary btn-layout-editor-save">保存</button> </div> <div class="box-body" style="position: absolute; width: 100%; top: 58px; bottom: 47px"><!-- toolbar --> <div class="layout-editor-toolbar"> <label>&nbsp工具栏</label> <div class="div-line-i" style="width: 76px"></div> <div class="btn-group-vertical"> <button data-widget-id="video" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon glyphicon-film"></i>&nbsp&nbsp视频 </button> <button data-widget-id="image" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon-picture"></i>&nbsp&nbsp图片 </button> <button data-widget-id="html" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon-font"></i>&nbsp&nbsp文本 </button> <button data-widget-id="clock" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon-time"></i>&nbsp&nbsp时钟 </button> <button data-widget-id="weather" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon-cloud"></i>&nbsp&nbsp天气 </button> </div> <div class="btn-group-vertical" style="margin-top: 15px"> <button data-widget-id="audio" class="btn btn-default btn-add-widget"> <i class="glyphicon glyphicon-music"></i>&nbsp&nbsp音乐 </button> </div> <div class="btn-group-vertical" style="margin-top: 15px"> <button class="btn btn-default btn-layout-editor-delete-widget"> <i class="glyphicon glyphicon-trash"></i>&nbsp&nbsp删除 </button> </div> </div><!-- canvas --> <div class="layout-editor-canvas-title"> <label>&nbsp画布区</label> <div class="div-line-i"></div> </div> <div class="layout-editor-canvas"></div><!-- widget --> <div class="layout-editor-widget"> <label>&nbsp控件属性</label> <div class="div-line-i"></div><!-- propoties --> <ul class="layout-editor-widget-properties"> </ul><!-- layout --> <div class="layout-editor-widgets"></div> </div> </div><!-- footer --> <div class="box-footer layout-editor-footer" style="position: absolute; bottom: 0; width: 100%"> <small class="tips">&nbsp&nbsp&nbspStep1:在工具栏中点击想要创建的控件&nbsp&nbsp&nbspStep2：在画布上拖拽画出大小&nbsp&nbsp&nbspStep3：拖拽调整大小和位置，也可以在右侧属性栏输入数值&nbsp&nbsp&nbsp（音乐控件不占面积，可点击直接添加）</small> </div> </div><!-- box --> </div> </div> </div> </div>';
}
return __p;
};
exports['layout_edit_property']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<small class="direct-name-001-hint direct-name-hint" style="top: 10px; width: 30px">编辑</small> <input class="form-control layout-edit-propoties-name direct-name-001" type="text" value="'+
((__t=(name))==null?'':__t)+
'" data-property-id="layout-name" style="margin-left: 15px; font-weight: bold"> <div class="input-group layout-editor-property" style="width: 101px"> <label class="col-sm-3 control-label property-name-inline">宽</label> <input class="form-control" type="text" value="'+
((__t=(width))==null?'':__t)+
'" data-property-id="layout-width" style="width: 61px;top: 4px; height: 28px; float: right"> </div> <div class="input-group layout-editor-property" style="margin-left: 15px; width: 101px"> <label class="col-sm-3 control-label property-name-inline">高</label> <input class="form-control" type="text" value="'+
((__t=(height))==null?'':__t)+
'" data-property-id="layout-height" style="width: 61px;top: 4px; height: 28px; float: right"> </div> <div class="input-group layout-editor-property" style="margin-left: 32px; width: 72px"> <label class="control-label property-name-inline">背景色</label> <input class="form-control" type="color" value="'+
((__t=(background_color))==null?'':__t)+
'" data-property-id="layout-bg-color" style="width: 25px;top: 4px; height: 28px;float: right; padding: 3px"> </div> <div class="col-xs-2 layout-editor-property"><!-- <label class="control-label property-name-inline">背景图</label> --> <div class="btn-group" style="width: 200px"> <button type="button" class="btn-layout-editor-background btn btn-primary" style="width: auto">添加背景图</button> <button type="button" class="btn-layout-editor-cancelbackground btn btn-default" style="width: auto">取消背景图</button> </div> </div> <script type="text/javascript">function getLength(str){  \r\n		    var realLength = 0;  \r\n		    for (var i = 0; i < str.length; i++){  \r\n		        var charCode = str.charCodeAt(i);\r\n		        \r\n		        if (charCode >= 0 && charCode <= 128)   \r\n		        realLength += 1;  \r\n		        else   \r\n		        realLength += 2;\r\n\r\n		    }\r\n\r\n		    return realLength;  \r\n		}  \r\n\r\n\r\n	function directName(obj,hint){\r\n		//get name\r\n		var $obj = $(obj);\r\n		var t = $obj.val();\r\n		var length = getLength(t);\r\n		var width = parseFloat($obj.css(\'font-size\'));\r\n		var left = length * width/2 +47;\r\n\r\n		//get hint\r\n		var $hint = $(hint);\r\n		\r\n		//ux fix\r\n		$obj.css(\'cursor\',\'pointer\');\r\n\r\n		//reposition\r\n		$hint.css(\'left\',left);\r\n\r\n		//event\r\n		$hint.click(function(){\r\n			$obj.focus().val(t);\r\n		});\r\n		$obj.focus(function(){\r\n			$hint.css(\'display\',\'none\');\r\n			$obj.css(\'cursor\',\'\');\r\n		});\r\n		$obj.blur(function(){\r\n			$hint.css(\'display\',\'\');\r\n			$obj.css(\'cursor\',\'pointer\');\r\n			//reposition\r\n			var t = $obj.val();\r\n			var length = getLength(t);\r\n			var width = parseFloat($obj.css(\'font-size\'));\r\n			var left = length * width/2 +47;\r\n			$hint.css(\'left\',left);\r\n		});\r\n	}\r\n\r\n	directName(\'.direct-name-001\',\'.direct-name-001-hint\');</script>';
}
return __p;
};
exports['layout_edit_widgets']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul> ';
 for (var i = widgets.length - 1; i >= 0; i--) { var el = widgets[i]; 
__p+=' ';
 if (el.focused) { 
__p+=' <li data-widget-index="'+
((__t=(i))==null?'':__t)+
'" class="focused"> <i style="background-color: '+
((__t=(el.background_color))==null?'':__t)+
'" class="wiget-mark"></i> ';
 } else { 
__p+=' </li><li data-widget-index="'+
((__t=(i))==null?'':__t)+
'"> ';
 } 
__p+=' <i style="background-color: '+
((__t=(el.background_color))==null?'':__t)+
'" class="wiget-mark"></i> <div>'+
((__t=(el.name))==null?'':__t)+
'</div> </li> ';
 }  
__p+=' </ul>';
}
return __p;
};
exports['layout_edit_widget_property']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!-- <label>\r\n        <i class="glyphicon glyphicon glyphicon-film"></i>&nbsp视频控件\r\n    </label>\r\n--> <li style="display: none"> <label>当前控件:</label> <input type="text" readonly="readonly" value="'+
((__t=(type))==null?'':__t)+
'"> </li> <div class="input-group" style="width: 115px; display: inline; float: left"> <label class="col-sm-3 control-label property-name-inline" style="padding-left: 0px; width: 16px">x</label> <input type="number" value="'+
((__t=(left))==null?'':__t)+
'" class="form-control" data-property-id="widget-left" style="margin-left: 4px; top:4px; width: 80px; height: 28px; line-height: 1"> </div> <div class="input-group" style="width: 100px;display: inline; float: left"> <label class="col-sm-3 control-label property-name-inline" style="padding-left: 0px; width: 16px">y</label> <input type="number" value="'+
((__t=(top))==null?'':__t)+
'" class="form-control" data-property-id="widget-top" style="margin-left: 4px; top:4px; width: 80px; height: 28px; line-height: 1"> </div> <div class="input-group" class="input-group" style="width: 115px; display: inline; float: left"> <label class="col-sm-3 control-label property-name-inline" style="padding-left: 0px; width: 16px">宽</label> <input type="number" value="'+
((__t=(width))==null?'':__t)+
'" class="form-control" data-property-id="widget-width" style="margin-left: 4px; top:4px; width: 80px; height: 28px; line-height: 1"> </div> <div class="input-group" style="width: 100px;display: inline; float: left"> <label class="col-sm-3 control-label property-name-inline" style="padding-left: 0px; width: 16px">高</label> <input type="number" value="'+
((__t=(height))==null?'':__t)+
'" class="form-control" data-property-id="widget-height" style="margin-left: 4px; top:4px; width: 80px; height: 28px; line-height: 1"> </div> <div class="input-group" style="width: 230px;display: inline; float: left; top: 4px"> <label class="col-sm-3 control-label property-name-inline" style="padding-left: 0px; width: 16px; margin-right: 4px; top: -4px">层</label> <button class="btn-layout-editor-zindex-increase btn btn-default btn-sm" style="width: 93px; margin-right:4px">上移一层</button> <button class="btn-layout-editor-zindex-decrease btn btn-default btn-sm" style="width: 93px">下移一层</button> </div> <!-- <li>\r\n    <button class="btn-layout-editor-delete-widget">删除控件</button>\r\n</li> -->';
}
return __p;
};
exports['layout_list_dialog']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="layout-list-dialog" class="modal-content"> <div class="modal-header"> <button type="button" class="btn btn-close close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h3 class="modal-title">选择模版</h3> </div> <div> <div class="box-header with-border"> <div class="has-feedback pull-right"> <input type="text" class="layout-list-search form-control input-sm" placeholder="搜索模版"> <span class="glyphicon glyphicon-search form-control-feedback"></span> </div> </div> <ul class="layout-list"> </ul> </div> <div class="text-center modal-footer"> <ul class="pagination layout-list-pager"> </ul> </div> </div>';
}
return __p;
};
exports['layout_list_dialog_item']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<li data-layout-id="'+
((__t=(id))==null?'':__t)+
'"> <div style="'+
((__t=(style))==null?'':__t)+
'"> </div> <span>'+
((__t=(name))==null?'':__t)+
'</span> </li>';
}
return __p;
};
exports['layout_table_row']=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<tr data-layout-id="'+
((__t=(id))==null?'':__t)+
'"> <td class="mod_checkbox" style="width: 32px"><input type="checkbox"></td> <td class="mod_name"><b><a href="#layout/edit?id='+
((__t=(id))==null?'':__t)+
'" class="btn-table-detail">'+
((__t=(name))==null?'':__t)+
'</a></b></td> <td class="mod_size_center">'+
((__t=(width))==null?'':__t)+
'×'+
((__t=(height))==null?'':__t)+
'</td><!--<td>'+
((__t=(height))==null?'':__t)+
'</td>--><!--<td>背景色:'+
((__t=(background_color))==null?'':__t)+
'</td>--> <td class="mod_user_center">'+
((__t=(operator))==null?'':__t)+
'</td> <td class="mod_create_time_center">'+
((__t=(create_time))==null?'':__t)+
'</td><!-- <td>编辑</td> --> </tr>';
}
return __p;
};});