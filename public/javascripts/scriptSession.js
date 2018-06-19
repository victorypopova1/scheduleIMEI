$(document).ready(function () {
    $(function () {
        $("#addInSessionTable").click(function() {
            var selectGroupSession = $("#selectGroupSession option:selected").text();
            var selectSubjectSession=$("#selectSubjectSession option:selected").text();
            var selectTypeSession=$("#selectTypeSession option:selected").text();
            var selectTeacherSession=$("#selectTeacherSession option:selected").text();
            var selectClassSession=$("#selectClassSession option:selected").text();
            var d = $("input#sessionDateAndTime").val();
            var d1=new Date(d);
            var month = new Array("янв.", "февр.", "мар.", "апр.", "мая", "июня",
                "июля", "авг.", "сент.", "окт.", "нояб.", "дек.");

            var date =  d1.getDate() + " " + month[d1.getMonth()]
                + " " + d1.getFullYear() + " г.";
            var min;
            if(d1.getMinutes()==0){
               min="00";
            }
            else{
                min=d1.getMinutes();
            }
            var time =  d1.getHours() + ":" +min;
            var result={selectGroupSession:selectGroupSession,selectSubjectSession:selectSubjectSession,
                selectTypeSession:selectTypeSession,selectTeacherSession:selectTeacherSession,
                selectClassSession:selectClassSession,date:date,time:time};
            $.ajax({
                type: "POST",
                url: "/addInSessionTable",
                data: result,
                success:function () {
                    fillSessionTable();
                    fillSessionTable1();
                }
            });
            return false;
        });
    });

    $("#selectGroupSession").select2({
        placeholder: "Выберите группу",
        allowClear: true,
        width: '100%'
    });
    $("#selectGroupSession1").select2({
        placeholder: "Выберите группу",
        allowClear: true,
        width: '100%'
    });
    $("#selectTypeSession").select2({
        placeholder: "Выберите тип",
        allowClear: true,
        width: '100%'
    });
    $("#selectSubjectSession").select2({
        placeholder: "Выберите предмет",
        allowClear: true,
        width: '100%'
    });
    $("#selectTeacherSession").select2({
        placeholder: "Выберите преподавателя",
        allowClear: true,
        width: '100%'
    });
    $("#selectClassSession").select2({
        placeholder: "Выберите аудиторию",
        allowClear: true,
        width: '100%'
    });

    $(function(){
        moment.locale('ru');
        $('#sessionDateAndTime').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            timePicker24Hour: true,
            locale: {
                format: 'YYYY-MM-DD H:mm'
            },

        });
    });
    $(function () {
        $("#SessionRedirect").click(function () {
            var select_ = $("#inputGroupSelect04 option:selected").val();
            var url = "/session/"+select_;
            $(location).attr('href',url);

     });
    });

    $(function () {
        $("#selectGroupSession").change(function () {
            fillSessionTable();
        });
    });
    $(function () {
        $("#selectGroupSession1").change(function () {
            fillSessionTable1();
        });
    });
    $(document).on('click', '.delBtn', function () {
        //this - кнопка удалить в ячейке
        var teacherSessionTd = $(this).parent().parent().find(".teacherSessionTd").html();
        var subjectSessionTd = $(this).parent().parent().find(".subjectSessionTd").html();
        var typeSessionThTable = $(this).parent().parent().parent().find(".nameTh").html();
        var selectGroupSession = $("#selectGroupSession option:selected").text();
        var typeSessionTh='';
        switch (typeSessionThTable){
            case "Экзамены": typeSessionTh="Экзамен"; break;
            case "Зачёты": typeSessionTh="Зачёт"; break;
            case "Зачёты с оценкой": typeSessionTh="Зачёт с оценкой"; break;
            case "Консультации": typeSessionTh="Консультация"; break;
            default: ''; break;
        };
        var dataFromPage = {teacherSessionTd: teacherSessionTd, subjectSessionTd: subjectSessionTd, typeSessionTh:typeSessionTh, selectGroupSession:selectGroupSession};
        $.ajax({
            type: "POST",
            url: "/delFromSessionTable",
            data: dataFromPage,
            success: function () {
                fillSessionTable();
                //fillSessionTable1();
            }
        });
        return false;
    });
    fillSessionTable();
    fillSessionTable1();
});

