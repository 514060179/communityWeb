(function (vc) {
    vc.extends({
        data: {
            roomBindOwnerInfo: {
                roomId: '',
                roomName: '',
                ownerId: '',
                ownerName: '',
                state: '2001',
                startTime: vc.dateFormat(new Date().getTime()),
                endTime: '2050-01-01',
            }
        },
        _initMethod: function () {
            vc.component._initRoomBindOwnerInfo();
            $that.roomBindOwnerInfo.roomId = vc.getParam('roomId');
            $that.listRoom(vc.getParam('roomId'));
            /*$that.roomBindOwnerInfo.startTime = vc.dateFormat(new Date().getTime());
            vc.initDate('addStartTime', function (_value) {
                $that.roomBindOwnerInfo.startTime = _value;
            });
            vc.initDate('addEndTime', function (_value) {
                $that.roomBindOwnerInfo.endTime = _value;
            });*/
        },
        _initEvent: function () {
            vc.on('roomBindOwner', 'chooseOwner', function (_owner) {
                $that.roomBindOwnerInfo.ownerName = _owner.name;
                $that.roomBindOwnerInfo.ownerId = _owner.ownerId;
            });
        },
        methods: {
            _initRoomBindOwnerInfo: function () {
                $('.addStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addStartTime").val();
                        vc.component.roomBindOwnerInfo.startTime = value;
                    });
                $('.addEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addEndTime").val();
                        var start = Date.parse(new Date(vc.component.roomBindOwnerInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".addEndTime").val('')
                        } else {
                            vc.component.roomBindOwnerInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            roomBindOwnerValidate() {
                return vc.validate.validate({
                    roomBindOwnerInfo: vc.component.roomBindOwnerInfo
                }, {
                    'roomBindOwnerInfo.ownerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主不能为空"
                        }
                    ],
                    'roomBindOwnerInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        }
                    ],
                    'roomBindOwnerInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'roomBindOwnerInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ]
                });
            },
            saveRoomBindOwnerInfo: function () {
                if (!vc.component.roomBindOwnerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomBindOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/room.sellRoom',
                    JSON.stringify(vc.component.roomBindOwnerInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
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
            clearAddHandoverInfo: function () {
                vc.component.roomBindOwnerInfo = {
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    ownerName: '',
                    state: '2001',
                    startTime: vc.dateFormat(new Date().getTime()),
                    endTime: '2050-01-01',
                };
            },
            _goBack: function () {
                vc.goBack();
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            listRoom: function (_roomId) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: _roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        let _room = listRoomData.rooms[0];
                        $that.roomBindOwnerInfo.roomId = _room.roomId;
                        $that.roomBindOwnerInfo.roomName = _room.floorNum + '-' + _room.unitNum + '-' + _room.roomNum;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);