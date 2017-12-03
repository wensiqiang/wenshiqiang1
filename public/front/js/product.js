/**
 * Created by HUCC on 2017/11/2.
 */
$(function () {

  mui(".mui-scroll-wrapper").scroll({
    indicators:false
  })



  //首先，获取到id
  var id = tools.getParam("productId");
  $.ajax({
    type:"get",
    url:"/product/queryProductDetail",
    data:{
      id:id
    },
    success:function (data) {
      var temp = data.size.split("-");
      var sizeArray = [];
      for(var i = temp[0]; i <= temp[1]; i++){
        sizeArray.push(i);
      }

      data.sizeArray = sizeArray;

      $(".mui-scroll").html( template("tpl", data) );

      //当内容渲染完成后，需要去初始化轮播图
      //轮播图效果
      mui('.mui-slider').slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      mui(".mui-numbox").numbox();


    }
  });


  //尺码选择功能
  $(".mui-scroll").on("click", ".size", function () {
    $(this).addClass("now").siblings().removeClass("now");
  });



  //添加到购物车功能
  $(".btn_add_cart").on("click", function () {
    //获取数据
    var size = $(".size.now").html();
    var num = $(".mui-numbox-input").val();

    if(!size){
      mui.toast("请选择尺码");
      return;
    }

    //才发送ajax请求
    $.ajax({
      type:"post",
      url:"/cart/addCart",
      data:{
        productId:id,
        num:num,
        size:size
      },
      success:function (data) {

        if(data.success){
          mui.toast("添加成功了,");
        }
        if(data.error === 400){
          //跳转到login页面
          location.href = "login.html?retUrl="+location.href;
        }

      }
    });

  })

})