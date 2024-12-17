/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintInfo: {
                complaints: [],
                states: [{
                    statusCd: '',
                    name: '全部'
                }, {
                    statusCd: 'W',
                    name: '处理中'
                }, {
                    statusCd: 'C',
                    name: '处理完成'
                }],
                complaintTypes:[],
                total: 0,
                records: 1,
                moreCondition: false,
                complaintName: '',
                conditions: {
                    complaintId: '',
                    typeCd: '',
                    complaintName: '',
                    tel: '',
                    roomName: '',
                    state: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.initDate('start_time', function (_value) {
                $that.complaintInfo.conditions.startTime = _value;
            });

            vc.initDate('end_time', function (_value) {
                $that.complaintInfo.conditions.endTime = _value;
            });

            $that._listComplaintTypes();

            $that._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('complaint', 'listComplaint', function (_param) {
                $that._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listComplaints(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listComplaints: function (_page, _rows) {
                $that.complaintInfo.conditions.page = _page;
                $that.complaintInfo.conditions.row = _rows;
                $that.complaintInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.complaintInfo.conditions
                };
                param.params.complaintId = param.params.complaintId.trim();
                param.params.complaintName = param.params.complaintName.trim();
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/complaint.listComplaints',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.complaintInfo.total = _json.total;
                        $that.complaintInfo.records = _json.records;
                        $that.complaintInfo.complaints = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.complaintInfo.records,
                            dataCount: $that.complaintInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchComplaintState: function (item) {
                $that.complaintInfo.conditions.state = item.statusCd;
                $that._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddComplaintModal: function () {
                vc.jumpToPage("/#/pages/complaint/addComplaint")
            },
            _openEditComplaintModel: function (_complaint) {
                vc.emit('editComplaint', 'openEditComplaintModal', _complaint);
            },
            _openDeleteComplaintModel: function (_complaint) {
                vc.emit('deleteComplaint', 'openDeleteComplaintModal', _complaint);
            },
            //查询
            _queryComplaintMethod: function () {
                $that._listComplaints(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openComplaintDetailModel: function (_complaint) {
                //vc.emit('complaintDetail', 'openComplaintDetailModal', _complaint);
                vc.jumpToPage('/#/pages/complaint/complaintDetail?complaintId='+_complaint.complaintId);
            },
            _toAuditPage: function () {
                vc.jumpToPage('/#/pages/property/workflowManage?tab=流程管理');
            },
            _listComplaintTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.complaintInfo.complaintTypes = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);