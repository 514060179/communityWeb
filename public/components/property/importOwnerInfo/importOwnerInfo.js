(function(vc) {
    vc.extends({
        data: {
            importOwnerInfoData: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('importOwnerInfo', 'openImportOwnerInfoModal', function(_param) {
                $that.clearAddFeeConfigInfo();
                $('#importOwnerInfoModel').modal('show');
            });
        },
        methods: {
            importOwnerInfoValidate() {
                return vc.validate.validate({
                    importOwnerInfoData: vc.component.importOwnerInfoData
                }, {
                    'importOwnerInfoData.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'importOwnerInfoData.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _importData: function() {
                if (!vc.component.importOwnerInfoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.importOwnerInfoData.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.importOwnerInfoData.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importOwnerInfoData.excelTemplate);
                param.append('communityId', vc.component.importOwnerInfoData.communityId);
                param.append('importAdapt', "importOwnerInfo");

                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'assetImport',
                    'importData',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            // vc.toast(_json.data);
                            $('#importOwnerInfoModel').modal('hide');
                            $that.clearAddFeeConfigInfo();

                            vc.jumpToPage('/#/pages/property/assetImportLogDetail?logId=' + _json.data.logId + '&logType=importOwnerInfo');
                            return;
                        }
                        vc.toast(_json.msg, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            clearAddFeeConfigInfo: function() {
                // var _feeTypeCds = vc.component.importRoomFeeInfo.feeTypeCds;
                vc.component.importOwnerInfoData = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: ''
                    // feeTypeCd: '',
                    // feeTypeCds: [],
                    // objType: '3333'
                };
                // vc.component.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function(_feeTypeCd) {},
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importOwnerInfoData.excelTemplate = e.target.files[0];
            },
            checkOwnerFileType: function(fileType) {
                const acceptTypes = ['xlsx', 'xls'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkOwnerFileSize: function(fileSize) {
                //2M
                const MAX_SIZE = 2 * 1024 * 1024;
                if (fileSize > MAX_SIZE) {
                    return false;
                }
                return true;
            }
        }
    });
})(window.vc);