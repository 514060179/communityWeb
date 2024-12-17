/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            startWorkInfo: {
                works: [],
                states: [
                    {
                        name: '全部',
                        state: ''
                    }, {
                        name: '待处理',
                        state: 'W'
                    }, {
                        name: '处理中',
                        state: 'D'
                    }, {
                        name: '处理完成',
                        state: 'C'
                    }
                ],
                total: 0,
                records: 1,
                moreCondition: false,
                wtId: '',
                conditions: {
                    state: '',
                    typeName: '',
                    timeout: '',
                    queryEndTime: '',
                    queryStartTime: ''
                }
            }
        },
        _initMethod: function () {
            $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._initStartWorkDate();
        },
        _initEvent: function () {
            vc.on('startWork', 'listStartWork', function (_param) {
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listStartWorks(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initStartWorkDate: function () {
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
                        vc.component.startWorkInfo.conditions.queryStartTime = value;
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
                        var start = Date.parse(new Date(vc.component.startWorkInfo.conditions.queryStartTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".queryEndTime").val('')
                        } else {
                            vc.component.startWorkInfo.conditions.queryEndTime = value;
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
            _listStartWorks: function (_page, _rows) {
                $that.startWorkInfo.conditions.page = _page;
                $that.startWorkInfo.conditions.row = _rows;
                var param = {
                    params: $that.startWorkInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/work.queryStartWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.startWorkInfo.total = _json.total;
                        $that.startWorkInfo.records = _json.records;
                        $that.startWorkInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.startWorkInfo.records,
                            dataCount: $that.startWorkInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddStartWorkModal: function () {
                vc.jumpToPage('/#/pages/oa/addWork');
            },
            _openEditStartWorkModel: function (_startWork) {
                vc.jumpToPage('/#/pages/oa/editWork?' + vc.objToGetParam(_startWork));
            },
            _openDeleteStartWorkModel: function (_startWork) {
                vc.emit('deleteWork', 'openDeleteWorkModal', _startWork);
            },
            _toWorkDetailPage: function (_work) {
                vc.jumpToPage('/#/pages/oa/workDetail?workId=' + _work.workId);
            },
            _queryStartWorkMethod: function () {
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetStartWorkMethod: function () {
                vc.component.startWorkInfo.conditions.workName = "";
                vc.component.startWorkInfo.conditions.staffName = "";
                vc.component.startWorkInfo.conditions.queryStartTime = "";
                vc.component.startWorkInfo.conditions.queryEndTime = "";
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState: function (_state) {
                $that.startWorkInfo.conditions.state = _state.state;
                $that._listStartWorks(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);
