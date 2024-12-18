(function (vc, vm) {
    vc.extends({
        data: {
            deleteMaintainancePlanInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMaintainancePlan', 'openDeleteMaintainancePlanModal', function (_params) {
                vc.component.deleteMaintainancePlanInfo = _params;
                $('#deleteMaintainancePlanModel').modal('show');
            });
        },
        methods: {
            deleteMaintainancePlan: function () {
                vc.component.deleteMaintainancePlanInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainancePlan.deleteMaintainancePlan',
                    JSON.stringify(vc.component.deleteMaintainancePlanInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMaintainancePlanModel').modal('hide');
                            vc.emit('maintainancePlanManage', 'listMaintainancePlan', {});
                            vc.toast("删除成功");
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
            closeDeleteMaintainancePlanModel: function () {
                $('#deleteMaintainancePlanModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
