(function (vc) {
    vc.extends({
        data: {
            doingComplaintInfo: {
                complaintId: '',
                context: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('doingComplaint', 'openDoingComplaintModal', function (_appraise) {
                vc.copyObject(_appraise,$that.doingComplaintInfo);
                $('#doingComplaintModel').modal('show');
            });
        },
        methods: {
            doingComplaintValidate() {
                return vc.validate.validate({
                    doingComplaintInfo: $that.doingComplaintInfo
                }, {
                    'doingComplaintInfo.complaintId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "评价不存在"
                        }
                    ],
                    'doingComplaintInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回复内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "回复内容超过500个字"
                        }
                    ],
                });
            },
            _finishComplaint: function () {
                if (!$that.doingComplaintValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.doingComplaintInfo.communityId = vc.getCurrentCommunity().communityId;
          
                vc.http.apiPost(
                    '/complaint.auditComplaint',
                    JSON.stringify($that.doingComplaintInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#doingComplaintModel').modal('hide');
                            $that.clearDoingComplaintInfo();
                            vc.emit('uodoComplaints', 'list', {});
                            vc.toast("办理成功");
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
            clearDoingComplaintInfo: function () {
                $that.doingComplaintInfo = {
                    complaintId: '',
                    context: '',
                };
            }
        }
    });
})(window.vc);
