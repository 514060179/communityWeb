(function (vc) {
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string,
            componentTitle: vc.propTypes.string // 组件名称
        },
        data: {
            addOwnerInfo: {
                componentTitle: $props.componentTitle,
                name: '',
                age: '',
                link: '',
                address: '',
                sex: '',
                ownerTypeCd: '',
                remark: '',
                ownerId: '',
                ownerPhoto: '',
                ownerPhotoUrl: '',
                idCard: '',
                videoPlaying: true,
                mediaStreamTrack: null,
                attrs: []
            }
        },
        _initMethod: function () {
            $that._loadOwnerAttrSpec();
        },
        _initEvent: function () {
            vc.on('addOwner', 'openAddOwnerModal', function (_ownerId) {
                if (_ownerId != null || _ownerId != -1) {
                    vc.component.addOwnerInfo.ownerId = _ownerId;
                }
                $('#addOwnerModel').modal('show');
                vc.component._initAddOwnerMedia();
            });
        },
        methods: {
            addOwnerValidate: function () {
                return vc.validate.validate({
                    addOwnerInfo: vc.component.addOwnerInfo
                }, {
                    'addOwnerInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,64",
                            errInfo: "姓名长度必须在2位至64位"
                        }
                    ],
                    'addOwnerInfo.link': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        }
                    ],
                    'addOwnerInfo.idCard': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "身份证格式不对"
                        }
                    ],
                    'addOwnerInfo.sex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "性别不能为空"
                        }
                    ],
                    // 'addOwnerInfo.ownerTypeCd': [
                    //     {
                    //         limit: "required",
                    //         param: "",
                    //         errInfo: "人员类型不能为空"
                    //     }
                    // ],
                    'addOwnerInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            saveOwnerInfo: function () {
                let _url = "/owner.saveOwner";
                if (!vc.component.addOwnerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.addOwnerInfo.componentTitle == '成员' && vc.component.addOwnerInfo.ownerTypeCd == '') {
                    vc.toast("人员类型不能为空");
                    return;
                }
                if (vc.component.addOwnerInfo.componentTitle == '业主') {
                    vc.component.addOwnerInfo.ownerTypeCd = '1001';
                }
                if ($that.addOwnerInfo.ownerTypeCd && $that.addOwnerInfo.ownerTypeCd != '1001') {
                    _url = "/owner.saveOwnerMember"
                }
                vc.component.addOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(_url,
                    JSON.stringify(vc.component.addOwnerInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addOwnerModel').modal('hide');
                            //vc.component.clearAddOwnerInfo();
                            vc.toast("添加成功");
                            vc.emit($props.notifyLoadDataComponentName, 'listOwnerData', vc.component.addOwnerInfo);
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddOwnerInfo: function () {
                let _componentTitle = $that.addOwnerInfo.componentTitle;
                vc.component.addOwnerInfo = {
                    componentTitle: _componentTitle,
                    name: '',
                    age: '',
                    link: '',
                    address: '',
                    sex: '',
                    ownerTypeCd: '',
                    remark: '',
                    ownerId: '',
                    ownerPhoto: '',
                    ownerPhotoUrl: '',
                    idCard: '',
                    videoPlaying: true,
                    mediaStreamTrack: null,
                    attrs: []
                };
                this._loadOwnerAttrSpec();
            },
            _addUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddOwnerMedia: function () {
                if (vc.component._addUserMedia()) {
                    var constraints = {
                        video: true,
                        audio: false
                    };
                    var video = document.getElementById('ownerPhoto');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        $that.addOwnerInfo.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        vc.component.addOwnerInfo.videoPlaying = true;
                    }, function (error) {
                        vc.component.addOwnerInfo.videoPlaying = false;
                    });
                } else {
                    vc.component.addOwnerInfo.videoPlaying = false;
                    console.log("初始化视频失败");
                }
            },
            _takePhoto: function () {
                if (vc.component.addOwnerInfo.videoPlaying) {
                    var canvas = document.getElementById('canvas');
                    var video = document.getElementById('ownerPhoto');
                    let w = video.videoWidth;
                    // 默认按比例压缩
                    let h = video.videoHeight;
                    if (h > 1080 || w > 1080) {
                        let _rate = 0;
                        if (h > w) {
                            _rate = h / 1080;
                            h = 1080;
                            w = Math.floor(w / _rate);
                        } else {
                            _rate = w / 1080;
                            w = 1080;
                            h = Math.floor(h / _rate);
                        }
                    }
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext('2d').drawImage(video, 0, 0, w, h);
                    let data = canvas.toDataURL('image/jpeg', 0.3);
                    // 改为异步上传图片
                    this._doUploadImageAddOwner(vc.dataURLtoFile(data, $that.addOwnerInfo.name));
                    // vc.component.addOwnerInfo.ownerPhoto = data;
                    //document.getElementById('photo').setAttribute('src', data);
                    //关闭拍照摄像头
                    $that._closeVedio();
                } else {
                    vc.toast('未检测到摄像头');
                }
            },
            _uploadPhoto: function (event) {
                //vc.component.addOwnerInfo.ownerPhoto = "";
                $("#uploadOwnerPhoto").trigger("click")
            },
            _choosePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0]; // 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 1) {
                        vc.toast("图片大小不能超过 1MB!")
                        return false;
                    }
                    // 改为异步上传图片
                    $that._doUploadImageAddOwner(file);
                    // var reader = new FileReader(); //新建FileReader对象
                    // reader.readAsDataURL(file); //读取为base64
                    // reader.onloadend = function (e) {
                    //     vc.translate(reader.result, function (_data) {
                    //         vc.component.addOwnerInfo.ownerPhoto = _data;
                    //     })
                    // }
                }
            },
            // 异步上传图片
            _doUploadImageAddOwner: function (_file) {
                var param = new FormData();
                param.append("uploadFile", _file);
                param.append('communityId', vc.getCurrentCommunity().communityId);
                //发送get请求
                vc.http.upload('uploadFile',
                    'uploadImage',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        console.log(res);
                        // if (res.status != 200) {
                        //     vc.toast("上传文件失败");
                        //     return;
                        // }
                        var data = JSON.parse(json);
                        console.log(data);
                        vc.component.addOwnerInfo.ownerPhoto = data.fileId;
                        vc.component.addOwnerInfo.ownerPhotoUrl = data.url;
                        console.log(vc.component.addOwnerInfo.ownerPhotoUrl)
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _reOpenVedio: function () {
                vc.component.addOwnerInfo.ownerPhoto = "";
                vc.component.addOwnerInfo.ownerPhotoUrl = "";
                vc.component._initAddOwnerMedia();
            },
            _closeVedio: function () {
                if (vc.component.addOwnerInfo.mediaStreamTrack != null) {
                    vc.component.addOwnerInfo.mediaStreamTrack.stop();
                }
            },
            _loadOwnerAttrSpec: function () {
                $that.addOwnerInfo.attrs = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addOwnerInfo.attrs.push(item);
                        }
                    });
                });
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                });
            },
            _closeSaveOwnerModal: function () {
                $that._closeVedio();
                $('#addOwnerModel').modal('hide');
            },

        }
    });
})(window.vc);