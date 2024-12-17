/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintDetailEventInfo: {
                events: [],
                complaintId: '',
                roomNum: '',
                allOweFeeAmount: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('complaintDetailEvent', 'switch', function (_data) {
                $that.complaintDetailEventInfo.complaintId = _data.complaintId;
                $that._loadComplaintDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('complaintDetailEvent', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadComplaintDetailEventData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('complaintDetailEvent', 'notify', function (_data) {
                $that._loadComplaintDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadComplaintDetailEventData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        complaintId: $that.complaintDetailEventInfo.complaintId,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaint.listComplaintEvent',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.complaintDetailEventInfo.events = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyComplaintDetailEvent: function () {
                $that._loadComplaintDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);