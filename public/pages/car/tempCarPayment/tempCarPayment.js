/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            tempCarPaymentInfo: {
                payments: [],
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
                    paId: '',
                    iotApiCode: 'listCarInoutPaymentBmoImpl'
                }
            }
        },
        _initMethod: function () {
            vc.initDateTime('carInStartTime', function (_value) {
                $that.tempCarPaymentInfo.conditions.startTime = _value;
            });
            vc.initDateTime('carInEndTime', function (_value) {
                $that.tempCarPaymentInfo.conditions.endTime = _value;
            });
            $that._loadParkingArea(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('carInoutManage', 'listCarInout',
                function (_param) {
                    $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listCarIns(_currentPage, DEFAULT_ROWS);
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
                        $that.tempCarPaymentInfo.parkingAreas = _json.parkingAreas;
                        if (_json.parkingAreas && _json.parkingAreas.length > 0) {
                            $that._swatchParkingArea(_json.parkingAreas[0])
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });

            },
            _swatchParkingArea: function (_parkingArea) {
                $that.tempCarPaymentInfo.conditions.paId = _parkingArea.paId;
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listCarIns: function (_page, _rows) {
                $that.tempCarPaymentInfo.conditions.page = _page;
                $that.tempCarPaymentInfo.conditions.row = _rows;
                $that.tempCarPaymentInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.tempCarPaymentInfo.conditions
                };
                param.params.carNum = param.params.carNum.trim();
                param.params.inoutId = param.params.inoutId.trim();
                //发送get请求
                vc.http.apiGet('/iot.getOpenApi', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.tempCarPaymentInfo.total = _json.total;
                        $that.tempCarPaymentInfo.records = _json.records;
                        $that.tempCarPaymentInfo.payments = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.tempCarPaymentInfo.records,
                            dataCount: $that.tempCarPaymentInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            //查询
            _queryCarInoutMethod: function () {
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCarInoutMethod: function () {
                $that.tempCarPaymentInfo.conditions.carNum = "";
                $that.tempCarPaymentInfo.conditions.inoutId = "";
                $that.tempCarPaymentInfo.conditions.startTime = "";
                $that.tempCarPaymentInfo.conditions.endTime = "";
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.tempCarPaymentInfo.moreCondition) {
                    $that.tempCarPaymentInfo.moreCondition = false;
                } else {
                    $that.tempCarPaymentInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);