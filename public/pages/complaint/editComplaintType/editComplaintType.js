(function (vc) {
    vc.extends({
        data: {
            editComplaintTypeInfo: {
                typeCd: '',
                typeName: '',
                notifyWay: '',
                appraiseReply: '',
                remark: '',
                staffs: []
            }
        },
        _initMethod: function () {
            $that.editComplaintTypeInfo.typeCd = vc.getParam('typeCd');
           // vc.emit('selectStaffs', 'setStaffs', $that.editComplaintTypeInfo.staffs);

            $that._loadComplaintType();

        },
        _initEvent: function () {

        },
        methods: {

            _loadComplaintType: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        typeCd: $that.editComplaintTypeInfo.typeCd
                    }
                };

                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                       let staffs =  _json.data[0].staffs;
                        _json.data[0].staffs = [];;
                        vc.copyObject(_json.data[0], $that.editComplaintTypeInfo);
                        staffs.forEach(_t=>{
                            _t.userId = _t.staffId;
                            _t.name = _t.staffName;
                            _t.userName = _t.staffName

                        })
                          vc.emit('selectStaffs', 'setStaffs', staffs);



                        if (!staffs || staffs.length < 1) {
                            return;
                        }
                        $that.editComplaintTypeInfo.staffs = staffs;


                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            editComplaintTypeValidate() {
                return vc.validate.validate({
                    editComplaintTypeInfo: $that.editComplaintTypeInfo
                }, {
                    'editComplaintTypeInfo.typeName': [
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
                    'editComplaintTypeInfo.notifyWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通知方式不能为空"
                        }
                    ],
                    'editComplaintTypeInfo.appraiseReply': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "评价回复不能为空"
                        }
                    ],
                    'editComplaintTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveComplaintTypeInfo: function () {
                if (!$that.editComplaintTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editComplaintTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/complaintType.updateComplaintType',
                    JSON.stringify($that.editComplaintTypeInfo), {
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