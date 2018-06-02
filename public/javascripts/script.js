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
            let table = document.getElementById("scheduleTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {
                    let cell=table.rows[i].cells[j];
                    $(cell).find(".nameSubject").text("");
                    $(cell).find(".teacher").text("");
                    $(cell).find(".classroom").text("");
                };};
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 1, col; col = row.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);

                                    //$(cell).find(".teacher").text(data[i][j].lastname+" "+(data[i][j].firstname)[0]+". "+(data[i][j].lastname)[0]+". ");
                                };};};
                    };
                };
            });
        });
    });
    $(function () {
        $("#saveChangesScheduleBtn").click(function() {
            var clickedGroupName = $("input#clickedGroupName").val();
            var clickedDateTime = $("input#clickedDateTime").val();
            var clickedDateDay = $("input#clickedDateDay").val()
            var subjectSelect=$("#inputGroupSelect01 option:selected").text();
            var teacherSelect=$("#inputGroupSelect02 option:selected").text();
            var classroomSelect=$("#inputGroupSelect03 option:selected").text();
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,subjectSelect:subjectSelect,
                teacherSelect:teacherSelect,classroomSelect:classroomSelect};
            $.ajax({
                type: "POST",
                url: "/saveChanges",
                data: result,
                success:function () {
                    fillSchedule();
                }
            });
            return false;
        });
    });

    function fillSchedule() {
        var select_ = $("#inputGroupSelect04 option:selected").text();
        $(".clickedGroupName").val(select_);
        let table = document.getElementById("scheduleTable");
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 1, col; col = row.cells[j]; j++) {
                let cell=table.rows[i].cells[j];
                $(cell).find(".nameSubject").text("");
                $(cell).find(".teacher").text("");
                $(cell).find(".classroom").text("");
            };};
        $.ajax({
            type: "POST",
            url: "/fillSchedule",
            data: jQuery.param({group: select_}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {
                                let cell=table.rows[i].cells[j];
                                $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                $(cell).find(".teacher").text(data[i][j].teacherName);
                                $(cell).find(".classroom").text(data[i][j].className);

                                //$(cell).find(".teacher").text(data[i][j].lastname+" "+(data[i][j].firstname)[0]+". "+(data[i][j].lastname)[0]+". ");
                            };};};
                };
            };
        });
    };

    fillSchedule();//подгрузка расписания при автоматической подстановке группы

    $("#inputGroupSelect02").select2({
            placeholder: "Выберите преподавателя",
            allowClear: true
        });
    $("#inputGroupSelect03").select2({
            placeholder: "Выберите аудиторию",
            allowClear: true
        });

    $("#inputGroupSelect04").select2({
        placeholder: "Выберите группу"
    });

    $("#inputGroupSelect01").select2({
        placeholder: "Выберите предмет",
        allowClear: true
    });
    // Read selected option
    /*$('#but_read').click(function(){
        var username = $('#inputGroupSelect04 option:selected').text();
        var userid = $('#inputGroupSelect04').val();

        $('#result').html("id : " + userid + ", name : " + username);

    });*/
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

function typeUserRegister(a) {
    var label = a.value;
    var sel = document.getElementById("Select1");
    var val = sel.options[sel.selectedIndex].text;
    if (val=="Староста") {
        document.getElementById("Label1").style.display='block';
    }
    else {
        document.getElementById("Label1").style.display='none';
    }
};

function userGroup(a) {

    var group1 = document.getElementById("userGroup");
    var val = group1.textContent;
    var group2 = document.getElementById("inputGroupSelect04");
    var val1 = group2.options[group2.selectedIndex].text;
    var type_user = document.getElementById("type_user");
    var val2 = type_user.textContent;

    if(val2=='Администратор'){
        document.getElementById("editSchedule").style.display='block';
        document.getElementById("Label1").style.display='none';
    };
    if (val2=='Староста' && val==val1) {
        document.getElementById("editSchedule").style.display='block';
        document.getElementById("Label1").style.display='none';
    };
    if (val2=='Староста' && val!=val1) {
        document.getElementById("editSchedule").style.display='none';
        document.getElementById("Label1").style.display='block';
    };
};
