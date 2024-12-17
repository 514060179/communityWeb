(function (vc) {
    vc.extends({
        data: {
            addComplaintInfo: {
                complaintTypes: [],
                typeCd: '',
                complaintName: '',
                tel: '',
                context: '',
                communityId: '',
                roomId: '',
                roomName: '',
                ownerId: '',
                ownerName: ''
            }
        },
        _initMethod: function () {
            $that._listComplaintTypes();
        },
        _initEvent: function () {
            vc.on('addComplaint', 'selectRoom', function (_param) {
                vc.copyObject(_param, $that.addComplaintInfo);
                $that._listComplaintRoom();
            })

        },
        methods: {
            addComplainValidate: function () {
                return vc.validate.validate({
                    addComplaintInfo: $that.addComplaintInfo
                }, {
                    'addComplaintInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉类型不能为空"
                        }
                    ],
                    'addComplaintInfo.complaintName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "联系人不能大于200位"
                        },
                    ],
                    'addComplaintInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系电话格式错误"
                        },
                    ],
                    'addComplaintInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "4000",
                            errInfo: "内容超过4000位"
                        },
                    ],

                });
            },
            _listComplaintTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addComplaintInfo.complaintTypes = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listComplaintRoom: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: $that.addComplaintInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let room = _json.rooms[0];
                        if (room.state == '2002') {
                            vc.toast('房屋没有绑定业主');
                            return;
                        }
                        $that.addComplaintInfo.ownerId = room.ownerId;
                        $that.addComplaintInfo.ownerName = room.ownerName;
                        $that.addComplaintInfo.tel = room.link;
                        $that.addComplaintInfo.complaintName = room.ownerName;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _selectComplaintRoom: function () {
                vc.emit('roomTree', 'openRoomTree', {
                    callName: 'addComplaint'
                })
            },
            _saveComplaint: function () {
                $that.addComplaintInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!$that.addComplainValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/complaint.saveComplaint',
                    JSON.stringify($that.addComplaintInfo), {
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
            }
        }
    });

})(window.vc);
