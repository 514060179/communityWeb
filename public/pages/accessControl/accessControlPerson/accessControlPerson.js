(function(vc) {
    vc.extends({
        data: {
            accessControlPersonInfo: {
                ownerId: '',
                ownerName: '',
                machines: [],
                machineIds: [],
                communityId: '',
                startDate: '',
                endDate: '',
                cardNumber: '',
                liveFloor: '',
                handFloor: '',
                qrCodeOpenDoor: true,
                cardNumberList: [],
                iotApiCode: 'saveAccessControlFaceBmoImpl',
                needBack: false,
                authedMachines: [],
                units: [],
                ownerRooms: [],
            }
        },
        _initMethod: function() {
            $that.accessControlPersonInfo.ownerId = vc.getParam('ownerId');
            $that.accessControlPersonInfo.ownerName = vc.getParam('ownerName');
            $that.accessControlPersonInfo.needBack = vc.getParam('needBack');

            $that._loadFloorAndUnits();
            $that._loadOwnerRooms();

            vc.initDate('startDate', function(_value) {
                $that.accessControlPersonInfo.startDate = _value;
            });
            vc.initDate('endDate', function(_value) {
                $that.accessControlPersonInfo.endDate = _value;
            });
        },
        _initEvent: function() {
            vc.on('accessControlPerson', 'chooseOwner', function(_owner) {
                $that.accessControlPersonInfo.ownerName = _owner.name;
                $that.accessControlPersonInfo.ownerId = _owner.ownerId;
            });

            vc.on('accessControlPerson', 'chooseAccessCard', function(_card) {
                if ($that.accessControlPersonInfo.cardNumberList.indexOf(_card.cardNumber) < 0) {
                    $that.accessControlPersonInfo.cardNumberList.push(_card.cardNumber);
                }
            });

            vc.on('accessControlPerson', 'chooseAccessCardList', function(_cards) {
                for(let i = 0; i < _cards.length; i++) {
                    if ($that.accessControlPersonInfo.cardNumberList.indexOf(_cards[i]) < 0) {
                        $that.accessControlPersonInfo.cardNumberList.push(_cards[i]);
                    }
                }
            });
        },
        methods: {
            _authorizeAccessControl: function () {
                $that.accessControlPersonInfo.communityId = vc.getCurrentCommunity().communityId;
                let _machineIds = $that.accessControlPersonInfo.machineIds;

                if (!_machineIds || _machineIds.length < 1) {
                    vc.toast('选择授权门禁');
                    return;
                }

                if ($that.accessControlPersonInfo.cardNumberList.length > 0) {
                    for (let i = 0; i < $that.accessControlPersonInfo.cardNumberList.length; i++) {
                        if ($that.accessControlPersonInfo.cardNumberList[i] === '') {
                            vc.toast('请输入门禁卡号');
                            return;
                        }
                    }
                }

                let _cardNumber = $that.accessControlPersonInfo.cardNumberList.join(',');
                if (!$that.accessControlPersonInfo.qrCodeOpenDoor) {
                    if (!_cardNumber || _cardNumber.length === 0 || _cardNumber === '') {
                        vc.toast('请输入门禁卡号');
                        return;
                    }
                }

                $that.accessControlPersonInfo.cardNumber = _cardNumber;

                //发送get请求
                vc.http.apiPost('/iot.postOpenApi',
                    $that.accessControlPersonInfo,
                    {},
                    function (json, res) {
                        console.log(json);
                        let _json = JSON.parse(json);
                        if (_json.code === 0) {
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _loadFloorAndUnits: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloorAndUnits',
                    param,
                    function (json) {
                        let _data = JSON.parse(json);
                        $that.accessControlPersonInfo.units = _data;
                        $that._listMachines();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _loadOwnerRooms: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.accessControlPersonInfo.ownerId,
                        page: 1,
                        row: 10,
                        roomNum: ''
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _data = JSON.parse(json);
                        $that.accessControlPersonInfo.ownerRooms = _data.rooms;
                        for(let i = 0; i < $that.accessControlPersonInfo.units.length; i++) {
                            for(let j = 0; j < _data.rooms.length; j++){
                                if(_data.rooms[j].unitNum === $that.accessControlPersonInfo.units[i].unitNum){
                                    $that.accessControlPersonInfo.units[i].handFloor = _data.rooms[j].layer;
                                }
                            }
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _listAuthMachines: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        iotApiCode: 'listAccessControlFaceBmoImpl',
                        personId: $that.accessControlPersonInfo.ownerId,
                        statusCd: '0'
                    }
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.accessControlPersonInfo.authedMachines = _json.data;
                        $that.accessControlPersonInfo.cardNumberList = [];
                        let handFloors = [];
                        for (let i = 0; i < $that.accessControlPersonInfo.authedMachines.length; i++) {
                            const item = $that.accessControlPersonInfo.authedMachines[i];
                            if ($that.accessControlPersonInfo.startDate === '') {
                                $that.accessControlPersonInfo.startDate = item.startTime.replace(" 00:00:00", "");
                            } else {
                                if (new Date($that.accessControlPersonInfo.startDate).getTime() > new Date(item.startTime).getTime()) {
                                    $that.accessControlPersonInfo.startDate = item.startTime.replace(" 00:00:00", "");
                                }
                            }

                            if ($that.accessControlPersonInfo.endDate === '') {
                                $that.accessControlPersonInfo.endDate = item.endTime.replace(" 00:00:00", "");
                            } else {
                                if (new Date($that.accessControlPersonInfo.endDate).getTime() < new Date(item.endTime).getTime()) {
                                    $that.accessControlPersonInfo.endDate = item.endTime.replace(" 00:00:00", "");
                                }
                            }

                            if ($that.accessControlPersonInfo.machineIds.indexOf(item.machineId) < 0) {
                                for (let n = 0; n < $that.accessControlPersonInfo.machines.length; n++) {
                                    if (item.machineId === $that.accessControlPersonInfo.machines[n].machineId) {
                                        $that.accessControlPersonInfo.machineIds.push(item.machineId);
                                        break;
                                    }
                                }
                            }

                            if (item.cardNumber !== 'qrcode' && item.cardNumber !== '') {
                                if ($that.accessControlPersonInfo.cardNumberList.indexOf(item.cardNumber) < 0) {
                                    $that.accessControlPersonInfo.cardNumberList.push(item.cardNumber);
                                }
                            } else {
                                $that.accessControlPersonInfo.qrCodeOpenDoor = true;
                            }

                            for (let j = 0; j < $that.accessControlPersonInfo.machines.length; j++) {
                                if ($that.accessControlPersonInfo.machines[j].machineId === item.machineId) {
                                    for (let k = 0; k < $that.accessControlPersonInfo.units.length; k++) {
                                        if ($that.accessControlPersonInfo.machines[j].objId === $that.accessControlPersonInfo.units[k].unitId) {
                                            $that.accessControlPersonInfo.units[k].handFloor = item.handFloor;
                                        }
                                    }
                                }
                            }
                        }

                        $that.accessControlPersonInfo.handFloor = handFloors.join(',');

                        $that._initJsTree();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMachines: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        iotApiCode: 'queryAccessControlListBmoImpl'
                    }
                };

                //发送get请求
                vc.http.apiGet('/iot.getOpenApi',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.accessControlPersonInfo.machines = _json.data;

                        $that._listAuthMachines();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openChooseAccessCard: function () {
                vc.emit('searchAccessCard', 'openSearchAccessCardModel', {});
            },
            _deleteAccessCard: function (_index, cardNumber) {
                for (let i = 0; i < $that.accessControlPersonInfo.authedMachines.length; i++) {
                    const machine = $that.accessControlPersonInfo.authedMachines[i];
                    if (cardNumber === machine.cardNumber) {
                        // 如果之前添加过，删除
                        let param = {
                            mfId: machine.mfId,
                            communityId: vc.getCurrentCommunity().communityId,
                            iotApiCode: 'deleteAccessControlFaceBmoImpl'
                        };
                        vc.http.apiPost('/iot.postOpenApi',
                            param,
                            {},
                            function (json, res) {

                            },
                            function (errInfo, error) {
                                console.log('请求失败处理');
                            }
                        );
                    }
                }

                $that.accessControlPersonInfo.cardNumberList.splice(_index, 1);
            },
            checkAccessControlItem: function (event) {
                let machineId =  event.target.value;
                if(event.target.checked === false){
                    for (let i = 0; i < $that.accessControlPersonInfo.authedMachines.length; i++) {
                        const machine = $that.accessControlPersonInfo.authedMachines[i];
                        if (machineId === machine.machineId) {
                            // 如果之前添加过，删除
                            let param = {
                                mfId: machine.mfId,
                                communityId: vc.getCurrentCommunity().communityId,
                                iotApiCode: 'deleteAccessControlFaceBmoImpl'
                            };
                            vc.http.apiPost('/iot.postOpenApi',
                                param,
                                {},
                                function (json, res) {

                                },
                                function (errInfo, error) {
                                    console.log('请求失败处理');
                                }
                            );
                        }
                    }
                }
            },
            _initJsTree: function () {
                let _data = $that._doJsTreeData();
                $.jstree.destroy()
                $("#jstree_accessControl").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"],
                    'state': { //一些初始化状态
                        "opened": true,
                    },
                    'core': {
                        'data': _data
                    }
                });
                $('#jstree_accessControl').on("changed.jstree", function (e, data) {
                    if (data.action === 'model' || data.action === 'ready') {
                        //默认合并
                        $("#jstree_accessControl").jstree("close_all");
                        return;
                    }
                    let _selected = data.node.state.selected;
                    let _d = data.node.children_d;
                    if (_d.length < 1) {
                        _d.push(data.node.id);
                    }
                    let _selectedMachines = [];
                    _d.forEach(_dItem => {
                        if (_dItem.indexOf('m_') > -1) {
                            _selectedMachines.push(_dItem.substring(2));
                        }
                    });

                    if (_selectedMachines.length < 1) {
                        return;
                    }

                    if (_selected) {
                        $that._addMachineToMachineGroup(_selectedMachines);
                    } else {
                        $that._deleteMachine(_selectedMachines);
                    }
                });
            },
            _doJsTreeData: function () {
                let _mGroupTree = [];
                //构建第一层-小区
                let _groupItem = {
                    id: 'c_' + vc.getCurrentCommunity().communityId,
                    cId: vc.getCurrentCommunity().communityId,
                    text: vc.getCurrentCommunity().name,
                    state: {
                        opened: true
                    },
                    children: [],
                    icon: "/img/room.png",
                };
                $that._doJsTreeMenuData(_groupItem);
                _mGroupTree.push(_groupItem);
                return _mGroupTree;
            },
            _doJsTreeMenuData: function (_groupItem) {
                let _children = _groupItem.children;
                let _machines = $that.accessControlPersonInfo.machines;
                //构建菜单第二层-楼栋及所属小区门禁梯控设备
                for (let i = 0; i < _machines.length; i++) {
                    if (_groupItem.cId === _machines[i].objId && _machines[i].locationType.toString() === '1000') {
                        const _menuItem = {
                            id: 'm_' + _machines[i].machineId,
                            mId: _machines[i].machineId,
                            text: _machines[i].machineName,
                            state: {
                                opened: false,
                                selected: $that.accessControlPersonInfo.machineIds.indexOf(_machines[i].machineId) > -1
                            },
                            children: [],
                            icon: _machines[i].hmName.toString().indexOf('梯控') > -1 ? '/img/lift.png' : '/img/door.png',
                        };
                        _children.push(_menuItem);
                    }
                }

                let _floors = $that.accessControlPersonInfo.units;
                for (let _pIndex = 0; _pIndex < _floors.length; _pIndex++) {
                    // 判断楼栋是否加入
                    var inserted = false;
                    for (let j = 0; j < _children.length; j++) {
                        if (_children[j].fId === _floors[_pIndex].floorId) {
                            inserted = true;
                            break;
                        }
                    }

                    if (inserted) {
                        continue;
                    }

                    let _menuItem = {
                        id: 'f_' + _floors[_pIndex].floorId,
                        fId: _floors[_pIndex].floorId,
                        text: _floors[_pIndex].floorNum + '栋',
                        icon: "/img/floor.png",
                        state: {
                            opened: true
                        },
                        children: []
                    };
                    $that._doJsTreeUnitData(_menuItem);
                    _children.push(_menuItem);
                }
            },
            _doJsTreeUnitData: function (_menuItem) {
                let _children = _menuItem.children;
                let _machines = $that.accessControlPersonInfo.machines;
                //构建菜单第三层-座及所属楼栋门禁梯控设备
                for (let i = 0; i < _machines.length; i++) {
                    if (_menuItem.fId === _machines[i].objId && _machines[i].locationType.toString() === '6000') {
                        let _menuItem1 = {
                            id: 'm_' + _machines[i].machineId,
                            mId: _machines[i].machineId,
                            text: _machines[i].machineName,
                            state: {
                                opened: false,
                                selected: $that.accessControlPersonInfo.machineIds.indexOf(_machines[i].machineId) > -1
                            },
                            icon: _machines[i].hmName.toString().indexOf('梯控') > -1 ? '/img/lift.png' : '/img/door.png',
                        };
                        _children.push(_menuItem1);
                    }
                }

                let _floors = $that.accessControlPersonInfo.units;
                for (let _pIndex = 0; _pIndex < _floors.length; _pIndex++) {
                    if (_menuItem.fId === _floors[_pIndex].floorId) {
                        let _privilegeItem = {
                            id: 'u_' + _floors[_pIndex].unitId,
                            uId: _floors[_pIndex].unitId,
                            text: _floors[_pIndex].unitNum + '座',
                            state: {
                                opened: true
                            },
                            icon: "/img/unit.png",
                            children: [],
                        };
                        $that._doJsTreeMachineData(_privilegeItem);
                        _children.push(_privilegeItem);
                    }
                }
            },
            _doJsTreeMachineData: function (_menuItem) {
                let _children = _menuItem.children;
                let _machines = $that.accessControlPersonInfo.machines;
                //构建菜单第三层-座及所属楼栋门禁梯控设备
                for (let i = 0; i < _machines.length; i++) {
                    if (_menuItem.uId === _machines[i].objId && _machines[i].locationType.toString() === '2000') {
                        let _menuItem2 = {
                            id: 'm_' + _machines[i].machineId,
                            mId: _machines[i].machineId,
                            text: _machines[i].machineName,
                            state: {
                                opened: false,
                                selected: $that.accessControlPersonInfo.machineIds.indexOf(_machines[i].machineId) > -1
                            },
                            icon: _machines[i].hmName.toString().indexOf('梯控') > -1 ? '/img/lift.png' : '/img/door.png',
                        };
                        _children.push(_menuItem2);
                    }
                }
                // if (_children.length === 0) {
                //     _menuItem.state = {
                //         disabled: true
                //     }
                // }
            },
            _addMachineToMachineGroup: function (selectedMachines) {
                for (let i = 0; i < selectedMachines.length; i++) {
                    if ($that.accessControlPersonInfo.machineIds.indexOf(selectedMachines[i]) < 0) {
                        $that.accessControlPersonInfo.machineIds.push(selectedMachines[i]);
                    }
                }
            },
            _deleteMachine: function (unselectedMachines) {
                for (let i = 0; i < unselectedMachines.length; i++) {
                    let index = $that.accessControlPersonInfo.machineIds.indexOf(unselectedMachines[i]);
                    if (index > -1) {
                        $that.accessControlPersonInfo.machineIds.splice(index, 1);
                    }
                }
            }
        }
    });
})(window.vc);