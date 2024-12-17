/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingBoxManageInfo: {
                parkingBoxs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                boxId: '',
                conditions: {
                    boxId: '',
                    boxName: '',
                    tempCarIn: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    iotApiCode:'listParkingBoxBmoImpl'
                }
            }
        },
        _initMethod: function () {
            $that._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('parkingBoxManage', 'listParkingBox', function (_param) {
                $that._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listParkingBoxs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingBoxs: function (_page, _rows) {
                $that.parkingBoxManageInfo.conditions.page = _page;
                $that.parkingBoxManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.parkingBoxManageInfo.conditions
                };
                param.params.boxId = param.params.boxId.trim();
                param.params.boxName = param.params.boxName.trim();
                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.parkingBoxManageInfo.total = _json.total;
                        $that.parkingBoxManageInfo.records = _json.records;
                        $that.parkingBoxManageInfo.parkingBoxs = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.parkingBoxManageInfo.records,
                            dataCount: $that.parkingBoxManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // _openAddParkingBoxModal: function () {
            //     vc.emit('addParkingBox', 'openAddParkingBoxModal', {});
            // },
            // _openEditParkingBoxModel: function (_parkingBox) {
            //     vc.emit('editParkingBox', 'openEditParkingBoxModal', _parkingBox);
            // },
            // _openDeleteParkingBoxModel: function (_parkingBox) {
            //     vc.emit('deleteParkingBox', 'openDeleteParkingBoxModal', _parkingBox);
            // },
            //查询
            _queryParkingBoxMethod: function () {
                $that._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetParkingBoxMethod: function () {
                $that.parkingBoxManageInfo.conditions.boxId = "";
                $that.parkingBoxManageInfo.conditions.boxName = "";
                $that.parkingBoxManageInfo.conditions.tempCarIn = "";
                $that._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.parkingBoxManageInfo.moreCondition) {
                    $that.parkingBoxManageInfo.moreCondition = false;
                } else {
                    $that.parkingBoxManageInfo.moreCondition = true;
                }
            },
            _parkingBoxArea: function (_parkingBox) {
                vc.jumpToPage('/#/pages/property/parkingBoxAreaManage?boxId=' + _parkingBox.boxId + "&boxName=" + _parkingBox.boxName);
            },
            _openParkingAreaControl: function (_parkingBox) {
                //vc.jumpToPage('/#/pages/property/parkingAreaControl?boxId=' + _parkingBox.boxId + "&paId=" + _parkingBox.paId);

                //获取用户名
                let param = {
                    params:{
                        targetUrl: encodeURIComponent('/#/pages/car/parkingAreaControl?boxId=' + _parkingBox.boxId + "&paId=" + _parkingBox.paId),
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
            }
        }
    });
})(window.vc);