/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workPoolInfo: {
                works: [],
                states: [
                    {
                        name: '全部',
                        state: ''
                    }, {
                        name: '待处理',
                        state: 'W'
                    }, {
                        name: '处理完成',
                        state: 'C'
                    }, {
                        name: '超时工作单',
                        state: 'timeout'
                    }
                ],
                total: 0,
                records: 1,
                moreCondition: false,
                wtId: '',
                conditions: {
                    state: '',
                    typeName: '',
                    staffNameLike: '',
                    workNameLike: '',
                    queryEndTime: '',
                    queryStartTime: '',
                    createUserNameLike: ''
                }
            }
        },
        _initMethod: function () {
            $that._listWorkPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('workPool', 'listWorkPool', function (_param) {
                $that._listWorkPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listWorkPools(_currentPage, DEFAULT_ROWS);
            });
            vc.initDateTime('queryStartTime', function (_value) {
                $that.workPoolInfo.conditions.queryStartTime = _value;
            })
            vc.initDateTime('queryEndTime', function (_value) {
                $that.workPoolInfo.conditions.queryEndTime = _value;
            })
        },
        methods: {
            _listWorkPools: function (_page, _rows) {
                $that.workPoolInfo.conditions.page = _page;
                $that.workPoolInfo.conditions.row = _rows;
                let param = {
                    params: JSON.parse(JSON.stringify($that.workPoolInfo.conditions))
                };
                if (param.params.state == 'timeout') {
                    param.params.state = 'C';
                    param.params.taskTimeout = 'Y'
                }
                //发送get请求
                vc.http.apiGet('/work.listWorkTask',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.workPoolInfo.total = _json.total;
                        $that.workPoolInfo.records = _json.records;
                        $that.workPoolInfo.works = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.workPoolInfo.records,
                            dataCount: $that.workPoolInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toWorkDetailPage: function (_work) {
                vc.jumpToPage('/#/pages/oa/workDetail?workId=' + _work.workId);
            },
            _queryWorkPoolMethod: function () {
                $that._listWorkPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetWorkPoolMethod: function () {
                vc.component.workPoolInfo.conditions.workNameLike = "";
                vc.component.workPoolInfo.conditions.createUserNameLike = "";
                vc.component.workPoolInfo.conditions.staffNameLike = "";
                vc.component.workPoolInfo.conditions.queryStartTime = "";
                vc.component.workPoolInfo.conditions.queryEndTime = "";
                $that._listWorkPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchWorkState: function (_state) {
                $that.workPoolInfo.conditions.state = _state.state;
                $that._listWorkPools(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);
