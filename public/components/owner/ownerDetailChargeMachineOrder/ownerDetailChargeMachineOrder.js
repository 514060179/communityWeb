/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailChargeMachineOrderInfo: {
                chargeMachineOrders: [],
                ownerId: '',
                link: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailChargeMachineOrder', 'switch', function (_data) {
                $that.ownerDetailChargeMachineOrderInfo.ownerId = _data.ownerId;
                $that.ownerDetailChargeMachineOrderInfo.link = _data.link;
                $that._loadOwnerDetailChargeMachineOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailChargeMachineOrder', 'listChargeMachineOrder',
                function (_data) {
                    $that._loadOwnerDetailChargeMachineOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('ownerDetailChargeMachineOrder', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadOwnerDetailChargeMachineOrderData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailChargeMachineOrderData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        personTel: $that.ownerDetailChargeMachineOrderInfo.link,
                        iotApiCode:'listChargeMachineOrderBmoImpl',
                    }
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.ownerDetailChargeMachineOrderInfo.chargeMachineOrders = _roomInfo.data;
                        vc.emit('ownerDetailChargeMachineOrder', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailChargeMachineOrder: function () {
                $that._loadOwnerDetailChargeMachineOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOrderAccts: function (_order) { // 展示扣款明细
                vc.jumpToPage('/#/pages/machine/chargeMachineOrderAccts?orderId=' + _order.orderId)
            },
            _showStopCharge: function (_order) {
                vc.emit('stopChargeMachine', 'openStopChargeMachineModal', _order);
            },

        }
    });
})(window.vc);