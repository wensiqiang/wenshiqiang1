/**
 * Created by HUCC on 2017/11/4.
 */
$(function () {

  //短信验证功能（目的：获取验证码， 通过返回的结果）
  $(".btn_getcode").on("click", function () {



    //只要点击按钮，先把按钮的值改成 正在发送中...
    //需要把按钮的样式改成灰色，禁用了这个按钮
    var $this = $(this);
    //先判断有没有disabled类，如果有，不玩了。
    if($this.hasClass("disabled")){
      return false;
    }


    $this.addClass("disabled").html("正在发送中....");
    $.ajax({
      type: "get",
      url: "/user/vCode",
      success: function (data) {
        //成功了说明后台发送了验证码，需要让用户60秒后才能再次点击
        console.log(data.vCode);//相当于手机收到了验证码
        var num = 60;
        var timer = setInterval(function () {
          num--;
          $this.html(num + "秒后再次发送");

          if (num <= 0) {
            $this.html("再次发送").removeClass("disabled");
            //清定时器
            clearInterval(timer);
          }
        }, 1000);

      }
    });
  })


  //手机注册功能
  $(".btn_register").on("click", function () {

    //获取所有的数据
    var username = $("[name='username']").val();
    var password = $("[name='password']").val();
    var repassword = $("[name='repassword']").val();
    var mobile = $("[name='mobile']").val();
    var vCode = $("[name='vCode']").val();


    //表单校验
    if(!username){
      mui.toast("请输入用户名");
      return false;
    }
    if(!password){
      mui.toast("请输入密码");
      return false;
    }
    if(!repassword){
      mui.toast("请输入确认密码");
      return false;
    }

    if(password != repassword){
      mui.toast("确认密码与密码不一致");
      return false;
    }

    if(!vCode){
      mui.toast("请输入验证码");
      return false;
    }

    //验证码只能是6位数字
    if(!/^\d{6}$/.test(vCode)){
      mui.toast("请输入有效的验证码");
      return false;
    }

    if(!mobile){
      mui.toast("请输入手机号");
      return false;
    }

    if(!/^1[34578]\d{9}$/.test(mobile)){
      mui.toast("请输入有效的手机号码");
      return false;
    }


    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/user/register",
      data:{
        username:username,
        password:password,
        mobile:mobile,
        vCode:vCode
      },
      success:function (data) {
        if(data.success){
          mui.toast("注册成功，即将跳转到登录页");
          setTimeout(function () {
            location.href = "login.html";
          },1000);
        }else {
          mui.toast(data.message);
        }

      }
    })

  });

});