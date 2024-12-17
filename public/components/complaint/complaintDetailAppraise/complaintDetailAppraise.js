/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintDetailAppraiseInfo: {
                appraises: [],
                complaintId: '',
                roomNum: '',
                allOweFeeAmount: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('complaintDetailAppraise', 'switch', function (_data) {
                $that.complaintDetailAppraiseInfo.complaintId = _data.complaintId;
                $that._loadComplaintDetailAppraiseData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('complaintDetailAppraise', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadComplaintDetailAppraiseData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('complaintDetailAppraise', 'notify', function (_data) {
                $that._loadComplaintDetailAppraiseData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadComplaintDetailAppraiseData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        complaintId: $that.complaintDetailAppraiseInfo.complaintId,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaintAppraise.listComplaintAppraise',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.complaintDetailAppraiseInfo.appraises = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyComplaintDetailAppraise: function () {
                $that._loadComplaintDetailAppraiseData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openReplyComplaintAppraiseModel:function(_appraise){
                vc.emit('replyComplaintAppraise', 'openReplyComplaintAppraiseModal',_appraise);
            }
        }
    });
})(window.vc);