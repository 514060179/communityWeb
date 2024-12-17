/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailCarInoutInfo: {
                carIns: [],
                carId: '',
                memberId:'',
                carNum:'',
                areaNum:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailCarInout', 'switch', function (_data) {
                $that.carDetailCarInoutInfo.carId = _data.carId;
                $that.carDetailCarInoutInfo.carNum = _data.carNum;
                $that.carDetailCarInoutInfo.areaNum = _data.areaNum;
                $that.carDetailCarInoutInfo.memberId = _data.memberId;
                $that._loadCarDetailCarInoutData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailCarInout', 'notify',
                function (_data) {
                    $that._loadCarDetailCarInoutData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailCarInout', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadCarDetailCarInoutData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailCarInoutData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carNum: $that.carDetailCarInoutInfo.carNum,
                        paNum:$that.carDetailCarInoutInfo.areaNum,
                        iotApiCode: 'listCarInoutDetailBmoImpl',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.carDetailCarInoutInfo.carIns = _roomInfo.data;
                        vc.emit('carDetailCarInout', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyCarDetailCarInout: function () {
                $that._loadCarDetailCarInoutData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            
        }
    });
})(window.vc);