function fillSessionTable() {
    var select_ = $("#selectGroupSession option:selected").text();
    $("#sessionTable tbody").remove();
    $("#sessionTableTest tbody").remove();
    $("#sessionTableTestMark tbody").remove();
    $("#sessionTableConsult tbody").remove();

    $('#sessionTable').append('<thead></thead><th colspan="6" class="nameTh">Экзамены</th><tbody></tbody>');
    $('#sessionTableTest').append('<thead></thead><th colspan="6" class="nameTh">Зачёты</th><tbody></tbody>');
    $('#sessionTableTestMark').append('<thead></thead><th colspan="6" class="nameTh">Зачёты с оценкой</th><tbody></tbody>');
    $('#sessionTableConsult').append('<thead></thead><th colspan="6" class="nameTh">Консультации</th><tbody></tbody>');
    $.ajax({
        type: "POST",
        url: "/fillSessionTable",
        data: jQuery.param({group: select_}),
        dataType: "json",
        success:function (data) {
            var i,countEx=0,countTest=0,countTMark=0,countConsult=0;
            for(i=0;i<data.length;i++){
                var x=data[i].typeEx;
                if(x===1){
                    countEx++;
                    if(data[i].className==null){
                        $('#sessionTable').append('<tr><td class="counterSession">' + countEx + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td><input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                    else {
                        $('#sessionTable').append('<tr><td class="counterSession">' + countEx + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '<input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                }else if(x===2){
                    countTest++;
                    if(data[i].className==null){
                        $('#sessionTableTest').append('<tr><td class="counterSession">'+countTest+'</td><td class="subjectSessionTd">'+data[i].subjectName+'</td><td class="teacherSessionTd">'+data[i].teacherName+'</td><td>'+data[i].timeName+'</td><td>'+data[i].dateName+'</td><td><input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                    else {
                        $('#sessionTableTest').append('<tr><td class="counterSession">' + countTest + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '<input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                }else if(x===3){
                    countTMark++;
                    if(data[i].className==null) {
                        $('#sessionTableTestMark').append('<tr><td class="counterSession">' + countTMark + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td><input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                    else {
                        $('#sessionTableTestMark').append('<tr><td class="counterSession">' + countTMark + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '<input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                }else if(x===4){
                    countConsult++;
                    if(data[i].className==null) {
                        $('#sessionTableConsult').append('<tr><td class="counterSession">' + countConsult + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td><input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }
                    else {
                        $('#sessionTableConsult').append('<tr><td class="counterSession">' + countConsult + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '<input type="button" class="delBtn btn btn-outline-danger btn-sm" value="Удалить"></td></tr>');
                    }

                }
            };
        }
    });
    return false;
};
function fillSessionTable1() {
    var select_ = $("#selectGroupSession1 option:selected").text();
    $("#sessionTable tbody").remove();
    $("#sessionTableTest tbody").remove();
    $("#sessionTableTestMark tbody").remove();
    $("#sessionTableConsult tbody").remove();

    $('#sessionTable').append('<thead></thead><th colspan="6" class="nameTh">Экзамены</th><tbody></tbody>');
    $('#sessionTableTest').append('<thead></thead><th colspan="6" class="nameTh">Зачёты</th><tbody></tbody>');
    $('#sessionTableTestMark').append('<thead></thead><th colspan="6" class="nameTh">Зачёты с оценкой</th><tbody></tbody>');
    $('#sessionTableConsult').append('<thead></thead><th colspan="6" class="nameTh">Консультации</th><tbody></tbody>');
    $.ajax({
        type: "POST",
        url: "/fillSessionTable",
        data: jQuery.param({group: select_}),
        dataType: "json",
        success:function (data) {
            var i,countEx=0,countTest=0,countTMark=0,countConsult=0;
            for(i=0;i<data.length;i++){
                var x=data[i].typeEx;
                if(x===1){
                    countEx++;
                    if(data[i].className==null){
                        $('#sessionTable').append('<tr><td class="counterSession">' + countEx + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td></td></tr>');
                    }
                    else {
                        $('#sessionTable').append('<tr><td class="counterSession">' + countEx + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '</td></tr>');
                    }
                }else if(x===2){
                    countTest++;
                    if(data[i].className==null){
                        $('#sessionTableTest').append('<tr><td class="counterSession">'+countTest+'</td><td class="subjectSessionTd">'+data[i].subjectName+'</td><td class="teacherSessionTd">'+data[i].teacherName+'</td><td>'+data[i].timeName+'</td><td>'+data[i].dateName+'</td><td></td></tr>');
                    }
                    else {
                        $('#sessionTableTest').append('<tr><td class="counterSession">' + countTest + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '</td></tr>');
                    }
                }else if(x===3){
                    countTMark++;
                    if(data[i].className==null) {
                        $('#sessionTableTestMark').append('<tr><td class="counterSession">' + countTMark + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td></td></tr>');
                    }
                    else {
                        $('#sessionTableTestMark').append('<tr><td class="counterSession">' + countTMark + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '</td></tr>');
                    }
                }else if(x===4){
                    countConsult++;
                    if(data[i].className==null) {
                        $('#sessionTableConsult').append('<tr><td class="counterSession">' + countConsult + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td></td></tr>');
                    }
                    else {
                        $('#sessionTableConsult').append('<tr><td class="counterSession">' + countConsult + '</td><td class="subjectSessionTd">' + data[i].subjectName + '</td><td class="teacherSessionTd">' + data[i].teacherName + '</td><td>' + data[i].timeName + '</td><td>' + data[i].dateName + '</td><td>' + data[i].className + '</td></tr>');
                    }
                }
            };
        }
    });
    return false;
};

function userGroupSession(a) {
    var group1 = document.getElementById("userGroup1");
    var val = group1.textContent;
    var group2 = document.getElementById("selectGroupSession");
    var val1 = group2.options[group2.selectedIndex].text;
    var type_user = document.getElementById("type_user1");
    var val2 = type_user.textContent;

    if(val2=='Администратор'){
        document.getElementById("editSession1").style.display='block';
        document.getElementById("Label2").style.display='none';
    };
    if (val2=='Староста' && val==val1) {
        document.getElementById("editSession1").style.display='block';
        document.getElementById("Label2").style.display='none';
    };
    if (val2=='Староста' && val!=val1) {
        document.getElementById("editSession1").style.display='none';
        document.getElementById("Label2").style.display='block';
    };
};

