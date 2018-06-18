$(document).ready(function () {

    //проверка заполнения формы
    var validobj = $("#form1").validate({
        onkeyup: false,
        errorClass: "myErrorClass",
        messages: {
            clickedGroupName: "Выберите группу",
            clickedDateDay: "Выберите день недели",
            clickedDateTime: "Выберите время",
            subjectSelect: "Выберите предмет",
            typeSubjectSelect: "Укажите тип пары",
            teacherSelect: "Выберите преподавателя",
            classroomSelect: "Выберите аудиторию"
        },

        //put error message behind each form element
        errorPlacement: function (error, element) {
            var elem = $(element);
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").addClass(errorClass);
            } else {
                elem.addClass(errorClass);
            }
        },

        //When removing make the same adjustments as when adding
        unhighlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").removeClass(errorClass);
            } else {
                elem.removeClass(errorClass);
            }
        }
    });
    var validobj1 = $("#form2").validate({
        onkeyup: false,
        errorClass: "myErrorClass",
        messages: {
            clickedGroupName1: "Выберите группу",
            clickedDateDay1: "Выберите день недели",
            clickedDateTime1: "Выберите время",
            clickedWeek1: "Выберите неделю"
        },

        //put error message behind each form element
        errorPlacement: function (error, element) {
            var elem = $(element);
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").addClass(errorClass);
            } else {
                elem.addClass(errorClass);
            }
        },

        //When removing make the same adjustments as when adding
        unhighlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").removeClass(errorClass);
            } else {
                elem.removeClass(errorClass);
            }
        }
    });

    var validobj2 = $("#form3").validate({
        onkeyup: false,
        errorClass: "myErrorClass",
        messages: {
            clickedGroupName2: "Выберите группу",
            clickedDateDay2: "Выберите день недели",
            clickedDateTime2: "Выберите время",
            subjectSelect2: "Выберите предмет",
            typeSubjectSelect2: "Укажите тип пары",
            teacherSelect2: "Выберите преподавателя",
            classroomSelect2: "Выберите аудиторию"
        },

        //put error message behind each form element
        errorPlacement: function (error, element) {
            var elem = $(element);
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").addClass(errorClass);
            } else {
                elem.addClass(errorClass);
            }
        },

        //When removing make the same adjustments as when adding
        unhighlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").removeClass(errorClass);
            } else {
                elem.removeClass(errorClass);
            }
        }
    });
    var validobj3 = $("#form4").validate({
        onkeyup: false,
        errorClass: "myErrorClass",
        messages: {
            clickedGroupName3: "Выберите группу",
            clickedDateDay3: "Выберите день недели",
            clickedDateTime3: "Выберите время",
            subjectSelect3: "Выберите предмет",
            typeSubjectSelect3: "Укажите тип пары",
            teacherSelect3: "Выберите преподавателя",
            classroomSelect3: "Выберите аудиторию"
        },

        //put error message behind each form element
        errorPlacement: function (error, element) {
            var elem = $(element);
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").addClass(errorClass);
            } else {
                elem.addClass(errorClass);
            }
        },

        //When removing make the same adjustments as when adding
        unhighlight: function (element, errorClass, validClass) {
            var elem = $(element);
            if (elem.hasClass("select2-offscreen")) {
                $("#s2id_" + elem.attr("id") + " ul").removeClass(errorClass);
            } else {
                elem.removeClass(errorClass);
            }
        }
    });

    $(document).on("change", ".select2-offscreen", ".select2-input", function () {
        if (!$.isEmptyObject(validobj.submitted)) {
            validobj.form();
        }
    });
    $(document).on("change", ".select2-offscreen", ".select2-input", function () {
        if (!$.isEmptyObject(validobj1.submitted)) {
            validobj1.form();
        }
    });
    $(document).on("change", ".select2-offscreen", ".select2-input", function () {
        if (!$.isEmptyObject(validobj2.submitted)) {
            validobj2.form();
        }
    });
    $(document).on("change", ".select2-offscreen", ".select2-input", function () {
        if (!$.isEmptyObject(validobj3.submitted)) {
            validobj3.form();
        }
    });
    $(document).on("select2-opening", function (arg) {
        var elem = $(arg.target);
        if ($("#s2id_" + elem.attr("id") + " ul").hasClass("myErrorClass")) {
            //jquery checks if the class exists before adding.
            $(".select2-drop ul").addClass("myErrorClass");
        } else {
            $(".select2-drop ul").removeClass("myErrorClass");
        }
    });


    $(function () {
        $("#searchPair").click(function () {
            var tableHeaderRowCount = 1;
            var table = document.getElementById('search');
            var rowCount = table.rows.length;
            for (var i = tableHeaderRowCount; i < rowCount; i++) {
                table.deleteRow(tableHeaderRowCount);
            }

            var tableHeaderRowCount1 = 1;
            var table1 = document.getElementById('search1');
            var rowCount1 = table1.rows.length;
            for (var i = tableHeaderRowCount1; i < rowCount1; i++) {
                table1.deleteRow(tableHeaderRowCount1);
            }

            var searchSubject = $("#searchSubject option:selected").text();
            var searchTeacher = $("#searchTeacher option:selected").text();
            var searchClass = $("#searchClass option:selected").text();
            var searchPairDate=$("input#searchPairDate").val();
            var result={subject: searchSubject, teacher:searchTeacher, class: searchClass};
            $.ajax({
                type: "POST",
                url: "/searchPairSTC",
                data: jQuery.param({subject: searchSubject, teacher:searchTeacher, class: searchClass,searchPairDate:searchPairDate}),
                dataType: "json"
            }).done(function (data) {
                for(var i in data) {
                    if(data[i].week==='верхняя') {
                        var weekday = data[i].weekday;
                        var time = data[i].time;
                        var group = data[i].group;
                        var subject = data[i].subject;
                        var typeSubject = data[i].type_subject;
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
                        td4.innerHTML = typeSubject+'. '+subject;
                        td5.innerHTML = teacher;
                        td6.innerHTML = className;
                    }
                    else if(data[i].week==='нижняя') {
                        var weekday = data[i].weekday;
                        var time = data[i].time;
                        var group = data[i].group;
                        var subject = data[i].subject;
                        var typeSubject = data[i].type_subject;
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
                        td4.innerHTML = typeSubject+'. '+subject;
                        td5.innerHTML = teacher;
                        td6.innerHTML = className;
                    }
                    else if(data[i].week==='') {
                        var weekday = data[i].weekday;
                        var time = data[i].time;
                        var group = data[i].group;
                        var subject = data[i].subject;
                        var typeSubject = data[i].type_subject;
                        var teacher = data[i].lastname + ' ' + data[i].firstname + ' ' + data[i].patronymic + ', ' + data[i].rank;
                        var className = data[i].className;

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
                        td4.innerHTML = typeSubject+'. '+subject;
                        td5.innerHTML = teacher;
                        td6.innerHTML = className;



                        // Находим нужную таблицу
                        var tbody1 = document.getElementById('search1').getElementsByTagName('tbody')[0];
                        // Создаем строку таблицы и добавляем ее
                        var row1 = document.createElement("TR");
                        tbody1.appendChild(row1);
                        // Создаем ячейки в вышесозданной строке
                        // и добавляем тх
                        var td11 = document.createElement("TD");
                        var td21 = document.createElement("TD");
                        var td31 = document.createElement("TD");
                        var td41 = document.createElement("TD");
                        var td51 = document.createElement("TD");
                        var td61 = document.createElement("TD");
                        row1.appendChild(td11);
                        row1.appendChild(td21);
                        row1.appendChild(td31);
                        row1.appendChild(td41);
                        row1.appendChild(td51);
                        row1.appendChild(td61);

                        // Наполняем ячейки
                        td11.innerHTML = weekday;
                        td21.innerHTML = time;
                        td31.innerHTML = group;
                        td41.innerHTML = typeSubject+'. '+subject;
                        td51.innerHTML = teacher;
                        td61.innerHTML = className;
                    }

                }

            });
            return false;
        });
    });

    //для изменения url без обновления страницы при просмотре расписания
    $(function () {
        $(".newUrl").change(function () {
            var id = $(".newUrl option:selected").val();
            var redirect = '/schedule/'+id;
            //history.pushState('', '', redirect);
            history.replaceState('', '', redirect);
        });
    });

    $(function () {
        $(".newUrl1").change(function () {
            var id = $(".newUrl1 option:selected").val();
            var redirect = '/session/'+id;
            //history.pushState('', '', redirect);
            history.replaceState('', '', redirect);
        });
    });

    $(function(){
        moment.locale('ru');
            $('#beginDate').daterangepicker({
                singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            },
            });
            $('#endDate').daterangepicker({
                singleDatePicker: true,
                locale: {
                    format: 'YYYY-MM-DD'
                },
            });
        $('#selectDate').daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            },
        });
        $('#searchPairDate').daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            },
        });

    });


    $("#searchSubject").select2({
        placeholder: "Выберите предмет",
        allowClear: true
    });

    $("#searchTeacher").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true,
        width: '100%'
    });

    $("#searchClass").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true,
        width: '100%'
    });

    $("#inputGroupSelect04").select2({
        placeholder: "Выберите группу",
        allowClear: true,
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
    $("#inputGroupSelect31").select2({
        placeholder: "Выберите предмет",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect32").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect33").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true,
        width: '100%'
    });
    $("#inputGroupSelect311").select2({
        placeholder: "Выберите тип пары",
        allowClear: true,
        width: '100%'
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
        document.getElementById("editSchedule1").style.display='block';
        document.getElementById("Label1").style.display='none';
    };
    if (val2=='Староста' && val==val1) {
        document.getElementById("editSchedule").style.display='block';
        document.getElementById("editSchedule1").style.display='block';
        document.getElementById("Label1").style.display='none';
    };
    if (val2=='Староста' && val!=val1) {
        document.getElementById("editSchedule").style.display='none';
        document.getElementById("editSchedule1").style.display='none';
        document.getElementById("Label1").style.display='block';
    };
};





