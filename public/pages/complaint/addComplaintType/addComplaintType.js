(function (vc) {
    vc.extends({
        data: {
            addComplaintTypeInfo: {
                typeCd: '',
                typeName: '',
                notifyWay: '',
                appraiseReply: '',
                remark: '',
                staffs: []
            }
        },
        _initMethod: function () {
            vc.emit('selectStaffs', 'setStaffs', $that.addComplaintTypeInfo.staffs);
        },
        _initEvent: function () {
          
        },
        methods: {

            addComplaintTypeValidate() {
                return vc.validate.validate({
                    addComplaintTypeInfo: $that.addComplaintTypeInfo
                }, {
                    'addComplaintTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "类型名称不能超过200"
                        },
                    ],
                    'addComplaintTypeInfo.notifyWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通知方式不能为空"
                        }
                    ],
                    'addComplaintTypeInfo.appraiseReply': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "评价回复不能为空"
                        }
                    ],
                    'addComplaintTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveComplaintTypeInfo: function () {
                if (!$that.addComplaintTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addComplaintTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/complaintType.saveComplaintType',
                    JSON.stringify($that.addComplaintTypeInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('添加成功');
                            vc.goBack();
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
        }
    });
})(window.vc);