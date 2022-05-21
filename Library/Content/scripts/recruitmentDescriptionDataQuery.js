
var asInitVals = new Array();

$(document).ready(function () {
    // dynamic table

    var page = 0;
    var oRecruitmentDescriptionsTable = $('#recruitmentdescriptions #recruitmentdescriptionsDyntable').dataTable({
        "sPaginationType": "full_numbers",
        "bLengthChange": false,
        "bProcessing": true,
        "bSearchable": true,
        "aaSortingFixed": [[0, 'asc']],
        "bServerSide": true,
        "sAjaxSource": "/Company/RecruitmentDescription/GetRecruitmentDescriptions?recruitmentID=" + $("#RecruitmentID").val(),
        "oLanguage": {
            "sProcessing": "<img src='/Areas/Admin/Content/layouts/layout2/img/loading-spinner-default.gif' alt='' id='loadr'>",
            "sLengthMenu": "Göster &nbsp; _MENU_ &nbsp;",
            "sZeroRecords": "Kayıt Bulunamadı",
            "sInfo": "Toplam: _TOTAL_ | Gösterilen: _START_ - _END_  ",
            "sInfoEmpty": "Kayıt Bulunamadı",
            "sInfoFiltered": "Siliniyor. İşlem tamamlandığında tablo tazelenecektir.",
            "sInfoPostFix": "",
            "sSearch": "Ara:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "<<<",
                "sPrevious": "<",
                "sNext": ">",
                "sLast": ">>>"
            }
        },
        "aoColumns": [

            {
                "sName": "name"
            },
            {
                "sName": "CreateDate"
            },
            {
                "sName": "StartDate"
            },
             {
                 "sName": "Edit"
             }


        ],
        "fnDrawCallback": function (oSettings) {
            $("#recruitmentdescriptions #recruitmentdescriptionsTableBody").fadeIn(150);
            page = 0;
            $("#recruitmentdescriptions .dataTables_processing").css("visibility", "hidden");
            $('#recruitmentdescriptions [data-toggle="tooltip"]').tooltip();

        }
    });

    $("#recruitmentdescriptions .sptl input").keyup(function () {
        /* Filter on the column (the index) of this element */
        if (this.value.length > 2 || this.value.length == 0) {
            oRecruitmentDescriptionsTable.fnFilter(this.value, $("#recruitmentdescriptions .sptl input").index(this));
        }
    });

    /*
     * Support functions to provide a little bit of 'user friendlyness' to the textboxes in
     * the footer
     */
    $("#recruitmentdescriptions .sptl input").each(function (i) {
        asInitVals[i] = this.value;

    });


    $("#recruitmentdescriptions .sptl input").focus(function () {
        if (this.className == "form-control input-sm ") {
            this.className = "form-control input-sm";
            this.value = "";
        }
    });

    $("#recruitmentdescriptions .sptl input").blur(function (i) {
        if (this.value == "") {
            this.className = "form-control input-sm ";
            this.value = asInitVals[$("#recruitmentdescriptions .sptl input").index(this)];
        }
    });
    $("#recruitmentdescriptions .sptl select").change(function () {
        var index = $(this).data("index")
        oRecruitmentDescriptionsTable.fnFilter(this.value, index);
    });
    $("#recruitmentdescriptionsDyntable_filter").hide();

});
$(document).ready(function () {
    $("#recruitmentdescriptions #loadr").addClass("loaderImgr");
})


