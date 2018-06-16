$(document).ready(function () {
    $(function () {
        $("#addInSessionTable").click(function() {
            var selectGroupSession = $("#selectGroupSession option:selected").text();
            var selectSubjectSession=$("#selectSubjectSession option:selected").text();
            var selectTypeSession=$("#selectTypeSession option:selected").text();
            var selectTeacherSession=$("#selectTeacherSession option:selected").text();
            var selectClassSession=$("#selectClassSession option:selected").text();
            var date = $("input#sessionDateAndTime").val();
            var date1=new Date(date);

            var result={selectGroupSession:selectGroupSession,selectSubjectSession:selectSubjectSession,
                selectTypeSession:selectTypeSession,selectTeacherSession:selectTeacherSession,
                selectClassSession:selectClassSession};
            $.ajax({
                type: "POST",
                url: "/addInSessionTable",
                data: result,
                success:function () {
                    fillSessionTable();
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
        $("#selectGroupSession").change(function () {
            fillSessionTable();
        });
    });

});

function fillSessionTable() {
    var select_ = $("#selectGroupSession option:selected").text();
    $("#sessionTable tbody").remove();
    $("#sessionTableTest tbody").remove();
    $("#sessionTableTestMark tbody").remove();
    $("#sessionTableConsult tbody").remove();

    $('#sessionTable').append('<thead></thead><th colspan="6">Экзамены</th><tbody></tbody>');
    $('#sessionTableTest').append('<thead></thead><th colspan="6">Зачёты</th><tbody></tbody>');
    $('#sessionTableTestMark').append('<thead></thead><th colspan="6">Зачёты с оценкой</th><tbody></tbody>');
    $('#sessionTableConsult').append('<thead></thead><th colspan="6">Консультации</th><tbody></tbody>');
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
                    $('#sessionTable').append('<tr><td>'+countEx+'</td><td>'+data[i].subjectName+'</td><td>'+data[i].teacherName+'</td><td></td><td></td><td>'+data[i].className+'</td></tr>');
                }else if(x===2){
                    countTest++;
                    $('#sessionTableTest').append('<tr><td>'+countTest+'</td><td>'+data[i].subjectName+'</td><td>'+data[i].teacherName+'</td><td></td><td></td><td>'+data[i].className+'</td></tr>');
                }else if(x===3){
                    countTMark++;
                    $('#sessionTableTestMark').append('<tr><td>'+countTMark+'</td><td>'+data[i].subjectName+'</td><td>'+data[i].teacherName+'</td><td></td><td></td><td>'+data[i].className+'</td></tr>');
                }else if(x===4){
                    countConsult++;
                    $('#sessionTableConsult').append('<tr><td>'+countConsult+'</td><td>'+data[i].subjectName+'</td><td>'+data[i].teacherName+'</td><td></td><td></td><td>'+data[i].className+'</td></tr>');
                }
            };
        }
    });
    return false;
};
