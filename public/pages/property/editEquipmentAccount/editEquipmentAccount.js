(function (vc) {
    vc.extends({
        data: {
            editEquipmentAccountInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                brand: '',
                model: '',
                typeId: '',
                locationDetail: '',
                locationObjId: '',
                locationObjName: '',
                firstEnableTime: '',
                warrantyDeadline: '',
                usefulLife: '',
                importanceLevel: '',
                importanceLevels: [],
                state: '',
                purchasePrice: '',
                netWorth: '',
                useOrgId: "",
                useOrgName: "",
                useUserId: "",
                useUserName: "",
                useUseTel: "",
                chargeOrgId: "",
                chargeOrgName: "",
                chargeOrgTel: "",
                chargeUseId: "",
                chargeUseName: "",
                remark: '',
                useStatus: []
            },
        },
        _initMethod: function () {
            $that.editEquipmentAccountInfo.machineId = vc.getParam('machineId');
            vc.getDict('equipment_account', "importance_level", function (_data) {
                $that.editEquipmentAccountInfo.importanceLevels = _data;
            });
            vc.getDict('equipment_account', "state", function (_data) {
                $that.editEquipmentAccountInfo.useStatus = _data;
            });
            $that._initAddEquipmentAccountInfo();
            $that._listEquipmentAccounts();
        },
        _initEvent: function () {
        },
        methods: {
            _initAddEquipmentAccountInfo: function () {
                $('.addFirstEnableTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addFirstEnableTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addFirstEnableTime").val();
                        $that.editEquipmentAccountInfo.firstEnableTime = value;
                    });
                $('.addWarrantyDeadlineE').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    minView: 'month',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addWarrantyDeadlineE').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addWarrantyDeadlineE").val();
                        $that.editEquipmentAccountInfo.warrantyDeadline = value;
                    });
            },

            editEquipmentAccountValidate() {
                return vc.validate.validate({
                    editEquipmentAccountInfo: $that.editEquipmentAccountInfo
                }, {
                    'editEquipmentAccountInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "设备名称不能超过64"
                        },
                    ],
                    'editEquipmentAccountInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "设备编码不能超过64"
                        },
                    ],
                    'editEquipmentAccountInfo.importanceLevel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "重要等级不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "重要等级格式错误"
                        },
                    ],
                    'editEquipmentAccountInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "使用状态格式错误"
                        },
                    ],
                    'editEquipmentAccountInfo.brand': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备品牌不能超过32"
                        },
                    ],
                    'editEquipmentAccountInfo.model': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备型号不能超过32"
                        },
                    ],
                    'editEquipmentAccountInfo.netWorth': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "资产净值不能超过8"
                        },
                    ],
                    'editEquipmentAccountInfo.locationDetail': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "位置详情不能超过150"
                        },
                    ],
                    'editEquipmentAccountInfo.firstEnableTime': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "首次启用时间不能超过150"
                        },
                    ],
                    'editEquipmentAccountInfo.warrantyDeadline': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "保修截止日期不能超过150"
                        },
                    ],
                    'editEquipmentAccountInfo.purchasePrice': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "采购价格不能超过8"
                        },
                    ],
                    'editEquipmentAccountInfo.useUserName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用人不能为空"
                        }
                    ],
                    'editEquipmentAccountInfo.chargeUseName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "责任人不能为空"
                        }
                    ],
                    'editEquipmentAccountInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                });
            },
            saveEquipmentAccountInfo: function () {
                if (!$that.editEquipmentAccountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editEquipmentAccountInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/equipmentAccount.updateEquipmentAccount',
                    JSON.stringify($that.editEquipmentAccountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("修改成功");
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
            _listEquipmentAccounts: function (_page, _row) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineId: $that.editEquipmentAccountInfo.machineId
                    }
                };
                //发送get请求
                vc.http.apiGet('/equipmentAccount.listEquipmentAccount',
                    param,
                    function (json, res) {
                        let _equipmentAccountManageInfo = JSON.parse(json);
                        vc.copyObject(_equipmentAccountManageInfo.data[0], $that.editEquipmentAccountInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack:function(){
                vc.goBack()
            }
        }
    });
})(window.vc);
