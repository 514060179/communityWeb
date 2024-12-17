/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            urgentPurchaseApplyStepInfo: {
                resourceStores: [],
                description: '',
                endUserName: '',
                endUserTel: '',
                file: '',
                resOrderType: '',
                staffId: '',
                shId: '',
                staffName: '',
                communityId: vc.getCurrentCommunity().communityId,
                storehouses: [],
                storehousesB: [],
            }
        },
        _initMethod: function () {
            $that._reset();
            //10000 采购 20000出库
            $that.urgentPurchaseApplyStepInfo.resOrderType = vc.getParam('resOrderType');
            let userInfo = vc.getData('/nav/getUserInfo');
            $that.urgentPurchaseApplyStepInfo.endUserName = userInfo.name;
            $that.urgentPurchaseApplyStepInfo.endUserTel = userInfo.tel;
            $that._listAllocationStorehouse();
            $that._listAllocationStorehouseB();
        },
        _initEvent: function () {
            vc.on('urgentPurchaseApplyStep', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, $that.urgentPurchaseApplyStepInfo);
            });
            vc.on('urgentPurchaseApplyStep', 'setSelectResourceStores', function (resourceStores) {
                let oldList = $that.urgentPurchaseApplyStepInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    newItem.shzId = '';
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId) {
                            delete resourceStores[newIndex];
                        }
                    })
                })
                // 合并已有商品和新添加商品
                resourceStores.push.apply(resourceStores, oldList);
                // 过滤空元素
                resourceStores = resourceStores.filter((s) => {
                    return s.hasOwnProperty('resId');
                });
                $that.urgentPurchaseApplyStepInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _reset: function(){
                $that.urgentPurchaseApplyStepInfo = {
                    resourceStores: [],
                    description: '',
                    endUserName: '',
                    endUserTel: '',
                    file: '',
                    resOrderType: '',
                    staffId: '',
                    shId: '',
                    staffName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    storehouses: [],
                    storehousesB: []
                };
            },
            // 验证物品来自同一仓库
            _resourcesFromSameHouse(resourcesList) {
                if (!resourcesList || resourcesList.length < 2) {
                    return true;
                }
                let lastHouse = '';
                let sign = true;
                for (let i = 0; i < resourcesList.length; i++) {
                    if (lastHouse == '') {
                        lastHouse = resourcesList[i].shId;
                        continue;
                    }
                    if (lastHouse == resourcesList[i].shId) {
                        continue;
                    } else {
                        sign = false;
                        break;
                    }
                }
                return sign;
            },
            _finishStep: function () {
                let _resourceStores = $that.urgentPurchaseApplyStepInfo.resourceStores;
                if (!_resourceStores || _resourceStores.length < 1) {
                    vc.toast('请选择采购物品');
                    return;
                }
                if (!$that._resourcesFromSameHouse(_resourceStores)) {
                    vc.toast('采购商品需来自同一仓库！');
                    return;
                }
                let _saveFlag = true;
                _resourceStores.forEach(item => {
                    if (!item.shzId) {
                        vc.toast("请选择" + item.resName + "的目标仓库");
                        _saveFlag = false;
                        return;
                    }
                    if (!item.quantity || item.quantity <= 0) {
                        vc.toast("请填写" + item.resName + "的采购数量");
                        _saveFlag = false;
                        return;
                    }
                    if (!item.urgentPrice || item.urgentPrice <= 0) {
                        vc.toast("请填写" + item.resName + "的采购单价");
                        _saveFlag = false;
                        return;
                    }
                });
                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    '/purchase/urgentPurchaseApply',
                    JSON.stringify($that.urgentPurchaseApplyStepInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openSelectResourceStoreInfoModel() {
                let _shId = $that.urgentPurchaseApplyStepInfo.shId;
                let endUserName = $that.urgentPurchaseApplyStepInfo.endUserName;
                let endUserTel = $that.urgentPurchaseApplyStepInfo.endUserTel;
                let description = $that.urgentPurchaseApplyStepInfo.description;
                if (!_shId) {
                    vc.toast('请选择仓库！');
                    return;
                }
                if (!endUserName) {
                    vc.toast('选择联系人！');
                    return;
                }
                if (!endUserTel) {
                    vc.toast('选择联系电话！');
                    return;
                }
                if (!description) {
                    vc.toast('选择申请说明！');
                    return;
                }
                vc.emit('chooseResourceStore4', 'openChooseResourceStoreModel4', {
                    shId: $that.urgentPurchaseApplyStepInfo.shId
                });
            },
            _listAllocationStorehouse: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        // communityId: vc.getCurrentCommunity().communityId,
                        allowPurchase: 'ON'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        $that.urgentPurchaseApplyStepInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _listAllocationStorehouseB: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        $that.urgentPurchaseApplyStepInfo.storehousesB = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            storeHousesChange: function (e, i) {
                let shId = e.target.value;
                $that.urgentPurchaseApplyStepInfo.storehouses.forEach((item) => {
                    if (item.shId == shId) {
                        $that.urgentPurchaseApplyStepInfo.resourceStores[i].shzName = item.shName;
                    }
                })
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                $that.urgentPurchaseApplyStepInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        $that.urgentPurchaseApplyStepInfo.resourceStores.splice(index, 1);
                    }
                })
            },

            _computeFlow: function () {
                // 仓库一改变，就清空已选择的商品信息
                $that.urgentPurchaseApplyStepInfo.resourceStores = [];
            },
        }
    });
})(window.vc);