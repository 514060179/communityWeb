/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailTaskInfo: {
                tasks: [],
                workId: '',
                staffNameLike: '',
                queryStartTime: '',
                queryEndTime: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailTask', 'switch', function (_data) {
                $that.workDetailTaskInfo.workId = _data.workId;
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
                setTimeout(function () {
                    vc.component._initWorkDetailTaskDateInfo();
                }, 1000)
            });
            vc.on('workDetailTask', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailTaskData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailTask', 'notify', function (_data) {
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _initWorkDetailTaskDateInfo: function () {
                $('.queryStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.queryStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".queryStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.workDetailTaskInfo.queryEndTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".queryStartTime").val('');
                            vc.component.workDetailTaskInfo.queryStartTime = "";
                        } else {
                            vc.component.workDetailTaskInfo.queryStartTime = value;
                        }
                    });
                $('.queryEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.queryEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".queryEndTime").val();
                        var start = Date.parse(new Date(vc.component.workDetailTaskInfo.queryStartTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".queryEndTime").val('');
                            vc.component.workDetailTaskInfo.queryEndTime = "";
                        } else {
                            vc.component.workDetailTaskInfo.queryEndTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control queryStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control queryEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _loadWorkDetailTaskData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailTaskInfo.taskId,
                        workId: $that.workDetailTaskInfo.workId,
                        staffNameLike: $that.workDetailTaskInfo.staffNameLike,
                        queryStartTime: $that.workDetailTaskInfo.queryStartTime,
                        queryEndTime: $that.workDetailTaskInfo.queryEndTime,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.listWorkTask',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailTaskInfo.tasks = _json.data;
                        vc.emit('workDetailTask', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryWorkDetailTask: function () {
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetWorkDetailTask: function () {
                vc.component.workDetailTaskInfo.staffNameLike = "";
                vc.component.workDetailTaskInfo.queryStartTime = "";
                vc.component.workDetailTaskInfo.queryEndTime = "";
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditRoomModel: function (_room) {
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
            _openWorkTaskDetail: function (_work) {
                vc.jumpToPage('/#/pages/oa/workTaskDetail?workId=' + _work.workId + "&taskId=" + _work.taskId);
            },
        }
    });
})(window.vc);