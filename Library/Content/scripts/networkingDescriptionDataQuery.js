
var asInitVals = new Array();

$(document).ready(function () {
    // dynamic table

    var page = 0;
    var oNetworkingDescriptionsTable = $('#networkingdescriptions #networkingdescriptionsDyntable').dataTable({
        "sPaginationType": "full_numbers",
        "bLengthChange": false,
        "bProcessing": true,
        "bSearchable": true,
        "aaSortingFixed": [[0, 'asc']],
        "bServerSide": true,
        "sAjaxSource": "/Company/NetworkingDescription/GetNetworkingDescriptions?networkingID=" + $("#NetworkingID").val(),
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
            $("#networkingdescriptions #networkingdescriptionsTableBody").fadeIn(150);
            page = 0;
            $("#networkingdescriptions .dataTables_processing").css("visibility", "hidden");
            $('#networkingdescriptions [data-toggle="tooltip"]').tooltip();

        }
    });

    $("#networkingdescriptions .sptl input").keyup(function () {
        /* Filter on the column (the index) of this element */
        if (this.value.length > 2 || this.value.length == 0) {
            oNetworkingDescriptionsTable.fnFilter(this.value, $("#networkingdescriptions .sptl input").index(this));
        }
    });

    /*
     * Support functions to provide a little bit of 'user friendlyness' to the textboxes in
     * the footer
     */
    $("#networkingdescriptions .sptl input").each(function (i) {
        asInitVals[i] = this.value;

    });


    $("#networkingdescriptions .sptl input").focus(function () {
        if (this.className == "form-control input-sm ") {
            this.className = "form-control input-sm";
            this.value = "";
        }
    });

    $("#networkingdescriptions .sptl input").blur(function (i) {
        if (this.value == "") {
            this.className = "form-control input-sm ";
            this.value = asInitVals[$("#networkingdescriptions .sptl input").index(this)];
        }
    });
    $("#networkingdescriptions .sptl select").change(function () {
        var index = $(this).data("index")
        oNetworkingDescriptionsTable.fnFilter(this.value, index);
    });
    $("#networkingdescriptionsDyntable_filter").hide();

});
$(document).ready(function () {
    $("#networkingdescriptions #loadr").addClass("loaderImgr");
})


