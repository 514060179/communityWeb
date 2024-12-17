/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            complaintTypeInfo: {
                complaintTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeCd: '',
                conditions: {
                    typeCd: '',
                    typeName: '',
                    notifyWay: '',

                }
            }
        },
        _initMethod: function () {
            $that._listComplaintTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('complaintType', 'listComplaintType', function (_param) {
                $that._listComplaintTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listComplaintTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listComplaintTypes: function (_page, _rows) {

                $that.complaintTypeInfo.conditions.page = _page;
                $that.complaintTypeInfo.conditions.row = _rows;
                $that.complaintTypeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.complaintTypeInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/complaintType.listComplaintType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.complaintTypeInfo.total = _json.total;
                        $that.complaintTypeInfo.records = _json.records;
                        $that.complaintTypeInfo.complaintTypes = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.complaintTypeInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddComplaintTypeModal: function () {
                vc.jumpToPage('/#/pages/complaint/addComplaintType')
            },
            _openEditComplaintTypeModel: function (_complaintType) {
                vc.jumpToPage('/#/pages/complaint/editComplaintType?typeCd='+_complaintType.typeCd);
            },
            _openDeleteComplaintTypeModel: function (_complaintType) {
                vc.emit('deleteComplaintType', 'openDeleteComplaintTypeModal', _complaintType);
            },
            _queryComplaintTypeMethod: function () {
                $that._listComplaintTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);
