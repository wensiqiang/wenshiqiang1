/**
 * Created by HUCC on 2017/11/1.
 */
//开启左侧的区域滚动
var sc = mui('.mui-scroll-wrapper').scroll({
  deceleration: 0.0005,
  indicators:false
});


//开启右侧的区域滚动
//var scrollRight = mui('.lt_category_r .mui-scroll-wrapper').scroll({
//  deceleration: 0.0005,
//  indicators:false
//});

//渲染一级分类
$.ajax({
  type:"get",
  url:"/category/queryTopCategory",
  success:function (data) {
    var html = template("tpl", data);
    $(".lt_category_l ul").html(html);

    //需要在一级分类数据渲染完成之后，去渲染第一个一级分类对应的二级分类.
    renderSecond(data.rows[0].id);


  }
});


//渲染二级分类的一个方法
//参数：一级分类id
function renderSecond(id){
  $.ajax({
    type:'get',
    url:"/category/querySecondCategory",
    data:{
      id:id
    },
    success:function (data) {
      //渲染二级分类
      $(".lt_category_r ul").html( template("tpl2", data) );
    }
  });
}


//给左边所有的li注册委托事件，获取到自定义属性id，渲染对应的二级分类。
$(".lt_category_l").on("click", "li", function () {
  $(this).addClass("now").siblings().removeClass("now");
  var id = $(this).data("id");
  renderSecond(id);

  //这里需要让右侧的区域滚动 scrollTop到0，0
  sc[1].scrollTo(0,0,500);
})