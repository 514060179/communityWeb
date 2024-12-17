/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionPlanManageInfo: {
                inspectionPlans: [],
                total: 0,
                records: 1,
                moreCondition: false,
                inspectionPlanName: '',
                states: '',
                inspectionPlanStaffModel: false,
                conditions: {
                    inspectionPlanName: '',
                    staffName: '',
                    state: '',
                    inspectionPlanId: ''
                }
            }
        },
        _initMethod: function () {
            $that._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('inspection_plan', "state", function (_data) {
                $that.inspectionPlanManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('inspectionPlanManage', 'listInspectionPlan', function (_param) {
                $that._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('inspectionPlanManage', 'reload', function (_param) {
                location.reload();
            });
            vc.on('inspectionPlanManage', 'goBack', function (_param) {
                $that.inspectionPlanManageInfo.inspectionPlanStaffModel = false;
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listInspectionPlans(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionPlans: function (_page, _rows) {
                $that.inspectionPlanManageInfo.conditions.page = _page;
                $that.inspectionPlanManageInfo.conditions.row = _rows;
                $that.inspectionPlanManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.inspectionPlanManageInfo.conditions
                };
                param.params.inspectionPlanId = param.params.inspectionPlanId.trim();
                param.params.inspectionPlanName = param.params.inspectionPlanName.trim();
                param.params.state = param.params.state.trim();
                //发送get请求
                vc.http.apiGet('/inspectionPlan.listInspectionPlans',
                    param,
                    function (json, res) {
                        var _inspectionPlanManageInfo = JSON.parse(json);
                        $that.inspectionPlanManageInfo.total = _inspectionPlanManageInfo.total;
                        $that.inspectionPlanManageInfo.records = _inspectionPlanManageInfo.records;
                        $that.inspectionPlanManageInfo.inspectionPlans = _inspectionPlanManageInfo.inspectionPlans;
                        vc.emit('pagination', 'init', {
                            total: $that.inspectionPlanManageInfo.records,
                            dataCount: $that.inspectionPlanManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionPlanModal: function () {
                //vc.emit('addInspectionPlan', 'openAddInspectionPlanModal', {});
                vc.jumpToPage('/#/pages/property/addInspectionPlan')
            },
            _openEditInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('editInspectionPlan', 'openEditInspectionPlanModal', _inspectionPlan);
            },
            _openDeleteInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('deleteInspectionPlan', 'openDeleteInspectionPlanModal', _inspectionPlan);
            },
            //查询
            _queryInspectionPlanMethod: function () {
                $that._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function () {
                $that.inspectionPlanManageInfo.conditions.inspectionPlanName = "";
                $that.inspectionPlanManageInfo.conditions.inspectionPlanId = "";
                $that.inspectionPlanManageInfo.conditions.state = "";
                $that._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //启用计划
            _openEnabledInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('inspectionPlanState', 'openInspectionPlanStateModal', {
                    inspectionPlanId: _inspectionPlan.inspectionPlanId,
                    stateName: '启用',
                    state: '2020025'
                });
            },
            //停用计划
            _openDisabledInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('inspectionPlanState', 'openInspectionPlanStateModal', {
                    inspectionPlanId: _inspectionPlan.inspectionPlanId,
                    stateName: '停用',
                    state: '2020026'
                });
            },
            _moreCondition: function () {
                if ($that.inspectionPlanManageInfo.moreCondition) {
                    $that.inspectionPlanManageInfo.moreCondition = false;
                } else {
                    $that.inspectionPlanManageInfo.moreCondition = true;
                }
            },
            _openPlanStaff: function (_inspectionPlan) {
                $that.inspectionPlanManageInfo.inspectionPlanStaffModel = true;
                vc.emit('inspectionPlanStaffManage', 'listInspectionPlanStaff', _inspectionPlan);
            }
        }
    });
})(window.vc);