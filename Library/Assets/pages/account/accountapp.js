////import usersetttings  from './components/usersetttings.js';
window.addEventListener('load', () => {
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'long' };
    //var days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Thursday', 'Friday', 'Saturday'];
    var titles = [{ name: "Üyelik Ayarlarım", label: "uyelikayarlarim" }, { name: "İletişim Ayarlarım", label: "iletisimayarlarim" }, { name: "Siparişlerim", label: "siparislerim" }, { name: "İndirim Kuponları", label: "indirimkuponlari" }];
    Vue.use(VueToastr, {
        defaultType: "success",
        defaultClassNames: ["animated", "zoomInUp"]
    });
    var vueaccountapp = new Vue({
        el: '#accountapp',
        name: 'accountapp',
        components: {
            orderscomponent,
            contactsettingscomponent
            //accountsettingscomponent
        },
        data: {
            titles: titles,
            selectedTitle: titles[0],
            candidate: {},
            loadComponents: false
        },
        computed: {
        },
        methods: {
            SelectTitle(selectedTitle) {
                this.selectedTitle = selectedTitle;
                $('#collapseInnerMenu').collapse('toggle')
            },
            GetCandidate() {

                var url = new URL(location.origin + '/Profile/GetCandidateSetting');
                fetch(url)
                    .then((res) => {
                        return res.json()
                    })
                    .then((res) => {
                        this.candidate = res;
                        this.candidate.recordStatusID = !this.candidate.recordStatusID;
                        this.loadComponents = true;

                    })
            },

        },

        created() {
            this.GetCandidate()
           
        },
        mounted() {

            this.$toastr.defaultClassNames = ["animated", "zoomInUp"];
            // Change Toast Position
            this.$toastr.defaultPosition = "toast-top-right";
            this.$nextTick(() => {
                //this.selectedTitle = this.titles[0];


            })
        }
    });

    window.vueaccountapp = vueaccountapp;

}

);