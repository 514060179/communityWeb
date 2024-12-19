(function (vc, vm) {
    vc.extends({
        data: {
            editCommunitySpaceInfo: {
                spaceId: '',
                name: '',
                startTime: '',
                endTime: '',
                feeMoney: '',
                adminName: '',
                tel: '',
                state: '',
                remark: '',
                ruleFile: '',
                priceFile: '',
                tempfile: ''
            }
        },
        _initMethod: function () {
            vc.initHourMinute('editSpaceStartTime', function(_value) {
                $that.editCommunitySpaceInfo.startTime = _value;
            });
            vc.initHourMinute('editSpaceEndTime', function(_value) {
                $that.editCommunitySpaceInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('editCommunitySpace', 'openEditCommunitySpaceModal', function (_params) {
                vc.component.refreshEditCommunitySpaceInfo();
                $('#editCommunitySpaceModel').modal('show');
                vc.copyObject(_params, vc.component.editCommunitySpaceInfo);
                vc.component.editCommunitySpaceInfo.communityId = vc.getCurrentCommunity().communityId;
            });

            vc.on("editCommunitySpace", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editCommunitySpaceInfo.img = _param[0].fileId;
                } else {
                    vc.component.editCommunitySpaceInfo.img = ''
                }
            });
        },
        methods: {
            editCommunitySpaceValidate: function () {
                return vc.validate.validate({
                    editCommunitySpaceInfo: vc.component.editCommunitySpaceInfo
                }, {
                    'editCommunitySpaceInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        }
                    ],
                    'editCommunitySpaceInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约开始时间不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约结束时间不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.feeMoney': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "每小时费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "每小时费用不能超过10"
                        }
                    ],
                    'editCommunitySpaceInfo.adminName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "管理员不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "不是有效的手机号"
                        }
                    ],
                    'editCommunitySpaceInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态不能超过12"
                        }
                    ],
                    'editCommunitySpaceInfo.spaceId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editCommunitySpace: function () {
                if (!vc.component.editCommunitySpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/communitySpace.updateCommunitySpace',
                    JSON.stringify(vc.component.editCommunitySpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunitySpaceModel').modal('hide');
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
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
            refreshEditCommunitySpaceInfo: function () {
                vc.component.editCommunitySpaceInfo = {
                    spaceId: '',
                    name: '',
                    startTime: '',
                    endTime: '',
                    feeMoney: '',
                    adminName: '',
                    tel: '',
                    state: ''
                }
            },
            getRuleFile: function (e) {
                $that.editCommunitySpaceInfo.tempfile = e.target.files[0];
                this._importRuleData();
            },
            _importRuleData: function () {
                // 导入数据
                let _fileName = $that.editCommunitySpaceInfo.tempfile.name;
                let _suffix = _fileName.substring(_fileName.lastIndexOf('.') + 1);
                if (!$that.checkFileType(_suffix.toLowerCase())) {
                    vc.toast('操作失败，请上传图片、PDF格式的文件');
                    return;
                }
                let param = new FormData();
                param.append("uploadFile", $that.editCommunitySpaceInfo.tempfile);
                vc.http.upload(
                    'importRoomFee',
                    'uploadContactFile',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status === 200) {
                            $that.editCommunitySpaceInfo.ruleFile = json;
                            vc.toast("上传成功");
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            getPriceFile: function (e) {
                $that.editCommunitySpaceInfo.tempfile = e.target.files[0];
                this._importPriceData();
            },
            _importPriceData: function () {
                // 导入数据
                let _fileName = $that.editCommunitySpaceInfo.tempfile.name;
                let _suffix = _fileName.substring(_fileName.lastIndexOf('.') + 1);
                if (!$that.checkFileType(_suffix.toLowerCase())) {
                    vc.toast('操作失败，请上传图片、PDF格式的文件');
                    return;
                }
                let param = new FormData();
                param.append("uploadFile", $that.editCommunitySpaceInfo.tempfile);
                vc.http.upload(
                    'importRoomFee',
                    'uploadContactFile',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            $that.editCommunitySpaceInfo.priceFile = json;
                            vc.toast("上传成功");
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },

            checkFileType: function (fileType) {
                const acceptTypes = ['png', 'pdf', 'jpg'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
        }
    });
})(window.vc, window.vc.component);