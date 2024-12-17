/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            transferGoodsManageInfo: {
                description: '',
                endUserInfo: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: '',
                    staffTel: ''
                },
                resourceStores: []
            }
        },
        _initMethod: function () {
            vc.component._initStep();
        },
        _initEvent: function () {
            vc.on('transferGoodsManageInfo', 'setSelectResourceStores', function (resourceStores) {
                console.log('set on :', resourceStores);
                // 保留用户之前输入的数量和备注
                let oldList = vc.component.transferGoodsManageInfo.resourceStores;
                resourceStores.forEach((newItem) => {
                    newItem.quantity = 0;
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId) {
                            newItem.giveQuantity = oldItem.giveQuantity;
                            newItem.price = oldItem.price;
                            newItem.purchaseRemark = oldItem.purchaseRemark;
                        }
                    })
                })
                vc.component.transferGoodsManageInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _initStep: function(){
                // 重置数据
                vc.component.transferGoodsManageInfo.resourceStores = [];
                vc.component.transferGoodsManageInfo.description = '';
                vc.component.transferGoodsManageInfo.endUserInfo = {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: '',
                    staffTel: ''
                };
            },
            chooseEndUser: function () {
                vc.emit('selectStaff', 'openStaff', $that.transferGoodsManageInfo.endUserInfo);
            },
            _openSelectResourceStaffInfoModel() {
                vc.emit('chooseResourceStaff', 'openChooseResourceStaffModel', {});
            },
            _finishStep: function () {
                let postData = {
                    resourceStores: vc.component.transferGoodsManageInfo.resourceStores,
                    description: vc.component.transferGoodsManageInfo.description,
                    file: '',
                    acceptUserId: vc.component.transferGoodsManageInfo.endUserInfo.staffId,
                    acceptUserName: vc.component.transferGoodsManageInfo.endUserInfo.staffName
                };
                let currentUserId = vc.getData("/nav/getUserInfo").userId;
                if (currentUserId == postData.acceptUserId) {
                    vc.toast("不能转赠给自己");
                    return;
                }
                if(!postData.acceptUserId){
                    vc.toast("请选择受赠人");
                    return;
                }
                if(!postData.description){
                    vc.toast("请填写转赠说明");
                    return;
                }
                let _resourceStores = postData.resourceStores;
                if (_resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                // 校验商品信息
                for (var i = 0; i < _resourceStores.length; i++) {
                    if (!_resourceStores[i].hasOwnProperty("giveQuantity") || parseFloat(_resourceStores[i].giveQuantity) <= 0) {
                        vc.toast("请填写数量");
                        return;
                    }
                    _resourceStores[i].giveQuantity = parseFloat(_resourceStores[i].giveQuantity);
                    if (_resourceStores[i].giveQuantity > parseFloat(_resourceStores[i].miniStock)) {
                        vc.toast(_resourceStores[i].resName + ",库存不足");
                        return;
                    }
                }
                vc.http.apiPost('/resourceStore.saveAllocationUserStorehouse',
                    JSON.stringify(postData), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.jumpToPage("/#/pages/common/myResourceStoreManage");
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);