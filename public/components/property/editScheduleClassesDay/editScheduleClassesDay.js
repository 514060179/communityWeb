(function(vc) {
    vc.extends({
        data: {
            editScheduleClassesDayInfo: {
                workday: '',
                workdayName: '',
                times: [],
                classess: [],
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editScheduleClassesDay', 'notify', function(_param) {
                // 如果是排班修改的页面进来的话，设置上下班时间不允许修改。
                if(_param.scheduleClassesPage) {
                    _param.isOper = true;
                } else {
                    _param.isOper = false;
                }
                $that.editScheduleClassesDayInfo = _param;
                $that._listClassess();
                $('#editScheduleClassesDayModel').modal('show');
            });
        },
        methods: {
            _changeScheduleClassesDayState: function() {
                if (!$that.editScheduleClassesDayInfo.scheduleClassesPage) {
                    $that.editScheduleClassesDayInfo.times.splice(0, $that.editScheduleClassesDayInfo.times.length);
                    if ($that.editScheduleClassesDayInfo.workday == '2002') {
                        $that.editScheduleClassesDayInfo.workdayName = '休息';
                        return;
                    }
                    let _classes = $that.editScheduleClassesDayInfo.classess;
                    _classes.forEach(item => {
                        if ($that.editScheduleClassesDayInfo.workday == item.classesId) {
                            $that.editScheduleClassesDayInfo.workdayName = item.name;
                            item.times.forEach(time => {
                                $that.editScheduleClassesDayInfo.times.push(time);
                            })
                        }
                    });
                } 
            },
            _changeScheduleClassesDayStateNew: function() {
                $that.editScheduleClassesDayInfo.times.splice(0, $that.editScheduleClassesDayInfo.times.length);
                if ($that.editScheduleClassesDayInfo.workday == '2002') {
                    $that.editScheduleClassesDayInfo.workdayName = '休息';
                    return;
                }
                let _classes = $that.editScheduleClassesDayInfo.classess;
                _classes.forEach(item => {
                    if ($that.editScheduleClassesDayInfo.workday == item.classesId) {
                        $that.editScheduleClassesDayInfo.workdayName = item.name;
                        item.times.forEach(time => {
                            $that.editScheduleClassesDayInfo.times.push(time);
                        })
                    }
                });
            },
            _summitEditScheduleClassesDay: function() {
                var _param = $that.editScheduleClassesDayInfo;
                _param.classId = _param.workday;
                if (_param.scheduleClassesPage) {
                    $that._updateScheduleClassesDay(_param);
                }
            },
            // 专门为修改排班处理, 调用修改用户的排班时间.
            _updateScheduleClassesDay: function (param) {
                vc.http.apiPost(
                    '/scheduleClasses.updateScheduleClassesDay',
                    JSON.stringify(param), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $that._changeScheduleClassesDayStateNew();
                            vc.toast('修改成功');
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
            _listClassess: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        state: '1001'
                    }
                };

                //发送get请求
                vc.http.apiGet('/classes.listClasses',
                    param,
                    function(json, res) {
                        let _classesManageInfo = JSON.parse(json);
                        vc.component.editScheduleClassesDayInfo.classess = _classesManageInfo.data;
                        $that.$forceUpdate();

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getClassTime: function(item) {
                let _time = "";
                if (!item.times) {
                    return _time
                }

                item.times.forEach(_timeItem => {
                    _time += (_timeItem.startTime + "~" + _timeItem.endTime + ";")
                })
                if (!_time) {
                    return _time;
                }

                return "(" + _time + ")";
            }

        }
    });
})(window.vc);