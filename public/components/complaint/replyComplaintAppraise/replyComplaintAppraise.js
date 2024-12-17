(function (vc) {
    vc.extends({
        data: {
            replyComplaintAppraiseInfo: {
                appraiseId: '',
                replyContext: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('replyComplaintAppraise', 'openReplyComplaintAppraiseModal', function (_appraise) {
                vc.copyObject(_appraise,$that.replyComplaintAppraiseInfo);
                $('#replyComplaintAppraiseModel').modal('show');
            });
        },
        methods: {
            replyComplaintAppraiseValidate() {
                return vc.validate.validate({
                    replyComplaintAppraiseInfo: $that.replyComplaintAppraiseInfo
                }, {
                    'replyComplaintAppraiseInfo.appraiseId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "评价不存在"
                        }
                    ],
                    'replyComplaintAppraiseInfo.replyContext': [
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
                if (!$that.replyComplaintAppraiseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.replyComplaintAppraiseInfo.communityId = vc.getCurrentCommunity().communityId;
          
                vc.http.apiPost(
                    '/complaintAppraise.replyComplaintAppraise',
                    JSON.stringify($that.replyComplaintAppraiseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#replyComplaintAppraiseModel').modal('hide');
                            $that.clearReplyComplaintAppraiseInfo();
                            vc.emit('complaintDetailAppraise', 'notify', {});
                            vc.toast("回复成功");
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
            clearReplyComplaintAppraiseInfo: function () {
                $that.replyComplaintAppraiseInfo = {
                    title: '',
                    pubType: '',
                    headerImg: '',
                    context: ''
                };
            }
        }
    });
})(window.vc);
