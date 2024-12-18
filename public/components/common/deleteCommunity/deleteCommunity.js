(function (vc, vm) {
    vc.extends({
        data: {
            deleteCommunityInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteCommunity', 'openDeleteCommunityModal', function (_params) {
                $that.deleteCommunityInfo = _params;
                $('#deleteCommunityModel').modal('show');
            });
        },
        methods: {
            deleteCommunity: function () {
                //$that.deleteCommunityInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/community.deleteCommunity',
                    JSON.stringify($that.deleteCommunityInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunityModel').modal('hide');
                            vc.emit('communityManage', 'listCommunity', {});
                            vc.emit('auditCommunityManage', 'listCommunity', {});
                            vc.toast("删除成功");
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
            closeDeleteCommunityModel: function () {
                $('#deleteCommunityModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);