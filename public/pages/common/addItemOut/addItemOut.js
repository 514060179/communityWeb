/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addItemOutInfo: {
                resourceStores: [],
                resourceSuppliers: [],
                audit: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
                endUserInfo: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: '',
                    staffTel: ''
                },
                description: '',
                endUserName: '',
                endUserTel: '',
                acceptStaffId: '',
                file: '',
                resOrderType: '20000',
                staffId: '',
                staffName: '',
                communityId: vc.getCurrentCommunity().communityId,
                shId: '',
                storehouses: [],
                flowId: '',
                canChooseEndUserOrNot: false,
            }
        },
        _initMethod: function () {
            $that._reset();
            let from = vc.getParam('from');
            if (from == 'resourceStore') {
                // 如果是从物品信息页面跳转过来的，可以选择联系人(endUserName)联系电话(endUserTel)
                $that.addItemOutInfo.canChooseEndUserOrNot = true;
            }
            //10000 采购 20000出库
            let userInfo = vc.getData('/nav/getUserInfo');
            // $that.addItemOutInfo.endUserName = userInfo.name;
            // $that.addItemOutInfo.endUserTel = userInfo.tel;
            $that.addItemOutInfo.endUserInfo.staffName = userInfo.name;
            $that.addItemOutInfo.endUserInfo.staffTel = userInfo.tel;
            $that._loadResourceSuppliers();
            $that._listPurchaseStorehouses();
        },
        _initEvent: function () {
            vc.on('addItemOut', 'setSelectResourceStores', function (resourceStores) {
                let oldList = $that.addItemOutInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    newItem.timesId = '';
                    if (newItem.times && newItem.times.length > 0) {
                        newItem.timesId = newItem.times[0].timesId;
                    }
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId && newItem.times && newItem.times.length < 2) {
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
                $that.addItemOutInfo.resourceStores = resourceStores;
            })
        },
        methods: {
            _reset: function () {
                $that.addItemOutInfo = {
                    resourceStores: [],
                    resourceSuppliers: [],
                    audit: {
                        assignee: '',
                        staffId: '',
                        staffName: '',
                        taskId: ''
                    },
                    endUserInfo: {
                        assignee: '',
                        staffId: '',
                        staffName: '',
                        taskId: '',
                        staffTel: ''
                    },
                    description: '',
                    endUserName: '',
                    endUserTel: '',
                    acceptStaffId: '',
                    file: '',
                    resOrderType: '20000',
                    staffId: '',
                    staffName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    shId: '',
                    storehouses: [],
                    flowId: '',
                    canChooseEndUserOrNot: false,
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
            _openSelectResourceStoreInfoModel() {
                let _shId = $that.addItemOutInfo.shId;
                let endUserName = $that.addItemOutInfo.endUserInfo.staffName;
                let endUserTel = $that.addItemOutInfo.endUserInfo.staffTel;
                let description = $that.addItemOutInfo.description;
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
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: $that.addItemOutInfo.shId
                });
            },
            _finishStep: function () {
                let _resourceStores = $that.addItemOutInfo.resourceStores;
                if (!_resourceStores || _resourceStores.length < 0) {
                    vc.toast("未选择采购物品");
                    return;
                }
                if (!$that._resourcesFromSameHouse(_resourceStores)) {
                    vc.toast('领用商品需来自同一仓库！');
                    return;
                }
                let _validate = true;
                _resourceStores.forEach(item => {
                    let _selectedStock = item.selectedStock;
                    let _quantity = item.quantity;
                    if (parseFloat(_quantity) > parseFloat(_selectedStock)) {
                        _validate = false;
                    }
                });
                if (!_validate) {
                    vc.toast('库存不够');
                    return;
                }
                // endUserName和endUserTel从endUserInfo对象里取值
                $that.addItemOutInfo.endUserName = $that.addItemOutInfo.endUserInfo.staffName;
                $that.addItemOutInfo.endUserTel = $that.addItemOutInfo.endUserInfo.staffTel;
                $that.addItemOutInfo.acceptStaffId = $that.addItemOutInfo.endUserInfo.staffId;
                if($that.addItemOutInfo.canChooseEndUserOrNot){
                    $that.addItemOutInfo.useSwitch = "OFF";
                }
                vc.http.apiPost(
                    '/collection/goodsCollection',
                    JSON.stringify($that.addItemOutInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            vc.toast("操作成功");
                            return;
                        } else if (_json.code == 404) {
                            vc.toast(_json.msg);
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadResourceSuppliers() {
                let param = {
                    params: {page: 1, row: 50}
                };
                //发送get请求
                vc.http.apiGet('/resourceSupplier.listResourceSuppliers',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addItemOutInfo.resourceSuppliers = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listPurchaseStorehouses: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        allowUse: 'ON'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addItemOutInfo.storehouses = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                $that.addItemOutInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        $that.addItemOutInfo.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
            },
            _changeTimesId: function (e, index) {
                let timeId = e.target.value;
                let times = $that.addItemOutInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        $that.addItemOutInfo.resourceStores[index].selectedStock = item.stock;
                    }
                });
                $that.$forceUpdate();
            },
            _getTimesStock: function (_resourceStore) {
                if (!_resourceStore.timesId) {
                    return "-";
                }
                let _stock = 0;
                _resourceStore.times.forEach(_item => {
                    if (_item.timesId == _resourceStore.timesId) {
                        _stock = _item.stock;
                    }
                });
                if (!_resourceStore.quantity) {
                    _resourceStore.quantity = '';
                }
                return _stock;
            },
            _loadStaffOrg: function (_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function (json, res) {
                        let _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data[0], $that.addItemOutInfo.audit);
                        if (!_data[0].assignee.startsWith('-')) {
                            $that.addItemOutInfo.audit.staffId = $that.addItemOutInfo.audit.assignee;
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.addItemOutInfo.audit);
            },
            chooseEndUser: function () {
                vc.emit('selectStaff', 'openStaff', $that.addItemOutInfo.endUserInfo);
            },
            _computeFlow: function () {
                // 仓库一改变，就清空已选择的商品信息
                $that.addItemOutInfo.resourceStores = [];
                let _storehouses = $that.addItemOutInfo.storehouses;
                let _flowId = "";
                _storehouses.forEach(item => {
                    if ($that.addItemOutInfo.shId == item.shId) {
                        _flowId = item.useFlowId;
                    }
                });
                $that.addItemOutInfo.flowId = _flowId;
                if (!_flowId) {
                    return;
                }
                $that._loadStaffOrg(_flowId);
            }
        }
    });
})(window.vc);