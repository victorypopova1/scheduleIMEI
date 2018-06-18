var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
    "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");
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

                    $(cell).find(".nameSubjectTemporary3").text("");
                    $(cell).find(".teacherTemporary3").text("");
                    $(cell).find(".classroomTemporary3").text("");
                    $(cell).find(".dateTemporary3").text("");
                    $(cell).find(".nameSubjectTemporary4").text("");
                    $(cell).find(".teacherTemporary4").text("");
                    $(cell).find(".classroomTemporary4").text("");
                    $(cell).find(".dateTemporary4").text("");
                    $(cell).find(".nameSubjectTemporary5").text("");
                    $(cell).find(".teacherTemporary5").text("");
                    $(cell).find(".classroomTemporary5").text("");
                    $(cell).find(".dateTemporary5").text("");
                    $(cell).find(".nameSubjectTemporary6").text("");
                    $(cell).find(".teacherTemporary6").text("");
                    $(cell).find(".classroomTemporary6").text("");
                    $(cell).find(".dateTemporary6").text("");

                    $(cell).find(".date-card3").removeClass("dateTemporarySch");
                    $(cell).find(".date-card4").removeClass("dateTemporarySch");
                    $(cell).find(".date-card5").removeClass("dateTemporarySch");
                    $(cell).find(".date-card6").removeClass("dateTemporarySch");
                    $(cell).find(".subject").removeClass("pair1","pairOff");
                    $(cell).find(".subject1").removeClass("pair2","pairOff");
                    $(cell).find(".subject2").removeClass("pair3","pairOff");

                    $(cell).find(".subject3").removeClass("pairTemporary nextTop");
                    $(cell).find(".subject3").removeClass("date-card3");
                    $(cell).find(".subject4").removeClass("pairTemporary");
                    $(cell).find(".subject4").removeClass("date-card4");
                    $(cell).find(".subject5").removeClass("pairTemporary");
                    $(cell).find(".subject5").removeClass("date-card5");
                    $(cell).find(".subject6").removeClass("pairTemporary");
                    $(cell).find(".subject6").removeClass("date-card6");

                    $(cell).find(".p1").removeClass("onPair");
                    $(cell).find(".p11").removeClass("offPair");
                    $(cell).find(".p1").addClass("offPair");
                    $(cell).find(".p11").addClass("onPair");

                    $(cell).find(".p2").removeClass("onPair nextTop");
                    $(cell).find(".p22").removeClass("offPair nextTop");
                    $(cell).find(".p2").addClass("offPair");
                    $(cell).find(".p22").addClass("onPair");

                    $(cell).find(".p3").removeClass("onPair nextTop");
                    $(cell).find(".p33").removeClass("offPair nextTop");
                    $(cell).find(".p3").addClass("offPair ");
                    $(cell).find(".p33").addClass("onPair ");

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
                    $(cell2).find(".nameSubject2").text("");
                    $(cell2).find(".teacher2").text("");
                    $(cell2).find(".classroom2").text("");

                    $(cell2).find(".nameSubjectTemporary3").text("");
                    $(cell2).find(".teacherTemporary3").text("");
                    $(cell2).find(".classroomTemporary3").text("");
                    $(cell2).find(".dateTemporary3").text("");
                    $(cell2).find(".nameSubjectTemporary4").text("");
                    $(cell2).find(".teacherTemporary4").text("");
                    $(cell2).find(".classroomTemporary4").text("");
                    $(cell2).find(".dateTemporary4").text("");
                    $(cell2).find(".nameSubjectTemporary5").text("");
                    $(cell2).find(".teacherTemporary5").text("");
                    $(cell2).find(".classroomTemporary5").text("");
                    $(cell2).find(".dateTemporary5").text("");
                    $(cell2).find(".nameSubjectTemporary6").text("");
                    $(cell2).find(".teacherTemporary6").text("");
                    $(cell2).find(".classroomTemporary6").text("");
                    $(cell2).find(".dateTemporary6").text("");

                    $(cell2).find(".date-card3").removeClass("dateTemporarySch");
                    $(cell2).find(".date-card4").removeClass("dateTemporarySch");
                    $(cell2).find(".date-card5").removeClass("dateTemporarySch");
                    $(cell2).find(".date-card6").removeClass("dateTemporarySch");
                    $(cell2).find(".subject").removeClass("pair1","pairOff");
                    $(cell2).find(".subject1").removeClass("pair2","pairOff");
                    $(cell2).find(".subject2").removeClass("pair3","pairOff");
                    $(cell2).find(".subject3").removeClass("pairTemporary nextTop");
                    $(cell2).find(".subject3").removeClass("date-card3");
                    $(cell2).find(".subject4").removeClass("pairTemporary");
                    $(cell2).find(".subject4").removeClass("date-card4");
                    $(cell2).find(".subject5").removeClass("pairTemporary");
                    $(cell2).find(".subject5").removeClass("date-card5");
                    $(cell2).find(".subject6").removeClass("pairTemporary");
                    $(cell2).find(".subject6").removeClass("date-card6");

                    $(cell2).find(".p1").removeClass("onPair");
                    $(cell2).find(".p11").removeClass("offPair");
                    $(cell2).find(".p1").addClass("offPair");
                    $(cell2).find(".p11").addClass("onPair");

                    $(cell2).find(".p2").removeClass("onPair nextTop");
                    $(cell2).find(".p22").removeClass("offPair nextTop");
                    $(cell2).find(".p2").addClass("offPair");
                    $(cell2).find(".p22").addClass("onPair");

                    $(cell2).find(".p3").removeClass("onPair nextTop");
                    $(cell2).find(".p33").removeClass("offPair nextTop");
                    $(cell2).find(".p3").addClass("offPair");
                    $(cell2).find(".p33").addClass("onPair");
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
                                if(typeof data[i][j].timeId!=="undefined") {
                                    let cell=table.rows[i].cells[j];

                                    $(cell).find(".p1").addClass("offPair");
                                    $(cell).find(".p11").addClass("onPair");
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
                                if(typeof data[i][j].timeId!=="undefined") {
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".p1").addClass("offPair");
                                    $(cell1).find(".p11").addClass("onPair");
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
                                    $(cell).find(".p2").addClass("offPair nextTop");
                                    $(cell).find(".p22").addClass("onPair nextTop");
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
                                if(typeof data[i][j].timeId!=="undefined") {
                                    let cell1 = table2.rows[i].cells[j];
                                    $(cell1).find(".p2").addClass("offPair nextTop");
                                    $(cell1).find(".p22").addClass("onPair nextTop");
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
                                    $(cell).find(".p3").addClass("offPair nextTop");
                                    $(cell).find(".p33").addClass("onPair nextTop");
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
                                    $(cell1).find(".p3").addClass("offPair nextTop");
                                    $(cell1).find(".p33").addClass("onPair nextTop");
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
                url: "/fillScheduleTemporaryFirst",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
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
                                        $(cell).find(".subject").removeClass("pair1");
                                        $(cell).find(".subject4").addClass("pairTemporary");
                                        $(cell).find(".date-card4").addClass("dateTemporarySch");
                                        $(cell).find(".nameSubjectTemporary4").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell).find(".teacherTemporary4").text(data[i][j].teacherName);
                                        $(cell).find(".classroomTemporary4").text(data[i][j].className);

                                        $(cell).find(".p1").toggleClass("onPair offPair");
                                        $(cell).find(".p11").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell).find(".dateTemporary4").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };
            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporaryFirst",
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
                                        $(cell1).find(".subject4").addClass("pairTemporary");
                                        $(cell1).find(".date-card4").addClass("dateTemporarySch");
                                        $(cell1).find(".nameSubjectTemporary4").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell1).find(".teacherTemporary4").text(data[i][j].teacherName);
                                        $(cell1).find(".classroomTemporary4").text(data[i][j].className);
                                        $(cell1).find(".p1").toggleClass("onPair offPair");
                                        $(cell1).find(".p11").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell1).find(".dateTemporary4").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };

            });
            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporarySecond",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
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
                                        $(cell).find(".subject1").removeClass("pair2");
                                        $(cell).find(".subject5").addClass("pairTemporary");
                                        $(cell).find(".date-card5").addClass("dateTemporarySch");
                                        $(cell).find(".nameSubjectTemporary5").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell).find(".teacherTemporary5").text(data[i][j].teacherName);
                                        $(cell).find(".classroomTemporary5").text(data[i][j].className);
                                        $(cell).find(".p2").toggleClass("onPair offPair");
                                        $(cell).find(".p22").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell).find(".dateTemporary5").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };
            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporarySecond",
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
                                        $(cell1).find(".subject1").removeClass("pair2");
                                        $(cell1).find(".subject5").addClass("pairTemporary");
                                        $(cell1).find(".date-card5").addClass("dateTemporarySch");
                                        $(cell1).find(".nameSubjectTemporary5").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell1).find(".teacherTemporary5").text(data[i][j].teacherName);
                                        $(cell1).find(".classroomTemporary5").text(data[i][j].className);
                                        $(cell1).find(".p2").toggleClass("onPair offPair");
                                        $(cell1).find(".p22").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell1).find(".dateTemporary5").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };

            });
            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporaryThird",
                data: jQuery.param({group: select_,week:'верхняя'}),
                dataType: "json"
            }).done(function (data) {
                let table = document.getElementById("scheduleTable");
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
                                        $(cell).find(".subject2").removeClass("pair3");
                                        $(cell).find(".subject6").addClass("pairTemporary");
                                        $(cell).find(".date-card6").addClass("dateTemporarySch");
                                        $(cell).find(".nameSubjectTemporary6").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell).find(".teacherTemporary6").text(data[i][j].teacherName);
                                        $(cell).find(".classroomTemporary6").text(data[i][j].className);
                                        $(cell).find(".p3").toggleClass("onPair offPair");
                                        $(cell).find(".p33").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell).find(".dateTemporary6").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };
            });

            $.ajax({
                type: "POST",
                url: "/fillScheduleTemporaryThird",
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
                                        $(cell1).find(".subject2").removeClass("pair3");
                                        $(cell1).find(".subject6").addClass("pairTemporary");
                                        $(cell1).find(".date-card6").addClass("dateTemporarySch");
                                        $(cell1).find(".nameSubjectTemporary6").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell1).find(".teacherTemporary6").text(data[i][j].teacherName);
                                        $(cell1).find(".classroomTemporary6").text(data[i][j].className);
                                        $(cell1).find(".p3").toggleClass("onPair offPair");
                                        $(cell1).find(".p33").toggleClass("onPair offPair");
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell1).find(".dateTemporary6").text(dB + '-' + dE);
                                    }
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
                                        $(cell).find(".p1").removeClass("onPair");
                                        $(cell).find(".p1").addClass("offPair");
                                        $(cell).find(".p11").removeClass("offPair");
                                        $(cell).find(".p11").addClass("onPair");
                                        $(cell).find(".p2").removeClass("onPair");
                                        $(cell).find(".p2").addClass("offPair");
                                        $(cell).find(".p22").removeClass("offPair");
                                        $(cell).find(".p22").addClass("onPair");
                                        $(cell).find(".p3").removeClass("onPair");
                                        $(cell).find(".p3").addClass("offPair");
                                        $(cell).find(".p33").removeClass("offPair");
                                        $(cell).find(".p33").addClass("onPair");

                                        $(cell).find(".subject").removeClass("pair1");
                                        $(cell).find(".subject1").removeClass("pair2");
                                        $(cell).find(".subject2").removeClass("pair3");
                                        $(cell).find(".subject3").addClass("pairTemporary nextTop");
                                        $(cell).find(".date-card3").addClass("dateTemporarySch");
                                        $(cell).find(".nameSubjectTemporary3").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                        $(cell).find(".teacherTemporary3").text(data[i][j].teacherName);
                                        $(cell).find(".classroomTemporary3").text(data[i][j].className);
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell).find(".dateTemporary3").text(dB + '-' + dE);
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
                                        $(cell1).find(".p1").removeClass("onPair");
                                        $(cell1).find(".p1").addClass("offPair");
                                        $(cell1).find(".p11").removeClass("offPair");
                                        $(cell1).find(".p11").addClass("onPair");
                                        $(cell1).find(".p2").removeClass("onPair");
                                        $(cell1).find(".p2").addClass("offPair");
                                        $(cell1).find(".p22").removeClass("offPair");
                                        $(cell1).find(".p22").addClass("onPair");
                                        $(cell1).find(".p3").removeClass("onPair");
                                        $(cell1).find(".p3").addClass("offPair");
                                        $(cell1).find(".p33").removeClass("offPair");
                                        $(cell1).find(".p33").addClass("onPair");

                                        $(cell1).find(".subject").removeClass("pair1");
                                        $(cell1).find(".subject1").removeClass("pair2");
                                        $(cell1).find(".subject2").removeClass("pair3");
                                        $(cell1).find(".subject3").addClass("pairTemporary nextTop");
                                        $(cell1).find(".date-card3").addClass("dateTemporarySch");
                                        $(cell1).find(".nameSubjectTemporary3").text(data[i][j].type_subject + '. ' + data[i][j].subjectName);
                                        $(cell1).find(".teacherTemporary3").text(data[i][j].teacherName);
                                        $(cell1).find(".classroomTemporary3").text(data[i][j].className);
                                        var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                        var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                        $(cell1).find(".dateTemporary3").text(dB + '-' + dE);
                                    }
                                };};};
                    };
                };
            });

        });
    });
    $(function () {
        $("#saveChangesScheduleBtn").click(function() {
            if ($("#form1").valid()==true) {
                var clickedGroupName = $("input#clickedGroupName").val();
                var clickedDateTime = $("input#clickedDateTime").val();
                var clickedDateDay = $("input#clickedDateDay").val()
                var subjectSelect = $("#inputGroupSelect01 option:selected").text();
                var teacherSelect = $("#inputGroupSelect02 option:selected").text();
                var classroomSelect = $("#inputGroupSelect03 option:selected").text();
                var typeSubjectSelect = $("#inputGroupSelect011 option:selected").text();
                var week = "";
                var numberPair = 1;
                if (document.getElementById('radio1').checked) {
                    week = 'верхняя';//четная
                }
                else if (document.getElementById('radio2').checked) {
                    week = 'нижняя';
                }
                else if (document.getElementById('radio3').checked) {
                    week = '';
                }
                var result = {
                    clickedGroupName: clickedGroupName,
                    clickedDateDay: clickedDateDay,
                    clickedDateTime: clickedDateTime,
                    subjectSelect: subjectSelect,
                    teacherSelect: teacherSelect,
                    classroomSelect: classroomSelect,
                    week: week,
                    typeSubjectSelect: typeSubjectSelect,
                    numberPair: numberPair
                };
                $.ajax({
                    type: "POST",
                    url: "/saveChanges",
                    data: result,
                    success: function () {
                        fillSchedule();
                    }
                });
                return false;
            }
        });
    });

    $(function () {
        $("#saveChangesScheduleBtn1").click(function() {
            if ($("#form3").valid()==true) {
                var clickedGroupName = $("input#clickedGroupName2").val();
                var clickedDateTime = $("input#clickedDateTime2").val();
                var clickedDateDay = $("input#clickedDateDay2").val()
                var subjectSelect = $("#inputGroupSelect21 option:selected").text();
                var teacherSelect = $("#inputGroupSelect22 option:selected").text();
                var classroomSelect = $("#inputGroupSelect23 option:selected").text();
                var typeSubjectSelect = $("#inputGroupSelect211 option:selected").text();
                var week = "";
                var numberPair;
                if (document.getElementById('radio21').checked) {
                    week = 'верхняя';//четная
                }
                else if (document.getElementById('radio22').checked) {
                    week = 'нижняя';
                }
                else if (document.getElementById('radio23').checked) {
                    week = '';
                }

                if (document.getElementById('pair2').checked) {
                    numberPair = 2;
                }
                else if (document.getElementById('pair3').checked) {
                    numberPair = 3;
                }

                var result = {
                    clickedGroupName: clickedGroupName,
                    clickedDateDay: clickedDateDay,
                    clickedDateTime: clickedDateTime,
                    subjectSelect: subjectSelect,
                    teacherSelect: teacherSelect,
                    classroomSelect: classroomSelect,
                    week: week,
                    typeSubjectSelect: typeSubjectSelect,
                    numberPair: numberPair
                };
                $.ajax({
                    type: "POST",
                    url: "/saveChanges",
                    data: result,
                    success: function () {
                        fillSchedule();
                    }
                });
                return false;
            }
        });
    });

    $(function () {
        $("#saveChangesScheduleBtn2").click(function() {
            if ($("#form4").valid()==true) {
                var clickedGroupName = $("input#clickedGroupName3").val();
                var clickedDateTime = $("input#clickedDateTime3").val();
                var clickedDateDay = $("input#clickedDateDay3").val()
                var subjectSelect = $("#inputGroupSelect31 option:selected").text();
                var teacherSelect = $("#inputGroupSelect32 option:selected").text();
                var classroomSelect = $("#inputGroupSelect33 option:selected").text();
                var typeSubjectSelect = $("#inputGroupSelect311 option:selected").text();
                var beginDate = $("input#beginDate").val();
                var endDate = $("input#endDate").val();
                var week = "";
                var numberPair;
                if (document.getElementById('radio31').checked) {
                    week = 'верхняя';
                }
                else if (document.getElementById('radio32').checked) {
                    week = 'нижняя';
                }
                else if (document.getElementById('radio33').checked) {
                    week = '';
                }

                if (document.getElementById('pairTemporaryAll').checked) {
                    numberPair = 0;
                }
                else if (document.getElementById('pairTemporary1').checked) {
                    numberPair = 1;
                }
                else if (document.getElementById('pairTemporary2').checked) {
                    numberPair = 2;
                }
                else if (document.getElementById('pairTemporary3').checked) {
                    numberPair = 3;
                }

                var result = {
                    clickedGroupName: clickedGroupName,
                    clickedDateDay: clickedDateDay,
                    clickedDateTime: clickedDateTime,
                    subjectSelect: subjectSelect,
                    teacherSelect: teacherSelect,
                    classroomSelect: classroomSelect,
                    week: week,
                    typeSubjectSelect: typeSubjectSelect,
                    beginDate: beginDate,
                    endDate: endDate,
                    numberPair: numberPair
                };
                $.ajax({
                    type: "POST",
                    url: "/temporaryChange",
                    data: result,
                    success: function () {
                        fillSchedule();
                    }
                });
                return false;
            }
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

                $(cell).find(".nameSubjectTemporary3").text("");
                $(cell).find(".teacherTemporary3").text("");
                $(cell).find(".classroomTemporary3").text("");
                $(cell).find(".dateTemporary3").text("");
                $(cell).find(".nameSubjectTemporary4").text("");
                $(cell).find(".teacherTemporary4").text("");
                $(cell).find(".classroomTemporary4").text("");
                $(cell).find(".dateTemporary4").text("");
                $(cell).find(".nameSubjectTemporary5").text("");
                $(cell).find(".teacherTemporary5").text("");
                $(cell).find(".classroomTemporary5").text("");
                $(cell).find(".dateTemporary5").text("");
                $(cell).find(".nameSubjectTemporary6").text("");
                $(cell).find(".teacherTemporary6").text("");
                $(cell).find(".classroomTemporary6").text("");
                $(cell).find(".dateTemporary6").text("");

                $(cell).find(".date-card3").removeClass("dateTemporarySch");
                $(cell).find(".date-card4").removeClass("dateTemporarySch");
                $(cell).find(".date-card5").removeClass("dateTemporarySch");
                $(cell).find(".date-card6").removeClass("dateTemporarySch");
                $(cell).find(".subject").removeClass("pair1","pairOff");
                $(cell).find(".subject1").removeClass("pair2","pairOff");
                $(cell).find(".subject2").removeClass("pair3","pairOff");

                $(cell).find(".subject3").removeClass("pairTemporary nextTop");
                $(cell).find(".subject3").removeClass("date-card3");
                $(cell).find(".subject4").removeClass("pairTemporary");
                $(cell).find(".subject4").removeClass("date-card4");
                $(cell).find(".subject5").removeClass("pairTemporary");
                $(cell).find(".subject5").removeClass("date-card5");
                $(cell).find(".subject6").removeClass("pairTemporary");
                $(cell).find(".subject6").removeClass("date-card6");

                $(cell).find(".p1").removeClass("onPair");
                $(cell).find(".p11").removeClass("offPair");
                $(cell).find(".p1").addClass("offPair");
                $(cell).find(".p11").addClass("onPair");

                $(cell).find(".p2").removeClass("onPair nextTop");
                $(cell).find(".p22").removeClass("offPair nextTop");
                $(cell).find(".p2").addClass("offPair");
                $(cell).find(".p22").addClass("onPair");

                $(cell).find(".p3").removeClass("onPair nextTop");
                $(cell).find(".p33").removeClass("offPair nextTop");
                $(cell).find(".p3").addClass("offPair ");
                $(cell).find(".p33").addClass("onPair ");

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
                $(cell2).find(".nameSubject2").text("");
                $(cell2).find(".teacher2").text("");
                $(cell2).find(".classroom2").text("");

                $(cell2).find(".nameSubjectTemporary3").text("");
                $(cell2).find(".teacherTemporary3").text("");
                $(cell2).find(".classroomTemporary3").text("");
                $(cell2).find(".dateTemporary3").text("");
                $(cell2).find(".nameSubjectTemporary4").text("");
                $(cell2).find(".teacherTemporary4").text("");
                $(cell2).find(".classroomTemporary4").text("");
                $(cell2).find(".dateTemporary4").text("");
                $(cell2).find(".nameSubjectTemporary5").text("");
                $(cell2).find(".teacherTemporary5").text("");
                $(cell2).find(".classroomTemporary5").text("");
                $(cell2).find(".dateTemporary5").text("");
                $(cell2).find(".nameSubjectTemporary6").text("");
                $(cell2).find(".teacherTemporary6").text("");
                $(cell2).find(".classroomTemporary6").text("");
                $(cell2).find(".dateTemporary6").text("");

                $(cell2).find(".date-card3").removeClass("dateTemporarySch");
                $(cell2).find(".date-card4").removeClass("dateTemporarySch");
                $(cell2).find(".date-card5").removeClass("dateTemporarySch");
                $(cell2).find(".date-card6").removeClass("dateTemporarySch");
                $(cell2).find(".subject").removeClass("pair1","pairOff");
                $(cell2).find(".subject1").removeClass("pair2","pairOff");
                $(cell2).find(".subject2").removeClass("pair3","pairOff");
                $(cell2).find(".subject3").removeClass("pairTemporary nextTop");
                $(cell2).find(".subject3").removeClass("date-card3");
                $(cell2).find(".subject4").removeClass("pairTemporary");
                $(cell2).find(".subject4").removeClass("date-card4");
                $(cell2).find(".subject5").removeClass("pairTemporary");
                $(cell2).find(".subject5").removeClass("date-card5");
                $(cell2).find(".subject6").removeClass("pairTemporary");
                $(cell2).find(".subject6").removeClass("date-card6");

                $(cell2).find(".p1").removeClass("onPair");
                $(cell2).find(".p11").removeClass("offPair");
                $(cell2).find(".p1").addClass("offPair");
                $(cell2).find(".p11").addClass("onPair");

                $(cell2).find(".p2").removeClass("onPair nextTop");
                $(cell2).find(".p22").removeClass("offPair nextTop");
                $(cell2).find(".p2").addClass("offPair");
                $(cell2).find(".p22").addClass("onPair");

                $(cell2).find(".p3").removeClass("onPair nextTop");
                $(cell2).find(".p33").removeClass("offPair nextTop");
                $(cell2).find(".p3").addClass("offPair");
                $(cell2).find(".p33").addClass("onPair");
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
                            if(typeof data[i][j].timeId!=="undefined") {
                                let cell=table.rows[i].cells[j];

                                $(cell).find(".p1").addClass("offPair");
                                $(cell).find(".p11").addClass("onPair");
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
                            if(typeof data[i][j].timeId!=="undefined") {
                                let cell1 = table2.rows[i].cells[j];
                                $(cell1).find(".p1").addClass("offPair");
                                $(cell1).find(".p11").addClass("onPair");
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
                                $(cell).find(".p2").addClass("offPair nextTop");
                                $(cell).find(".p22").addClass("onPair nextTop");
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
                            if(typeof data[i][j].timeId!=="undefined") {
                                let cell1 = table2.rows[i].cells[j];
                                $(cell1).find(".p2").addClass("offPair nextTop");
                                $(cell1).find(".p22").addClass("onPair nextTop");
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
                                $(cell).find(".p3").addClass("offPair nextTop");
                                $(cell).find(".p33").addClass("onPair nextTop");
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
                                $(cell1).find(".p3").addClass("offPair nextTop");
                                $(cell1).find(".p33").addClass("onPair nextTop");
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
            url: "/fillScheduleTemporaryFirst",
            data: jQuery.param({group: select_,week:'верхняя'}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
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
                                    $(cell).find(".subject").removeClass("pair1");
                                    $(cell).find(".subject4").addClass("pairTemporary");
                                    $(cell).find(".date-card4").addClass("dateTemporarySch");
                                    $(cell).find(".nameSubjectTemporary4").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacherTemporary4").text(data[i][j].teacherName);
                                    $(cell).find(".classroomTemporary4").text(data[i][j].className);

                                    $(cell).find(".p1").toggleClass("onPair offPair");
                                    $(cell).find(".p11").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell).find(".dateTemporary4").text(dB + '-' + dE);
                                }
                            };};};
                };
            };
        });

        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporaryFirst",
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
                                    $(cell1).find(".subject4").addClass("pairTemporary");
                                    $(cell1).find(".date-card4").addClass("dateTemporarySch");
                                    $(cell1).find(".nameSubjectTemporary4").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary4").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary4").text(data[i][j].className);
                                    $(cell1).find(".p1").toggleClass("onPair offPair");
                                    $(cell1).find(".p11").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary4").text(dB + '-' + dE);
                                }
                            };};};
                };
            };

        });
        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporarySecond",
            data: jQuery.param({group: select_,week:'верхняя'}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
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
                                    $(cell).find(".subject1").removeClass("pair2");
                                    $(cell).find(".subject5").addClass("pairTemporary");
                                    $(cell).find(".date-card5").addClass("dateTemporarySch");
                                    $(cell).find(".nameSubjectTemporary5").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacherTemporary5").text(data[i][j].teacherName);
                                    $(cell).find(".classroomTemporary5").text(data[i][j].className);
                                    $(cell).find(".p2").toggleClass("onPair offPair");
                                    $(cell).find(".p22").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell).find(".dateTemporary5").text(dB + '-' + dE);
                                }
                            };};};
                };
            };
        });

        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporarySecond",
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
                                    $(cell1).find(".subject1").removeClass("pair2");
                                    $(cell1).find(".subject5").addClass("pairTemporary");
                                    $(cell1).find(".date-card5").addClass("dateTemporarySch");
                                    $(cell1).find(".nameSubjectTemporary5").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary5").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary5").text(data[i][j].className);
                                    $(cell1).find(".p2").toggleClass("onPair offPair");
                                    $(cell1).find(".p22").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary5").text(dB + '-' + dE);
                                }
                            };};};
                };
            };

        });
        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporaryThird",
            data: jQuery.param({group: select_,week:'верхняя'}),
            dataType: "json"
        }).done(function (data) {
            let table = document.getElementById("scheduleTable");
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
                                    $(cell).find(".subject2").removeClass("pair3");
                                    $(cell).find(".subject6").addClass("pairTemporary");
                                    $(cell).find(".date-card6").addClass("dateTemporarySch");
                                    $(cell).find(".nameSubjectTemporary6").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacherTemporary6").text(data[i][j].teacherName);
                                    $(cell).find(".classroomTemporary6").text(data[i][j].className);
                                    $(cell).find(".p3").toggleClass("onPair offPair");
                                    $(cell).find(".p33").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell).find(".dateTemporary6").text(dB + '-' + dE);
                                }
                            };};};
                };
            };
        });

        $.ajax({
            type: "POST",
            url: "/fillScheduleTemporaryThird",
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
                                    $(cell1).find(".subject2").removeClass("pair3");
                                    $(cell1).find(".subject6").addClass("pairTemporary");
                                    $(cell1).find(".date-card6").addClass("dateTemporarySch");
                                    $(cell1).find(".nameSubjectTemporary6").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary6").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary6").text(data[i][j].className);
                                    $(cell1).find(".p3").toggleClass("onPair offPair");
                                    $(cell1).find(".p33").toggleClass("onPair offPair");
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary6").text(dB + '-' + dE);
                                }
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
                                    $(cell).find(".p1").removeClass("onPair");
                                    $(cell).find(".p1").addClass("offPair");
                                    $(cell).find(".p11").removeClass("offPair");
                                    $(cell).find(".p11").addClass("onPair");
                                    $(cell).find(".p2").removeClass("onPair");
                                    $(cell).find(".p2").addClass("offPair");
                                    $(cell).find(".p22").removeClass("offPair");
                                    $(cell).find(".p22").addClass("onPair");
                                    $(cell).find(".p3").removeClass("onPair");
                                    $(cell).find(".p3").addClass("offPair");
                                    $(cell).find(".p33").removeClass("offPair");
                                    $(cell).find(".p33").addClass("onPair");

                                    $(cell).find(".subject").removeClass("pair1");
                                    $(cell).find(".subject1").removeClass("pair2");
                                    $(cell).find(".subject2").removeClass("pair3");
                                    $(cell).find(".subject3").addClass("pairTemporary nextTop");
                                    $(cell).find(".date-card3").addClass("dateTemporarySch");
                                    $(cell).find(".nameSubjectTemporary3").text(data[i][j].type_subject+'. '+data[i][j].subjectName);
                                    $(cell).find(".teacherTemporary3").text(data[i][j].teacherName);
                                    $(cell).find(".classroomTemporary3").text(data[i][j].className);
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell).find(".dateTemporary3").text(dB + '-' + dE);
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
                                    $(cell1).find(".p1").removeClass("onPair");
                                    $(cell1).find(".p1").addClass("offPair");
                                    $(cell1).find(".p11").removeClass("offPair");
                                    $(cell1).find(".p11").addClass("onPair");
                                    $(cell1).find(".p2").removeClass("onPair");
                                    $(cell1).find(".p2").addClass("offPair");
                                    $(cell1).find(".p22").removeClass("offPair");
                                    $(cell1).find(".p22").addClass("onPair");
                                    $(cell1).find(".p3").removeClass("onPair");
                                    $(cell1).find(".p3").addClass("offPair");
                                    $(cell1).find(".p33").removeClass("offPair");
                                    $(cell1).find(".p33").addClass("onPair");

                                    $(cell1).find(".subject").removeClass("pair1");
                                    $(cell1).find(".subject1").removeClass("pair2");
                                    $(cell1).find(".subject2").removeClass("pair3");
                                    $(cell1).find(".subject3").addClass("pairTemporary nextTop");
                                    $(cell1).find(".date-card3").addClass("dateTemporarySch");
                                    $(cell1).find(".nameSubjectTemporary3").text(data[i][j].type_subject + '. ' + data[i][j].subjectName);
                                    $(cell1).find(".teacherTemporary3").text(data[i][j].teacherName);
                                    $(cell1).find(".classroomTemporary3").text(data[i][j].className);
                                    var dB = mydate1.getDate() + " " + month[mydate1.getMonth()];
                                    var dE = mydate2.getDate() + " " + month[mydate1.getMonth()];
                                    $(cell1).find(".dateTemporary3").text(dB + '-' + dE);
                                }
                            };};};
                };
            };
        });
    };

    $(function () {
        $("#deleteScheduleBtn").click(function() {
            if ($("#form2").valid()==true) {
                var clickedGroupName = $("input#clickedGroupName").val();
                var clickedDateTime = $("input#clickedDateTime").val();
                var clickedDateDay = $("input#clickedDateDay").val();
                //var clickedWeek =$("input#clickedWeek1").val();
                var clickedWeek = $("#week option:selected").text();
                var pair;
                var temporary = 0;
                if (document.getElementById('radio11').checked) {
                    pair = 1;
                }
                else if (document.getElementById('radio12').checked) {
                    pair = 2;
                }
                else if (document.getElementById('radio13').checked) {
                    pair = 3;
                }
                else if (document.getElementById('radio14').checked) {
                    temporary = 1;
                    pair = 0;
                }
                else if (document.getElementById('radio15').checked) {
                    temporary = 1;
                    pair = 1;
                }
                else if (document.getElementById('radio16').checked) {
                    temporary = 1;
                    pair = 2;
                }
                else if (document.getElementById('radio17').checked) {
                    temporary = 1;
                    pair = 3;
                }
                var result = {
                    clickedGroupName: clickedGroupName,
                    clickedDateDay: clickedDateDay,
                    clickedDateTime: clickedDateTime,
                    clickedWeek: clickedWeek,
                    pair: pair,
                    temporary: temporary
                };

                $.ajax({
                    type: "POST",
                    url: "/deletePair",
                    data: result,
                    success: function () {
                        fillSchedule();
                    }
                });
            }
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
