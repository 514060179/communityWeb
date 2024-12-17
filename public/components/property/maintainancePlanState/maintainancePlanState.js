(function (vc, vm) {
    vc.extends({
        data: {
            maintainancePlanStateInfo: {
                planId: '',
                stateName: '',
                state: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('maintainancePlanState', 'openMaintainancePlanStateModal', function (_params) {
                vc.copyObject(_params, vc.component.maintainancePlanStateInfo);
                $('#maintainancePlanStateModel').modal('show');
            });
        },
        methods: {
            _changeMaintainancePlanState: function () {
                vc.component.maintainancePlanStateInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainancePlan.updateMaintainancePlanState',
                    JSON.stringify(vc.component.maintainancePlanStateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#maintainancePlanStateModel').modal('hide');
                            vc.emit('maintainancePlanManage', 'listMaintainancePlan', {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            _closeMaintainancePlanStateModel: function () {
                $('#maintainancePlanStateModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
