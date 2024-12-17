/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportNoFeeRoomInfo: {
                floors: [],
                units: [],
                rooms: [],
                roomInfos: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    floorId: '',
                    floorNum: '',
                    unitId: '',
                    unitNum: '',
                    roomId: '',
                    roomNum: '',
                    ownerName: '',
                    link: ''
                }
            }
        },
        _initMethod: function () {
            $that.loadReportNoFeeRoomFloors();
            vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询
            _queryMethod: function () {
                vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetMethod: function () {
                vc.component.reportNoFeeRoomInfo.conditions.floorId = "";
                vc.component.reportNoFeeRoomInfo.conditions.unitId = "";
                vc.component.reportNoFeeRoomInfo.conditions.roomId = "";
                vc.component.reportNoFeeRoomInfo.conditions.ownerName = "";
                vc.component.reportNoFeeRoomInfo.conditions.link = "";
                vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listRepairs: function (_page, _rows) {
                vc.component.reportNoFeeRoomInfo.conditions.page = _page;
                vc.component.reportNoFeeRoomInfo.conditions.row = _rows;
                vc.component.reportNoFeeRoomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportNoFeeRoomInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryNoFeeRooms',
                    param,
                    function (json, res) {
                        var _reportNoFeeRoomInfo = JSON.parse(json);
                        vc.component.reportNoFeeRoomInfo.total = _reportNoFeeRoomInfo.total;
                        vc.component.reportNoFeeRoomInfo.records = _reportNoFeeRoomInfo.records;
                        vc.component.reportNoFeeRoomInfo.rooms = _reportNoFeeRoomInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportNoFeeRoomInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportNoFeeRoomInfo.total
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询楼栋
            loadReportNoFeeRoomFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.reportNoFeeRoomInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询单元
            selectReportNoFeeRoomUnit: function () {
                var param = {
                    params: {
                        floorId: vc.component.reportNoFeeRoomInfo.conditions.floorId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function (json, res) {
                        var listUnitData = JSON.parse(json);
                        vc.component.reportNoFeeRoomInfo.units = listUnitData;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询房屋
            _selectReportNoFeeRoomRoom: function () {
                var param = {
                    params: {
                        unitId: vc.component.reportNoFeeRoomInfo.conditions.unitId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.component.reportNoFeeRoomInfo.roomInfos = listRoomData.rooms;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function () {
                if (vc.component.reportNoFeeRoomInfo.moreCondition) {
                    vc.component.reportNoFeeRoomInfo.moreCondition = false;
                } else {
                    vc.component.reportNoFeeRoomInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function () {
                // vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&pagePath=reportNoFeeRoom");
                vc.component.reportNoFeeRoomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportNoFeeRoomInfo.conditions.pagePath = 'reportNoFeeRoom';
                let param = {
                    params: vc.component.reportNoFeeRoomInfo.conditions
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
            }
        }
    });
})(window.vc);