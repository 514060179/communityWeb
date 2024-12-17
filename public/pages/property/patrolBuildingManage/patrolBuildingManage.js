/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            patrolBuildingManageInfo: {
                patrolBuildings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    pbId: '',
                    staffId: '',
                    staffName: '',
                    floorNum: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            vc.component._initDateInfo();
            vc.component._listPatrolBuildings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('patrolBuildingManage', 'listPatrolBuilding', function (_param) {
                vc.component._listPatrolBuildings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listPatrolBuildings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDateInfo: function () {
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
                        vc.component.patrolBuildingManageInfo.conditions.startTime = value;
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
                        var start = Date.parse(new Date($that.patrolBuildingManageInfo.conditions.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("登记结束时间必须大于登记开始时间");
                            $(".endTime").val('');
                            $that.patrolBuildingManageInfo.conditions.endTime = "";
                        } else {
                            $that.patrolBuildingManageInfo.conditions.endTime = value;
                        }
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
            _listPatrolBuildings: function (_page, _rows) {
                vc.component.patrolBuildingManageInfo.conditions.page = _page;
                vc.component.patrolBuildingManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.patrolBuildingManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/patrolBuilding.listPatrolBuilding',
                    param,
                    function (json, res) {
                        let _patrolBuildingManageInfo = JSON.parse(json);
                        vc.component.patrolBuildingManageInfo.total = _patrolBuildingManageInfo.total;
                        vc.component.patrolBuildingManageInfo.records = _patrolBuildingManageInfo.records;
                        vc.component.patrolBuildingManageInfo.patrolBuildings = _patrolBuildingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.patrolBuildingManageInfo.records,
                            dataCount: vc.component.patrolBuildingManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPatrolBuildingModal: function () {
                vc.jumpToPage('/#/pages/attendance/addPatrolBuilding');
            },
            _openEditPatrolBuildingModel: function (patrolBuilding) {
                // vc.emit('editPatrolBuilding', 'openEditPatrolBuildingModal', patrolBuilding);
                vc.jumpToPage('/#/pages/attendance/editPatrolBuilding?pbId=' + patrolBuilding.pbId);
            },
            _openDeletePatrolBuildingModel: function (patrolBuilding) {
                vc.emit('deletePatrolBuilding', 'openDeletePatrolBuildingModal', patrolBuilding);
            },
            //查询
            _queryPatrolBuildingMethod: function () {
                vc.component._listPatrolBuildings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPatrolBuildingMethod: function () {
                vc.component.patrolBuildingManageInfo.conditions.startTime = "";
                vc.component.patrolBuildingManageInfo.conditions.endTime = "";
                vc.component.patrolBuildingManageInfo.conditions.pbId = "";
                vc.component.patrolBuildingManageInfo.conditions.staffName = "";
                vc.component.patrolBuildingManageInfo.conditions.floorNum = "";
                vc.component._listPatrolBuildings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            },
            //导出
            _exportExcel: function () {
                vc.component.patrolBuildingManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.patrolBuildingManageInfo.conditions.pagePath = 'patrolBuildingManage';
                let param = {
                    params: vc.component.patrolBuildingManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function () {
                if (vc.component.patrolBuildingManageInfo.moreCondition) {
                    vc.component.patrolBuildingManageInfo.moreCondition = false;
                } else {
                    vc.component.patrolBuildingManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);