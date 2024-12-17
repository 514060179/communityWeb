(function (vc) {
    vc.extends({
        data: {
            addRepairSettingInfo: {
                settingId: '',
                repairTypeName: '',
                repairWay: '200',
                repairSettingType: '200',
                remark: '',
                publicArea: 'F',
                payFeeFlag: 'F',
                priceScope: '',
                returnVisitFlag: '003',
                isShow: 'Y',
                notifyWay: 'WECHAT'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addRepairSetting', 'openAddRepairSettingModal', function () {
                $('#addRepairSettingModel').modal('show');
            });
        },
        methods: {
            addRepairSettingValidate() {
                return vc.validate.validate({
                    addRepairSettingInfo: $that.addRepairSettingInfo
                }, {
                    'addRepairSettingInfo.repairTypeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxIn",
                            param: "1,200",
                            errInfo: "类型名称不能超过200位"
                        },
                    ],
                    'addRepairSettingInfo.repairSettingType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修设置类型不能为空"
                        }
                    ],
                    'addRepairSettingInfo.repairWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "派单方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "派单方式格式错误"
                        },
                    ],
                    'addRepairSettingInfo.publicArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公共区域不能为空"
                        }
                    ],
                    'addRepairSettingInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主端展示不能为空"
                        }
                    ],
                    'addRepairSettingInfo.payFeeFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费情况不能为空"
                        }
                    ],
                    'addRepairSettingInfo.returnVisitFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回访设置不能为空"
                        }
                    ],
                    'addRepairSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "说明不能超过500位"
                        },
                    ]
                });
            },
            saveRepairSettingInfo: function () {
                if ($that.addRepairSettingInfo.payFeeFlag == 'F') {
                    $that.addRepairSettingInfo.priceScope = '不收费';
                }
                if (!$that.addRepairSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addRepairSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/repair.saveRepairSetting',
                    JSON.stringify($that.addRepairSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRepairSettingModel').modal('hide');
                            $that.clearAddRepairSettingInfo();
                            vc.emit('repairSettingManage', 'listRepairSetting', {});
                            vc.toast("添加成功，请记得绑定维修师傅！");
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
            clearAddRepairSettingInfo: function () {
                $that.addRepairSettingInfo = {
                    settingId: '',
                    repairTypeName: '',
                    repairWay: '200',
                    repairSettingType: '200',
                    remark: '',
                    publicArea: 'F',
                    payFeeFlag: 'F',
                    priceScope: '',
                    returnVisitFlag: '003',
                    isShow: 'Y',
                    notifyWay: 'WECHAT'
                };
            }
        }
    });
})(window.vc);
