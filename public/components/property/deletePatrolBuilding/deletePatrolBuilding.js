(function (vc, vm) {
    vc.extends({
        data: {
            deletePatrolBuildingInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deletePatrolBuilding', 'openDeletePatrolBuildingModal', function (_params) {
                vc.component.deletePatrolBuildingInfo = _params;
                $('#deletePatrolBuildingModel').modal('show');
            });
        },
        methods: {
            deletePatrolBuilding: function () {
                vc.component.deletePatrolBuildingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/patrolBuilding.deletePatrolBuilding',
                    JSON.stringify(vc.component.deletePatrolBuildingInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePatrolBuildingModel').modal('hide');
                            vc.emit('patrolBuildingManage', 'listPatrolBuilding', {});
                            vc.toast("删除成功！");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeletePatrolBuildingModel: function () {
                $('#deletePatrolBuildingModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);