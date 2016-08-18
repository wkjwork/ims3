'use strict';

define(function (require, exports, module) {

    /**
     * 声明依赖的所有模块
     */
    var templates = require('common/templates'),
        config = require('common/config'),
        util = require('common/util'),
        crud = require('common/crud'),
        toast = require('common/toast'),
        layoutDialog = require('pages/layout/list_dialog'),
        programCtrl = require('pages/channel/program'),
        getClassAndTerm = require('pages/terminal/getTermClassAndTerm.js');

    /**
     * 全局配置
     */
    var projectName = config.projectName,
        requestUrl = config.serverRoot,
        db = null,
        channelId = null,
        programHandle = null,
        /**
         * 保存常规节目的序列
         */
        regularSortable = null,
        /**
         * 保存定时节目的序列
         */
        timedSortable = null;

    /**
     * 初始化数据库
     */
    function configDatabase() {
        try {
            db.rollback();
        } catch (err) {
        }
        try {
            db.drop('channel');
            db.drop('program');
            db.drop('layout');
            db.drop('widget');
            db.drop('material');
        } catch (err) {
        }
        db.create('channel', [
            {name: 'id', type: 'number', autoIncrement: true},
            {name: 'name', type: 'string'},
            {name: 'name_eng', type: 'string'},
            {name: 'overall_schedule_params', type: 'string'},
            {name: 'overall_schedule_type', type: 'number'},
            {name: 'version', type: 'number'}
        ]);
        db.create('program', [
            {name: 'id', type: 'number', autoIncrement: true},
            {name: 'template_id', type: 'number'},
            {name: 'is_time_segment_limit', type: 'number'},
            {name: 'layout_id', type: 'number'},
            {name: 'lifetime_start', type: 'string'},
            {name: 'lifetime_end', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'name_eng', type: 'string'},
            {name: 'schedule_params', type: 'string'},
            {name: 'schedule_type', type: 'string'},
            {name: 'sequence', type: 'number'},
            {name: 'time_segment_duration', type: 'number'},
            {name: 'time_segment_start', type: 'string'}
        ]);
        db.create('layout', [
            {name: 'id', type: 'number'},
            {name: 'background_color', type: 'string'},
            {name: 'background_image_mid', type: 'number'},
            {name: 'background_image_url', type: 'string'},
            {name: 'bottom_margin', type: 'number'},
            {name: 'download_auth_type', type: 'string'},
            {name: 'top_margin', type: 'number'},
            {name: 'left_margin', type: 'number'},
            {name: 'right_margin', type: 'number'},
            {name: 'width', type: 'number'},
            {name: 'height', type: 'number'},
            {name: 'name', type: 'string'},
            {name: 'name_eng', type: 'string'}
        ]);
        db.create('widget', [
            {name: 'id', type: 'number', autoIncrement: true},
            {name: 'program_id', type: 'number'},
            {name: 'program_template_id', type: 'number'},
            {name: 'layout_widget_id', type: 'number'},
            {name: 'layout_id', type: 'number'},
            {name: 'type_id', type: 'number'},
            {name: 'type', type: 'string'},
            {name: 'type_name', type: 'string'},
            {name: 'material', type: 'string'},
            {name: 'width', type: 'number'},
            {name: 'height', type: 'number'},
            {name: 'left', type: 'string'},
            {name: 'style', type: 'string'},
            {name: 'top', type: 'number'},
            {name: 'overall_schedule_params', type: 'string'},
            {name: 'overall_schedule_type', type: 'string'},
            {name: 'z_index', type: 'number'}
        ]);
        db.create('material', [
            {name: 'id', type: 'number', autoIncrement: true},
            {name: 'widget_id', type: 'number'},
            {name: 'is_time_segment_limit', type: 'number'},
            {name: 'lifetime_start', type: 'string'},
            {name: 'lifetime_end', type: 'string'},
            {name: 'resource_id', type: 'number'},
            {name: 'name', type: 'string'},
            {name: 'name_eng', type: 'string'},
            {name: 'schedule_params', type: 'string'},
            {name: 'schedule_type', type: 'string'},
            {name: 'sequence', type: 'number'},
            {name: 'time_segment_duration', type: 'number'},
            {name: 'time_segment_start', type: 'string'},
            {name: 'type_id', type: 'number'},
            {name: 'type_name', type: 'string'},
            {name: 'download_auth_type', type: 'string'},
            {name: 'url', type: 'string'}
        ]);
        db.beginTransaction();
    }

    /**
     * 页面入口
     */
    exports.init = function () {
        programHandle = null;
        channelId = null;
        regularSortable = null;
        timedSortable = null;
        window.onpopstate = function () {
            onCloseEditor();
            window.onpopstate = undefined;
        };
        db = crud.Database.getInstance();
        configDatabase();
        var _channelId = Number(util.getHashParameters().id);
        loadChannelData(isNaN(_channelId) ? null : _channelId);
    };

    /**
     * 加载频道数据
     * @param _channelId
     */
    function loadChannelData(_channelId) {

        if (_channelId !== null) {

            channelId = _channelId;
            var deferredGet = $.Deferred(),
                deferredGetPrograms = $.Deferred(),
                dataGet = JSON.stringify({
                    action: 'Get',
                    Project: projectName
                }),
                dataGetPrograms = JSON.stringify({
                    action: 'GetPrograms',
                    project_name: projectName,
                    ChannelID: String(channelId)
                });

            $.when(deferredGet, deferredGetPrograms)
                .then(loadProgramData)
                .done(function () {
                    initChannelView(channelId);
                });

            util.ajax('post', requestUrl + '/backend_mgt/v2/channels', dataGetPrograms, function (res) {
                deferredGetPrograms.resolve(res.Programs);
            });

            util.ajax('post', requestUrl + '/backend_mgt/v2/channels/' + channelId, dataGet, function (res) {
                deferredGet.resolve(res.Channel[0]);
            });

        } else {

            db.collection('channel').insert({
                name: '新建频道',
                name_eng: 'new channel',
                overall_schedule_params: '{"Type":"Sequence"}',
                overall_schedule_type: 'Regular',
                version: 0
            });
            channelId = db.collection('channel').lastInsertId();

            initChannelView(channelId);

        }

    }

    /***************** get channel data ****************/

    function loadProgramData(channel, programs) {
        db.collection('channel').load(parseChannelData(channel));
        var promises = [];
        programs.map(parseProgramData).forEach(function (program) {
            db.collection('program').load(program);
            promises.push(loadWidgetData(program));
        });
        return $.when.apply($, promises);
    }

    function loadWidgetData(program) {
        var deferred = $.Deferred(),
            data = JSON.stringify({
                Action: 'GetControlBoxs',
                Project: projectName,
                ProgramID: program.id
            }),
            promises = [];
        util.ajax('post', requestUrl + '/backend_mgt/v2/programs', data, function (res) {
            if (Number(res.rescode) !== 200) {
                deferred.reject(res);
                return;
            }
            var layout = parseLayoutData(res.Layout);
            layout.id = program.layout_id;
            db.collection('layout').load(layout);
            var widgets = res.ControlBoxs.map(parseWidgetData);
            widgets.forEach(function (widget) {
                widget.layout_id = layout.id;
                widget.program_id = program.id;
                db.collection('widget').load(widget);
                promises.push(loadMaterialData(widget));
            });
            $.when.apply($, promises).done(function () {
                deferred.resolve();
            });
        });
        return deferred.promise();
    }

    function loadMaterialData(widget) {
        var deferred = $.Deferred(),
            data = JSON.stringify({
                Action: 'GetMaterials',
                Project: projectName,
                ControlBoxID: widget.id
            });
        util.ajax('post', requestUrl + '/backend_mgt/v1/controlboxes', data, function (res) {
            if (Number(res.rescode) !== 200) {
                deferred.reject(res);
                return;
            }
            var materials = res.Materials.map(parseMaterialData);
            materials.forEach(function (material) {
                db.collection('material').load(material);
            });
            deferred.resolve();
        });
        return deferred.promise();
    }

    function parseChannelData(data) {
        return {
            id: Number(data.ID),
            name: data.Name,
            name_eng: data.Name_eng,
            overall_schedule_params: data.Overall_Schedule_Paras,
            overall_schedule_type: data.Overall_Schedule_Type,
            version: data.Version
        };
    }

    function parseProgramData(data) {
        return {
            id: data.ID,
            template_id: data.ProgramTemplateID,
            is_time_segment_limit: data.Is_TimeSegment_Limit,
            layout_id: data.Layout_ID,
            lifetime_start: data.LifeStartTime,
            lifetime_end: data.LifeEndTime,
            name: data.Name,
            name_eng: '',
            schedule_params: data.Schedule_Paras,
            schedule_type: data.Schedule_Type,
            sequence: data.Sequence,
            time_segment_duration: data.TimeSegment_Duration,
            time_segment_start: data.TimeSegment_Start
        };
    }

    function parseLayoutData(data) {
        return {
            name: data.Name,
            name_eng: data.Name_eng,
            width: data.Width,
            height: data.Height,
            top_margin: data.TopMargin,
            left_margin: data.LeftMargin,
            right_margin: data.RightMargin,
            bottom_margin: data.BottomMargin,
            background_color: data.BackgroundColor,
            background_image_mid: data.BackgroundPic_MID,
            background_image_url: data.BackgroundPic_URL,
            download_auth_type: data.Download_Auth_Type
        };
    }

    function parseLayoutData2(data) {
        return {
            name: data.Name,
            name_eng: data.Name_eng,
            width: data.Width,
            height: data.Height,
            top_margin: data.TopMargin,
            left_margin: data.LeftMargin,
            right_margin: data.RightMargin,
            bottom_margin: data.BottomMargin,
            background_color: data.BackgroundColor,
            background_image_url: data.BackgroundPic.URL,
            download_auth_type: data.Download_Auth_Type,
            background_image_mid: 0
        };
    }

    function parseWidgetData(data) {
        return {
            id: data.ID,
            program_template_id: data.Program_ID,
            type_id: data.ControlBox_Type_ID,
            layout_widget_id: 0,
            type: data.ControlBox_Type,
            type_name: data.ControlBox_Type_Name,
            material: data.ControlBox_Material,
            width: data.Width,
            height: data.Height,
            left: data.Left,
            top: data.Top,
            overall_schedule_params: data.Overall_Schedule_Paras,
            overall_schedule_type: data.Overall_Schedule_Type,
            style: data.Style,
            z_index: data.Z
        };
    }

    function parseMaterialData(data) {
        var typeName = data.Type_Name;
        if (data.Is_Live != undefined) {
            if (data.Is_Live == 1) {
                typeName = "直播";
            }
        }
        return {
            id: data.ID,
            widget_id: data.ControlBox_ID,
            is_time_segment_limit: data.Is_TimeSegment_Limit,
            lifetime_start: data.LifeStartTime,
            lifetime_end: data.LifeEndTime,
            resource_id: data.Material_ID,
            name: data.Name,
            name_eng: data.Name_eng,
            schedule_params: data.Schedule_Paras,
            schedule_type: data.Schedule_Type,
            sequence: data.Sequence,
            time_segment_duration: data.TimeSegment_Duration,
            time_segment_start: data.TimeSegment_Start,
            type_id: data.Type_ID,
            type_name: typeName,
            download_auth_type: data.Download_Auth_Type,
            url: data.URL
        };
    }


    /******************  end of get channel data ***************/

    /**
     * 初始化频道页面
     */
    function initChannelView(channelId) {
        var channel = db.collection('channel').select({id: channelId})[0],
            programs = db.collection('program').select({});
        renderProgramList(channel, programs);
        registerEventListeners();
        //筛选审核状态
        if (util.getLocalParameter('config_checkSwitch') == '1') {
            $('#channel-editor-wrapper .btn-channel-editor-saveRelease').hide();
        } else {
            $('#channel-editor-wrapper .btn-channel-editor-saveSubmit').hide();
        }
    }

    /**
     * 初始化节目列表
     * @param json
     */
    function renderProgramList(channel, programs) {
        var data = {
            name: channel.name,
            overall_schedule_params: channel.overall_schedule_params,
            overall_schedule_type: channel.overall_schedule_type
        };
        $('#edit-page-container')
            .html(templates.channel_edit_main(data))
            .removeClass('none');
        var regularPrograms = [],
            timedPrograms = [],
            selectedProgram = null;
        programs.forEach(function (el) {
            if (el.schedule_type === 'Regular') {
                regularPrograms.push(el);
            } else {
                timedPrograms.push(el);
            }
        });
        if (regularPrograms.length > 0) {
            selectedProgram = regularPrograms[0];
        } else if (timedPrograms.length > 0) {
            selectedProgram = timedPrograms[0];
        }
        renderRegularProgramList(regularPrograms);
        renderTimedProgramList(timedPrograms);
        loadProgram(selectedProgram);
    }

    function renderRegularProgramList(programs) {
        var ul = $('#channel-editor-wrapper .channel-program-list-regular ul');
        ul.html('');
        programs.sort(function (a, b) {
            return a.sequence - b.sequence;
        });
        programs.forEach(function (el, idx, arr) {
            var layout = db.collection('layout').select({id: el.layout_id})[0];
            //var backgroundStyle = layout.background_image_url ?
            //'background-image:url(' + layout.background_image_url + ');background-repeat:no-repeat;background-size:100% 100%;background-position:center;' :
            //'background-color:' + layout.background_color;
            var backgroundStyle = 'background-image:url(' + getThumbnail(layout) + ');background-repeat:no-repeat;background-size:100% 100%;background-position:center;' ;
            var data = {
                id: el.id,
                name: el.name,
                backgroundStyle: backgroundStyle
            };
            ul.append(templates.channel_edit_program_list_item(data));
        });
        regularSortable = Sortable.create(ul[0], {
            onSort: onResortProgram
        });
    }

    function renderTimedProgramList(programs) {
        var ul = $('#channel-editor-wrapper .channel-program-list-timed ul');
        ul.html('');
        programs.sort(function (a, b) {
            return a.sequence - b.sequence;
        });
        programs.forEach(function (el, idx, arr) {
            var layout = db.collection('layout').select({id: el.layout_id})[0];
            var backgroundStyle = 'background-image:url(' + getThumbnail(layout) + ');background-repeat:no-repeat;background-size:100% 100%;background-position:center;' ;
            var data = {
                id: el.id,
                name: el.name,
                backgroundStyle: backgroundStyle
            };
            ul.append(templates.channel_edit_program_list_item(data));
        });
        timedSortable = Sortable.create(ul[0], {
            onSort: onTimedProgram
        });
    }

    function onProgramNameChange(data) {
        $('#channel-editor-wrapper .program-list-item[data-id="' + data.id + '"] .program-list-item-title').text(data.name);
    }


    var messageReceiver = (function () {
        return {
            subscribeEvent: function (handle) {
                programHandle = handle;
                handle.on('program_name.change', onProgramNameChange);
            }
        };
    }());

    /**
     * 加载节目
     * @param programId
     */
    function loadProgram(program) {
        $('#channel-editor-wrapper ul>li').removeClass('selected');
        if (program) {
            $('#channel-editor-wrapper ul>li[data-id=' + program.id + ']').addClass('selected');
        }
        if (programHandle) {
            programHandle.send('program.reset', null);
        }
        programCtrl.load(program, messageReceiver);
    }

    /**
     * 注册事件监听
     */
    function registerEventListeners() {
        $('#channel-editor-wrapper .btn-channel-editor-close').click(onCloseEditor, onBackList);
        $('#channel-editor-wrapper .btn-channel-editor-save').click(onSaveChannel);
        $('#channel-editor-wrapper .btn-channel-editor-saveRelease').click(function() {
            $(this).attr("release", "true");
            onSaveChannel();
        });
        $('#channel-editor-wrapper .btn-channel-editor-saveSubmit').click(function() {
            $(this).attr("audit", "true");
            onSubmitAudit();
        });
        //$('#channel-editor-wrapper .btn-channel-editor-publish').click(onPublishChannel);
        $('#channel-editor-wrapper .btn-program-new').click(function () {
            var type = this.getAttribute('data-program-type');
            layoutDialog.open();
            layoutDialog.onSelect(function (layoutId) {
                layoutDialog.close();
                onNewLayout(type, layoutId);
            });
        });
        $('#channel-editor-wrapper .btn-program-delete').click(function () {
            var deleteType = this.getAttribute('data-program-type'),
                selectedProgram = findSelectedProgram();
            if (!selectedProgram || selectedProgram.schedule_type !== deleteType) {
                alert('没有选中节目');
                return;
            };
            if (confirm("确定删除该节目？")) {
                onDeleteProgram(selectedProgram.id);
            }
        });
        $('#channel-editor-wrapper .channel-program-list ul').delegate('li', 'click', function () {
            var programId = Number(this.getAttribute('data-id')),
                program = db.collection('program').select({id: programId})[0];
            loadProgram(program);
        });
        $('#channel-editor-wrapper .channel-editor-property').change(function () {
            db.collection('channel').update({name: this.value}, {});
        });
        $('#channel-editor-wrapper .channel-program-schedule-type').change(function () {
            if (this.value === 'Sequence') {
                var s = 0;
                $('#channel-editor-wrapper .channel-program-list-regular li').each(function (idx, el) {
                    var id = parseInt(this.getAttribute('data-id'));
                    db.collection('program').update({sequence: s}, {id: id});
                    s++;
                });
            }
            var value = JSON.stringify({Type: this.value});
            db.collection('channel').update({overall_schedule_params: value}, {});
            programHandle.send('channel_overall_schedule_params.change', this.value);
        });
    }

    /**
     * 关闭页面的回调函数
     */
    function onCloseEditor() {
        try {
            db.rollback();
        } catch (err) {
        }
        try {
            db.drop('channel');
            db.drop('program');
            db.drop('layout');
            db.drop('widget');
            db.drop('material');
        } catch (err) {
        }
        $('#edit-page-container')
            .empty()
            .addClass('none');
        if (programHandle) {
            programHandle.send('program.reset', null);
        }
        if (location.hash.indexOf('?id=') === -1) {
            location.hash = '#channel/list';
        }
        window.onpopstate = undefined;
    }

    function onBackList() {
        location.hash = '#channel/list';
    }

    /**
     * 保存频道的回调函数
     */
    function onSaveChannel() {
        if (!inputCheck()) return;
        toast.show('温馨提示:正在保存，可能需要几分钟时间，请耐心等待');
        $('#channel-editor-wrapper .btn-channel-editor-save').attr("disabled", "disabled");
        setTimeout(removeDisabled, config.letTimeout);
        remoteCreateOrUpdateChannel()
            .then(remoteAddPrograms)
            .then(remoteUpdatePrograms)
            .then(remoteUpdateWidgets)
            .then(remoteAddMaterials)
            .then(remoteUpdateMaterials)
            .then(remoteDeleteMaterials)
            .then(remoteDeletePrograms)
            .then(remoteSubmitVersion)
            .done(onSaveChannelSuccess)
            .fail(onSaveChannelFail);
    }

    function removeDisabled() {
        $('#channel-editor-wrapper .btn-channel-editor-save').removeAttr("disabled");
    }

    /**************** start of saveChannel *****************/
    function remoteCreateOrUpdateChannel() {
        var deferred = $.Deferred(),
            newChannels = db.collection('channel').getLocalInsertedRows(),
            changedChannels = db.collection('channel').getLocalUpdatedRows(),
            data, channel, checkSwitch = Number(util.getLocalParameter('config_checkSwitch'));
        if (newChannels.length > 0) {
            channel = newChannels[0];
            data = JSON.stringify({
                project_name: projectName,
                action: 'Post',
                Data: {
                    Name: channel.name,
                    Name_eng: channel.name_eng,
                    Description: '',
                    Overall_Schedule_Type: channel.overall_schedule_type,
                    Overall_Schedule_Paras: channel.overall_schedule_params
                }
            });
            util.ajax('post', requestUrl + '/backend_mgt/v2/channels', data, function (res) {
                if (Number(res.rescode) !== 200) {
                    deferred.reject(res);
                    return;
                }
                channelId = Number(res.ChannelID);
                db.collection('channel').update({id: channelId}, {});
                deferred.resolve();
            });
        } else if (changedChannels.length > 0 && checkSwitch === 0) {
            channel = changedChannels[0];
            data = JSON.stringify({
                project_name: projectName,
                action: 'Put',
                Data: {
                    Name: channel.name,
                    Name_eng: channel.name_eng,
                    Overall_Schedule_Type: channel.overall_schedule_type,
                    Overall_Schedule_Paras: channel.overall_schedule_params,
                    Version: channel.version,
                    Description: ''
                }
            });
            util.ajax('post', requestUrl + '/backend_mgt/v2/channels/' + channel.id, data, function (res) {
                if (Number(res.rescode) !== 200) {
                    deferred.reject(res);
                    return;
                }
                deferred.resolve();
            });
        } else if (checkSwitch === 1) {

            data = JSON.stringify({
                project_name: projectName,
                action: 'setCheckLevel2Edit',
                ChannelIDs: [channelId]
            });

            channel = changedChannels[0];
            util.ajax('post', requestUrl + '/backend_mgt/v2/channels/' + channelId, data, function (res) {
                if (Number(res.rescode) !== 200) {
                    deferred.reject(res);
                    return;
                }
                if (changedChannels.length === 0) {
                    deferred.resolve();
                    return;
                }
                var data = JSON.stringify({
                    project_name: projectName,
                    action: 'Put',
                    Data: {
                        Name: channel.name,
                        Name_eng: channel.name_eng,
                        Overall_Schedule_Type: channel.overall_schedule_type,
                        Overall_Schedule_Paras: channel.overall_schedule_params,
                        Version: channel.version,
                        Description: ''
                    }
                });

                util.ajax('post', requestUrl + '/backend_mgt/v2/channels/' + channel.id, data, function (res) {
                    if (Number(res.rescode) !== 200) {
                        deferred.reject(res);
                        return;
                    }
                    deferred.resolve();
                });
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    }

    function remoteAddPrograms() {
        var deferred = $.Deferred(),
            newPrograms = db.collection('program').getLocalInsertedRows();
        if (newPrograms.length === 0) {
            deferred.resolve([]);
        } else {
            var successCount = 0,
                failed = false,
                generatedWidgets = [];
            newPrograms.forEach(function (program) {
                var data = JSON.stringify({
                        Project: projectName,
                        Action: 'Post',
                        Data: {
                            Name: program.name,
                            LifeStartTime: program.lifetime_start,
                            LifeEndTime: program.lifetime_end,
                            Channel_ID: channelId,
                            Name_eng: program.name_eng,
                            Description: '',
                            Public: 0,
                            Sequence: program.sequence,
                            Is_TimeSegment_Limit: program.is_time_segment_limit,
                            TimeSegment_Start: program.time_segment_start,
                            TimeSegment_Duration: program.time_segment_duration,
                            Schedule_Paras: program.schedule_params,
                            Schedule_Type: program.schedule_type,
                            Layout_ID: program.layout_id
                        }
                    }),
                    oldProgramId = program.id, oldTemplateId = program.template_id;
                util.ajax('post', requestUrl + '/backend_mgt/v2/programs', data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        deferred.reject(res);
                        failed = true;
                        return;
                    }
                    var programId = Number(res.ProgramID),
                        templateId = Number(res.ProgramTemplateID);
                    db.collection('program').update({id: programId}, {id: oldProgramId});
                    db.collection('widget').update({program_id: programId}, {program_id: oldProgramId});
                    db.collection('widget').update({program_template_id: templateId}, {program_template_id: oldTemplateId});
                    res.ControlBoxTypeIDMap.forEach(function (el) {
                        var oldWidgetId = db.collection('widget').select({
                            program_id: programId,
                            layout_widget_id: el.LayoutControlBoxID
                        })[0].id;
                        db.collection('widget').update({id: el.ProgramControlBoxID}, {id: oldWidgetId});
                        db.collection('material').update({widget_id: el.ProgramControlBoxID}, {widget_id: oldWidgetId});
                        var widget = db.collection('widget').select({id: el.ProgramControlBoxID})[0];
                        generatedWidgets.push(widget);
                    });
                    successCount++;
                    if (successCount === newPrograms.length) {
                        deferred.resolve(generatedWidgets);
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteUpdatePrograms(generatedWidgets) {
        var deferred = $.Deferred(),
            changedPrograms = db.collection('program').getLocalUpdatedRows();
        if (changedPrograms.length === 0) {
            deferred.resolve(generatedWidgets);
        } else {
            var successCount = 0, failed = false;
            changedPrograms.forEach(function (program) {
                var data = JSON.stringify({
                    Project: projectName,
                    Action: 'Put',
                    Data: {
                        Name: program.name,
                        LifeStartTime: program.lifetime_start,
                        LifeEndTime: program.lifetime_end,
                        Channel_ID: channelId,
                        Name_eng: program.name_eng,
                        Description: '',
                        Public: 0,
                        Sequence: program.sequence,
                        Is_TimeSegment_Limit: program.is_time_segment_limit,
                        TimeSegment_Start: program.time_segment_start,
                        TimeSegment_Duration: program.time_segment_duration,
                        Schedule_Paras: program.schedule_params,
                        Schedule_Type: program.schedule_type,
                        Layout_ID: program.layout_id
                    }
                });
                util.ajax('post', requestUrl + '/backend_mgt/v2/programs/' + program.id, data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        deferred.reject(res);
                        failed = true;
                        return;
                    }
                    successCount++;
                    if (successCount === changedPrograms.length) {
                        deferred.resolve(generatedWidgets);
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteUpdateWidgets(generatedWidgets) {
        var deferred = $.Deferred(),
            changedWidgets = db.collection('widget').getLocalUpdatedRows();
        changedWidgets = changedWidgets.concat(generatedWidgets);
        if (changedWidgets.length === 0) {
            deferred.resolve();
        } else {
            var successCount = 0, failed = false;
            changedWidgets.forEach(function (widget) {
                var data = JSON.stringify({
                    Project: projectName,
                    Action: 'Update',
                    ControlBoxID: widget.id,
                    Data: {
                        Style: widget.style,
                        Overall_Schedule_Paras: widget.overall_schedule_params,
                        Overall_Schedule_Type: widget.overall_schedule_type,
                        Z: widget.z_index,
                        ID: widget.id,
                        ControlBox_Material: widget.material,
                        Top: widget.top,
                        Left: widget.left,
                        ControlBox_Type_ID: widget.type_id,
                        ControlBox_Type_Name: widget.type_name,
                        ControlBox_Type: widget.type,
                        Program_ID: widget.program_template_id,
                        Height: widget.height,
                        Width: widget.width
                    }
                });
                util.ajax('post', requestUrl + '/backend_mgt/v1/controlboxes/' + widget.id, data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        failed = true;
                        deferred.reject(res);
                        return;
                    }
                    successCount++;
                    if (successCount === changedWidgets.length) {
                        deferred.resolve();
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteAddMaterials() {
        var deferred = $.Deferred(),
            newMaterials = db.collection('material').getLocalInsertedRows();
        if (newMaterials.length === 0) {
            deferred.resolve();
        } else {
            var successCount = 0, failed = false;
            newMaterials.forEach(function (material) {
                var data = JSON.stringify({
                        Project: projectName,
                        Action: 'AddMaterialWithID',
                        ControlBoxID: material.widget_id,
                        Data: {
                            ControlBox_ID: material.widget_id,
                            Material_ID: material.resource_id,
                            LifeStartTime: material.lifetime_start,
                            LifeEndTime: material.lifetime_end,
                            Is_TimeSegment_Limit: material.is_time_segment_limit,
                            TimeSegment_Start: material.time_segment_start,
                            TimeSegment_Duration: material.time_segment_duration,
                            Schedule_Paras: material.schedule_params,
                            Schedule_Type: material.schedule_type,
                            Sequence: material.sequence
                        }
                    }),
                    oldMaterialId = material.id;
                util.ajax('post', requestUrl + '/backend_mgt/v1/controlboxes', data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        failed = true;
                        deferred.reject(res);
                        return;
                    }
                    successCount++;
                    var materialId = Number(res.ControlBox_Material_ID);
                    db.collection('material').update({id: materialId}, {id: oldMaterialId});
                    if (successCount === newMaterials.length) {
                        deferred.resolve();
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteUpdateMaterials() {
        var deferred = $.Deferred(),
            changedMaterials = db.collection('material').getLocalUpdatedRows();
        if (changedMaterials.length === 0) {
            deferred.resolve();
        } else {
            var successCount = 0, failed = false;
            changedMaterials.forEach(function (material) {
                var data = JSON.stringify({
                    Project: projectName,
                    Action: 'UpdateMaterial',
                    Data: {
                        ID: material.id,
                        LifeStartTime: material.lifetime_start,
                        LifeEndTime: material.lifetime_end,
                        ControlBox_ID: material.widget_id,
                        Name: material.name,
                        Name_eng: material.name_eng,
                        Type_ID: material.type_id,
                        URL: material.url,
                        Type_Name: material.type_name,
                        Material_ID: material.resource_id,
                        Schedule_Type: material.schedule_type,
                        Schedule_Paras: material.schedule_params,
                        Is_TimeSegment_Limit: material.is_time_segment_limit,
                        Sequence: material.sequence,
                        TimeSegment_Start: material.time_segment_start,
                        TimeSegment_Duration: material.time_segment_duration
                    }
                });
                util.ajax('post', requestUrl + '/backend_mgt/v1/controlboxes', data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        failed = true;
                        deferred.reject(res);
                        return;
                    }
                    successCount++;
                    if (successCount === changedMaterials.length) {
                        deferred.resolve();
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteDeleteMaterials() {
        var deferred = $.Deferred(),
            deletedMaterials = db.collection('material').getLocalDeletedRows();
        if (deletedMaterials.length === 0) {
            deferred.resolve();
        } else {
            var successCount = 0, failed = false;
            deletedMaterials.forEach(function (material) {
                var data = JSON.stringify({
                    Project: projectName,
                    Action: 'DeleteMaterial',
                    ControlBox_Material_ID: material.id
                });
                util.ajax('post', requestUrl + '/backend_mgt/v1/controlboxes', data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        failed = true;
                        deferred.reject(res);
                        return;
                    }
                    successCount++;
                    if (successCount === deletedMaterials.length) {
                        deferred.resolve();
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteDeletePrograms() {
        var deferred = $.Deferred(),
            deletedPrograms = db.collection('program').getLocalDeletedRows();
        if (deletedPrograms.length === 0) {
            deferred.resolve();
        } else {
            var successCount = 0, failed = false;
            deletedPrograms.forEach(function (program) {
                var data = JSON.stringify({
                    Project: projectName,
                    Action: 'Delete'
                });
                util.ajax('post', requestUrl + '/backend_mgt/v2/programs/' + program.id, data, function (res) {
                    if (!failed && Number(res.rescode) !== 200) {
                        failed = true;
                        deferred.reject(res);
                        return;
                    }
                    successCount++;
                    if (successCount === deletedPrograms.length) {
                        deferred.resolve();
                    }
                });
            });
        }
        return deferred.promise();
    }

    function remoteSubmitVersion() {
        var deferred = $.Deferred(),
            checkSwitch = Number(util.getLocalParameter('config_checkSwitch')),
            data;

        data = JSON.stringify({
            action: 'SubmitVersion',
            Project: projectName,
            ChannelID: channelId
        });

        util.ajax('post', requestUrl + '/backend_mgt/v2/channels', data, function (res) {
            if (Number(res.rescode) !== 200) {
                deferred.reject(res);
                return;
            }
            if (checkSwitch === 0) {
                data = JSON.stringify({
                    project_name: projectName,
                    action: 'checkPass',
                    ChannelIDs: [
                        channelId
                    ]
                });
                util.ajax('post', requestUrl + '/backend_mgt/v2/channels', data, function (res) {
                    if (Number(res.rescode) !== 200) {
                        deferred.reject(res);
                        return;
                    }
                    deferred.resolve()
                });
            } else {
                deferred.resolve();
            }
        });

        return deferred.promise();
    }

    function onSaveChannelSuccess() {
        db.commit();
        db.beginTransaction();
        $('#channel-editor-wrapper .btn-channel-editor-save').removeAttr("disabled");

        if ($('#channel-editor-wrapper .btn-channel-editor-saveRelease').attr("release") == "true") {
            onPublishChannel();
        } else if ($('#channel-editor-wrapper .btn-channel-editor-saveSubmit').attr("audit") == "true") {
            onSubmitAudit();
        } else {
            alert('保存成功!');
        }
        if (location.hash.indexOf('?id=') === -1) {
            location.hash = '#channel/edit?id=' + channelId;
        } else {
            exports.init();
        }
        //location.reload();
    }

    function onSaveChannelFail() {
        //db.rollback();
        $('#channel-editor-wrapper .btn-channel-editor-save').removeAttr("disabled");
        alert('保存失败');
    }

    /**************** end of saveChannel  *****************/

    function onNewLayout(type, layoutId) {
        var data = JSON.stringify({
            project_name: projectName,
            action: 'getCBLList',
            data: {
                layout_id: layoutId
            }
        });
        util.ajax('post', requestUrl + '/backend_mgt/v1/layout', data, function (res) {
            var layout = db.collection('layout').select({id: layoutId})[0];
            if (!layout) {
                layout = parseLayoutData2(res);
                layout.id = layoutId;
                layout.download_auth_type = res.BackgroundPic.Download_Auth_Type;
                db.collection('layout').insert(layout);
            }
            var widgets = res.Layout_ControlBoxs.map(function (el) {
                var type, type_id, type_name;
                if (el.Type === 'VideoBox') {
                    type = 'VideoBox';
                    type_name = '视频控件';
                    type_id = 1;
                } else if (el.Type === 'AudioBox') {
                    type = 'AudioBox';
                    type_name = '音频控件';
                    type_id = 4;
                } else if (el.Type === 'WebBox') {
                    type = 'WebBox';
                    type_name = '文本控件';
                    type_id = 3;
                } else if (el.Type === 'ImageBox') {
                    type = 'ImageBox';
                    type_name = '图片控件';
                    type_id = 2;
                } else if (el.Type === 'ClockBox') {
                    type = 'ClockBox';
                    type_name = '时钟控件';
                    type_id = 5;
                } else if (el.Type === 'WeatherBox') {
                    type = 'WeatherBox';
                    type_name = '天气控件';
                    type_id = 6;
                }
                return {
                    layout_id: layoutId,
                    type_id: type_id,
                    type: type,
                    type_name: type_name,
                    layout_widget_id: el.ID,
                    material: '',
                    width: el.Width,
                    height: el.Height,
                    left: el.Left,
                    style: '',
                    top: el.Top,
                    overall_schedule_params: '{\"Type\": \"Sequence\"}',
                    overall_schedule_type: 'Regular',
                    z_index: el.Zorder
                };
            });
            onNewProgram(type, layout, widgets);
        });
    }

    /**
     * 创建新节目
     * @param type
     * @param layoutId
     */
    function onNewProgram(type, layout, widgets) {
        // find max sequence
        var maxSequence = 0;
        if (type === 'Regular') {
            var regularIds = regularSortable.toArray().map(function (el) {
                return parseInt(el);
            });
            regularIds.forEach(function (programId) {
                var sequence = db.collection('program').select({id: programId})[0].sequence;
                if (sequence > maxSequence) {
                    maxSequence = sequence;
                }
            });
        }else if(type === 'Timed'){
            var timedIds = timedSortable.toArray().map(function (el) {
                return parseInt(el);
            });
            timedIds.forEach(function (programId) {
                var sequence = db.collection('program').select({id: programId})[0].sequence;
                if (sequence > maxSequence) {
                    maxSequence = sequence;
                }
            });
        }
        db.collection('program').insert({
            is_time_segment_limit: 0,
            layout_id: layout.id,
            template_id: 0,
            lifetime_start: '1970-01-01 00:00:00',
            lifetime_end: '2030-01-01 00:00:00',
            name: layout.name,
            name_eng: 'new program',
            schedule_params: '{\"duration\":3600,\"count\":1}',
            schedule_type: type,
            sequence: maxSequence + 1,
            time_segment_duration: 0,
            time_segment_start: ''
        });
        var programId = db.collection('program').lastInsertId(),
            program = db.collection('program').select({id: programId})[0],
            ul = $(type === 'Regular' ?
                    '#channel-editor-wrapper .channel-program-list-regular ul' :
                    '#channel-editor-wrapper .channel-program-list-timed ul'
            ),
            //backgroundStyle = layout.background_image_url ?
            //'background-image:url(' + layout.background_image_url + ');background-repeat:no-repeat;background-size:100% 100%;background-position:center' :
            //'background-color:' + layout.background_color,
            backgroundStyle = 'background-image:url(' + getThumbnail(layout) + ');background-repeat:no-repeat;background-size:100% 100%;background-position:center;',
            data = {
                id: program.id,
                name: program.name,
                backgroundStyle: backgroundStyle
            };
        db.collection('program').update({template_id: programId}, {id: programId});
        widgets.forEach(function (widget) {
            widget.program_id = programId;
            widget.program_template_id = programId;
            db.collection('widget').insert(widget);
        });
        ul.append(templates.channel_edit_program_list_item(data));
        loadProgram(program);
    }

    /**
     * 删除节目
     * @param programId
     */
    function onDeleteProgram(programId) {
        $('#channel-editor-wrapper .channel-program-list ul>li[data-id=' + programId + ']').remove();
        db.collection('program').delete({id: programId});
        var programList = db.collection('program').select({});
        var program = null;
        for (var a = 0, b = 0; a<programList.length; a++) {
            if (programList[a] == null) {
                program = programList[a+1];
                b++;
            } else {
                program = programList[b];
                break;
            }
        }
        loadProgram(program);
    }

    /**
     * 当节目重排序时回调
     * @param evt
     */
    function onResortProgram(evt) {
        var type = $('#channel-editor-wrapper .channel-program-schedule-type').val();
        if (type !== 'Sequence') {
            return;
        }
        var sortedIds = regularSortable.toArray().map(function (el) {
            return parseInt(el);
        });
        sortedIds.forEach(function (id, idx) {
            db.collection('program').update({sequence: idx}, {id: id});
        });
    }

    /**
     * 当定时节目重排序时回调
     * @param evt
     */
    function onTimedProgram(evt) {
        var sortedIds = timedSortable.toArray().map(function (el) {
            return parseInt(el);
        });
        sortedIds.forEach(function (id, idx) {
            db.collection('program').update({sequence: idx}, {id: id});
        });
    }

    /**
     *
     */
    function findSelectedProgram() {
        var programId = null;
        $('#channel-editor-wrapper .channel-program-list li').each(function (idx, el) {
            if ($(el).hasClass('selected')) {
                programId = parseInt(el.getAttribute('data-id'));
            }
        });
        if (programId === null) {
            return null;
        }
        return db.collection('program').select({id: programId})[0]
    }

    /**
     *获取缩略图
     */
    function getThumbnail(layout) {
        var background_image;
        if ((layout.background_image_url == "" && layout.download_auth_type == "") || (layout.background_image_url == undefined && layout.download_auth_type == undefined)) {
            var data = JSON.stringify({
                project_name: projectName,
                action: 'getThumbnail',
                data: {
                    layout_id: String(layout.id),
                }
            });
            util.ajax2('post', requestUrl + '/backend_mgt/v1/layout', data, function (res) {
                if (Number(res.ID) != undefined) {
                    //console.log('获取缩略图添加成功!');
                    background_image = res.Thumbnail;
                }
            })
        } else {
            background_image = util.getRealURL(layout.download_auth_type, layout.background_image_url);
        }
        return background_image;
    }

    /**
     *保存并发布
     */
    function onPublishChannel() {
        util.cover.load('resources/pages/terminal/getTermClassAndTerm.html');
        getClassAndTerm.channelID = channelId;
        getClassAndTerm.title = '发布到...';
        getClassAndTerm.save = function (data) {
            //var cList = JSON.stringify(data.categoryList);
            //var tList = JSON.stringify(data.termList);
            var post_data = JSON.stringify({
                project_name: config.projectName,
                action: 'publishChannel',
                channelID: channelId,
                categoryList: data.categoryList,
                termList: data.termList
            });
            var url = config.serverRoot + '/backend_mgt/v2/termcategory';
            util.ajax2('post', url, post_data, function (msg) {
                if (msg.rescode == 200) {
                    alert("频道保存并发布成功！")
                    location.hash = '#channel/list';
                }
                else {
                    alert("频道保存并发布失败！")
                }
            });
            util.cover.close();
        }
    }

    function onSubmitAudit() {
        var ids = new Array();
        ids.push(channelId);
        var data = {
            "project_name": config.projectName,
            "action": "submitToCheck",
            "ChannelIDs": ids
        }
        util.ajax(
            'POST',
            config.serverRoot + '/backend_mgt/v2/channels',
            JSON.stringify(data),
            function (data) {
                if (data.rescode === '200') {
                    alert('保存并提交审核成功！');
                    location.hash = '#channel/list';
                } else {
                    alert('保存并提交审核失败！');
                }
            }
        )
    }

    /**
     *校验事件
     */
    function inputCheck() {
        var programList = db.collection('program').select({});
        for (var a = 0; a < programList.length; a++) {
            var program = programList[a];
            var errorMsg = "";
            if (program != null) {
                if (program.lifetime_start.length != 16) {
                    if (program.lifetime_start.length != 19) {
                        errorMsg = "请输入正确的节目生效时间!\n";
                        alert(errorMsg);
                        return false;
                    }
                }
                if (program.lifetime_end.length != 16) {
                    if (program.lifetime_end.length != 19) {
                        errorMsg = "请输入正确的节目失效时间!";
                        alert(errorMsg);
                        return false;
                    }
                }
                var start_time = new Date(program.lifetime_start);
                var end_time = new Date(program.lifetime_end);
                if (start_time > end_time) {
                    errorMsg = "节目生效时间晚于失效时间，请重新输入!"
                    alert(errorMsg);
                    return false;
                }
            }
        }
        return true;
    }
});
