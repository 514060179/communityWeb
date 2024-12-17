(function (vc, vm) {
    vc.extends({
        data: {
            editComplaintInfo: {
                complaintTypes: [],
                complaintId: '',
                typeCd: '',
                complaintName: '',
                tel: '',
                context: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editComplaint', 'openEditComplaintModal', function (_params) {
                $that.refreshEditComplaintInfo();
                $('#editComplaintModel').modal('show');
                vc.copyObject(_params, $that.editComplaintInfo);
                $that._listEditComplaintTypes();
                $that.editComplaintInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editComplaintValidate: function () {
                return vc.validate.validate({
                    editComplaintInfo: $that.editComplaintInfo
                }, {
                    'editComplaintInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "投诉类型格式错误"
                        }
                    ],
                    'editComplaintInfo.complaintName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "投诉人不能大于200位"
                        }
                    ],
                    'editComplaintInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "投诉电话格式错误"
                        }
                    ],
                    'editComplaintInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "4000",
                            errInfo: "投诉状态超过4000位"
                        }
                    ],
                    'editComplaintInfo.complaintId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉ID不能为空"
                        }
                    ]
                });
            },
            editComplaint: function () {
                if (!$that.editComplaintValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/complaint.updateComplaint',
                    JSON.stringify($that.editComplaintInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editComplaintModel').modal('hide');
                            vc.emit('complaint', 'listComplaint', {});
                            vc.emit('myAuditComplaints', 'list', {});
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
            refreshEditComplaintInfo: function () {
                $that.editComplaintInfo = {
                    complaintTypes: [],
                    complaintId: '',
                    typeCd: '',
                    complaintName: '',
                    tel: '',
                    context: ''
                }
            },
            _listEditComplaintTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.editComplaintInfo.complaintTypes = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.$that);