/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehousesInfo: {
                resourceStores: [],
                storehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: [],
                applyTypes: [],
                conditions: {
                    asId: '',
                    applyId: '',
                    resId: '',
                    resName: '',
                    resCode: '',
                    rssId: '',
                    parentRstId: '',
                    rstId: '',
                    shIda: '',
                    shIdz: '',
                    stock: '',
                    startUserId: '',
                    state: '',
                    applyType: '',
                    startTime: '',
                    endTime: '',
                    userId: vc.getData('/nav/getUserInfo').userId,
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "state", function (_data) {
                $that.allocationStorehousesInfo.states = _data;
            });
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "apply_type", function (_data) {
                $that.allocationStorehousesInfo.applyTypes = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.allocationStorehousesInfo.applyTypes.push(item);
                });
            });
            vc.component._initAllocationStorehouseDetailedInfo();
            $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('allocationStorehouseDetailed', '_listAllocationStore', function (_param) {
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listAllocationStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initAllocationStorehouseDetailedInfo: function () {
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
                        vc.component.allocationStorehousesInfo.conditions.startTime = value;
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
                        var start = Date.parse(new Date(vc.component.allocationStorehousesInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.allocationStorehousesInfo.conditions.endTime = value;
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
            //查询方法
            _listAllocationStores: function (_page, _rows) {
                $that.allocationStorehousesInfo.conditions.page = _page;
                $that.allocationStorehousesInfo.conditions.row = _rows;
                $that.allocationStorehousesInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.allocationStorehousesInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.applyId = param.params.applyId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.total = _allocationStorehousesInfo.total;
                        $that.allocationStorehousesInfo.records = _allocationStorehousesInfo.records;
                        $that.allocationStorehousesInfo.resourceStores = _allocationStorehousesInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.allocationStorehousesInfo.records,
                            dataCount: $that.allocationStorehousesInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationStorehouseMethod: function () {
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationStorehouseMethod: function () {
                $that.allocationStorehousesInfo.conditions.applyId = "";
                $that.allocationStorehousesInfo.conditions.shIda = "";
                $that.allocationStorehousesInfo.conditions.shIdz = "";
                $that.allocationStorehousesInfo.conditions.startUserId = "";
                $that.allocationStorehousesInfo.conditions.resId = "";
                $that.allocationStorehousesInfo.conditions.resName = "";
                $that.allocationStorehousesInfo.conditions.parentRstId = "";
                $that.allocationStorehousesInfo.conditions.rstId = "";
                $that.allocationStorehousesInfo.conditions.rssId = "";
                $that.allocationStorehousesInfo.conditions.state = "";
                $that.allocationStorehousesInfo.conditions.applyType = "";
                $that.allocationStorehousesInfo.conditions.startTime = "";
                $that.allocationStorehousesInfo.conditions.endTime = "";
                $that.allocationStorehousesInfo.resourceStoreSonTypes = [];
                $that.allocationStorehousesInfo.resourceStoreSpecifications = [];
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listStorehouses: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function () {
                let param = {
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
                        let _json = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreTypes = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                $that.allocationStorehousesInfo.conditions.rstId = '';
                $that.allocationStorehousesInfo.resourceStoreSonTypes = [];
                if ($that.allocationStorehousesInfo.conditions.parentRstId == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.allocationStorehousesInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                $that.allocationStorehousesInfo.resourceStoreSpecifications = [];
                $that.allocationStorehousesInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.allocationStorehousesInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreSpecifications = _allocationStorehousesInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.allocationStorehousesInfo.moreCondition) {
                    $that.allocationStorehousesInfo.moreCondition = false;
                } else {
                    $that.allocationStorehousesInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                /*vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationStorehouseDetail&' + vc.objToGetParam($that.allocationStorehousesInfo.conditions));*/
                vc.component.allocationStorehousesInfo.conditions.pagePath = 'allocationStorehouseDetailed';
                let param = {
                    params: vc.component.allocationStorehousesInfo.conditions
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
            swatchApplyType: function (_item) {
                $that.allocationStorehousesInfo.conditions.applyType = _item.statusCd;
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);