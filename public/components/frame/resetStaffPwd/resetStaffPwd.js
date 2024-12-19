(function (vc) {
    vc.extends({
        data: {
            resetStaffPwdInfo: {}
        },
        _initEvent: function () {
            vc.on('resetStaffPwd', 'openResetStaffPwd', function (_staffInfo) {
                $that.resetStaffPwdInfo = _staffInfo;
                $('#resetStaffPwdModel').modal('show');
            });
        },
        methods: {
            closeDeleteStaffModel: function () {
                $('#resetStaffPwdModel').modal('hide');
            },
            resetStaffPwd: function () {
                var _dataObj = {
                    communityId: vc.getCurrentCommunity().communityId,
                    staffId: $that.resetStaffPwdInfo.userId
                };
                vc.http.apiPost(
                    '/user.resetStaffPwd',
                    JSON.stringify(_dataObj), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#resetStaffPwdModel').modal('hide');
                            //vc.toast("修改密码成功，密码为" + _json.pwd + "请及时修改密码", 10 * 1000, true);
                            vc.confirmDialog({
                                title: '操作成功',
                                message: "修改密码成功，密码为" + _json.pwd + "请及时修改密码",
                                onConfirm: function() {
                                    // 执行确认操作的逻辑
                                },
                                onCancel: function() {
                                    // 执行取消操作的逻辑
                                }
                            });
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        $that.resetStaffPwdInfo.errorInfo = errInfo;
                    }
                );
            }
        }
    });
})(window.vc);