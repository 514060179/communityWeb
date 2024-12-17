/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            orgManageInfo: {
                staffs: [],
                relCds:[],
                orgName: '',
                conditions: {
                    orgId: '',
                    staffName: ''
                }
            }
        },
        _initMethod: function() {
            vc.getDict('u_org_staff_rel', "rel_cd", function (_data) {
                $that.orgManageInfo.relCds = _data;
            });
        },
        _initEvent: function() {
            vc.on('org', 'switchOrg', function(_param) {
                $that.orgManageInfo.conditions.orgId = _param.orgId;
                $that.orgManageInfo.orgName = _param.orgName;
                $that._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('orgManage', 'notice', function() {
                $that._listStaffs(1, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listStaffs: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        orgId: $that.orgManageInfo.conditions.orgId,
                        staffName: $that.orgManageInfo.conditions.staffName.trim()
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.orgManageInfo.total = _json.total;
                        $that.orgManageInfo.records = _json.records;
                        let staffList = _json.staffs;
                        let relCdsList = $that.orgManageInfo.relCds;
                        staffList.forEach((staff) => {
                            relCdsList.forEach((rel) => {
                                if (staff.relCd == rel.statusCd) {
                                    staff.relCdName = rel.name;
                                }
                            })
                        })
                        $that.orgManageInfo.staffs = staffList;
                        vc.emit('pagination', 'init', {
                            total: $that.orgManageInfo.records,
                            dataCount: $that.orgManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryOrgMethod: function() {
                $that._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOrgMethod: function() {
                $that.orgManageInfo.conditions.staffName = "";
                $that._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.orgManageInfo.moreCondition) {
                    $that.orgManageInfo.moreCondition = false;
                } else {
                    $that.orgManageInfo.moreCondition = true;
                }
            },
            _openOrgRelStaff: function() {
                if (!$that.orgManageInfo.conditions.orgId) {
                    vc.toast('请选择组织');
                    return;
                }
                vc.emit('orgRelStaff', 'orgRelStaffModel', {
                    orgId: $that.orgManageInfo.conditions.orgId
                })
            },
            _openDeleteOrgRelStaff: function(_rel) {
                vc.emit('deleteOrgRelStaff', 'openDeleteOrgModal', _rel)
            },
            _toStaffDetail: function(_staff) {
                vc.jumpToPage('/#/pages/staff/staffDetail?staffId=' + _staff.userId)
            }
        }
    });
})(window.vc);