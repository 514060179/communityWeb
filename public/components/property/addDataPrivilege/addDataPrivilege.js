(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addDataPrivilegeInfo: {
                dpId: '',
                name: '',
                code: '',
                communityId: vc.getCurrentCommunity().communityId,
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addDataPrivilege', 'openAddDataPrivilegeModal', function () {
                $('#addDataPrivilegeModel').modal('show');
            });
        },
        methods: {
            addDataPrivilegeValidate() {
                return vc.validate.validate({
                    addDataPrivilegeInfo: $that.addDataPrivilegeInfo
                }, {
                    'addDataPrivilegeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        }
                    ],
                    'addDataPrivilegeInfo.code': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "编号不能超过30"
                        }
                    ],
                    'addDataPrivilegeInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "communityId不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "communityId不能超过30"
                        }
                    ],
                    'addDataPrivilegeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "备注不能超过256"
                        }
                    ]
                });
            },
            saveDataPrivilegeInfo: function () {
                if (!$that.addDataPrivilegeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addDataPrivilegeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, $that.addDataPrivilegeInfo);
                    $('#addDataPrivilegeModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/dataPrivilege.saveDataPrivilege',
                    JSON.stringify($that.addDataPrivilegeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addDataPrivilegeModel').modal('hide');
                            $that.clearAddDataPrivilegeInfo();
                            vc.emit('dataPrivilegeDiv', '_loadDataPrivilege', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddDataPrivilegeInfo: function () {
                let _communityId = $that.addDataPrivilegeInfo.communityId;
                $that.addDataPrivilegeInfo = {
                    name: '',
                    code: '',
                    communityId: _communityId,
                    remark: ''
                };
            }
        }
    });
})(window.vc);