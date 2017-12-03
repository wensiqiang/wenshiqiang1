/**
 * Created by HUCC on 2017/10/31.
 */

$(function () {

  var currentPage = 1;
  var pageSize = 5;

  //渲染一级分页功能
  function render() {

    //发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        //渲染数据
        $("tbody").html(template("tpl", data));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(data.total / pageSize),
          size: "small",
          onPageClicked(a, b, c, page){
            currentPage = page;
            render();
          }
        });

      }
    })

  }
  render();


  //显示添加模态框
  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");
  });



  //给表单做校验
  var $form = $("#form");
  $form.bootstrapValidator({
    //校验时使用的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{

      //name属性
      categoryName:{
        validators:{
          notEmpty:{
            message:"一级分类名称不能为空"
          }
        }
      }

    }
  });

  $form.on("success.form.bv", function (e) {
    e.preventDefault();

    //要发送ajax请求
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$form.serialize(),
      success:function (data) {
        if(data.success){

          //成功了，需要做什么?
          //1. 关闭模态框
          $("#addModal").modal("hide");
          //2. 重新渲染第一页
          currentPage = 1;
          render();

          //3. 重置表单
          $form.data("bootstrapValidator").resetForm();
          //表单有一个reset方法，会把表单中所有的值都清空,js对象的方法
          $form[0].reset();

        }
      }
    });
  });

  //校验成功后，需要发送ajax请求

});
