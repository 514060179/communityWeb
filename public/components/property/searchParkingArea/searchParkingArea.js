(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseParkingSpace: vc.propTypes.string,
            emitLoadData: vc.propTypes.string,
            parkingSpaceFlag: vc.propTypes.string, // 如果 S 表示查询售卖停车位 H 出租停车位 SH 查询出租和出售车位 F 表示查询未售卖未出租停车位
            showSearchCondition: vc.propTypes.string = 'true'
        },
        data: {
            searchParkingAreaInfo: {
                parkingSpaces: [],
                total: 0,
                records: 1,
                num: '',
                areaNum: '',
                carNum: '',
                parkingAreas: [],
                psFlag: $props.parkingSpaceFlag,
                showSearchCondition: $props.showSearchCondition
            }
        },
        _initMethod: function () {
            $that._listSearchParkingAreas();
        },
        _initEvent: function () {
            vc.on('searchParkingArea', 'openSearchParkingAreaModel', function (_param) {
                $('#searchParkingAreaModel').modal('show');
                vc.component._refreshsearchParkingAreaData();
                vc.component._loadAllParkingAreaInfo(1, 10);
            });
            vc.on('searchParkingArea', 'showOwnerParkingSpaces', function (_parkingSpaces) {
                $('#searchParkingAreaModel').modal('show');
                vc.component.searchParkingAreaInfo.parkingSpaces = _parkingSpaces;
            });
            vc.on('searchParkingArea', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllParkingAreaInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllParkingAreaInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        num: vc.component.searchParkingAreaInfo.num,
                        areaNum: vc.component.searchParkingAreaInfo.areaNum,
                        carNum: vc.component.searchParkingAreaInfo.carNum,
                        state: $props.parkingSpaceFlag
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas',
                    param,
                    function (json) {
                        var _parkingSpaceInfo = JSON.parse(json);
                        vc.component.searchParkingAreaInfo.parkingSpaces = _parkingSpaceInfo.parkingSpaces;
                        vc.emit('searchParkingArea', 'paginationPlus', 'init', {
                            total: _parkingSpaceInfo.records,
                            dataCount: _parkingSpaceInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseParkingArea: function (_parkingSpace) {
                vc.emit($props.emitChooseParkingSpace, 'chooseParkingArea', _parkingSpace);
                vc.emit($props.emitLoadData, 'listParkingAreaData', {
                    psId: _parkingSpace.psId
                });
                $('#searchParkingAreaModel').modal('hide');
            },
            searchParkingAreas: function () {
                vc.component._loadAllParkingAreaInfo(1, 15);
            },
            resetParkingSpaces: function () {
                vc.component.searchParkingAreaInfo.carNum = "";
                vc.component.searchParkingAreaInfo.num = "";
                vc.component.searchParkingAreaInfo.areaNum = "";
                vc.component._loadAllParkingAreaInfo(1, 15);
            },
            _refreshsearchParkingAreaData: function () {
                vc.component.searchParkingAreaInfo.num = "";
            },
            _viewParkingSpaceState: function (state) {
                if (state == 'F') {
                    return "空闲";
                } else if (state == 'S') {
                    return "已售卖";
                } else if (state == 'H') {
                    return "已出租";
                } else {
                    return "未知";
                }
            },
            _listSearchParkingAreas: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _parkingAreaManageInfo = JSON.parse(json);
                        $that.searchParkingAreaInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            }
        }
    });
})(window.vc);