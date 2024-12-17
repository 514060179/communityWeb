/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            maintainanceTaskDetailManageInfo: {
                maintainanceTasks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                taskId: '',
                stateTypes: [],
                maintainanceStateTypes: [],
                taskStates: [],
                plans: [],
                patrolTypes: [],
                conditions: {
                    planUserName: '',
                    taskDetailId: '',
                    planName: '',
                    actInsTime: '',
                    startTime: '',
                    endTime: '',
                    state: '',
                    maintainanceState: '',
                    maintainanceId: '',
                    planId: '',
                    maintainanceRouteId: '',
                    taskState: '',
                    patrolType: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('maintainance_task', "state", function (_data) {
                $that.maintainanceTaskDetailManageInfo.stateTypes = _data;
            });
            vc.getDict('maintainance_task_detail', "maintainance_state", function (_data) {
                $that.maintainanceTaskDetailManageInfo.maintainanceStateTypes = _data;
            });
            vc.getDict('maintainance_task_detail', "state", function (_data) {
                $that.maintainanceTaskDetailManageInfo.taskStates = _data;
            });
            vc.getDict('maintainance_task_detail', "patrol_type", function (_data) {
                $that.maintainanceTaskDetailManageInfo.patrolTypes = _data;
            });
            $that._initMaintainanceTaskDetailDateInfo();
            $that._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listMaintainancePlanInfo();
        },
        _initEvent: function () {
            vc.on('maintainanceTaskManage', 'listMaintainanceTask', function (_param) {
                $that._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listMaintainanceTasksDetailList(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initMaintainanceTaskDetailDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        $that.maintainanceTaskDetailManageInfo.conditions.maintainanceStartTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        $that.maintainanceTaskDetailManageInfo.conditions.maintainanceEndTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listMaintainanceTasksDetailList: function (_page, _rows) {
                $that.maintainanceTaskDetailManageInfo.conditions.page = _page;
                $that.maintainanceTaskDetailManageInfo.conditions.row = _rows;
                $that.maintainanceTaskDetailManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.maintainanceTaskDetailManageInfo.conditions
                };
                param.params.planUserName = param.params.planUserName.trim();
                param.params.taskDetailId = param.params.taskDetailId.trim();
                param.params.planName = param.params.planName.trim();
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTaskDetail',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.maintainanceTaskDetailManageInfo.total = _json.total;
                        $that.maintainanceTaskDetailManageInfo.records = _json.records;
                        $that.maintainanceTaskDetailManageInfo.maintainanceTasks = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.maintainanceTaskDetailManageInfo.records,
                            dataCount: $that.maintainanceTaskDetailManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryMaintainanceTaskMethod: function () {
                $that._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMaintainanceTaskMethod: function () {
                $that.maintainanceTaskDetailManageInfo.conditions.planUserName = "";
                $that.maintainanceTaskDetailManageInfo.conditions.taskDetailId = "";
                $that.maintainanceTaskDetailManageInfo.conditions.planName = "";
                $that.maintainanceTaskDetailManageInfo.conditions.actInsTime = "";
                $that.maintainanceTaskDetailManageInfo.conditions.maintainanceStartTime = "";
                $that.maintainanceTaskDetailManageInfo.conditions.maintainanceEndTime = "";
                $that.maintainanceTaskDetailManageInfo.conditions.state = "";
                $that.maintainanceTaskDetailManageInfo.conditions.maintainanceId = '';
                $that.maintainanceTaskDetailManageInfo.conditions.maintainancePlanId = '';
                $that.maintainanceTaskDetailManageInfo.conditions.maintainanceRouteId = '';
                $that.maintainanceTaskDetailManageInfo.conditions.maintainanceState = "";
                $that.maintainanceTaskDetailManageInfo.conditions.taskState = "";
                $that.maintainanceTaskDetailManageInfo.conditions.patrolType = "";
                $that._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.maintainanceTaskDetailManageInfo.moreCondition) {
                    $that.maintainanceTaskDetailManageInfo.moreCondition = false;
                } else {
                    $that.maintainanceTaskDetailManageInfo.moreCondition = true;
                }
            },
            _listMaintainancePlanInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlan',
                    param,
                    function (json, res) {
                        var _maintainancePointManageInfo = JSON.parse(json);
                        $that.maintainanceTaskDetailManageInfo.plans = _maintainancePointManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainanceRouteInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainanceRoute.listMaintainanceRoutes',
                    param,
                    function (json, res) {
                        var _maintainancePointManageInfo = JSON.parse(json);
                        $that.maintainanceTaskDetailManageInfo.maintainanceRouteList = _maintainancePointManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainancePointInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePoint.listMaintainancePoints',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.maintainanceTaskDetailManageInfo.maintainancePointList = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            openMap: function (lat, lng) {
                if (!lat || !lng) {
                    vc.toast('暂无位置信息');
                    return;
                }
                vc.emit('viewMap', 'showMap', {
                    lat: lat,
                    lng: lng
                });
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=maintainanceTaskDetails&' + vc.objToGetParam($that.maintainanceTaskDetailManageInfo.conditions));
            }
        }
    });
})(window.vc);
