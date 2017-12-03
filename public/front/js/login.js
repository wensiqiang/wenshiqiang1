/**
 * Created by HUCC on 2017/11/4.
 */

$(function () {


  $(".btn_login").on("click", function () {

    var username = $("[name='username']").val();
    var password = $("[name='password']").val();

    //校验
    if(!username){
      mui.toast("请输入用户名");
      return false;
    }

    if(!password){
      mui.toast("请输入密码");
      return false;
    }


    $.ajax({
      type:"post",
      url:"/user/login",
      data:{
        username:username,
        password:password
      },
      success:function (data) {



        if(data.success){

          //登录成功，跳转到哪儿？
          //首先要获取到回跳的地址
          var search = location.search;
          //如果发现search有retUrl,说明要回跳， 如果没有，直接跳转到个人中心即可。
          if(search.indexOf("retUrl") > -1){
            //需要回跳
            search = search.replace("?retUrl=", "");
            location.href = search;//跳回去
          }else{
            location.href = "user.html";
          }

        }
        if(data.error === 403){
          mui.toast(data.message);
        }
      }
    })


  });

});