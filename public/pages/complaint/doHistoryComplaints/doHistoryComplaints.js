/**
 入驻小区
 **/
 (function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            doHistoryComplaintsInfo: {
                complaints: [],
                total: 0,
                records: 1,
                moreCondition: false,
                currentTaskId: '',
                currentComplaintId: '',
                userName: '',
                curUserId: '',
                conditions: {
                    AuditOrdersId: '',
                    userName: '',
                    auditLink: '',

                }
            }
        },
        _initMethod: function() {
            $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('doHistoryComplaints', 'list', function(_auditInfo) {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('doHistoryComplaints', 'auditMessage', function(_auditInfo) {
                $that._auditComplaintInfo(_auditInfo);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {
                $that.doHistoryComplaintsInfo.conditions.page = _page;
                $that.doHistoryComplaintsInfo.conditions.row = _rows;
                $that.doHistoryComplaintsInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.doHistoryComplaintsInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/auditUser.listAuditHistoryComplaints',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.doHistoryComplaintsInfo.total = _json.total;
                        $that.doHistoryComplaintsInfo.records = _json.records;
                        $that.doHistoryComplaintsInfo.complaints = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.doHistoryComplaintsInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryAuditOrdersMethod: function() {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.AuditOrdersManageInfo.moreCondition) {
                    $that.AuditOrdersManageInfo.moreCondition = false;
                } else {
                    $that.AuditOrdersManageInfo.moreCondition = true;
                }
            },
            _openComplaintDetailModel: function(_complaint) {
                vc.jumpToPage('/#/pages/complaint/complaintDetail?complaintId='+_complaint.complaintId);
            }


        }
    });
})(window.vc);