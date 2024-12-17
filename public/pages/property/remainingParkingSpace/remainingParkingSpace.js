(function (vc) {
    vc.extends({
        data: {
            remainingParkingSpaceInfo: {
                total: 0,
                freeCount: 0,
                createTime: vc.dateTimeFormat(new Date().getTime())
            }
        },
        _initMethod: function () {
            //$that._listRemainingParkingSpaceData();
        },
        _initEvent: function () {
        },
        methods: {
            _listRemainingParkingSpaceData: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        iotApiCode:'getFreeParkingSpaceBmoImpl'
                    }
                }
                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            let _json = JSON.parse(json).data;
                            $that.remainingParkingSpaceInfo.total = _json.total;
                            $that.remainingParkingSpaceInfo.freeCount = _json.freeCount;
                            $that.remainingParkingSpaceInfo.createTime = vc.dateTimeFormat(new Date().getTime());
                            vc.toast("刷新成功");
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _freshRemainingParkingSpace: function () {
                $that._listRemainingParkingSpaceData();
            }
        }
    })
})(window.vc);