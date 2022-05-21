
var asInitVals = new Array();


$(document).ready(function () {
    // dynamic table
    var page = 0;
    var oTable = $('#dyntable').DataTable({

        "sPaginationType": "full_numbers",
        "bLengthChange": false,
        "bSearchable": true,
        "bProcessing": true,
        "aaSortingFixed": [[0, 'desc']],
        "aaSorting": [[0, 'desc']],
        "bServerSide": true,
        "sAjaxSource": "/ReportsPanel/GetReports?Type=" + $('input[name="TimeFilter"]:checked').val(),
        "oLanguage": {
            "sProcessing": "<img src='/Content/layouts/layout2/img/loading-spinner-default.gif' alt='' id='loadr'>",
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
                "sName": "CampusName"
            },

            {
                "sName": "Ayarlar"
            }

        ],
        "fnDrawCallback": function (oSettings) {
            $('#tableBody').slideDown(50);
            page = 0;
            $(".dataTables_processing").css("visibility", "hidden");
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
    $("#dyntable_paginate").on("click", ".paginate_button", function () {
        $('#tableBody').slideUp(50);
    });
    $(".sptl input").keyup(function () {
        /* Filter on the column (the index) of this element */
        if (this.value.length > 0 || this.value.length == 0) {
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
        if (this.className == "form-control input-sm ") {
            this.className = "form-control input-sm";
            this.value = "";
        }
    });

    $(".sptl input").blur(function (i) {
        if (this.value == "") {
            this.className = "form-control input-sm ";
            this.value = asInitVals[$(".sptl input").index(this)];
        }
    });

    $("#dyntable_filter").hide();

});
$(document).ready(function () {
    $("#loadr").addClass("loaderImgr");
});
jQuery.fn.dataTableExt.oApi.fnFilterClear = function (oSettings) {
    var i, iLen;

    /* Remove global filter */
    oSettings.oPreviousSearch.sSearch = "";

    /* Remove the text of the global filter in the input boxes */
    if (typeof oSettings.aanFeatures.f != 'undefined') {
        var n = oSettings.aanFeatures.f;
        for (i = 0, iLen = n.length; i < iLen; i++) {
            $('input', n[i]).val('');
        }
    }

    /* Remove the search text for the column filters - NOTE - if you have input boxes for these
     * filters, these will need to be reset
     */
    for (i = 0, iLen = oSettings.aoPreSearchCols.length; i < iLen; i++) {
        oSettings.aoPreSearchCols[i].sSearch = "";
    }

    /* Redraw */
    oSettings.oApi._fnReDraw(oSettings);
};
function RefreshTable() {
    var s = "/ReportsPanel/GetReports?Type=" + $('input[name="TimeFilter"]:checked').val();

    $("#tableBody").fadeOut(150);
    var table = $('#dyntable').dataTable();
    var OSettings = table.fnSettings();
    OSettings.sAjaxSource = s;
    table.fnFilterClear();
}
function handleClick() {
    RefreshTable();
}





