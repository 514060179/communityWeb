/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            doWorkInfo: {
                works: [],
                states: [
                    {
                        name: '全部',
                        state: ''
                    },
                    {
                        name: '待处理',
                        state: 'W'
                    },
                    {
                        name: '已处理',
                        state: 'C'
                    }
                ],
                total: 0,
                records: 1,
                moreCondition: false,
                wtId: '',
                conditions: {
                    workNameLike: '',
                    staffNameLike: '',
                    state: '',
                    typeName: '',
                    timeout: '',
                    queryEndTime: '',
                    queryStartTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDoWorkDateInfo();
            $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('doWork', 'listDoWork', function (_param) {
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listDoWorks(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDoWorkDateInfo: function () {
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
                        vc.component.doWorkInfo.conditions.queryStartTime = value;
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
                        var start = Date.parse(new Date(vc.component.doWorkInfo.conditions.queryStartTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结租时间必须大于起租时间")
                            $(".queryEndTime").val('')
                        } else {
                            vc.component.doWorkInfo.conditions.queryEndTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control queryStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control queryEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listDoWorks: function (_page, _rows) {
                $that.doWorkInfo.conditions.page = _page;
                $that.doWorkInfo.conditions.row = _rows;
                var param = {
                    params: $that.doWorkInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/work.queryTaskWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.doWorkInfo.total = _json.total;
                        $that.doWorkInfo.records = _json.records;
                        $that.doWorkInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.doWorkInfo.records,
                            dataCount: $that.doWorkInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openTodoTaskDetail: function (_work) {
                vc.jumpToPage('/#/pages/oa/workTaskDetail?workId=' + _work.workId + "&taskId=" + _work.taskId + "&todo=ON");
            },
            _queryDoWorkMethod: function () {
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetDoWorkMethod: function () {
                vc.component.doWorkInfo.conditions.workNameLike = "";
                vc.component.doWorkInfo.conditions.staffNameLike = "";
                vc.component.doWorkInfo.conditions.queryStartTime = "";
                vc.component.doWorkInfo.conditions.queryEndTime = "";
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState: function (_state) {
                $that.doWorkInfo.conditions.state = _state.state;
                $that._listDoWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toWorkDetailPage: function (_work) {
                vc.jumpToPage('/#/pages/oa/workDetail?workId=' + _work.workId);
            },
        }
    });
})(window.vc);
