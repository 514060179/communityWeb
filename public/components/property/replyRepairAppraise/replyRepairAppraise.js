(function (vc) {
    vc.extends({
        data: {
            replyRepairAppraiseInfo: {
                repairId: '',
                ruId:'',
                replyContext: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('replyRepairAppraise', 'openReplyRepairAppraiseModal', function (_appraise) {
                vc.copyObject(_appraise,$that.replyRepairAppraiseInfo);
                $('#replyRepairAppraiseModel').modal('show');
            });
        },
        methods: {
            replyRepairAppraiseValidate() {
                return vc.validate.validate({
                    replyRepairAppraiseInfo: $that.replyRepairAppraiseInfo
                }, {
                    'replyRepairAppraiseInfo.ruId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "评价不存在"
                        }
                    ],
                    'replyRepairAppraiseInfo.replyContext': [
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
            _replyAppraise: function () {
                if (!$that.replyRepairAppraiseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.replyRepairAppraiseInfo.communityId = vc.getCurrentCommunity().communityId;
          
                vc.http.apiPost(
                    '/repair.replyRepairAppraise',
                    JSON.stringify($that.replyRepairAppraiseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#replyRepairAppraiseModel').modal('hide');
                            $that.clearReplyRepairAppraiseInfo();
                            vc.emit('ownerRepairDetail','notifyRepairUser', {});
                            vc.toast("回复成功");
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
            clearReplyRepairAppraiseInfo: function () {
                $that.replyRepairAppraiseInfo = {
                    repairId: '',
                    ruId:'',
                    replyContext: '',
                };
            }
        }
    });
})(window.vc);
