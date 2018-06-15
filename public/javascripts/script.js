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

            $(".clickedDateDay3").val(tableRows[0].cells[tdIndex].textContent);
            $(".clickedDateTime3").val(tableRows[trIndex + 1].cells[0].textContent);
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

            $(".clickedDateDay3").val(tableRows2[0].cells[tdIndex].textContent);
            $(".clickedDateTime3").val(tableRows2[trIndex + 1].cells[0].textContent);
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
            $(".clickedGroupName3").val(select_);
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
                    $(cell).find(".nameSubject2").text("");
                    $(cell).find(".teacher2").text("");
                    $(cell).find(".classroom2").text("");


                    $(cell).find(".nameSubjectTemporary").text("");
                    $(cell).find(".teacherTemporary").text("");
                    $(cell).find(".classroomTemporary").text("");
                    $(cell).find(".dateTemporary").text("");

                    $(cell).find(".date-card").removeClass("dateTemporarySch");
                    $(cell).find(".subject").removeClass("pair1","pairOff");
                    $(cell).find(".subject1").removeClass("pair2","pairOff");
                    $(cell).find(".subject2").removeClass("pair3","pairOff");

                    $(cell).find(".subject3").removeClass("pairTemporary");
                    $(cell).find(".subject3").removeClass("date-card");
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
                    $(cell2).find(".nameSubjectTemporary").text("");
                    $(cell2).find(".teacherTemporary").text("");
                    $(cell2).find(".classroomTemporary").text("");
                    $(cell2).find(".dateTemporary").text("");

                    $(cell2).find(".date-card").removeClass("dateTemporarySch");
                    $(cell2).find(".subject").removeClass("pair1","pairOff");
                    $(cell2).find(".subject1").removeClass("pair2","pairOff");
                    $(cell2).find(".subject2").removeClass("pair3","pairOff");

                    $(cell2).find(".subject3").removeClass("pairTemporary");
                    $(cell2).find(".subject3").removeClass("date-card");
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
                                    //document.getElementById(0).className = 'line1';
                                    //document.getElementById('0').classList.toggle("line1");
                                    //$(".${0}").toggleClass('line1');
                                    //var articleDiv = document.querySelector('div.line');
                                    // articleDiv.className="line1";
                                    let cell=table.rows[i].cells[j];
                                    $(cell).find(".subject").addClass("pair1");
                                    $(cell).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacher").text(data[i][j].teacherName);
                                    $(cell).find(".classroom").text(data[i][j].className);
                                }
                            };};

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
                                    $(cell1).find(".subject").addClass("pair1");
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
                                    $(cell).find(".subject1").addClass("pair2");
                                    $(cell).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacher1").text(data[i][j].teacherName);
                                    $(cell).find(".classroom1").text(data[i][j].className);
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
                                    $(cell1).find(".subject1").addClass("pair2");
                                    $(cell1).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacher1").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom1").text(data[i][j].className);
                                };};};
                    };
                };

            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleThirdPair",
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
                                    $(cell).find(".subject2").addClass("pair3");
                                    $(cell).find(".nameSubject2").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacher2").text(data[i][j].teacherName);
                                    $(cell).find(".classroom2").text(data[i][j].className);
                                };};};

                    };
                };
            });


            $.ajax({
                type: "POST",
                url: "/fillScheduleThirdPair",
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
                                    $(cell1).find(".subject2").addClass("pair3");
                                    $(cell1).find(".nameSubject2").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacher2").text(data[i][j].teacherName);
                                    $(cell1).find(".classroom2").text(data[i][j].className);
                                };};};
                    };
                };

            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporary",
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
                                    var selectDate = $("input#selectDate").val();
                                    var mydate=new Date(selectDate);
                                    var mydate1=new Date(data[i][j].beginDate);
                                    var mydate2=new Date(data[i][j].endDate);
                                    if((mydate.getTime()>= mydate1.getTime()) && (mydate.getTime()<=mydate2.getTime())){

                                        //if($('#nameSubject').val() != "") {$(cell).find(".subject").addClass("pairOff");};
                                        //if($('#nameSubject1').val() != "") {$(cell).find(".subject1").addClass("pairOff");};
                                        $(cell).find(".subject").removeClass("pair1");
                                        $(cell).find(".subject1").removeClass("pair2");
                                        $(cell).find(".subject2").removeClass("pair3");
                                        $(cell).find(".subject3").addClass("pairTemporary");
                                        $(cell).find(".date-card").addClass("dateTemporarySch");
                                        $(cell).find(".nameSubjectTemporary").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell).find(".teacherTemporary").text(data[i][j].teacherName);
                                        $(cell).find(".classroomTemporary").text(data[i][j].className);
                                        var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                                            "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell).find(".dateTemporary").text(dB + '-' + dE);

                                    }
                                    // else{
                                    //document.getElementById("line").className = document.getElementById("line").className.replace("line2", "line1");
                                    // $("#line").toggleClass('line2');
                                    // }

                                };};};

                    };
                };
            });


            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporary",
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
                                    var selectDate = $("input#selectDate").val();
                                    var mydate=new Date(selectDate);
                                    var mydate1=new Date(data[i][j].beginDate);
                                    var mydate2=new Date(data[i][j].endDate);
                                    if((mydate.getTime()>= mydate1.getTime()) && (mydate.getTime()<=mydate2.getTime())){
                                        $(cell1).find(".subject").removeClass("pair1");
                                        $(cell1).find(".subject1").removeClass("pair2");
                                        $(cell1).find(".subject2").removeClass("pair3");
                                        $(cell1).find(".subject3").addClass("pairTemporary");
                                        $(cell1).find(".date-card").addClass("dateTemporarySch");
                                        $(cell1).find(".nameSubjectTemporary").text(data[i][j].type_subject + '. ' + data[i][j].subjectName);
                                        $(cell1).find(".teacherTemporary").text(data[i][j].teacherName);
                                        $(cell1).find(".classroomTemporary").text(data[i][j].className);
                                        var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                                            "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell1).find(".dateTemporary").text(dB + '-' + dE);
                                    }
                                    else{

                                    }
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
            var numberPair=0;
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
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week,typeSubjectSelect:typeSubjectSelect,numberPair:numberPair};
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
            var numberPair;
            if(document.getElementById('radio21').checked) {
                week='верхняя';//четная
            }
            else if(document.getElementById('radio22').checked) {
                week='нижняя';
            }
            else if(document.getElementById('radio23').checked){
                week='';
            }

            if(document.getElementById('pair2').checked) {
                numberPair=1;
            }
            else if(document.getElementById('pair3').checked) {
                numberPair=2;
            }

            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,subjectSelect:subjectSelect,
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week,typeSubjectSelect:typeSubjectSelect,numberPair:numberPair};
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
        $("#saveChangesScheduleBtn2").click(function() {
            $("#form4").valid();
            var clickedGroupName = $("input#clickedGroupName3").val();
            var clickedDateTime = $("input#clickedDateTime3").val();
            var clickedDateDay = $("input#clickedDateDay3").val()
            var subjectSelect=$("#inputGroupSelect31 option:selected").text();
            var teacherSelect=$("#inputGroupSelect32 option:selected").text();
            var classroomSelect=$("#inputGroupSelect33 option:selected").text();
            var typeSubjectSelect=$("#inputGroupSelect311 option:selected").text();
            var beginDate = $("input#beginDate").val();
            var endDate = $("input#endDate").val();
            var week="";
            if(document.getElementById('radio31').checked) {
                week='верхняя';//четная
            }
            else if(document.getElementById('radio32').checked) {
                week='нижняя';
            }
            else if(document.getElementById('radio33').checked){
                week='';
            }
            var result={clickedGroupName:clickedGroupName,clickedDateDay:clickedDateDay,clickedDateTime:clickedDateTime,subjectSelect:subjectSelect,
                teacherSelect:teacherSelect,classroomSelect:classroomSelect,week:week,typeSubjectSelect:typeSubjectSelect,beginDate:beginDate,endDate:endDate};
            $.ajax({
                type: "POST",
                url: "/temporaryChange",
                data: result,
                success:function () {
                    fillSchedule();
                }
            });
            return false;
        });
    });
    $(function () {
        $("#selectDate").change(function() {
            fillSchedule();
        });
    });

    function fillSchedule() {
        var select_ = $("#inputGroupSelect04 option:selected").text();
        $(".clickedGroupName").val(select_);
        $(".clickedGroupName1").val(select_);
        $(".clickedGroupName2").val(select_);
        $(".clickedGroupName3").val(select_);
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
                $(cell).find(".nameSubject2").text("");
                $(cell).find(".teacher2").text("");
                $(cell).find(".classroom2").text("");


                $(cell).find(".nameSubjectTemporary").text("");
                $(cell).find(".teacherTemporary").text("");
                $(cell).find(".classroomTemporary").text("");
                $(cell).find(".dateTemporary").text("");

                $(cell).find(".date-card").removeClass("dateTemporarySch");
                $(cell).find(".subject").removeClass("pair1","pairOff");
                $(cell).find(".subject1").removeClass("pair2","pairOff");
                $(cell).find(".subject2").removeClass("pair3","pairOff");

                $(cell).find(".subject3").removeClass("pairTemporary");
                $(cell).find(".subject3").removeClass("date-card");
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
                $(cell2).find(".nameSubjectTemporary").text("");
                $(cell2).find(".teacherTemporary").text("");
                $(cell2).find(".classroomTemporary").text("");
                $(cell2).find(".dateTemporary").text("");

                $(cell2).find(".date-card").removeClass("dateTemporarySch");
                $(cell2).find(".subject").removeClass("pair1","pairOff");
                $(cell2).find(".subject1").removeClass("pair2","pairOff");
                $(cell2).find(".subject2").removeClass("pair3","pairOff");

                $(cell2).find(".subject3").removeClass("pairTemporary");
                $(cell2).find(".subject3").removeClass("date-card");
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
                                //document.getElementById(0).className = 'line1';
                                //document.getElementById('0').classList.toggle("line1");
                                //$(".${0}").toggleClass('line1');
                                //var articleDiv = document.querySelector('div.line');
                                // articleDiv.className="line1";
                                let cell=table.rows[i].cells[j];
                                $(cell).find(".subject").addClass("pair1");
                                $(cell).find(".nameSubject").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell).find(".teacher").text(data[i][j].teacherName);
                                $(cell).find(".classroom").text(data[i][j].className);
                            }
                        };};

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
                                $(cell1).find(".subject").addClass("pair1");
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
                                $(cell).find(".subject1").addClass("pair2");
                                $(cell).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell).find(".teacher1").text(data[i][j].teacherName);
                                $(cell).find(".classroom1").text(data[i][j].className);
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
                                $(cell1).find(".subject1").addClass("pair2");
                                $(cell1).find(".nameSubject1").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell1).find(".teacher1").text(data[i][j].teacherName);
                                $(cell1).find(".classroom1").text(data[i][j].className);
                            };};};
                };
            };

        });

        $.ajax({
            type: "POST",
            url: "/fillScheduleThirdPair",
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
                                $(cell).find(".subject2").addClass("pair3");
                                $(cell).find(".nameSubject2").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell).find(".teacher2").text(data[i][j].teacherName);
                                $(cell).find(".classroom2").text(data[i][j].className);
                            };};};

                };
            };
        });


        $.ajax({
            type: "POST",
            url: "/fillScheduleThirdPair",
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
                                $(cell1).find(".subject2").addClass("pair3");
                                $(cell1).find(".nameSubject2").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                $(cell1).find(".teacher2").text(data[i][j].teacherName);
                                $(cell1).find(".classroom2").text(data[i][j].className);
                            };};};
                };
            };

        });

        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporary",
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
                                var selectDate = $("input#selectDate").val();
                                var mydate=new Date(selectDate);
                                var mydate1=new Date(data[i][j].beginDate);
                                var mydate2=new Date(data[i][j].endDate);
                                if((mydate.getTime()>= mydate1.getTime()) && (mydate.getTime()<=mydate2.getTime())){

                                    //if($('#nameSubject').val() != "") {$(cell).find(".subject").addClass("pairOff");};
                                    //if($('#nameSubject1').val() != "") {$(cell).find(".subject1").addClass("pairOff");};
                                    $(cell).find(".subject").removeClass("pair1");
                                    $(cell).find(".subject1").removeClass("pair2");
                                    $(cell).find(".subject2").removeClass("pair3");
                                    $(cell).find(".subject3").addClass("pairTemporary");
                                    $(cell).find(".date-card").addClass("dateTemporarySch");
                                    $(cell).find(".nameSubjectTemporary").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacherTemporary").text(data[i][j].teacherName);
                                    $(cell).find(".classroomTemporary").text(data[i][j].className);
                                    var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                                        "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell).find(".dateTemporary").text(dB + '-' + dE);

                                }
                                // else{
                                //document.getElementById("line").className = document.getElementById("line").className.replace("line2", "line1");
                                // $("#line").toggleClass('line2');
                                // }

                            };};};

                };
            };
        });


        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporary",
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
                                var selectDate = $("input#selectDate").val();
                                var mydate=new Date(selectDate);
                                var mydate1=new Date(data[i][j].beginDate);
                                var mydate2=new Date(data[i][j].endDate);
                                if((mydate.getTime()>= mydate1.getTime()) && (mydate.getTime()<=mydate2.getTime())){
                                    $(cell1).find(".subject").removeClass("pair1");
                                    $(cell1).find(".subject1").removeClass("pair2");
                                    $(cell1).find(".subject2").removeClass("pair3");
                                    $(cell1).find(".subject3").addClass("pairTemporary");
                                    $(cell1).find(".date-card").addClass("dateTemporarySch");
                                    $(cell1).find(".nameSubjectTemporary").text(data[i][j].type_subject + '. ' + data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary").text(data[i][j].className);
                                    var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                                        "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary").text(dB + '-' + dE);
                                }
                                else{

                                }
                            };};};

                };
            };
        });


        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporary",
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
                                var selectDate = $("input#selectDate").val();
                                var mydate=new Date(selectDate);
                                var mydate1=new Date(data[i][j].beginDate);
                                var mydate2=new Date(data[i][j].endDate);
                                if((mydate.getTime()>= mydate1.getTime()) && (mydate.getTime()<=mydate2.getTime())){
                                    //var articleDiv = document.querySelector("div.line2");
                                    //articleDiv.className="line1";

                                    $(cell1).find(".nameSubjectTemporary").text(data[i][j].type_subject + '. ' + data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary").text(data[i][j].className);
                                    var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                                        "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary").text(dB + '-' + dE);
                                }
                                else{

                                }
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
                pair=0;
            }
            else if(document.getElementById('radio12').checked) {
                pair=1;
            }
            else if(document.getElementById('radio13').checked) {
                pair=2;
            }
            else if(document.getElementById('radio14').checked) {
                pair=3;
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

    $(function() {
        var d = new Date();
        var dayn = d.getDate();
        if (!$.cookie('hideModal') && dayn==14) {
            var delay_popup = 2000;
            document.getElementById('overlay').style.display='block';
            //setTimeout("document.getElementById('overlay').style.display='block'", delay_popup);
            setTimeout($.cookie('hideModal', true, {
                // Время хранения cookie в днях
                expires: 28,
                path: '/'
            }),delay_popup+10000);
        }
    });
    fillSchedule();//подгрузка расписания при автоматической подстановки группы

});
