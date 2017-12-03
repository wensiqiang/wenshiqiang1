/**
 * Created by HUCC on 2017/11/4.
 */
$(function () {


  //下拉刷新功能
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",
      down : {
        auto: true,
        callback :function () {

          //渲染购物车功能
          $.ajax({
            type:"get",
            url:"/cart/queryCart",
            success:function (data) {
              console.log(data);
              //获取数据花了1秒钟
              setTimeout(function () {
                console.log(data);
                tools.checkLogin(data);
                //渲染购物车
                $("#OA_task_2").html( template("tpl", {data:data}) );
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
              }, 1000);

            }
          });


        }
      }
    }
  });




  //删除功能，为了ios上一个bug，如果用到了下拉刷新或者上拉加载，mui禁用了click，需要使用tap
  $("#OA_task_2").on("tap", ".btn_delete", function () {
    var id = $(this).data("id");

    mui.confirm("确定删除吗?","提示",["否","是"],function (e) {
      if(e.index === 0){
        mui.toast("操作取消");
      }else {
        $.ajax({
          type:"get",
          url:"/cart/deleteCart",
          data:{
            id:[id]//id必须是一个数组
          },
          success:function (data) {
            tools.checkLogin(data);
            if(data.success){
              //让容器下拉一次
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })



  });



  //编辑功能
  $("#OA_task_2").on("tap", ".btn_edit", function () {

    var data = this.dataset;
    //模版引擎绑定数据
    var html = template("tpl2", data);

    //需要把html这个字符串中所有的\n全部替换掉.
    html = html.replace(/\n/g, "");

    //弹出confirm窗
    mui.confirm(html, "编辑商品", ["确定","取消"], function (e) {
      if(e.index == 0){
        //这里面需要修改商品
        $.ajax({
          type:"post",
          url:"/cart/updateCart",
          data:{
            id:data.id,
            size:$(".lt_edit_size span.now").html(),
            num:$(".mui-numbox-input").val()
          },
          success:function (data) {
            //校验是否登录
            tools.checkLogin(data);

            if(data.success){
              //如果成功，重新下拉一次
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }

          }
        });


      }else{
        mui.toast("操作取消")
      }
    });

    //重新渲染mui数字框  给尺码注册点击事件
    mui(".mui-numbox").numbox();
    $(".lt_edit_size span").on("tap", function () {
      $(this).addClass("now").siblings().removeClass("now");
    })

  });



  //计算总金额的功能
  //1. 需要给所有的checkbox注册事件
  $("#OA_task_2").on("change", ".ck", function () {
    //获取到选中的checkbox，计算选中checkbox的商品的金额

    var total = 0;

    $(":checked").each(function (i, e) {

      total +=  $(this).data("num") * $(this).data("price");

    });

    $(".lt_total span").html(total);
  });

});