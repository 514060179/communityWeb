/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPrePaymentFeeInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                conditions: {}
            }
        },
        _initMethod: function () {
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('reportPrePaymentFee', 'switch', function (_data) {
                $that.reportPrePaymentFeeInfo.conditions = _data;
                $that._listPreFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportPrePaymentFee', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._listPreFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPreFees: function (_page, _rows) {
                $that.reportPrePaymentFeeInfo.conditions.page = _page;
                $that.reportPrePaymentFeeInfo.conditions.row = _rows;
                let param = {
                    params: $that.reportPrePaymentFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryPrePayment',
                    param,
                    function (json, res) {
                        let _reportPrePaymentFeeInfo = JSON.parse(json);
                        $that.reportPrePaymentFeeInfo.total = _reportPrePaymentFeeInfo.total;
                        $that.reportPrePaymentFeeInfo.records = _reportPrePaymentFeeInfo.records;
                        $that.reportPrePaymentFeeInfo.fees = _reportPrePaymentFeeInfo.data;
                        vc.emit('reportPrePaymentFee', 'paginationPlus', 'init', {
                            total: $that.reportPrePaymentFeeInfo.records,
                            dataCount: $that.reportPrePaymentFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //导出
            _exportExcel: function () {
                // vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' + $that.reportPrePaymentFeeInfo.conditions.communityId + "&pagePath=reportPrePaymentFee");
                vc.component.reportPrePaymentFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportPrePaymentFeeInfo.conditions.pagePath = 'reportPrePaymentFee';
                let param = {
                    params: vc.component.reportPrePaymentFeeInfo.conditions
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