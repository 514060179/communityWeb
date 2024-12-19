/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carInManageInfo: {
                carIns: [],
                parkingAreas:[],
                total: 0,
                records: 1,
                moreCondition: false,
                carNum: '',
                conditions: {
                    state: '100300',
                    carNum: '',
                    inoutId: '',
                    carType:'H',
                    startTime: '',
                    endTime: '',
                    paNum:'',
                    paId:'',
                    iotApiCode:'listCarInParkingAreaBmoImpl'
                }
            }
        },
        _initMethod: function () {
            $that._initCarInDateInfo();
            $that._loadParkingArea(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('carInoutManage', 'listCarInout',
                function (_param) {
                    $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listCarIns(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadParkingArea: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.carInManageInfo.parkingAreas = _json.parkingAreas;
                        if (_json.parkingAreas && _json.parkingAreas.length > 0) {
                            $that._swatchParkingArea(_json.parkingAreas[0])
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });

            },
            _swatchParkingArea: function (_parkingArea) {
                $that.carInManageInfo.conditions.paNum = _parkingArea.num;
                $that.carInManageInfo.conditions.paId = _parkingArea.paId;
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _initCarInDateInfo: function () {
                $('.carInStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInStartTime").val();
                        $that.carInManageInfo.conditions.startTime = value;
                    });
                $('.carInEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInEndTime").val();
                        $that.carInManageInfo.conditions.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control carInStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control carInEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listCarIns: function (_page, _rows) {
                $that.carInManageInfo.conditions.page = _page;
                $that.carInManageInfo.conditions.row = _rows;
                $that.carInManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.carInManageInfo.conditions
                };
                param.params.carNum = param.params.carNum.trim();
                param.params.inoutId = param.params.inoutId.trim();
                //发送get请求
                vc.http.apiGet('/carInoutDetail.listCarInoutDetail', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.carInManageInfo.total = _json.total;
                        $that.carInManageInfo.records = _json.records;
                        $that.carInManageInfo.carIns = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.carInManageInfo.records,
                            dataCount: $that.carInManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            //查询
            _queryCarInoutMethod: function () {
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCarInoutMethod: function () {
                $that.carInManageInfo.conditions.carNum = "";
                $that.carInManageInfo.conditions.inoutId = "";
                $that.carInManageInfo.conditions.startTime = "";
                $that.carInManageInfo.conditions.endTime = "";
                $that._listCarIns(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.carInManageInfo.moreCondition) {
                    $that.carInManageInfo.moreCondition = false;
                } else {
                    $that.carInManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);