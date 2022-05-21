
function OpenDialog(id) {
    var customerEmployeeId = 0

    if (typeof id != "undefined") {
        customerEmployeeId = id;
    }
    var customerId = $("#customerId").val();
    var model = { customerEmployeeId: customerEmployeeId, customerId: customerId };
    $.ajax({
        type: "POST",
        url: "/CustomerEmployee/_Edit",
        data: JSON.stringify(model),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (response) {
            $('.modal-body').html(response);
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        }
    }).done(function () {
       
      
    });
}
function OnFailure() {
    toastr.error("Kayıt eklenemedi", "Kayıt");
}
function OnSuccess(id) {
    window.location = "/Customer/Edit/" + id;
}
function OnSuccessCEmployee() {
    $("#btnCloseModal").trigger("click");
    $("#tableBody").fadeOut(150);
    var s = "/CustomerEmployee/GetCustomerEmployees?customerId=" + $("#customerId").val();
    var table = $('#customerEmployeesDyntable').dataTable();
    var oSettings = table.fnSettings();
    oSettings.sAjaxSource = s;
    table.fnFilterClear();
}
function OnFailureCEmployee() {
    toastr.error("Kayıt eklenemedi", "Kayıt");
}