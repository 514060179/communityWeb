/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeSummaryInfo: {
                fees: [],
                feeConfigs: [],
                floors: [],
                configIds: [],
                feeTypeCds: [],
                communitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    floorId: '',
                    objName: '',
                    startDate: '',
                    endDate: '',
                    configId: '',
                    feeTypeCd: '',
                    ownerName: '',
                    link: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function () {
            $that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId
            $that._initDate();
            $that._loadStaffCommunitys();
            $that._listFeeConfigs();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                $that.reportFeeSummaryInfo.feeTypeCds = _data
            });
            $that._listFloors();
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
        },
        methods: {
            _initDate: function () {
                /*vc.initDate('startDate', function (_value) {
                    $that.reportFeeSummaryInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function (_value) {
                    $that.reportFeeSummaryInfo.conditions.endDate = _value;
                });*/
                $('.startDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startDate").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.endDate));
                        if (start - end >= 0) {
                            vc.toast("计费起始时间必须小于计费终止时间");
                            $(".startDate").val('');
                            $that.reportFeeSummaryInfo.conditions.startDate = "";
                        } else {
                            $that.reportFeeSummaryInfo.conditions.startDate = value;
                        }
                    });
                $('.endDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endDate").val();
                        var start = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.startDate));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".endDate").val('');
                            $that.reportFeeSummaryInfo.conditions.endDate = "";
                        } else {
                            $that.reportFeeSummaryInfo.conditions.endDate = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endDate")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.reportFeeSummaryInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _data.setDate(0);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + '-' + _data.getDate();
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + '-' + _data.getDate();
                }
                $that.reportFeeSummaryInfo.conditions.endDate = _newDate;
            },
            //查询
            _queryMethod: function () {
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            swatchFloor: function (_floorId) {
                $that.reportFeeSummaryInfo.conditions.floorId = _floorId;
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                $that.reportFeeSummaryInfo.conditions.page = _page;
                $that.reportFeeSummaryInfo.conditions.row = _rows;
                //$that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportFeeSummaryInfo.conditions
                };
                param.params.objName = param.params.objName.trim();
                param.params.ownerName = param.params.ownerName.trim();
                param.params.link = param.params.link.trim();
                if ($that.reportFeeSummaryInfo.configIds.length > 0) {
                    param.params.configIds = $that.reportFeeSummaryInfo.configIds.join(',');
                } else {
                    param.params.configIds = $that.reportFeeSummaryInfo.configIds;
                }
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeSummary',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            let _reportFeeSummaryInfo = JSON.parse(json);
                            $that.reportFeeSummaryInfo.fees = _reportFeeSummaryInfo.data;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
                //楼栋收费率
                vc.emit('floorFeeSummary', 'notify', param.params);
                vc.emit('configFeeSummary', 'notify', param.params);
            },
            //重置
            _resetMethod: function (_page, _rows) {
                /*$that.reportFeeSummaryInfo.conditions.startDate = "";
                $that.reportFeeSummaryInfo.conditions.endDate = "";*/
                $that.reportFeeSummaryInfo.conditions.roomNum = "";
                $that.reportFeeSummaryInfo.conditions.ownerName = "";
                $that.reportFeeSummaryInfo.conditions.link = "";
                $that.reportFeeSummaryInfo.conditions.feeTypeCd = "";
                $that.reportFeeSummaryInfo.conditions.floorName = "";
                $that.reportFeeSummaryInfo.conditions.floorId = "";
                $that.reportFeeSummaryInfo.conditions.unitId = "";
                $that.reportFeeSummaryInfo.configIds = [];
                $that.reportFeeSummaryInfo.conditions.configId = "";
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFeeConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.reportFeeSummaryInfo.conditions.communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportFeeSummaryInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function () {
                if ($that.reportFeeSummaryInfo.moreCondition) {
                    $that.reportFeeSummaryInfo.moreCondition = false;
                } else {
                    $that.reportFeeSummaryInfo.moreCondition = true;
                }
            },
            _listFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.reportFeeSummaryInfo.conditions.communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportFeeSummaryInfo.floors = _feeConfigManageInfo.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _exportExcel: function () {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
                //$that.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportFeeSummaryInfo.conditions.pagePath = 'reportFeeSummary';
                let param = {
                    params: $that.reportFeeSummaryInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _toDetail: function (_fee) {
                let _configIds = "";
                $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                vc.jumpToPage('/#/pages/property/reportFeeSummaryDetail?feeYear=' + _fee.feeYear + "&feeMonth=" + _fee.feeMonth +
                    "&configIds=" + _configIds + "&" + vc.objToGetParam($that.reportFeeSummaryInfo.conditions))
            },
            _printFeeSummary: function () {
                let _param = vc.objToGetParam($that.reportFeeSummaryInfo.conditions);
                window.open('/print.html#/pages/property/reportFeeSummaryPrint?' + _param);
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.reportFeeSummaryInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity: function () {
                $that._listFeeConfigs();
                $that._listFloors();
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);