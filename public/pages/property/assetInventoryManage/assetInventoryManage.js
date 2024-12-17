/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryManageInfo: {
                assetInventorys: [],
                storehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                aiId: '',
                states: [],
                conditions: {
                    shId: '',
                    staffName: '',
                    state: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                curStaffId: ''
            }
        },
        _initMethod: function () {
            $that.assetInventoryManageInfo.curStaffId = vc.getData('/nav/getUserInfo').userId;
            $that._listShopHouses();
            vc.component._initAssetInventoryDateInfo();
            $that._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('asset_inventory', "state", function (_data) {
                $that.assetInventoryManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('assetInventoryManage', 'listAssetInventory', function (_param) {
                $that._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listAssetInventorys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initAssetInventoryDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.assetInventoryManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.assetInventoryManageInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.assetInventoryManageInfo.conditions.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listAssetInventorys: function (_page, _rows) {
                $that.assetInventoryManageInfo.conditions.page = _page;
                $that.assetInventoryManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.assetInventoryManageInfo.conditions
                };
                param.params.staffName = param.params.staffName.trim();
                //发送get请求
                vc.http.apiGet('/assetInventory.listAssetInventory',
                    param,
                    function (json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        $that.assetInventoryManageInfo.total = _assetInventoryManageInfo.total;
                        $that.assetInventoryManageInfo.records = _assetInventoryManageInfo.records;
                        $that.assetInventoryManageInfo.assetInventorys = _assetInventoryManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.assetInventoryManageInfo.records,
                            dataCount: $that.assetInventoryManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAssetInventoryModal: function () {
                vc.jumpToPage("/#/pages/property/assetInventoryIn");
            },
            _openEditAssetInventoryModel: function (_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryEdit?aiId=' + _assetInventory.aiId);
            },
            _openAuditAssetInventoryModel: function (_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryAudit?aiId=' + _assetInventory.aiId);
            },
            _openInStockAssetInventoryModel: function (_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryInStock?aiId=' + _assetInventory.aiId);
            },
            _openDeleteAssetInventoryModel: function (_assetInventory) {
                vc.emit('deleteAssetInventory', 'openDeleteAssetInventoryModal', _assetInventory);
            },
            _openCancelAssetInventoryModel: function (_assetInventory) {
                vc.emit('cancelAssetInventory', 'openCancelAssetInventoryModal', _assetInventory);
            },
            //查询
            _queryAssetInventoryMethod: function () {
                $that._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAssetInventoryMethod: function () {
                $that.assetInventoryManageInfo.conditions.shId = "";
                $that.assetInventoryManageInfo.conditions.staffName = "";
                $that.assetInventoryManageInfo.conditions.state = "";
                $that.assetInventoryManageInfo.conditions.startTime = "";
                $that.assetInventoryManageInfo.conditions.endTime = "";
                $that._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getInvLoss: function (_assetInventory) {
                let _invLoss = parseInt(_assetInventory.quantity) - parseInt(_assetInventory.invQuantity);
                if (_invLoss > 0) {
                    return _invLoss;
                }
                return 0;
            },
            _getInvProfit: function (_assetInventory) {
                let _invProfit = parseInt(_assetInventory.invQuantity) - parseInt(_assetInventory.quantity);
                if (_invProfit > 0) {
                    return _invProfit;
                }
                return 0;
            },
            _getInvLossMoney: function (_assetInventory) {
                let _invLoss = parseInt(_assetInventory.quantityMoney) - parseInt(_assetInventory.invQuantityMoney);
                if (_invLoss > 0) {
                    return _invLoss;
                }
                return 0;
            },
            _getInvProfitMoney: function (_assetInventory) {
                let _invProfit = parseInt(_assetInventory.invQuantityMoney) - parseInt(_assetInventory.quantityMoney);
                if (_invProfit > 0) {
                    return _invProfit;
                }
                return 0;
            },
            _moreCondition: function () {
                if ($that.assetInventoryManageInfo.moreCondition) {
                    $that.assetInventoryManageInfo.moreCondition = false;
                } else {
                    $that.assetInventoryManageInfo.moreCondition = true;
                }
            },
            _listShopHouses: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                $that.assetInventoryManageInfo.storehouses = [{
                    shName: '全部',
                    shId: ''
                }];
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        _json.data.forEach(item => {
                            $that.assetInventoryManageInfo.storehouses.push(item);
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //导出
            _exportAssetInventoryManage: function () {
                vc.component.assetInventoryManageInfo.conditions.pagePath = 'assetInventoryManage';
                let param = {
                    params: vc.component.assetInventoryManageInfo.conditions
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
            },
            swatchStorehouse: function (_item) {
                $that.assetInventoryManageInfo.conditions.shId = _item.shId;
                $that._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);