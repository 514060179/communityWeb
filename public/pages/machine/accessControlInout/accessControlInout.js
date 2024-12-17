/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accessControlInoutInfo: {
                accessControlInouts: [],
                accessControls: [],
                openTypeCds: [{
                    openTypeName: '全部',
                    openTypeCd: '',
                }, {
                    openTypeName: '人脸开门',
                    openTypeCd: '1000',
                }, {
                    openTypeName: '钥匙开门',
                    openTypeCd: '2000',
                }, {
                    openTypeName: '二维码开门',
                    openTypeCd: '3000',
                }, {
                    openTypeName: '密码开门',
                    openTypeCd: '4000',
                }],
                total: 0,
                records: 1,
                moreCondition: false,
                inoutId: '',
                conditions: {
                    machineId: '',
                    name: '',
                    openTypeCd: '',
                    tel: '',
                    state: '',
                    queryStartTime:'',
                    queryEndTime:'',
                    iotApiCode:'listAccessControlInoutBmoImpl',
                }
            }
        },
        _initMethod: function() {
            $that._listAccessControls();
            $that._listAccessControlInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.initDateTime('queryStartTime',function(_value){
                $that.accessControlInoutInfo.conditions.queryStartTime = _value;
            });
            vc.initDateTime('queryEndTime',function(_value){
                $that.accessControlInoutInfo.conditions.queryEndTime = _value;
            });
        },
        _initEvent: function() {

            vc.on('accessControlInout', 'listAccessControlInout', function(_param) {
                $that._listAccessControlInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAccessControlInouts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccessControlInouts: function(_page, _rows) {

                $that.accessControlInoutInfo.conditions.page = _page;
                $that.accessControlInoutInfo.conditions.row = _rows;
                $that.accessControlInoutInfo.conditions.communityId = vc.getCurrentCommunity().communityId;

                let param = {
                    params: $that.accessControlInoutInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.accessControlInoutInfo.total = _json.total;
                        $that.accessControlInoutInfo.records = _json.records;
                        $that.accessControlInoutInfo.accessControlInouts = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.accessControlInoutInfo.records,
                            currentPage: _page,
                            dataCount:_json.total
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _queryAccessControlInoutMethod: function() {
                $that._listAccessControlInouts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            swatchOpenTypeCd: function(_openType) {
                $that.accessControlInoutInfo.conditions.openTypeCd = _openType.openTypeCd;
                $that._listAccessControlInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOwnerFace: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },

            _listAccessControls: function(_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        iotApiCode:'listAccessControlBmoImpl',

                    }
                };
                $that.accessControlInoutInfo.accessControls = [];

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function(json, res) {
                        let _accessControlManageInfo = JSON.parse(json);
                        $that.accessControlInoutInfo.accessControls = _accessControlManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });
})(window.vc);