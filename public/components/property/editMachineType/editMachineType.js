(function (vc, vm) {
    vc.extends({
        data: {
            editMachineTypeInfo: {
                parentTypeId: '',
                typeId: '',
                machineTypeCd: '',
                machineTypeName: '',
                machineTypeCode: '',
                isEnable: '',
                importanceLevel: '',
                importanceLevels: [],
                unit: '',
                warrantyDeadline: '',
                seq: '',
                remark: '',
                machine: []
            }
        },
        _initMethod: function () {
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.editMachineTypeInfo.machine = _data;
            });
            vc.getDict('machine_type', "importance_level", function (_data) {
                vc.component.editMachineTypeInfo.importanceLevels = _data;
            });
            vc.component._initEditMachineTypeDateInfo();
        },
        _initEvent: function () {
            vc.on('editMachineType', 'openEditMachineTypeModal', function (_params) {
                vc.component.refreshEditMachineTypeInfo();
                $('#editMachineTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editMachineTypeInfo);
                vc.component.editMachineTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditMachineTypeDateInfo: function () {
                $('.editWarrantyDeadline').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editWarrantyDeadline').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editWarrantyDeadline").val();
                        vc.component.editMachineTypeInfo.warrantyDeadline = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editWarrantyDeadline')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editMachineTypeValidate: function () {
                return vc.validate.validate({
                    editMachineTypeInfo: vc.component.editMachineTypeInfo
                }, {
                    'editMachineTypeInfo.machineTypeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备类型名称不能超过30"
                        }
                    ],
                    'editMachineTypeInfo.machineTypeCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "分类编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "分类编码不能超过30"
                        }
                    ],
                    'editMachineTypeInfo.isEnable': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "启用状态不能为空"
                        }
                    ],
                    'editMachineTypeInfo.importanceLevel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "重要等级不能为空"
                        }
                    ],
                    'editMachineTypeInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序值不能为空"
                        }
                    ],
                    'editMachineTypeInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备类型ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备类型ID不能超过30"
                        }
                    ]
                });
            },
            editMachineType: function () {
                if (!vc.component.editMachineTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'machineType.updateMachineType',
                    JSON.stringify(vc.component.editMachineTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMachineTypeModel').modal('hide');
                            $that.machineTypeInfo = vc.component.editMachineTypeInfo;
                            // vc.emit('machineTypesTree', 'refreshTree', {});
                            vc.emit('machineTypeManage', 'listMachineType', {});
                            vc.toast("修改成功");
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
            refreshEditMachineTypeInfo: function () {
                let _machine = vc.component.editMachineTypeInfo.machine;
                let _importanceLevels = $that.editMachineTypeInfo.importanceLevels;
                vc.component.editMachineTypeInfo = {
                    typeId: '',
                    machineTypeCd: '',
                    machineTypeName: '',
                    parentTypeId: '',
                    machineTypeCode: '',
                    importanceLevel: '',
                    importanceLevels: _importanceLevels,
                    isEnable: '',
                    unit: '',
                    warrantyDeadline: '',
                    seq: '',
                    remark: '',
                    machine: _machine
                }
            }
        }
    });
})(window.vc, window.vc.component);
