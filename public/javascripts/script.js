$(document).ready(function () {
    $(function () {
        $("#btn_closeWindow").click(function () {
            $(".par").hide();
        });
    });
    $(function () {
        $("#btn_openWindow").click(function () {
            $(".par").toggle();
        });
    });
    $(function () {
        $(".teacher_li").click(function () {
            $(this).parent().find("#delTeacher").toggle();
            $(this).parent().find("#changeTeacher").toggle();
        });
    });
    $(function () {
        $('td').on('dblclick', function () {
            var $td = $(this),
                $tr = $td.parent(),
                trIndex = $tr.index(),
                tdIndex = $td.index(),
                table = document.getElementById("scheduleTable"),
                tableRows = table.rows;

            $(".clickedDateDay").val(tableRows[0].cells[tdIndex].textContent);
            $(".clickedDateTime").val(tableRows[trIndex + 1].cells[0].textContent);

        });
    });
    $(function () {
        $('#saveChangesScheduleBtn').on('click', function () {
            var subject = $("#inputGroupSelect01 option:selected").text();

            // $(".clickedDateDay").text(tableRows[0].cells[tdIndex].textContent);
            // $(".clickedDateTime").text(tableRows[trIndex+1].cells[0].textContent+" ");
        });
    });
    $(function () {
        $("#inputGroupSelect04").change(function () {

            var select_ = $("#inputGroupSelect04 option:selected").text();
            $(".clickedGroupName").val(select_);
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_}),
                dataType: "json"
            }).done(function (data) {
                //};
            });
        });
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
