(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            printAssetInventoryInStockInfo: {
                storehouses: [],
                conditions: {}
            },
            printFlag: '0'
        },
        _initMethod: function () {
            vc.component._initPrintAssetInventoryInStockInfo();
            vc.component._listPrintAssetInventoryInStock(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('printAssetInventoryInStock', 'openPrintAssetInventoryInStockModal', function (_allocationStorehouseDetailInfo) {
                $that.printAssetInventoryInStockInfo = _allocationStorehouseDetailInfo;
                $('#printAssetInventoryInStockModel').modal('show');
            });
        },
        methods: {
            _initPrintAssetInventoryInStockInfo: function () {
                let aiId = vc.getParam('aiId');
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: aiId
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventory.listAssetInventory',
                    param,
                    function (json, res) {
                        var _printAssetInventoryInStockInfo = JSON.parse(json);
                        var _printAssetInventoryInStock = _printAssetInventoryInStockInfo.data[0];
                        vc.component.printAssetInventoryInStockInfo.conditions = _printAssetInventoryInStock;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listPrintAssetInventoryInStock: function (_page, _rows) {
                let aiId = vc.getParam('aiId');
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        applyOrderId: aiId
                    }
                };
                //发送get请求
                vc.http.apiGet('assetInventoryDetail.listAssetInventoryWholeDetail',
                    param,
                    function (json, res) {
                        let _assetInventoryInfo = JSON.parse(json);
                        let _assetInventory = _assetInventoryInfo.data;
                        vc.component.printAssetInventoryInStockInfo.storehouses = _assetInventory;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printAssetInventoryInStockDiv: function () {
                $that.printFlag = '1';
                document.getElementById("print-btn").style.display = "none";//隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });
})(window.vc);
