(function (vc, vm) {
    vc.extends({
        data: {
            editFeeConfigInfo: {
                configId: '',
                feeTypeCd: '',
                feeName: '',
                feeFlag: '',
                startTime: '',
                endTime: '',
                computingFormula: '',
                squarePrice: '',
                additionalAmount: '0.00',
                isDefault: '',
                feeTypeCds: [],
                computingFormulas: [],
                feeFlags: [],
                billTypes: [],
                paymentCds: [],
                billType: '',
                paymentCycle: '',
                paymentCd: '',
                computingFormulaText: '',
                deductFrom: '',
                payOnline: 'Y',
                scale: '1',
                decimalPlace: '2',
                units: 'MOP',
                prepaymentPeriod: '1'
            }
        },
        _initMethod: function () {
            $that._initEditFeeConfigDateInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                $that.editFeeConfigInfo.feeTypeCds = _data;
            });
            vc.getDict('pay_fee_config', "computing_formula", function (_data) {
                $that.editFeeConfigInfo.computingFormulas = _data;
            });
            vc.getDict('pay_fee_config', 'fee_flag', function (_data) {
                $that.editFeeConfigInfo.feeFlags = _data;
            });
            vc.getDict('pay_fee_config', 'bill_type', function (_data) {
                $that.editFeeConfigInfo.billTypes = _data;
            });
            vc.getDict('pay_fee_config', 'payment_cd', function (_data) {
                $that.editFeeConfigInfo.paymentCds = _data;
            });
        },
        _initEvent: function () {
            vc.on('editFeeConfig', 'openEditFeeConfigModal',
                function (_params) {
                    $that.refreshEditFeeConfigInfo();
                    $('#editFeeConfigModel').modal('show');
                    vc.copyObject(_params, $that.editFeeConfigInfo);
                    $that.editFeeConfigInfo.startTime = vc.dateFormat(_params.startTime);
                    $that.editFeeConfigInfo.endTime = vc.dateFormat(_params.endTime);
                    $that.editFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                });
        },
        methods: {
            _initEditFeeConfigDateInfo: function () {
                $('.editFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date($that.editFeeConfigInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("计费起始时间必须小于计费终止时间");
                            $(".editFeeConfigStartTime").val('');
                            $that.editFeeConfigInfo.startTime = "";
                        } else {
                            $that.editFeeConfigInfo.startTime = value;
                        }
                    });
                $('.editFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigEndTime").val();
                        var start = Date.parse(new Date($that.editFeeConfigInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".editFeeConfigEndTime").val('');
                            $that.editFeeConfigInfo.endTime = "";
                        } else {
                            $that.editFeeConfigInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName("form-control editFeeConfigStartTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editFeeConfigEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editFeeConfigValidate: function () {
                return vc.validate.validate({
                    editFeeConfigInfo: $that.editFeeConfigInfo
                }, {
                    'editFeeConfigInfo.feeTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        }
                    ],
                    'editFeeConfigInfo.feeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费项目不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "收费项目不能超过100位"
                        }
                    ],
                    'editFeeConfigInfo.feeFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用标识不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "费用类型格式错误"
                        }
                    ],
                    'editFeeConfigInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费起始时间不是有效的时间格式"
                        }
                    ],
                    'editFeeConfigInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费终止时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "计费终止时间不是有效的时间格式"
                        }
                    ],
                    'editFeeConfigInfo.computingFormula': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计算公式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "计算公式格式错误"
                        }
                    ],
                    'editFeeConfigInfo.squarePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计费单价不能为空"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "计费单价格式错误，如1.5000"
                        }
                    ],
                    'editFeeConfigInfo.additionalAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "附加费用不能为空"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "附加费用格式错误"
                        }
                    ],
                    'editFeeConfigInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项ID不能为空"
                        }
                    ],
                    'editFeeConfigInfo.billType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "出账类型不能为空"
                        }
                    ],
                    'editFeeConfigInfo.paymentCycle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费周期不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "缴费周期必须为数字 单位月"
                        }
                    ],
                    'editFeeConfigInfo.prepaymentPeriod': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "预付期必须为数字 单位天"
                        }
                    ],
                    'editFeeConfigInfo.paymentCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "付费类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "付费类型格式错误"
                        }
                    ]
                });
            },
            editFeeConfig: function () {
                //固定费用
                if ($that.editFeeConfigInfo.computingFormula == '2002') {
                    $that.editFeeConfigInfo.squarePrice = "0.00";
                }
                //自定义费用
                if ($that.editFeeConfigInfo.computingFormula == '7007' ||
                    $that.editFeeConfigInfo.computingFormula == '4004' ||
                    $that.editFeeConfigInfo.computingFormula == '1101' ||
                    $that.editFeeConfigInfo.computingFormula == '1102' ||
                    $that.editFeeConfigInfo.computingFormula == '9009') {
                    $that.editFeeConfigInfo.squarePrice = "0.00";
                    $that.editFeeConfigInfo.additionalAmount = "0.00";
                }
                if ($that.editFeeConfigInfo.feeFlag == '2006012') {
                    $that.editFeeConfigInfo.paymentCycle = '1';
                }
                if ($that.editFeeConfigInfo.paymentCd == '1200') { //如果是预付费
                    if (!$that.editFeeConfigInfo.prepaymentPeriod) {
                        vc.toast("预付期不能为空！");
                        return;
                    }
                }
                if ($that.editFeeConfigInfo.paymentCd != '1200') { //如果不是预付费
                    $that.editFeeConfigInfo.prepaymentPeriod = '0';
                }
                if (!$that.editFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //收费项目去空
                $that.editFeeConfigInfo.feeName = $that.editFeeConfigInfo.feeName.trim();
                //计费单价去空
                //$that.editFeeConfigInfo.squarePrice = $that.editFeeConfigInfo.squarePrice.trim();
                //附加费用去空
                //$that.editFeeConfigInfo.additionalAmount = $that.editFeeConfigInfo.additionalAmount.trim();
                //缴费周期去空
                $that.editFeeConfigInfo.paymentCycle = $that.editFeeConfigInfo.paymentCycle.trim();
                vc.http.apiPost('/feeConfig.updateFeeConfig', JSON.stringify($that.editFeeConfigInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeConfigModel').modal('hide');
                            vc.emit('feeConfigManage', 'listFeeConfig', {});
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
            refreshEditFeeConfigInfo: function () {
                var _feeTypeCds = $that.editFeeConfigInfo.feeTypeCds;
                var _computingFormulas = $that.editFeeConfigInfo.computingFormulas;
                var _feeFlags = $that.editFeeConfigInfo.feeFlags;
                var _billTypes = $that.editFeeConfigInfo.billTypes;
                var _paymentCds = $that.editFeeConfigInfo.paymentCds;
                $that.editFeeConfigInfo = {
                    configId: '',
                    feeTypeCd: '',
                    feeName: '',
                    feeFlag: '',
                    startTime: '',
                    endTime: '',
                    computingFormula: '',
                    squarePrice: '',
                    additionalAmount: '',
                    isDefault: '',
                    paymentCycle: '',
                    paymentCd: '',
                    billType: '',
                    computingFormulaText: '',
                    deductFrom: '',
                    payOnline: 'Y',
                    scale: '1',
                    decimalPlace: '2',
                    units: 'MOP',
                    prepaymentPeriod: '1'
                };
                $that.editFeeConfigInfo.feeTypeCds = _feeTypeCds;
                $that.editFeeConfigInfo.computingFormulas = _computingFormulas;
                $that.editFeeConfigInfo.feeFlags = _feeFlags;
                $that.editFeeConfigInfo.billTypes = _billTypes;
                $that.editFeeConfigInfo.paymentCds = _paymentCds;
            }
        }
    });
})(window.vc, window.$that);