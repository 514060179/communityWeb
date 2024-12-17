(function(vc,vm){

    vc.extends({
        data:{
            deleteComplaintTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteComplaintType','openDeleteComplaintTypeModal',function(_params){

               $that.deleteComplaintTypeInfo = _params;
                $('#deleteComplaintTypeModel').modal('show');

            });
        },
        methods:{
            deleteComplaintType:function(){
               $that.deleteComplaintTypeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/complaintType.deleteComplaintType',
                    JSON.stringify(vc.component.deleteComplaintTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteComplaintTypeModel').modal('hide');
                            vc.emit('complaintType','listComplaintType',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);
                     });
            },
            closeDeleteComplaintTypeModel:function(){
                $('#deleteComplaintTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
