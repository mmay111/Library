var contactsettingscomponent=Vue.component('contactsettingscomponent', {
    template: '#contactsettings-template',
    data() {
        return {
        }
    },
    computed: {

    },
    methods: {
        ChangeSendSms() {
            var title = "SMS Ayarları";
            var url = new URL(location.origin + '/Profile/SMSSetting');
            params = { sms: this.$root.candidate.sendSms };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((res) => {
                    if (res.Status == 200) {
                        this.$toastr.Add({
                            title: title, 
                            msg: res.Message,
                        });
                    }
                    else {
                        this.$toastr.Add({
                            title: title,
                            msg: res.Message, 
                            type: "error", 
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        },
        ChangeSendEmail() {
            var title = "E-Mail Ayarları";
            var url = new URL(location.origin + '/Profile/EmailSetting');
            params = { email: this.$root.candidate.sendEmail };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((res) => {
                    if (res.Status == 200) {
                        this.$toastr.Add({
                            title: title,
                            msg: res.Message,
                        });
                    }
                    else {
                        this.$toastr.Add({
                            title: title,
                            msg: res.Message,
                            type: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        },
        ChangeSendNotification() {
            var title = "Bildirim Ayarları";
            var url = new URL(location.origin + '/Profile/NotificationSetting');
            params = { notification: this.$root.candidate.sendNotification };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((res) => {
                    if (res.Status == 200) {
                        this.$toastr.Add({
                            title: title,
                            msg: res.Message,
                        });
                    }
                    else {
                        this.$toastr.Add({
                            title: title,
                            msg: res.Message,
                            type: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
      
    },
    created() {
      
    },
    mounted() {
        this.$nextTick(() => {
        })
    },
    beforeDestroy() {
    },
    watch: {

    },
});