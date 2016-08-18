define(function(require, exports, module) {
	
	var CONFIG = require('common/config'),
      UTIL = require("common/util.js");

  exports.classID;
  exports.className;
  exports.requireJS;

  var _workSeqments,
      _downloadSeqments,
      _restartTimer,
      _heartBeatPeriod,
      _mainServer,
      _programSync;

  exports.init = function() {

    inputInit();
    loadInfo();

    // 关闭
    $('#CC-close').click(function(){
      UTIL.cover.close();
    })

    // 保存
    $('#CC-save').click(function(){
      var upgradeURL = $.trim($('#CC-upgradeURL').val()),
          logURL = $.trim($('#CC-logURL').val()),
          vol = $('#CC-vol-slider').val(),
          workSwitch = ($("#CC-workSwitch").bootstrapSwitch('state'))?1:0,
          downloadSwitch = ($("#CC-downloadSwitch").bootstrapSwitch('state'))?1:0,
          restartSwitch = ($("#CC-restartSwitch").bootstrapSwitch('state'))?1:0,
          workWeekRepeat = new Array(),
          cityIDs = ($('#CC-city').val()===null?'':$('#CC-city').val().join());

      $('#CC-workWeekRepeat input[type="checkbox"]').each(function(i,e){
        if($(e)[0].checked){
          workWeekRepeat.push(i+1);
        }
      })

      var workStart = $('#CC-workStart').val(),
          workEnd = $('#CC-workEnd').val(),
          workDuration,
          downloadStart = $('#CC-downloadStart').val(),
          downloadEnd = $('#CC-downloadEnd').val(),
          downloadDuration,
          restartTime = $('#CC-restartTime').val(),
          downloadSeqments = {},
          workSeqments = {},
          restartTimer = {};

      // 校验
      // 工作区间
      if(workSwitch === 1){
        workSeqments.on = 1;
        if(workWeekRepeat.length === 0){
          alert('请选择工作区间重复周期');
          $('#CC-workWeekRepeat').focus();
          return;
        }
        if(workStart === ''){
          alert('请填入工作区间开始时间');
          $('#CC-workStart').focus();
          return;
        }

        if(!$('#CC-workStart').inputmask("isComplete")){
          alert('请填入正确的工作区间开始时间');
          $('#CC-workStart').focus();
          return;
        }

        if(workEnd === ''){
          alert('请填入工作区间结束时间');
          $('#CC-workEnd').focus();
          return;
        }

        if(!$('#CC-workEnd').inputmask("isComplete")){
          alert('请填入正确的工作区间结束时间');
          $('#CC-workEnd').focus();
          return;
        }

        workStart = workStart.split(':');
        workStart = new Date('2016-04-25 '+workStart[0]+':'+workStart[1]+':'+workStart[2]);

        workEnd = workEnd.split(':');
        workEnd = new Date('2016-04-25 '+workEnd[0]+':'+workEnd[1]+':'+workEnd[2]);

        workDuration = Math.ceil((workEnd - workStart)/1000);

        if((workEnd - workStart) < 0){
          alert('工作区间结束时间不能早于开始时间');
          $('#CC-workEnd').focus();
          return;
        }

        workSeqments.duration = workDuration;
        var s = workStart.getSeconds(),
            m = workStart.getMinutes(),
            h = workStart.getHours(),
            d = '*',
            M = '*',
            y = '*',
            w = workWeekRepeat.join(',');
        
        workSeqments.trigger = s + " " + m + " " + h + " " + d + " " + M + " " + y + " " + w;
        workSeqments = JSON.stringify(workSeqments);
      }
      else{
        workSeqments = JSON.parse(_workSeqments);
        workSeqments.on = 0;
        workSeqments = JSON.stringify(workSeqments);
      }


      // 下载区间
      if(downloadSwitch === 1){
        downloadSeqments.on = 1;
        
        if(downloadStart === ''){
          alert('请填入下载区间开始时间');
          $('#CC-downloadStart').focus();
          return;
        }

        if(!$('#CC-downloadStart').inputmask("isComplete")){
          alert('请填入正确的下载区间开始时间');
          $('#CC-downloadStart').focus();
          return;
        }

        if(downloadEnd === ''){
          alert('请填入下载区间结束时间');
          $('#CC-downloadEnd').focus();
          return;
        }

        if(!$('#CC-downloadEnd').inputmask("isComplete")){
          alert('请填入正确的下载区间结束时间');
          $('#CC-downloadEnd').focus();
          return;
        }

        downloadStart = downloadStart.split(':');
        downloadStart = new Date('2016-04-25 '+downloadStart[0]+':'+downloadStart[1]+':'+downloadStart[2]);

        downloadEnd = downloadEnd.split(':');
        downloadEnd = new Date('2016-04-25 '+downloadEnd[0]+':'+downloadEnd[1]+':'+downloadEnd[2]);

        downloadDuration = Math.ceil((downloadEnd - downloadStart)/1000);
        if(downloadDuration < 0){
          downloadEnd.setTime(downloadEnd.getTime()+24*60*60*1000);
        }
        downloadDuration = Math.ceil((downloadEnd - downloadStart)/1000);

        downloadSeqments.duration = downloadDuration;
        var s = downloadStart.getSeconds(),
            m = downloadStart.getMinutes(),
            h = downloadStart.getHours(),
            d = '*',
            M = '*',
            y = '*',
            w = '*';
        
        downloadSeqments.trigger = s + " " + m + " " + h + " " + d + " " + M + " " + y + " " + w;
        downloadSeqments = JSON.stringify(downloadSeqments);
      }
      else{
        downloadSeqments = JSON.parse(_downloadSeqments);
        downloadSeqments.on = 0;
        downloadSeqments = JSON.stringify(downloadSeqments);
      }
      
      // 定时重启
      if(restartSwitch === 1){
        restartTimer.on = 1;
        
        if(restartTime === ''){
          alert('请填入定时重启时间');
          $('#CC-restartTime').focus();
          return;
        }

        if(!$('#CC-restartTime').inputmask("isComplete")){
          alert('请填入正确的定时重启时间');
          $('#CC-restartTime').focus();
          return;
        }

        restartTime = restartTime.split(':');
        var s = restartTime[2],
            m = restartTime[1],
            h = restartTime[0],
            d = '*',
            M = '*',
            y = '*',
            w = '*';
        
        restartTimer.trigger = s + " " + m + " " + h + " " + d + " " + M + " " + y + " " + w;
        restartTimer = JSON.stringify(restartTimer);

      }
      else{
        restartTimer = JSON.parse(_restartTimer);
        restartTimer.on = 0;
        restartTimer = JSON.stringify(restartTimer);
      }

      
      saveTermClassConfig();

      function saveTermClassConfig(){

        var data = {
          "project_name": CONFIG.projectName,
          "action": "changeCategoryConfig",
          "categoryID": exports.classID,
          "config": {
              "DownloadSeqments": downloadSeqments, 
              "WorkSeqments": workSeqments,
              "UpgradeURL": upgradeURL, 
              "Volume": vol, 
              "HeartBeat_Period": _heartBeatPeriod,
              "CityIDs": cityIDs, 
              "MainServer": _mainServer, 
              "RestartTimer": restartTimer, 
              "ProgramSync": _programSync, 
              "LogURL": logURL
          }
        }
        
        $('#CC_waiting').show();

        UTIL.ajax('POST', 
          CONFIG.serverRoot + '/backend_mgt/v2/termcategory', 
          JSON.stringify(data), 
          function(data){
            if(data.rescode === '200'){
              alert('保存成功');
              require(exports.requireJS).loadTermList();
              UTIL.cover.close();
            }else{
              $('#CC_waiting').hide();
              alert('保存终端分类配置失败' + data.errInfo);
            }
          }
        )
      }
    })  
  }

  function inputInit(){

    $.fn.bootstrapSwitch.defaults.onText = '开';
    $.fn.bootstrapSwitch.defaults.offText = '关';

    $("#CC-workSwitch").bootstrapSwitch();
    $("#CC-downloadSwitch").bootstrapSwitch();
    $("#CC-restartSwitch").bootstrapSwitch();

    $('#CC-workSwitch').on('switchChange.bootstrapSwitch', function(event, state) {
      if(state){
        $('#CC-workWeekRepeatArea').css('display','block');
        $('#CC-workArea').css('display','block');
      }else{
        $('#CC-workWeekRepeatArea').css('display','none');
        $('#CC-workArea').css('display','none');
      }
    });

    $("#CC-downloadSwitch").on('switchChange.bootstrapSwitch', function(event, state) {
      if(state){
        $('#CC-downloadArea').css('display','block');
      }else{
        $('#CC-downloadArea').css('display','none');      
      }
    });

    $("#CC-restartSwitch").on('switchChange.bootstrapSwitch', function(event, state) {
      if(state){
        $('#CC-restartArea').css('display','block');
      }else{
        $('#CC-restartArea').css('display','none');      
      }
    });

    $('#CC-workWeekRepeat input[type="checkbox"]').iCheck({
      checkboxClass: 'icheckbox_minimal-blue'
    })
    $('#CC-workStart').inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
    $('#CC-workEnd').inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
    $('#CC-downloadStart').inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
    $('#CC-downloadEnd').inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
    $('#CC-restartTime').inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});
  }

  function loadInfo(){

    $('#CC-title').html(exports.className);
    loadCityInfo();

    function loadCityInfo(){
      var data = {
        "project_name": CONFIG.projectName,
        "action": "getCityList",
        "Pager":{
          "total":-1,
          "per_page":100000000,
          "page":1,
          "orderby":"",
          "sortby":"",
          "keyword":""
        }
      }  

      UTIL.ajax('POST', 
        CONFIG.serverRoot + '/backend_mgt/v2/city', 
        JSON.stringify(data), 
        function(data){
          if(data.rescode === '200'){
            var citys = data.cityList;
            $('#CC-city').empty();
            for(var i = 0; i < citys.length; i++){
              $('#CC-city').append('<option value = "'+citys[i].AreaID+'">'+citys[i].City+'（'+citys[i].CityEng+'）</option>');
            }
            loadConfigInfo();
          }else{
            alert('获取城市信息失败');
          }
        }
      );
    }

    function loadConfigInfo(){
      var data = {
        "project_name": CONFIG.projectName,
        "action": "getCategoryConfig",
        "categoryID": exports.classID
      }

      UTIL.ajax(
        'POST', 
        CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
        JSON.stringify(data),
        function(data){
          if(data.rescode !== '200'){
            alert('获取终端分类配置信息失败');
          }else{
            $('#CC-Channel').html(data.config.Channel_Name);
            $('#CC-PreChannel').html(data.config.PreDownload_Channel_Name);
            $('#CC-upgradeURL').val(data.config.UpgradeURL);
            $('#CC-logURL').val(data.config.LogURL);
            
            $( "#CC-vol-slider" ).slider({
              max: 100,
              value: data.config.Volume
            });

            var config = data.config;

            // 心跳
            _heartBeatPeriod = config.HeartBeat_Period;

            // MainServer
            _mainServer = config.MainServer;

            // _programSync
            _programSync = config.ProgramSync;

            // _workSeqments
            _workSeqments = config.WorkSeqments;

            // _downloadSeqments
            _downloadSeqments = config.DownloadSeqments;

            // _restartTimer
            _restartTimer = config.RestartTimer;

            // 加载城市信息
            for(var i = 0; i<config.Cities.length; i++){
              $('#CC-city > option:nth(0)').attr('value')
              $("#CC-city").find("[value$='"+config.Cities[i].ID+"']").attr('selected',true);
            } 
            $("#CC-city").select2();

            //工作区间
            var workSeqments = JSON.parse(config.WorkSeqments);
            
            if(workSeqments.on === 0){
              $("#CC-workSwitch").bootstrapSwitch('state', false);
            }
            
            var trigger = workSeqments.trigger.split(" ");

            //week
            var week = trigger[6];
            if(week !== '*'){
              week = week.split(',');
              for(var i=0; i< week.length; i++){
                $('#CC-workWeekRepeat input[type$=checkbox]:nth('+(Number(week[i])-1)+')').iCheck('check');
              }
            }

            //starttime
            var hour = trigger[2];
            var minute = trigger[1];
            var second = trigger[0];
            if(hour !== '*' || minute !== '*' || second !== '*'){
              hour = (hour === '*')?'00':((hour<10)?'0'+hour:hour);
              minute = (minute === '*')?'00':((minute<10)?'0'+minute:minute);
              second = (second === '*')?'00':((second<10)?'0'+second:second);
              $('#CC-workStart').val(hour+':'+minute+':'+second);
              
              //endtime
              var duration = workSeqments.duration;
              var start = new Date('2016-04-24 '+hour+':'+minute+':'+second);
              var end = new Date();
              end.setTime(start.getTime()+duration*1000);
              var end_hour = end.getHours();
              var end_minute = end.getMinutes();
              var end_second = end.getSeconds();
              end_hour = (end_hour === '*')?'00':((end_hour<10)?'0'+end_hour:end_hour);
              end_minute = (end_minute === '*')?'00':((end_minute<10)?'0'+end_minute:end_minute);
              end_second = (end_second === '*')?'00':((end_second<10)?'0'+end_second:end_second);
              $('#CC-workEnd').val(end_hour+':'+end_minute+':'+end_second);
            }

            // 下载区间
            var DownloadSeqments = JSON.parse(config.DownloadSeqments);

            if(DownloadSeqments.on === 0){
              $("#CC-downloadSwitch").bootstrapSwitch('state', false);
            }
          
            var trigger = DownloadSeqments.trigger.split(" ");

            //starttime
            var hour = trigger[2];
            var minute = trigger[1];
            var second = trigger[0];
            if(hour !== '*' || minute !== '*' || second !== '*'){
              hour = (hour === '*')?'00':((hour<10)?'0'+hour:hour);
              minute = (minute === '*')?'00':((minute<10)?'0'+minute:minute);
              second = (second === '*')?'00':((second<10)?'0'+second:second);
              $('#CC-downloadStart').val(hour+':'+minute+':'+second);
            
              //endtime
              var duration = DownloadSeqments.duration;
              var start = new Date('2016-04-24 '+hour+':'+minute+':'+second);
              var end = new Date();
              end.setTime(start.getTime()+duration*1000);
              var end_hour = end.getHours();
              var end_minute = end.getMinutes();
              var end_second = end.getSeconds();
              end_hour = (end_hour === '*')?'00':((end_hour<10)?'0'+end_hour:end_hour);
              end_minute = (end_minute === '*')?'00':((end_minute<10)?'0'+end_minute:end_minute);
              end_second = (end_second === '*')?'00':((end_second<10)?'0'+end_second:end_second);
              $('#CC-downloadEnd').val(end_hour+':'+end_minute+':'+end_second);
            }
          

            // 定时重启
            var RestartTimer = JSON.parse(config.RestartTimer);

            if(RestartTimer.on === 0){
              $("#CC-restartSwitch").bootstrapSwitch('state', false);
            }
            
            var trigger = RestartTimer.trigger.split(" ");

            //starttime
            var hour = trigger[2];
            var minute = trigger[1];
            var second = trigger[0];
            if(hour !== '*' || minute !== '*' || second !== '*'){
              hour = (hour === '*')?'00':((hour<10)?'0'+hour:hour);
              minute = (minute === '*')?'00':((minute<10)?'0'+minute:minute);
              second = (second === '*')?'00':((second<10)?'0'+second:second);
              $('#CC-restartTime').val(hour+':'+minute+':'+second);
            }
          
          }
        }
      );
    }
  }

	
});
