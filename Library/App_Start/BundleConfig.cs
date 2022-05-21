using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace Library.Admin.App_Start
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region CSS

            bundles.Add(new StyleBundle("~/Content/layout").Include(
            "~/Content/layouts/layout2/css/layout.min.css", new CssRewriteUrlTransform()
             ));
            bundles.Add(new StyleBundle("~/Content/multiselect").Include(
            "~/Content/global/plugins/bootstrap-multiselect/css/bootstrap-multiselect.css", new CssRewriteUrlTransform()
             ));
            bundles.Add(new StyleBundle("~/Content/themes").Include("~/Content/layouts/layout2/css/themes/blue.css", new CssRewriteUrlTransform()));
            bundles.Add(new StyleBundle("~/Content/font-awesome").Include(
              "~/Content/global/plugins/font-awesome/css/font-awesome.min.css", new CssRewriteUrlTransform()
               ));

            bundles.Add(new StyleBundle("~/Content/error")
           .Include("~/Content/global/plugins/font-awesome/css/font-awesome.min.css")
           .Include("~/Content/global/plugins/simple-line-icons/simple-line-icons.min.css")
           .Include("~/Content/global/plugins/bootstrap/css/bootstrap.min.css")
           .Include("~/Content/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css")
           .Include("~/Content/global/css/components-md.min.css")
           .Include("~/Content/global/css/plugins-md.min.css")
           .Include("~/Content/pages/css/error.min.css")
           .Include("~/Content/pages/css/error.min.css")
           );
            bundles.Add(new StyleBundle("~/Content/simple-line-icons").Include(
              "~/Content/global/plugins/simple-line-icons/simple-line-icons.min.css", new CssRewriteUrlTransform()
                 ));
            bundles.Add(new StyleBundle("~/Content/login").Include(
              "~/Content/pages/css/login-5.min.css", new CssRewriteUrlTransform()
                 ));

            bundles.Add(new StyleBundle("~/Content/bootstrap")
                .Include("~/Content/main.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap/css/bootstrap.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/datatables/datatables.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/select2/css/select2.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/select2/css/select2-bootstrap.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-select/css/bootstrap-select.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/pages/css/profile.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/morris/morris.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/fullcalendar/fullcalendar.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/jqvmap/jqvmap/jqvmap.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/css/components-md.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/plugins/bootstrap-toastr/toastr.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/global/css/plugins-md.min.css", new CssRewriteUrlTransform())
);

            #endregion

            #region Scripts

           

           
            bundles.Add(new ScriptBundle("~/scripts/report")
              .Include("~/Content/scripts/report.js"));
            bundles.Add(new ScriptBundle("~/scripts/jqueryui")
                .Include("~/Content/pages/scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/scripts/fnfilterclear")
                .Include("~/Content/scripts/fnFilterClear.js"));

            bundles.Add(new ScriptBundle("~/scripts/newrecord")
               .Include("~/Content/scripts/newRecord.js"));

            bundles.Add(new ScriptBundle("~/scripts/homeDataQuery")
            .Include("~/Content/scripts/homeDataQuery.js"));

            bundles.Add(new ScriptBundle("~/scripts/userscoreDataQuery")
            .Include("~/Content/scripts/userscoreDataQuery.js"));

            bundles.Add(new ScriptBundle("~/scripts/mobileteamDataQuery")
                .Include("~/Content/scripts/mobileteamDataQuery.js"));

            bundles.Add(new ScriptBundle("~/scripts/vendorDataQuery")
              .Include("~/Content/scripts/vendorDataQuery.js"));

            bundles.Add(new ScriptBundle("~/scripts/regionDataQuery")
        .Include("~/Content/scripts/regionDataQuery.js"));


            bundles.Add(new ScriptBundle("~/scripts/userDataQuery")
            .Include("~/Content/scripts/userDataQuery.js"));

            bundles.Add(new ScriptBundle("~/scripts/locationdataquery")
              .Include("~/Content/scripts/locationDataQuery.js"));

        
            bundles.Add(new ScriptBundle("~/scripts/uimodals")
              .Include("~/Content/pages/scripts/ui-modals.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jquery").Include("~/Content/global/plugins/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/datepicker").Include("~/Content/scripts/datepicker.js"));

            bundles.Add(new ScriptBundle("~/Scripts/slimscroll")
                .Include("~/Content/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/validation")
                  .Include("~/Content/global/plugins/jquery-validation/js/jquery.validate.min.js")
                  .Include("~/Content/global/plugins/jquery-validation/js/additional-methods.min.js")
                  .Include("~/Content/pages/scripts/form-validation.min.js"));


            bundles.Add(new ScriptBundle("~/Scripts/multiselect")
                 .Include("~/Content/global/plugins/bootstrap-multiselect/js/bootstrap-multiselect.js")
                 .Include("~/Content/pages/scripts/components-bootstrap-multiselect.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/login")
                 .Include("~/Content/pages/scripts/login-5.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/backstretch")
                .Include("~/Content/global/plugins/backstretch/jquery.backstretch.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/datatables").Include(
                "~/Content/global/scripts/datatable.js",
                "~/Content/global/plugins/datatables/datatables.min.js",
                "~/Content/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js"
            ));
            bundles.Add(new ScriptBundle("~/Scripts/datatablesbuttons").Include(
               "~/Content/pages/scripts/table-datatables-buttons.js"));

            bundles.Add(new ScriptBundle("~/Scripts/script")
                .Include("~/Content/scripts/script.js")
                .Include("~/Scripts/jquery.unobtrusive-ajax.min.js")
                .Include("~/Content/global/plugins/jquery.min.js")
                .Include("~/Content/global/plugins/bootstrap/js/bootstrap.min.js")
                .Include("~/Content/global/plugins/js.cookie.min.js")
                .Include("~/Content/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js")
                .Include("~/Content/global/plugins/jquery.blockui.min.js")
                .Include("~/Content/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js")
                .Include("~/Content/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js")
                .Include("~/Content/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js")
                .Include("~/Content/global/plugins/clockface/js/clockface.js")
                 .Include("~/Content/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js")
                 .Include("~/Content/global/plugins/jquery.input-ip-address-control-1.0.min.js")
                 .Include("~/Content/global/plugins/moment.min.js")
                 .Include("~/Content/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js")
                 .Include("~/Content/global/plugins/morris/morris.min.js")
                 .Include("~/Content/global/plugins/select2/js/select2.full.min.js")
                 .Include("~/Content/global/plugins/bootstrap-select/js/bootstrap-select.min.js")
                 .Include("~/Content/global/plugins/bootstrap-toastr/toastr.min.js")
                 .Include("~/Content/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js")
                 .Include("~/Content/global/scripts/app.min.js")
                 .Include("~/Content/pages/scripts/ui-toastr.min.js")
                 .Include("~/Content/pages/scripts/components-select2.min.js")
                 .Include("~/Content/pages/scripts/components-bootstrap-select.min.js")
                 .Include("~/Content/pages/scripts/form-input-mask.min.js")
                 .Include("~/Content/pages/scripts/ui-blockui.min.js")
                 .Include("~/Content/pages/scripts/components-date-time-pickers.min.js")
                 .Include("~/Content/pages/scripts/dashboard.min.js")
                 .Include("~/Content/layouts/layout2/scripts/layout.min.js")
                 .Include("~/Content/layouts/layout2/scripts/demo.min.js")
                );

            #endregion





            BundleTable.EnableOptimizations = true;
        }
    }
}
