
$(document).ready(function(){
    $("#btn_closeWindow").click(function(){
        $(".par").hide();
    });
    $("#btn_openWindow").click(function(){
        $(".par").toggle();
    });
    $(".teacher_li").click(function () {
        $(this).parent().find("#delTeacher").toggle();
        $(this).parent().find("#changeTeacher").toggle();
    });
 /*
   $("td").click(function () {
        $.ajax({
            type: "GET",
            url: "/tableSubjects",
            dataType:"json"
        }).done(function (data) {
            var subjects=JSON.parse(JSON.stringify(data));
            for (var i in subjects){
                $(".td-dropdown").append("<a class='dropdown-item'>" +
                    subjects[i]+" </a>");
            }
        });
       // $(this).append("subjects");
    });
*/
});
