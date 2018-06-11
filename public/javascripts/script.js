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
            $(".clickedWeek").val("верхняя");
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
            $(".clickedWeek").val("нижняя");
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
            let table2 = document.getElementById("scheduleTable2");
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 1, col; col = row.cells[j]; j++) {

                    let cell=table.rows[i].cells[j];
                    $(cell).find(".nameSubject").text("");
                    $(cell).find(".teacher").text("");
                    $(cell).find(".classroom").text("");

                };};

            for (var i = 0, row2; row2=table2.rows[i]; i++) {
                for (var j = 1, col2;col2 = row2.cells[j]; j++) {

                    let cell2=table2.rows[i].cells[j];
                    $(cell2).find(".nameSubject").text("");
                    $(cell2).find(".teacher").text("");
                    $(cell2).find(".classroom").text("");
                };};
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_,week:''}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
                let table2 = document.getElementById("scheduleTable2");
                console.log(data);
                for (var i = 0, row,row2; row = table.rows[i], row2=table2.rows[i]; i++) {
                    for (var j = 1, col,col2; col = row.cells[j],col2 = row2.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell1).find(".teacher").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom").text(data[i][j].className);
                                };};};
                    };
                };
            });
            $.ajax({
                type: "POST",
                url: "/fillSchedule",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
                console.log(data);
                for (var i = 0, row; row = table.rows[i]; i++) {
                    for (var j = 1, col; col = row.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);
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
                console.log(data);
                for (var i = 0, row2;  row2=table2.rows[i]; i++) {
                    for (var j = 1, col2; col2 = row2.cells[j]; j++) {
                        if(typeof data[i]!=="undefined"){
                            if(typeof data[i][j]!=="undefined"){
                                if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell1).find(".teacher").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom").text(data[i][j].className);
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
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week};
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
        $("#searchPair").click(function () {

            var tableHeaderRowCount = 1;
            var table = document.getElementById('search');
            var rowCount = table.rows.length;
            for (var i = tableHeaderRowCount; i < rowCount; i++) {
                table.deleteRow(tableHeaderRowCount);
            }
            var searchSubject = $("#searchSubject option:selected").text();
            var searchTeacher = $("#searchTeacher option:selected").text();
            var searchClass = $("#searchClass option:selected").text();
            var result={subject: searchSubject, teacher:searchTeacher, class: searchClass};
            $.ajax({
                type: "POST",
                url: "/searchPairSTC",
                data: jQuery.param({subject: searchSubject, teacher:searchTeacher, class: searchClass}),
                dataType: "json"
            }).done(function (data) {
                for(var i in data) {

                    if(data[i].week==='верхняя') {
                        var weekday = data[i].weekday;
                        var time = data[i].time;
                        var group = data[i].group;
                        var subject = data[i].subject;
                        var teacher = data[i].lastname + ' ' + data[i].firstname + ' ' + data[i].patronymic + ', ' + data[i].rank;
                        var className = data[i].className;

                        // Находим нужную таблицу
                        var tbody = document.getElementById('search').getElementsByTagName('tbody')[0];

                        // Создаем строку таблицы и добавляем ее
                        var row = document.createElement("TR");
                        tbody.appendChild(row);

                        // Создаем ячейки в вышесозданной строке
                        // и добавляем тх
                        var td1 = document.createElement("TD");
                        var td2 = document.createElement("TD");
                        var td3 = document.createElement("TD");
                        var td4 = document.createElement("TD");
                        var td5 = document.createElement("TD");
                        var td6 = document.createElement("TD");
                        row.appendChild(td1);
                        row.appendChild(td2);
                        row.appendChild(td3);
                        row.appendChild(td4);
                        row.appendChild(td5);
                        row.appendChild(td6);

                        // Наполняем ячейки
                        td1.innerHTML = weekday;
                        td2.innerHTML = time;
                        td3.innerHTML = group;
                        td4.innerHTML = subject;
                        td5.innerHTML = teacher;
                        td6.innerHTML = className;
                    }
                    else if(data[i].week==='нижняя') {
                        var weekday = data[i].weekday;
                        var time = data[i].time;
                        var group = data[i].group;
                        var subject = data[i].subject;
                        var teacher = data[i].lastname + ' ' + data[i].firstname + ' ' + data[i].patronymic + ', ' + data[i].rank;
                        var className = data[i].className;

                        // Находим нужную таблицу
                        var tbody = document.getElementById('search1').getElementsByTagName('tbody')[0];

                        // Создаем строку таблицы и добавляем ее
                        var row = document.createElement("TR");
                        tbody.appendChild(row);

                        // Создаем ячейки в вышесозданной строке
                        // и добавляем тх
                        var td1 = document.createElement("TD");
                        var td2 = document.createElement("TD");
                        var td3 = document.createElement("TD");
                        var td4 = document.createElement("TD");
                        var td5 = document.createElement("TD");
                        var td6 = document.createElement("TD");
                        row.appendChild(td1);
                        row.appendChild(td2);
                        row.appendChild(td3);
                        row.appendChild(td4);
                        row.appendChild(td5);
                        row.appendChild(td6);

                        // Наполняем ячейки
                        td1.innerHTML = weekday;
                        td2.innerHTML = time;
                        td3.innerHTML = group;
                        td4.innerHTML = subject;
                        td5.innerHTML = teacher;
                        td6.innerHTML = className;
                    }
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

            };};

        for (var i = 0, row2; row2=table2.rows[i]; i++) {
            for (var j = 1, col2;col2 = row2.cells[j]; j++) {

                let cell2=table2.rows[i].cells[j];
                $(cell2).find(".nameSubject").text("");
                $(cell2).find(".teacher").text("");
                $(cell2).find(".classroom").text("");
            };};
        $.ajax({
            type: "POST",
            url: "/fillSchedule",
            data: jQuery.param({group: select_,week:''}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
            let table2 = document.getElementById("scheduleTable2");
            //console.log(data);
            for (var i = 0, row,row2; row = table.rows[i], row2=table2.rows[i]; i++) {
                for (var j = 1, col,col2; col = row.cells[j],col2 = row2.cells[j]; j++) {
                    if(typeof data[i]!=="undefined"){
                        if(typeof data[i][j]!=="undefined"){
                            if(typeof data[i][j].timeId!=="undefined") {//для всех недель
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".nameSubject").text(data[i][j].subjectName);
                                    $(cell1).find(".teacher").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom").text(data[i][j].className);
                            };};};
                };
            };
        });
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
                                $(cell).find(".nameSubject").text(data[i][j].subjectName);
                                $(cell).find(".teacher").text(data[i][j].teacherName);
                                $(cell).find(".classroom").text(data[i][j].className);
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
                                $(cell1).find(".nameSubject").text(data[i][j].subjectName);
                                $(cell1).find(".teacher").text(data[i][j].teacherName);
                                $(cell1).find(".classroom").text(data[i][j].className);
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
            var clickedWeek =$("input#clickedWeek").val()
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,clickedWeek:clickedWeek};
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

    $("#inputGroupSelect01").select2({
        placeholder: "Выберите предмет",
        allowClear: true
    });

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



    fillSchedule();//подгрузка расписания при автоматической подстановки группы


    //для изменения url без обновления страницы при просмотре расписания
    $(function () {
        $(".newUrl").change(function () {
            var id = $(".newUrl option:selected").val();
            var redirect = '/schedule/'+id;
            //history.pushState('', '', redirect);
            history.replaceState('', '', redirect);
        });
    });
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