(function (vc, vm) {
    vc.extends({
        data: {
            communityDataToIotInfo: {
                communityId:'',
                communityName:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('communityDataToIot', 'openCommunityDataToIotModal', function (_params) {
                vc.copyObject(_params,$that.communityDataToIotInfo);
                $('#communityDataToIotModel').modal('show');
            });
        },
        methods: {
            _toSendCommunityDataToIot: function () {
                vc.http.apiPost(
                    '/community.sendCommunityToIot',
                    JSON.stringify($that.communityDataToIotInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#communityDataToIotModel').modal('hide');
                            vc.toast("同步提交成功");
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
            closeCommunityDataToIotModel: function () {
                $('#communityDataToIotModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);