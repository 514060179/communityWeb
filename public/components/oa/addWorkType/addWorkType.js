(function (vc) {
    vc.extends({
        data: {
            addWorkTypeInfo: {
                wtId: '',
                typeName: '',
                smsWay: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addWorkType', 'openAddWorkTypeModal', function () {
                $('#addWorkTypeModel').modal('show');
            });
        },
        methods: {
            addWorkTypeValidate() {
                return vc.validate.validate({
                    addWorkTypeInfo: $that.addWorkTypeInfo
                }, {
                    'addWorkTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "类型名称不能超过200"
                        }
                    ],
                    'addWorkTypeInfo.smsWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通知方式不能为空"
                        }
                    ],
                    'addWorkTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注不能超过500"
                        }
                    ],
                });
            },
            saveWorkTypeInfo: function () {
                if (!$that.addWorkTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addWorkTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/workType.saveWorkType',
                    JSON.stringify($that.addWorkTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addWorkTypeModel').modal('hide');
                            $that.clearAddWorkTypeInfo();
                            vc.emit('workType', 'listWorkType', {});
                            vc.toast("添加成功");
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
            clearAddWorkTypeInfo: function () {
                $that.addWorkTypeInfo = {
                    typeName: '',
                    smsWay: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
