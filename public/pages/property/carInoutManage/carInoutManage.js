/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carInoutManageInfo: {
                carInouts: [],
                parkingAreas: [],
                total: 0,
                records: 1,
                moreCondition: false,
                carNum: '',
                conditions: {
                    state: '',
                    carNum: '',
                    inoutId: '',
                    carType: '',
                    startTime: '',
                    endTime: '',
                    paNum: '',
                    iotApiCode: 'listCarInoutDetailBmoImpl'
                }
            }
        },
        _initMethod: function () {
            $that._initCarInoutDate();
            $that._loadParkingArea();
            //$that._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('carInoutManage', 'listCarInout', function (_param) {
                $that._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listCarInouts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadParkingArea: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.carInoutManageInfo.parkingAreas = _json.parkingAreas;
                        if (_json.parkingAreas && _json.parkingAreas.length > 0) {
                            $that._swatchParkingArea(_json.parkingAreas[0])
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });

            },
            _swatchParkingArea: function (_parkingArea) {
                $that.carInoutManageInfo.conditions.paNum = _parkingArea.num;
                $that._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _initCarInoutDate: function () {
                vc.initDateTime('carInoutsStartTime', function (_value) {
                    $that.carInoutManageInfo.conditions.startTime = _value;
                });
                vc.initDateTime('carInoutsEndTime', function (_value) {
                    $that.carInoutManageInfo.conditions.endTime = _value;
                });
            },
            _listCarInouts: function (_page, _rows) {
                $that.carInoutManageInfo.conditions.page = _page;
                $that.carInoutManageInfo.conditions.row = _rows;
                $that.carInoutManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.carInoutManageInfo.conditions
                };
                param.params.carNum = param.params.carNum.trim();
                param.params.inoutId = param.params.inoutId.trim();
                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.carInoutManageInfo.total = _json.total;
                        $that.carInoutManageInfo.records = _json.records;
                        $that.carInoutManageInfo.carInouts = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.carInoutManageInfo.records,
                            dataCount: $that.carInoutManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCarInoutModal: function () {
                vc.emit('addCarInout', 'openAddCarInoutModal', {});
            },
            _openEditCarInoutModel: function (_carInout) {
                vc.emit('editCarInout', 'openEditCarInoutModal', _carInout);
            },
            _openDeleteCarInoutModel: function (_carInout) {
                vc.emit('deleteCarInout', 'openDeleteCarInoutModal', _carInout);
            },
            //查询
            _queryCarInoutMethod: function () {
                $that._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCarInoutMethod: function () {
                $that.carInoutManageInfo.conditions.state = "";
                $that.carInoutManageInfo.conditions.carNum = "";
                $that.carInoutManageInfo.conditions.inoutId = "";
                $that.carInoutManageInfo.conditions.startTime = "";
                $that.carInoutManageInfo.conditions.endTime = "";
                $that._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.carInoutManageInfo.moreCondition) {
                    $that.carInoutManageInfo.moreCondition = false;
                } else {
                    $that.carInoutManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);