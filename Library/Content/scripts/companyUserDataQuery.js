
var asInitVals = new Array();

$(document).ready(function () {
    // dynamic table

    var page = 0;
    var oTable = $('#dyntable').dataTable({
        "sPaginationType": "full_numbers",
        //"bLengthChange": false,
        "bProcessing": true,
        "bSearchable": true,
        "aaSortingFixed": [[0, 'desc']],
        "aaSorting": [[0, 'desc']],
        "bServerSide": true,
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        "sAjaxSource": "/Company/Employee/GetEmployees",
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
                   "sName": "ID",
                   "sType": "numeric",
                   "visible": false
               },
            {
                "sName": "Company"
            },
            {
                "sName": "Sector"
            },
            {
                "sName": "CreatedDate"
            },
            {
                "sName": "RecordStatus"
            },
            {
                "sName": "Priorty"
            },
             {
                 "sName": "Edit"
             }
            
        ],
        "fnDrawCallback": function (oSettings) {
            page = 0;
            $("#tableBody").fadeIn(150);
            $(".dataTables_processing").css("visibility", "hidden");
            $('[data-toggle="tooltip"]').tooltip();

        }
    });

    $(".sptl input").keyup(function () {
        /* Filter on the column (the index) of this element */
        if (this.value.length > 2 || this.value.length === 0) {
            oTable.fnFilter(this.value, $(".sptl input").index(this));
        }
    });

    /*
     * Support functions to provide a little bit of 'user friendlyness' to the textboxes in
     * the footer
     */
    $(".sptl input").each(function (i) {
        asInitVals[i] = this.value;

    });


    $(".sptl input").focus(function () {
        if (this.className === "form-control input-sm ") {
            this.className = "form-control input-sm";
            this.value = "";
        }
    });

    $(".sptl input").blur(function (i) {
        if (this.value === "") {
            this.className = "form-control input-sm ";
            this.value = asInitVals[$(".sptl input").index(this)];
        }
    });

    $("#dyntable_filter").hide();

});
$(document).ready(function () {
    $("#loadr").addClass("loaderImgr");
});


