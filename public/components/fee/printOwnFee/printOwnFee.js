(function (vc) {
    vc.extends({
        data: {
            printOwnFeeInfo: {
                payObjId: '',
                payObjType: '',
                payObjName: '',
                targetEndTime: '',
            }
        },
        _initMethod: function () {
            vc.initDate('targetEndTime', function (_value) {
                $that.printOwnFeeInfo.targetEndTime = _value;
            })
        },
        _initEvent: function () {
            vc.on('printOwnFee', 'openPrintOwnFeeModal', function (_param) {
                $that.clearPrintOwnFeeInfo();
                vc.copyObject(_param,$that.printOwnFeeInfo)
                $('#printOwnFeeModel').modal('show');
            });
        },
        methods: {

            _openPrintOweFeePage: function () {
                if (!$that.printOwnFeeInfo.targetEndTime) {
                    vc.toast('请选择截止时间');
                    return;
                }
                $('#printOwnFeeModel').modal('hide');

                window.open('/print.html#/pages/property/printOweFee?payObjId=' + $that.printOwnFeeInfo.payObjId
                    + "&payObjType=" + $that.printOwnFeeInfo.payObjType
                    + "&payObjName=" + $that.printOwnFeeInfo.payObjName
                    + "&targetEndTime=" + $that.printOwnFeeInfo.targetEndTime)

            },
            clearPrintOwnFeeInfo: function () {
                $that.printOwnFeeInfo = {
                    payObjId: '',
                    payObjType: '',
                    payObjName: '',
                    targetEndTime: '',
                };
            }
        }
    });
})(window.vc);
