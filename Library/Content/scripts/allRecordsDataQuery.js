var asInitVals = new Array();
var getApprove = 0;

$(document).ready(function () {
    // dynamic table
    var page = 0;
    var fromDate = $("#fromDate").val();
    var toDate = $("#toDate").val();

    var oTable = $('#dyntable').dataTable({

        "sPaginationType": "full_numbers",
        "bLengthChange": false,
        "bProcessing": true,
        "bSearchable": true,
        "aaSortingFixed": [[0, 'desc']],
        "aaSorting": [[0, 'desc']],
        "bServerSide": true,
        'iDisplayLength': 10,
        "sAjaxSource": "/Record/GetRecordResults?fromDate=" + fromDate + "&toDate=" + toDate + "&getApprove=" + getApprove,
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
                "sName": "Date",
                "className": "td-center",
            },
            {
                "sName": "RecordName"
            },
            {
                "sName": "CreatedBy"
            },
            {
                "sName": "Shop"
            },
            {
                "sName": "ApprovalStatus"
            },
            {
                "sLook": "Look"
            }
        ],
        "fnDrawCallback": function (oSettings) {
            page = 0;
            $("#dyntable #tableBody").fadeIn(150);
            $(".dataTables_processing").css("visibility", "hidden");
            $('[data-toggle="tooltip"]').tooltip();
            $("#tableBody tr td").addClass("text-center");
            $("#tableBody tr td").css('white-space', 'normal');
        }
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

    $("#toDate,#fromDate").change(function () {
        fromDate = $("#fromDate").val();
        toDate = $("#toDate").val();
        userTypeID = $("#UserTypeID").val();

        var s = "/Record/GetRecordResults?fromDate=" + fromDate + "&toDate=" + toDate + "&getApprove=" + getApprove;

        if (fromDate != "" && toDate != "") {

            $("#tableBody").fadeOut(150);
            var table = $('#dyntable').dataTable();
            var OSettings = table.fnSettings();
            OSettings.sAjaxSource = s;
            table.fnFilterClear();
        }
    })
});

function RefreshTable() {

    fromDate = $("#fromDate").val();
    toDate = $("#toDate").val();

    var s = "/Record/GetRecordResults?fromDate=" + fromDate + "&toDate=" + toDate + "&getApprove=" + getApprove;

    if (fromDate != "" && toDate != "") {

        $("#tableBody").fadeOut(150);
        var table = $('#dyntable').dataTable();
        var OSettings = table.fnSettings();
        OSettings.sAjaxSource = s;
        table.fnFilterClear();
    }
}
function SetApprove(getapprove) {
    getApprove = getapprove;
    RefreshTable();

}






