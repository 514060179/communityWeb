/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintDetailTypeInfo: {
                complaintTypes: [],
                complaintId: '',
                typeCd: '',
                allOweFeeAmount: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('complaintDetailType', 'switch', function (_data) {
                $that.complaintDetailTypeInfo.complaintId = _data.complaintId;
                $that.complaintDetailTypeInfo.typeCd = _data.typeCd;
                
                $that._loadComplaintDetailTypeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('complaintDetailType', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadComplaintDetailTypeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('complaintDetailType', 'notify', function (_data) {
                $that._loadComplaintDetailTypeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadComplaintDetailTypeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        typeCd: $that.complaintDetailTypeInfo.typeCd,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.complaintDetailTypeInfo.complaintTypes = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyComplaintDetailType: function () {
                $that._loadComplaintDetailTypeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);