/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaManageInfo: {
                parkingAreas: [],
                total: 0,
                records: 1,
                moreCondition: false,
                num: '',
                listColumns: [],
                conditions: {
                    num: '',
                    typeCd: '',
                    paId: ''
                }
            }
        },
        _initMethod: function () {
            $that._getColumns(function () {
                $that._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {
            vc.on('parkingAreaManage', 'listParkingArea',
                function (_param) {
                    $that._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listParkingAreas(_currentPage, DEFAULT_ROWS);
                }
            );
        },
        methods: {
            _listParkingAreas: function (_page, _rows) {
                $that.parkingAreaManageInfo.conditions.page = _page;
                $that.parkingAreaManageInfo.conditions.row = _rows;
                $that.parkingAreaManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.parkingAreaManageInfo.conditions
                };
                param.params.num = param.params.num.trim();
                param.params.paId = param.params.paId.trim();
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        var _parkingAreaManageInfo = JSON.parse(json);
                        $that.parkingAreaManageInfo.total = _parkingAreaManageInfo.total;
                        $that.parkingAreaManageInfo.records = _parkingAreaManageInfo.records;
                        $that.parkingAreaManageInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                        $that.dealParkingAreaAttr(_parkingAreaManageInfo.parkingAreas);
                        vc.emit('pagination', 'init', {
                            total: $that.parkingAreaManageInfo.records,
                            dataCount: $that.parkingAreaManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _openAddParkingAreaModal: function () {
                vc.emit('addParkingArea', 'openAddParkingAreaModal', {});
            },
            _openEditParkingAreaModel: function (_parkingArea) {
                vc.emit('editParkingArea', 'openEditParkingAreaModal', _parkingArea);
            },
            _openDeleteParkingAreaModel: function (_parkingArea) {
                vc.emit('deleteParkingArea', 'openDeleteParkingAreaModal', _parkingArea);
            },
            //查询
            _queryParkingAreaMethod: function () {
                $that._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //删除
            _resetParkingAreaMethod: function () {
                $that.parkingAreaManageInfo.conditions.num = "";
                $that.parkingAreaManageInfo.conditions.typeCd = "";
                $that.parkingAreaManageInfo.conditions.paId = "";
                $that._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.parkingAreaManageInfo.moreCondition) {
                    $that.parkingAreaManageInfo.moreCondition = false;
                } else {
                    $that.parkingAreaManageInfo.moreCondition = true;
                }
            },
            dealParkingAreaAttr: function (parkingAreas) {
                parkingAreas.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_parkingArea) {
                _parkingArea.listValues = [];
                console.log('attr', _parkingArea)
                if (!_parkingArea.hasOwnProperty('attrs') || _parkingArea.attrs.length < 1) {
                    $that.parkingAreaManageInfo.listColumns.forEach(_value => {
                        _parkingArea.listValues.push('');
                    })
                    return;
                }
                let _parkingAreaAttrDtos = _parkingArea.attrs;
                $that.parkingAreaManageInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _parkingAreaAttrDtos.forEach(_attrItem => {
                        if (_value.specCd == _attrItem.specCd) {
                            _tmpValue = _attrItem.value;
                        }
                    })
                    _parkingArea.listValues.push(_tmpValue);
                })
            },
            _getColumns: function (_call) {
                console.log('_getColumns');
                $that.parkingAreaManageInfo.listColumns = [];
                vc.getAttrSpec('parking_area_attr', function (data) {
                    $that.parkingAreaManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.parkingAreaManageInfo.listColumns.push({
                                specCd: item.specCd,
                                specName: item.specName
                            });
                        }
                    });
                    _call();
                });
            },
            _openParkingAreaText: function (_parkingArea) {
                vc.jumpToPage('/#/pages/property/parkingAreaText?paId=' + _parkingArea.paId)
            },
            _openParkingAreaTotalControl: function (_parkingArea) {

                //获取用户名
                let param = {
                    params:{
                        targetUrl: encodeURIComponent('/#/pages/car/parkingAreaTotalControl?paId=' + _parkingArea.paId),
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/iot.getIotToken',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        let _url = _json.data.url;
                        window.open(_url);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );

                //vc.jumpToPage('/#/pages/property/parkingAreaTotalControl?paId=' + _parkingArea.paId);
            }
        }
    });
})(window.vc);