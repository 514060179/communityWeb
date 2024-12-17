/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditAuthOwnerUndoInfo: {
                room: {},
                roomId: '',
                owners: [],
                appUserName:'',
                link:'',
                audit: {
                    state: '',
                    remark: '',
                    appUserId: '',
                }
            }
        },
        _initMethod: function () {
            $that.auditAuthOwnerUndoInfo.audit.appUserId = vc.getParam('appUserId');
            $that.auditAuthOwnerUndoInfo.roomId = vc.getParam('roomId');
            $that.auditAuthOwnerUndoInfo.appUserName = vc.getParam('appUserName');
            $that.auditAuthOwnerUndoInfo.link = vc.getParam('link');
            $that._loadRoom();
            $that._loadOwners();

        },
        _initEvent: function () {

        },
        methods: {

            _loadRoom: function () {
                let _param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: $that.auditAuthOwnerUndoInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/room.queryRooms',
                    _param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.auditAuthOwnerUndoInfo.room = _json.rooms[0]
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadOwners: function () {
                let _param = {
                    params: {
                        page: 1,
                        row: 100,
                        roomId: $that.auditAuthOwnerUndoInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/owner.queryOwners',
                    _param,
                    function (json, res) {
                        let _json = JSON.parse(json);

                        $that.auditAuthOwnerUndoInfo.owners = _json.owners;
                     
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _auditSubmit:function(){
                let _auditInfo = $that.auditAuthOwnerUndoInfo.audit;
                _auditInfo.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.apiPost('/owner.auditAuthOwner',
                    JSON.stringify(_auditInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if(_json.code != 0){
                            vc.toast(_json.msg);
                            return;
                        }
                        
                        vc.goBack();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            }

        }
    });
})(window.vc);