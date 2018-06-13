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
        $('.td1').on('dblclick', function () {
            var $td = $(this),
                $tr = $td.parent(),
                trIndex = $tr.index(),
                tdIndex = $td.index(),
                table = document.getElementById("scheduleTable"),
                table2 = document.getElementById("scheduleTable2"),
                tableRows = table.rows;
            tableRows2 = table2.rows;

            $(".clickedDateDay").val(tableRows[0].cells[tdIndex].textContent);
            $(".clickedDateTime").val(tableRows[trIndex + 1].cells[0].textContent);

            $(".clickedDateDay1").val(tableRows[0].cells[tdIndex].textContent);
            $(".clickedDateTime1").val(tableRows[trIndex + 1].cells[0].textContent);
            $(".clickedWeek1").val("верхняя");

            $(".clickedDateDay2").val(tableRows[0].cells[tdIndex].textContent);
            $(".clickedDateTime2").val(tableRows[trIndex + 1].cells[0].textContent);
        });
    });
    $(function () {
        $('.td2').on('dblclick', function () {
            var $td = $(this),
                $tr = $td.parent(),
                trIndex = $tr.index(),
                tdIndex = $td.index(),

                table2 = document.getElementById("scheduleTable2"),
                tableRows2 = table2.rows;


            $(".clickedDateDay").val(tableRows2[0].cells[tdIndex].textContent);
            $(".clickedDateTime").val(tableRows2[trIndex + 1].cells[0].textContent);
            //$(".clickedWeek").val("нижняя");
            $(".clickedDateDay1").val(tableRows2[0].cells[tdIndex].textContent);
            $(".clickedDateTime1").val(tableRows2[trIndex + 1].cells[0].textContent);
            $(".clickedWeek1").val("нижняя");

            $(".clickedDateDay2").val(tableRows2[0].cells[tdIndex].textContent);
            $(".clickedDateTime2").val(tableRows2[trIndex + 1].cells[0].textContent);
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
            $(".clickedGroupName1").val(select_);
            $(".clickedGroupName2").val(select_);
            let table = document.getElementById("scheduleTable");
            let table2 = document.getElementById("scheduleTable2");
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {

                    let cell=table.rows[i].cells[j];
                    $(cell).find(".nameSubject").text("");
                    $(cell).find(".teacher").text("");
                    $(cell).find(".classroom").text("");
                    $(cell).find(".nameSubject1").text("");
                    $(cell).find(".teacher1").text("");
                    $(cell).find(".classroom1").text("");

                };};

            for (var i = 0, row2; row2=table2.rows[i]; i++) {
                for (var j = 1, col2;col2 = row2.cells[j]; j++) {

                    let cell2=table2.rows[i].cells[j];
                    $(cell2).find(".nameSubject").text("");
                    $(cell2).find(".teacher").text("");
                    $(cell2).find(".classroom").text("");
                    $(cell2).find(".nameSubject1").text("");
                    $(cell2).find(".teacher1").text("");
                    $(cell2).find(".classroom1").text("");
                };};
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
                //console.log(data);
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 1, col; col = row.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);
                                };};};
                    };
                };
            });
            $.ajax({
                type: "POST",
                url: "/fillScheduleSecondPair",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
                //console.log(data);
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 1, col; col = row.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {
                                    let cell = table.rows[i].cells[j];
                                    $(cell).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacher1").text(data[i][j].teacherName);
                                    $(cell).find(".classroom1").text(data[i][j].className);
                                };};};

                    };
                };
            });
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_,week:'нижняя'}),
                dataType: "json"
            }).done(function (data) {
                let table2 = document.getElementById("scheduleTable2");
                //console.log(data);
                for (var i = 0, row2;  row2=table2.rows[i]; i++) {
                    for (var j = 1, col2; col2 = row2.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacher").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom").text(data[i][j].className);
                                };};};
                    };
                };
            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleSecondPair",
                data: jQuery.param({group: select_,week:'нижняя'}),
                dataType: "json"
            }).done(function (data) {
                let table2 = document.getElementById("scheduleTable2");
                //console.log(data);
                for (var i = 0, row2;  row2=table2.rows[i]; i++) {
                    for (var j = 1, col2; col2 = row2.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacher1").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom1").text(data[i][j].className);
                                };};};
                    };
                };

            });
        });

    });
    $(function () {
        $("#saveChangesScheduleBtn").click(function() {
            $("#form1").valid();
            var clickedGroupName = $("input#clickedGroupName").val();
            var clickedDateTime = $("input#clickedDateTime").val();
            var clickedDateDay = $("input#clickedDateDay").val()
            var subjectSelect=$("#inputGroupSelect01 option:selected").text();
            var teacherSelect=$("#inputGroupSelect02 option:selected").text();
            var classroomSelect=$("#inputGroupSelect03 option:selected").text();
            var typeSubjectSelect=$("#inputGroupSelect011 option:selected").text();
            var week="";
            if(document.getElementById('radio1').checked) {
                week='верхняя';//четная
            }
            else if(document.getElementById('radio2').checked) {
                week='нижняя';
            }
            else if(document.getElementById('radio3').checked){
                week='';
            }
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,subjectSelect:subjectSelect,
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week,typeSubjectSelect:typeSubjectSelect};
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

    $(function () {
        $("#saveChangesScheduleBtn1").click(function() {
            $("#form3").valid();
            var clickedGroupName = $("input#clickedGroupName2").val();
            var clickedDateTime = $("input#clickedDateTime2").val();
            var clickedDateDay = $("input#clickedDateDay2").val()
            var subjectSelect=$("#inputGroupSelect21 option:selected").text();
            var teacherSelect=$("#inputGroupSelect22 option:selected").text();
            var classroomSelect=$("#inputGroupSelect23 option:selected").text();
            var typeSubjectSelect=$("#inputGroupSelect211 option:selected").text();
            var week="";
            if(document.getElementById('radio21').checked) {
                week='верхняя';//четная
            }
            else if(document.getElementById('radio22').checked) {
                week='нижняя';
            }
            else if(document.getElementById('radio23').checked){
                week='';
            }
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,subjectSelect:subjectSelect,
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week,typeSubjectSelect:typeSubjectSelect};
            $.ajax({
                type: "POST",
                url: "/addSecondPair",
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
        let table2 = document.getElementById("scheduleTable2");
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 1, col; col = row.cells[j]; j++) {

                let cell=table.rows[i].cells[j];
                $(cell).find(".nameSubject").text("");
                $(cell).find(".teacher").text("");
                $(cell).find(".classroom").text("");
                $(cell).find(".nameSubject1").text("");
                $(cell).find(".teacher1").text("");
                $(cell).find(".classroom1").text("");

            };};

        for (var i = 0, row2; row2=table2.rows[i]; i++) {
            for (var j = 1, col2;col2 = row2.cells[j]; j++) {

                let cell2=table2.rows[i].cells[j];
                $(cell2).find(".nameSubject").text("");
                $(cell2).find(".teacher").text("");
                $(cell2).find(".classroom").text("");
                $(cell2).find(".nameSubject1").text("");
                $(cell2).find(".teacher1").text("");
                $(cell2).find(".classroom1").text("");
            };};
        $.ajax({
            type: "POST",
            url: "/fillSchedule",
            data: jQuery.param({group: select_,week:'верхняя'}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
            //console.log(data);


            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                let cell=table.rows[i].cells[j];

                                $(cell).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell).find(".teacher").text(data[i][j].teacherName);
                                $(cell).find(".classroom").text(data[i][j].className);
                            };};};
                };
            };
        });
        $.ajax({
            type: "POST",
            url: "/fillScheduleSecondPair",
            data: jQuery.param({group: select_,week:'верхняя'}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
            //console.log(data);
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                let cell=table.rows[i].cells[j];
                                $(cell).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell).find(".teacher1").text(data[i][j].teacherName);
                                $(cell).find(".classroom1").text(data[i][j].className);

                            };};};

                };
            };
        });
        $.ajax({
            type: "POST",
            url: "/fillSchedule",
            data: jQuery.param({group: select_,week:'нижняя'}),
            dataType: "json"
        }).done(function (data) {
            let table2 = document.getElementById("scheduleTable2");
            //console.log(data);
            for (var i = 0, row2;  row2=table2.rows[i]; i++) {
                for (var j = 1, col2; col2 = row2.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                let cell1 = table2.rows[i].cells[j];
                                $(cell1).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell1).find(".teacher").text(data[i][j].teacherName);
                                $(cell1).find(".classroom").text(data[i][j].className);
                            };};};
                };
            };
        });
        $.ajax({
            type: "POST",
            url: "/fillScheduleSecondPair",
            data: jQuery.param({group: select_,week:'нижняя'}),
            dataType: "json"
        }).done(function (data) {
            let table2 = document.getElementById("scheduleTable2");
            //console.log(data);
            for (var i = 0, row2;  row2=table2.rows[i]; i++) {
                for (var j = 1, col2; col2 = row2.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                let cell1 = table2.rows[i].cells[j];
                                $(cell1).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell1).find(".teacher1").text(data[i][j].teacherName);
                                $(cell1).find(".classroom1").text(data[i][j].className);
                            };};};

                };
            };
        });
    };

    $(function () {
        $("#deleteScheduleBtn").click(function() {
            var clickedGroupName = $("input#clickedGroupName").val();
            var clickedDateTime = $("input#clickedDateTime").val();
            var clickedDateDay = $("input#clickedDateDay").val();
            var clickedWeek =$("input#clickedWeek1").val();
            var pair;
            if(document.getElementById('radio11').checked) {
                pair=1;//четная
            }
            else if(document.getElementById('radio12').checked) {
                pair=2;
            }
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,clickedWeek:clickedWeek,pair:pair};

            $.ajax({
                type: "POST",
                url: "/deletePair",
                data: result,
                success:function () {
                    fillSchedule();
                }
            });
            return false;
        });
    });

    $("#searchSubject").select2({
        placeholder: "Выберите предмет",
        allowClear: true
    });

    $("#searchTeacher").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true
    });

    $("#searchClass").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true
    });

    $("#inputGroupSelect04").select2({
        placeholder: "Выберите группу",
        width: '100%'
    });

    $("#inputGroupSelect01").select2({
        placeholder: "Выберите предмет",
        allowClear: true,
        width: '100%'
    });


    $("#inputGroupSelect02").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect03").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect011").select2({
        placeholder: "Выберите тип пары",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect21").select2({
        placeholder: "Выберите предмет",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect22").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect23").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect211").select2({
        placeholder: "Выберите тип пары",
        allowClear: true,
        width: '100%'
    });
    $("#date1").text(date());

    function date() {
        var d = new Date();
        var day = new Array("Воскресенье", "Понедельник", "Вторник",
            "Среда", "Четверг", "Пятница", "Суббота");
        var month = new Array("января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря");
        var TODAY = day[d.getDay()] + " " + d.getDate() + " " + month[d.getMonth()]
            + " " + d.getFullYear() + " г.";

        var dayn = d.getDate();
        return TODAY;
    }
    date();
    fillSchedule();//подгрузка расписания при автоматической подстановки группы

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