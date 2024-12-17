/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailEventInfo: {
                events: [],
                workId: '',
                staffNameLike: '',
                queryStartTime: '',
                queryEndTime: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailEvent', 'switch', function (_data) {
                $that.workDetailEventInfo.workId = _data.workId;
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
                setTimeout(function () {
                    vc.component._initWorkDetailEventDateInfo();
                    /*vc.initDateTime('eventQueryStartTime', function (_value) {
                        $that.workDetailEventInfo.queryStartTime = _value;
                    });
                    vc.initDateTime('eventQueryEndTime', function (_value) {
                        $that.workDetailEventInfo.queryEndTime = _value;
                    });*/
                }, 1000)
            });
            vc.on('workDetailEvent', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailEventData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailEvent', 'notify', function (_data) {
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _initWorkDetailEventDateInfo: function () {
                $('.eventQueryStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.eventQueryStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".eventQueryStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.workDetailEventInfo.queryEndTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".eventQueryStartTime").val('');
                            vc.component.workDetailEventInfo.queryStartTime = "";
                        } else {
                            vc.component.workDetailEventInfo.queryStartTime = value;
                        }
                    });
                $('.eventQueryEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.eventQueryEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".eventQueryEndTime").val();
                        var start = Date.parse(new Date(vc.component.workDetailEventInfo.queryStartTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间");
                            $(".eventQueryEndTime").val('');
                            vc.component.workDetailEventInfo.queryEndTime = "";
                        } else {
                            vc.component.workDetailEventInfo.queryEndTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control eventQueryStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control eventQueryEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _loadWorkDetailEventData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailEventInfo.taskId,
                        workId: $that.workDetailEventInfo.workId,
                        staffNameLike: $that.workDetailEventInfo.staffNameLike,
                        queryStartTime: $that.workDetailEventInfo.queryStartTime,
                        queryEndTime: $that.workDetailEventInfo.queryEndTime,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/workEvent.listWorkEvent',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailEventInfo.events = _json.data;
                        vc.emit('workDetailEvent', 'paginationPlus', 'init', {
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
            _queryWorkDetailEvent: function () {
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetWorkDetailEvent: function () {
                vc.component.workDetailEventInfo.staffNameLike = "";
                vc.component.workDetailEventInfo.queryStartTime = "";
                vc.component.workDetailEventInfo.queryEndTime = "";
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);