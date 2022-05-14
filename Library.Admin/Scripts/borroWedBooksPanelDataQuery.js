var asInitVals = new Array();

$(document).ready(function () {
    //dynamic table
    var page = 0;
    var oTable = $('#dyntable').dataTable({

        "sPaginationType": "full_numbers",
        "bLengthChange": false,
        "bSearchable": true,
        "bProcessing": true,
        "aaSortingFixed": [[0, 'desc']],
        "aaSorting": [[0, 'desc']],
        "bServerSide": true,
        "sAjaxSource": "/BorrowedBooksPanel/GetBorrowedBooks",
        "oLanguage": {
            "sProcessing": "<img src='/Content/layouts/layout2/img/loading-spinner-default.gif' alt='' id='loadr'>",
            "sLengthMenu": "Göster &nbsp: _MENU_ &nbsp;",
            "sZeroRecords": "Kayıt bulunamadı",
            "sInfo": "Toplam: _TOTAL_ | Gösterilen: _START_ - _END_  ",
            "sInfoEmpty": "Kayıt bulunamadı",
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
            //{
            //    "sName": "ID",
            //    "sType": "numeric",
            //    "visible": false
            //},
            {
                "sName": "UserName"
            },
            {
                "sName": "BookName"
            },
            {
                "sName": "Author"
            },
            {
                "sName": "Barcode"
            },
            {
                "sName": "BookFee"
            },
            {
                "sName": "Campus"
            },
            {
                "sName": "BorrowedDate"
            },
            {
                "sName": "BorrowExpiresDate"
            },
            {
                "sName": "isReturned"
            },
            {
                "sName": "Edit"
            },
        ],
        "fnDrawCallback": function (oSettings) {
            $('#tableBody').slideDown(50);
            page = 0;
            $(".dataTables_processing").css("visibility", "hidden");
            $('[data-toggle="tooltip"').tooltip();
        }
    });
    $("#dyntable_paginate").on("click", ".paginate_button", function () {
        $('#tableBody').slideUp(50);
    });
    $(".sptl input").keyup(function () {
        /*Filter on the column (the index) of this element*/
        if (this.value.length > 0 || this.value.length == 0) {
            oTable.fnFilter(this.value, $(".sptl input").index(this));
        }
    });

    $("sptl input").each(function (i) {
        asInitVals[i] = this.value;
    });
    $(".sptl input").focus(function () {
        if (this.className == "form-control input-sm") {
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
