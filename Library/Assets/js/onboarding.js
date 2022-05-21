var isOnboardingHideble = false;

$(document).ready(function () {
 
    if (!localStorage.getItem('hideOnboarding')) {
        $.get("/layout/ShowOnboarding", function (res) {
            if (res) {
                isOnboardingHideble = false;
                ShowOnBoarding();
            }
            else {
                isOnboardingHideble = true;
            }
        });

        $('#OnBoarding').on('hide.bs.modal', function (e) {
            if (isOnboardingHideble == false) {
                e.preventDefault()
            }
        })
    }

});

