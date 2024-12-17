(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            editPatrolBuildingInfo: {
                pbId: '',
                staffId: '',
                staffName: '',
                floorId: '',
                floorNum: '',
                state: '',
                floors: [],
                imgUrls: [],
                photos: [],
                title: '',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            $that.editPatrolBuildingInfo.pbId = vc.getParam('pbId');
            vc.component._listEditPatrolBuildings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on("editPatrolBuilding", "notifyUploadImage", function (_param) {
                vc.component.editPatrolBuildingInfo.photos = [];
                _param.forEach((item) => {
                    vc.component.editPatrolBuildingInfo.photos.push({
                        'photo': item.fileId
                    })
                })
            });
        },
        methods: {
            editPatrolBuildingValidate() {
                return vc.validate.validate({
                    editPatrolBuildingInfo: vc.component.editPatrolBuildingInfo
                }, {
                    'editPatrolBuildingInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        }
                    ],
                    'editPatrolBuildingInfo.staffName': [
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
                    'editPatrolBuildingInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有无异常不能为空"
                        }
                    ],
                    'editPatrolBuildingInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡楼内容不能为空"
                        }
                    ],
                    'editPatrolBuildingInfo.photos': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡楼图片不能为空"
                        }
                    ]
                });
            },
            _listEditPatrolBuildings: function (_page, _rows) {
                vc.component.editPatrolBuildingInfo.page = _page;
                vc.component.editPatrolBuildingInfo.row = _rows;
                let param = {
                    params: vc.component.editPatrolBuildingInfo
                };
                //发送get请求
                vc.http.apiGet('/patrolBuilding.listPatrolBuilding',
                    param,
                    function (json, res) {
                        let _patrolBuildingManageInfo = JSON.parse(json);
                        vc.component.editPatrolBuildingInfo = _patrolBuildingManageInfo.data[0];
                        vc.component._queryFloor();
                        vc.component._freshPatrolBuildingPhoto(vc.component.editPatrolBuildingInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            savePatrolBuildingInfo: function () {
                if (!vc.component.editPatrolBuildingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editPatrolBuildingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/patrolBuilding.updatePatrolBuilding',
                    JSON.stringify(vc.component.editPatrolBuildingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPatrolBuildingModel').modal('hide');
                            vc.goBack();
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
            //选择员工
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.editPatrolBuildingInfo);
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
                        $that.editPatrolBuildingInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _freshPatrolBuildingPhoto: function (_patrolBuilding) {
                if (!_patrolBuilding.imgUrls || _patrolBuilding.imgUrls.length < 1) {
                    vc.emit('editPatrolBuilding', 'uploadImageUrl', 'notifyPhotos', []);
                } else {
                    //判断属性中是否有照片
                    var _photos = [];
                    _patrolBuilding.imgUrls.forEach(function (_item) {
                        _photos.push(_item);
                    });
                    vc.emit('editPatrolBuilding', 'uploadImageUrl', 'notifyPhotos', _photos);
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
