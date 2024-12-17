(function (vc) {
    vc.extends({
        data: {
            addPatrolBuildingInfo: {
                state: '',
                staffId: '',
                staffName: '',
                photos: [],
                floors: [],
                floorId: '',
                floorNum: '',
                title: '',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            vc.component._queryFloor();
        },
        _initEvent: function () {
            vc.on("addPatrolBuilding", "notifyUploadImage", function (_param) {
                vc.component.addPatrolBuildingInfo.photos = [];
                _param.forEach((item) => {
                    vc.component.addPatrolBuildingInfo.photos.push({
                        'photo': item.fileId
                    })
                })
            });
        },
        methods: {
            addPatrolBuildingValidate() {
                return vc.validate.validate({
                    addPatrolBuildingInfo: vc.component.addPatrolBuildingInfo
                }, {
                    'addPatrolBuildingInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        }
                    ],
                    'addPatrolBuildingInfo.staffName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "员工名称不能超过200"
                        }
                    ],
                    'addPatrolBuildingInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有无异常不能为空"
                        }
                    ],
                    'addPatrolBuildingInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡楼内容不能为空"
                        }
                    ],
                    'addPatrolBuildingInfo.photos': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡楼图片不能为空"
                        }
                    ]
                });
            },
            savePatrolBuildingInfo: function () {
                if (!vc.component.addPatrolBuildingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPatrolBuildingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/patrolBuilding.savePatrolBuilding',
                    JSON.stringify(vc.component.addPatrolBuildingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPatrolBuildingModel').modal('hide');
                            vc.goBack();
                            vc.toast("添加成功");
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
            //选择员工
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.addPatrolBuildingInfo);
            },
            //查询楼栋
            _queryFloor: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addPatrolBuildingInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
