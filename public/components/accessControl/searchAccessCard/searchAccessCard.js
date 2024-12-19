(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseAccessCard: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            searchAccessCardInfo: {
                accessCards: [],
                cardNumber: '',
                faceCardNumber: '',
                selectedCards: [],
                sortOrder: '',
                sortField: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('searchAccessCard', 'openSearchAccessCardModel', function (_param) {
                $('#searchAccessCardModel').modal('show');
                $that._refreshSearchAccessCardData();
                $that._loadAllAccessCardInfo(1, 10);
            });
            vc.on('searchAccessCard', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllAccessCardInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllAccessCardInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        faceCardNumber: $that.searchAccessCardInfo.faceCardNumber,
                        cardNumber: $that.searchAccessCardInfo.cardNumber,
                        status: 0,
                        sortField: $that.searchAccessCardInfo.sortField,
                        sortOrder: $that.searchAccessCardInfo.sortOrder,
                        iotApiCode: 'listAccessCardBmoImpl'
                    }
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function(json, res) {
                        let _cardInfo = JSON.parse(json);
                        $that.searchAccessCardInfo.accessCards = _cardInfo.data;
                        vc.emit('searchAccessCard', 'paginationPlus', 'init', {
                            total: _cardInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseAccessCard: function (_card) {
                vc.emit($props.emitChooseAccessCard, 'chooseAccessCard', _card);
                vc.emit($props.emitLoadData, 'listAccessCardData', {
                    cardNumber: _card.cardNumber
                });
                $('#searchAccessCardModel').modal('hide');
            },
            searchAccessCards: function () {
                $that._loadAllAccessCardInfo(1, 10, $that.searchAccessCardInfo.cardNumber);
            },
            _refreshSearchAccessCardData: function () {
                $that.searchAccessCardInfo.cardNumber = "";
            },
            _cancelChoose: function (){
                $that.searchAccessCardInfo.selectedCards = [];
                $('#searchAccessCardModel').modal('hide');
            },
            _confirmChoose: function (){
                vc.emit($props.emitChooseAccessCard, 'chooseAccessCardList', $that.searchAccessCardInfo.selectedCards);
                $that.searchAccessCardInfo.selectedCards = [];
                $('#searchAccessCardModel').modal('hide');
            },
            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.searchAccessCardInfo.selectedCards.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.searchAccessCardInfo.selectedCards = [];
                }
            },
            sortByField: function (fieldName) {
                $that.searchAccessCardInfo.sortField = fieldName;
                if ($that.searchAccessCardInfo.sortOrder !== '') {
                    $that.searchAccessCardInfo.sortOrder = $that.searchAccessCardInfo.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    $that.searchAccessCardInfo.sortOrder = "asc"
                }

                $that._loadAllAccessCardInfo(1, 10);
            }
        }
    });
})(window.vc);