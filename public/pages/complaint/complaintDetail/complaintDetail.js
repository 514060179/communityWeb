/**
 业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            complaintDetailInfo: {
                viewComplaintFlag: '',
                complaintId: "",
                typeName: '',
                typeCd:'',
                roomName: "",
                complaintName: "",
                tel: "",
                stateName: "",
                createTime: "",
                context:'',
                _currentTab: 'complaintDetailEvent',
            }
        },
        _initMethod: function () {
            $that.complaintDetailInfo.complaintId = vc.getParam('complaintId');
            if (!vc.notNull($that.complaintDetailInfo.complaintId)) {
                return;
            }
            let _currentTab = vc.getParam('currentTab');
            if (_currentTab) {
                $that.complaintDetailInfo._currentTab = _currentTab;
            }
            $that._loadComplaintInfo();
            $that.changeTab($that.complaintDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on('complaintDetail', 'listComplaintData', function (_info) {
                $that._loadComplaintInfo();
                $that.changeTab($that.complaintDetailInfo._currentTab);
            });
        },
        methods: {
            _loadComplaintInfo: function () {
                let param = {
                    params: {
                        complaintId: $that.complaintDetailInfo.complaintId,
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTypeCd: '1001'
                    }
                }
                //发送get请求
                vc.http.apiGet('/complaint.listComplaints',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data[0], $that.complaintDetailInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.complaintDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    complaintId: $that.complaintDetailInfo.complaintId,
                    typeCd: $that.complaintDetailInfo.typeCd,
                })
            },
        }
    });
})(window.vc);