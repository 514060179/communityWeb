/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditAuthOwnerInfo: {
                appUsers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                currentAppUserId: '',
                name: '',
                states: [{
                    name: '全部',
                    statusCd: ''
                }, {
                    name: '待审核',
                    statusCd: '10000'
                }, {
                    name: '审核成功',
                    statusCd: '12000'
                }, {
                    name: '审核失败',
                    statusCd: '13000'
                }],
                conditions: {
                    appUserName: '',
                    idCard: '',
                    link: '',
                    state: '',
                    appType: '',
                    appTypeName: '',
                    memberId: ''
                }
            }
        },
        _initMethod: function () {
            $that._listAuditAuthOwners(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('auditAuthOwner', 'listAuditAuthOwner', function (_param) {
                $that._listAuditAuthOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('auditAuthOwner', 'auditMessage', function (_auditInfo) {
                $that._auditAppUserBindingOwner(_auditInfo);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listAuditAuthOwners(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditAuthOwners: function (_page, _rows) {
                $that.auditAuthOwnerInfo.conditions.page = _page;
                $that.auditAuthOwnerInfo.conditions.row = _rows;
                $that.auditAuthOwnerInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.auditAuthOwnerInfo.conditions
                };
                param.params.appUserName = param.params.appUserName.trim();
                param.params.link = param.params.link.trim();
                param.params.idCard = param.params.idCard.trim();
                param.params.memberId = param.params.memberId.trim();
                //发送get请求
                vc.http.apiGet('/owner.listAuditAppUserBindingOwners',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.auditAuthOwnerInfo.total = _json.total;
                        $that.auditAuthOwnerInfo.records = _json.records;
                        $that.auditAuthOwnerInfo.appUsers = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.auditAuthOwnerInfo.records,
                            dataCount: $that.auditAuthOwnerInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditAuthOwnerModel: function (_appUser) {
                //$that.auditAuthOwnerInfo.currentAppUserId = _auditAppUserBindingOwner.appUserId;
                //vc.emit('audit', 'openAuditModal', {});

                vc.jumpToPage('/#/pages/property/auditAuthOwnerUndo?appUserId='+_appUser.appUserId
                +"&roomId="+_appUser.roomId
                +"&appUserName="+_appUser.appUserName
                +"&link="+_appUser.link);
            },
            _moreCondition: function () {
                if ($that.auditAuthOwnerInfo.moreCondition) {
                    $that.auditAuthOwnerInfo.moreCondition = false;
                } else {
                    $that.auditAuthOwnerInfo.moreCondition = true;
                }
            },
            //查询
            _queryAuditAuthOwnerMethod: function () {
                $that._listAuditAuthOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAuditAuthOwnerMethod: function () {
                $that.auditAuthOwnerInfo.conditions.appUserName = "";
                $that.auditAuthOwnerInfo.conditions.idCard = "";
                $that.auditAuthOwnerInfo.conditions.state = "";
                $that.auditAuthOwnerInfo.conditions.link = "";
                $that.auditAuthOwnerInfo.conditions.memberId = "";
                $that._listAuditAuthOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _deleteAppUserBindingOwnerModel: function (_auditAppUserBindingOwner) {
                vc.emit('deleteAppUserBindingOwner', 'openDeleteAppUserBindingOwnerModal', _auditAppUserBindingOwner);
            },
            _resetUserPwdModel: function (_staff) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', _staff);
            },
            _swatchState: function (_item) {
                $that.auditAuthOwnerInfo.conditions.state = _item.statusCd;
                $that._listAuditAuthOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);