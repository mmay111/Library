$(document).ready(function () {
    var sleftmenu = sessionStorage.getItem('hleftMenu');

    if (sleftmenu == "true") {
        console.log("aa");
        $("#leftmenu .leftmenu-nav li .title").toggle();
        $("#leftmenu .leftmenu-nav li").toggleClass("d-flex").toggleClass("show");
        $("#leftmenu").toggleClass("col-lg-2");
        $("#maincontainer").toggleClass("col-xl-11").toggleClass("col-lg-11");

        var $toggleleftmenu = $(".toggleleftmenu")
        var $itemText = $toggleleftmenu.find("span.text-blue");
        var $itemIcon = $toggleleftmenu.find(".fas.icon");
        if ($toggleleftmenu.is(".show")) {
            $itemText.html("Gizle").show();
        }
        else {
            $itemText.hide();
        }
        $itemIcon.toggleClass("fa-chevron-left");
        $itemIcon.toggleClass("fa-chevron-right");
        $itemIcon.toggleClass("show");
    }
    $('#leftmenu .leftmenu-nav li a').each(function (i, el) {
        if (window.location.pathname.indexOf($(el).attr('href')) > -1) {
            $(el).parent('.nav-item').addClass('active').siblings().removeClass('active')
        }
    });
    var addedActive = false;
    $('.leftmenu-nav .submenu-sec a').each(function (i, el) {
        if (window.location.pathname.indexOf($(el).attr('href')) > -1) {
            $(el).addClass('active').siblings().removeClass('active');
            addedActive = true;
        }
    });
    if (!addedActive) {
        $('.leftmenu-nav .menu-item.no-accord a').each(function (i, el) {
            if (window.location.pathname.indexOf($(el).attr('href')) > -1) {
                $(el).addClass('active').siblings().removeClass('active');
                addedActive = true;
            }
        });
    }
    $('.popovers').popover();

    //Sort random function
    function owlrandom(owl,owlSelector) {
        owl.children().sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).each(function () {
            $(this).appendTo(owl);
        });
    }
    const jobPostings = $('.job-postings');
    jobPostings.owlCarousel({
        lazyLoadEager: 0, autoWidth: true,
         margin: 30, lazyLoad: true,  responsiveClass: true,
        responsive: { 0: { margin: 15 }, 600: {}, 1000: { items: 3 } }
        
    });
    $('.jobPostingsNext').click(function () { jobPostings.trigger('next.owl.carousel'); });
    $('.jobPostingsPrev').click(function () { jobPostings.trigger('prev.owl.carousel', [300]); });

    const discoverCompanies = $('.discover-companies');
    discoverCompanies.owlCarousel({
        autoWidth: true,
        margin: 30, lazyLoad: true, merge: true, mergeFit:true,responsiveClass: true,
        responsive: { 0: { items: 1, margin: 15, autoWidth: true }, 600: { }, 1000: { items: 3 } }
    });

    $('.discoverCompaniesNext').click(function () { discoverCompanies.trigger('next.owl.carousel'); });
    $('.discoverCompaniesPrev').click(function () { discoverCompanies.trigger('prev.owl.carousel', [300]); });

    const careerTools = $('.career-tools');
    careerTools.owlCarousel({
        onInitialize: function (element) {
            owlrandom(careerTools, element);
        },
        lazyLoadEager: 0, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 2 }, 1000: { items: 3 } }
    });
    $('.careerToolsNext').click(function () { careerTools.trigger('next.owl.carousel'); });
    $('.careerToolsPrev').click(function () { careerTools.trigger('prev.owl.carousel', [300]); });

    const recruitmentPrograms = $('.recruitment-programs');
    recruitmentPrograms.owlCarousel({  autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: {margin:15 }, 600: { }, 1000: { items: 3 } } });
    $('.recruitmentProgramsNext').click(function () { recruitmentPrograms.trigger('next.owl.carousel'); });
    $('.recruitmentProgramsPrev').click(function () { recruitmentPrograms.trigger('prev.owl.carousel', [300]); });

  
    const upcomingEvents = $('.upcoming-events');
    upcomingEvents.owlCarousel({  autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: {  margin: 15 }, 600: { }, 1000: { items: 3} } });
    $('.upcomingEventsNext').click(function () { upcomingEvents.trigger('next.owl.carousel'); });
    $('.upcomingEventsPrev').click(function () { upcomingEvents.trigger('prev.owl.carousel', [300]); });


    const onlineTrainings = $('.online-trainings');
    onlineTrainings.owlCarousel({
        onInitialize: function (element) {
            owlrandom(onlineTrainings, element);
        },autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 3 }, 1000: { items: 4 } }
    });
    $('.onlineTrainingsNext').click(function () { onlineTrainings.trigger('next.owl.carousel'); });
    $('.onlineTrainingsPrev').click(function () { onlineTrainings.trigger('prev.owl.carousel', [300]); });

    const sesliKitaplar = $('.sesli-kitaplar');
    sesliKitaplar.owlCarousel({
        onInitialize: function (element) {
            owlrandom(sesliKitaplar, element);
        }, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 3 }, 1000: { items: 4 } } });
    $('.seslikitaplarNext').click(function () { sesliKitaplar.trigger('next.owl.carousel'); });
    $('.seslikitaplarPrev').click(function () { sesliKitaplar.trigger('prev.owl.carousel', [300]); });

    const kisiselGelisimProgrami = $('.kisisel-gelisim-programi');
    kisiselGelisimProgrami.owlCarousel({
        onInitialize: function (element) {
            owlrandom(kisiselGelisimProgrami, element);
        }, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 3 }, 1000: { items: 4 } }
    });
    $('.kisiselGelisimProgramiNext').click(function () { kisiselGelisimProgrami.trigger('next.owl.carousel'); });
    $('.kisiselGelisimProgramiPrev').click(function () { kisiselGelisimProgrami.trigger('prev.owl.carousel', [300]); });

    const cvMulakatIsArama = $('.cvMulakatIsaramaEgitimleri');
    cvMulakatIsArama.owlCarousel({
        onInitialize: function (element) {
            owlrandom(cvMulakatIsArama, element);
        }, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 3 }, 1000: { items: 4 } } });
    $('.cvMulakatIsaramaEgitimleriNext').click(function () { cvMulakatIsArama.trigger('next.owl.carousel'); });
    $('.cvMulakatIsaramaEgitimleriPrevPrev').click(function () { cvMulakatIsArama.trigger('prev.owl.carousel', [300]); });

    const onlineStajProgramlari = $('.onlineStajProgramlari');
    onlineStajProgramlari.owlCarousel({
        onInitialize: function (element) {
            owlrandom(onlineStajProgramlari, element);
        }, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 3 }, 1000: { items: 4 } }
    });
    $('.onlineStajProgramlariNext').click(function () { onlineStajProgramlari.trigger('next.owl.carousel'); });
    $('.onlineStajProgramlariPrev').click(function () { onlineStajProgramlari.trigger('prev.owl.carousel', [300]); });

    const companyJobs = $('.company-jobs');
    companyJobs.owlCarousel({ autoWidth: true, lazyLoadEager: 1, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: {   margin: 15 }, 600: { items: 2, }, 1000: { items: 3, } } });
    $('.company-jobs-Next').click(function () { companyJobs.trigger('next.owl.carousel'); });
    $('.company-jobs-Prev').click(function () { companyJobs.trigger('prev.owl.carousel', [300]); });

    const samejobs = $('.same-jobs');
    samejobs.owlCarousel({  autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1, margin: 15 }, 600: { items: 2, }, 1000: { items: 3, } } });
    $('.same-jobs-Next').click(function () { samejobs.trigger('next.owl.carousel'); });
    $('.same-jobs-Prev').click(function () { samejobs.trigger('prev.owl.carousel', [300]); });

    const academy = $('.academy');
    academy.owlCarousel({
        lazyLoadEager: 1, autoWidth: true, margin: 30, lazyLoad: true, responsiveClass: true, responsive: { 0: { items: 1,margin: 15 }, 600: {}, 1000: { items: 3 } } });
    $('.academyNext').click(function () { academy.trigger('next.owl.carousel'); });
    $('.academyPrev').click(function () { academy.trigger('prev.owl.carousel', [300]); });

    //Company User start 

    const cvTemplate = $('.cv-template');
    cvTemplate.owlCarousel({ responsiveClass: true, responsive: { 0: { items: 2, }, 600: { items: 3, }, 900: { items: 4, }, 1100: { items: 5, }, 1200: { items: 7, } } });
    $('.cvTemplateNext').click(function () { cvTemplate.trigger('next.owl.carousel'); });
    $('.cvTemplatePrev').click(function () { cvTemplate.trigger('prev.owl.carousel', [300]); });

    const meetTeam = $('.meet-team');
    meetTeam.owlCarousel({ autoWidth: true, margin: 30, responsiveClass: true, responsive: { 0: { items: 1, margin: 10, }, 600: { items: 2, }, 1000: { items: 3, } } });
    $('.meetTeamNext').click(function () { meetTeam.trigger('next.owl.carousel'); });
    $('.meetTeamPrev').click(function () { meetTeam.trigger('prev.owl.carousel', [300]); });

    const companyPhotos = $('.company-photos');
    companyPhotos.owlCarousel({ lazyLoadEager: 1, lazyLoad: true, margin: 30, responsiveClass: true, responsive: { 0: { items: 2, margin: 15,  }, 600: { items: 3, }, 1000: { items: 5, } } });
    $('.companyphotosNext').click(function () { companyPhotos.trigger('next.owl.carousel'); });
    $('.companyphotosPrev').click(function () { companyPhotos.trigger('prev.owl.carousel', [300]); });


    const videoList = $('.video-list');
    videoList.owlCarousel({ responsiveClass: true, margin: 20, responsive: { 0: { items: 1, }, 600: { items: 3, }, 1000: { items: 4, } } });
    $('.videoListNext').click(function () { videoList.trigger('next.owl.carousel'); });
    $('.videoListPrev').click(function () { videoList.trigger('prev.owl.carousel', [300]); });

    //Company User end 

});

$(document).on('click', '.toggleleftmenu', function () {
    $("#leftmenu .leftmenu-nav li .title").toggle();
    $("#leftmenu .leftmenu-nav li").toggleClass("d-flex").toggleClass("show");
    $("#leftmenu").toggleClass("col-lg-2");
    $("#maincontainer").toggleClass("col-xl-11").toggleClass("col-lg-11");


    var $item = $(this);
    var $itemText = $item.find("span.text-blue");
    var $itemIcon = $item.find(".fas.icon");
    if ($item.is(".show")) {
        console.log("s");
        $itemText.html("Gizle").show();
        sessionStorage.setItem('hleftMenu', false);
    }
    else {
        sessionStorage.setItem('hleftMenu', true);
        $itemText.hide();
    }
    $itemIcon.toggleClass("fa-chevron-left");
    $itemIcon.toggleClass("fa-chevron-right");

    $(this).toggleClass("show");

})

window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


function setCookie(cname, cvalue, exdays, session) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    if (session) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }
    else {
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}