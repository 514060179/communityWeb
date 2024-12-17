/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationUserStorehouseManageInfo: {
                allocationUserStorehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                subTotalQuantity: '',
                highTotalQuantity: '',
                conditions: {
                    resId: '',
                    resName: '',
                    acceptUserId: '',
                    acceptUserName: '',
                    startUserId: '',
                    startUserName: '',
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                    ausId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            vc.component._initAllocationUserStorehouseDateInfo();
            $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('allocationUserStorehouseManage', 'listAllocationUserStorehouse', function (_param) {
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listAllocationUserStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initAllocationUserStorehouseDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.allocationUserStorehouseManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.allocationUserStorehouseManageInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.allocationUserStorehouseManageInfo.conditions.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listAllocationUserStorehouses: function (_page, _rows) {
                $that.allocationUserStorehouseManageInfo.conditions.page = _page;
                $that.allocationUserStorehouseManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.allocationUserStorehouseManageInfo.conditions
                };
                param.params.ausId = param.params.ausId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                param.params.startUserName = param.params.startUserName.trim();
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.acceptUserId = param.params.acceptUserId.trim();
                param.params.acceptUserName = param.params.acceptUserName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationUserStorehouses',
                    param,
                    function (json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.total = _allocationUserStorehouseManageInfo.total;
                        $that.allocationUserStorehouseManageInfo.records = _allocationUserStorehouseManageInfo.records;
                        $that.allocationUserStorehouseManageInfo.allocationUserStorehouses = _allocationUserStorehouseManageInfo.data;
                        if (_allocationUserStorehouseManageInfo.data.length > 0) {
                            $that.allocationUserStorehouseManageInfo.subTotalQuantity = _allocationUserStorehouseManageInfo.data[0].subTotalQuantity;
                            $that.allocationUserStorehouseManageInfo.highTotalQuantity = _allocationUserStorehouseManageInfo.data[0].highTotalQuantity;
                        } else {
                            $that.allocationUserStorehouseManageInfo.subTotalQuantity = "0";
                            $that.allocationUserStorehouseManageInfo.highTotalQuantity = "0";
                        }
                        vc.emit('pagination', 'init', {
                            total: $that.allocationUserStorehouseManageInfo.records,
                            dataCount: $that.allocationUserStorehouseManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationUserStorehouseMethod: function () {
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationUserStorehouseMethod: function () {
                $that.allocationUserStorehouseManageInfo.conditions.resId = "";
                $that.allocationUserStorehouseManageInfo.conditions.resName = "";
                $that.allocationUserStorehouseManageInfo.conditions.acceptUserId = "";
                $that.allocationUserStorehouseManageInfo.conditions.acceptUserName = "";
                $that.allocationUserStorehouseManageInfo.conditions.startUserId = "";
                $that.allocationUserStorehouseManageInfo.conditions.startUserName = "";
                $that.allocationUserStorehouseManageInfo.conditions.ausId = "";
                $that.allocationUserStorehouseManageInfo.conditions.rstId = "";
                $that.allocationUserStorehouseManageInfo.conditions.parentRstId = "";
                $that.allocationUserStorehouseManageInfo.conditions.rssId = "";
                $that.allocationUserStorehouseManageInfo.conditions.startTime = "";
                $that.allocationUserStorehouseManageInfo.conditions.endTime = "";
                $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = [];
                $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = [];
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listResourceStoreTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: '0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                $that.allocationUserStorehouseManageInfo.conditions.rstId = '';
                $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = [];
                if ($that.allocationUserStorehouseManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.allocationUserStorehouseManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = [];
                $that.allocationUserStorehouseManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.allocationUserStorehouseManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = _allocationUserStorehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.allocationUserStorehouseManageInfo.moreCondition) {
                    $that.allocationUserStorehouseManageInfo.moreCondition = false;
                } else {
                    $that.allocationUserStorehouseManageInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function () {
                // vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationUserStorehouseManage&' + vc.objToGetParam($that.allocationUserStorehouseManageInfo.conditions));
                $that.allocationUserStorehouseManageInfo.conditions.pagePath = 'allocationUserStorehouseManage';
                let param = {
                    params: $that.allocationUserStorehouseManageInfo.conditions
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
            }
        }
    });
})(window.vc);