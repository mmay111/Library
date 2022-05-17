

Vue.component('accountsettingscomponent', {
    template: '#accountsettingsapp-template',
    data() {
        return {
            show: true,
            message: "First component mounted",
            accountdeleteStatus: false,
            accountDeleted: false,
            newEmail: "",
            emailErrors: [],
            newPassword: {
                errors: [],
                attemptSubmit: false,
                password: "",
                newPassword: "",
                newPassword2: "",
                passwordFieldType:"password"
            }
            //candidateId: this.$root.candidateId,
            //emailAddress: this.$root.emailAddress,
            //recordStatusID: this.$root.recordStatusID,
            //sendEmail: this.$root.sendEmail,
            //sendSms: this.$root.sendSms,
            //sendNotification: this.$root.sendNotification,
        }
    },
    computed: {
        CheckPassword: function () { return this.name === ''; },
    },
    methods: {
        ChangeRStatus(event) {

            var url = new URL(location.origin + '/Profile/AccountActivePassive');
            params = { passive: !this.$root.candidate.recordStatusID };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((res) => {
                    if (res.Status == 200) {
                        this.$toastr.Add({
                            title: "Üyeliğimi Pasife Al", // Toast Title
                            msg: "İşlemini gerçekleştirdik.", // Message
                        });
                        this.$root.GetCandidate();
                    }
                    else {
                        this.$toastr.Add({
                            title: "Üyeliğimi Pasife Al", // Toast Title
                            msg: "İşlemini gerçekleştiremedik.", // Message
                            type: "error", // Toast type,
                        });

                    }

                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        },
        ConfirmAccountDeletion() {
            $('#confiraccountdeletionmodal').modal('show');
        },
        DeleteAccount() {
            $("#confirmdeleteaccount").addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').prop('disabled', true);
            var url = new URL(location.origin + '/Profile/DeleteCandidate');
            fetch(url)
                .then((res) => {
                    return res.json()
                })
                .then((res) => {
                    var title = "Üyeliğimi Sil";
                    if (res.Status == 200) {
                        this.accountDeleted = true;

                        this.$toastr.Add({
                            title: title, // Toast Title
                            msg: res.Message, // Message
                        });
                        setTimeout(function () {
                            location.href = res.RedirectUrl;
                        }, 500);
                    }
                    else {
                        this.$toastr.Add({
                            title: title, // Toast Title
                            msg: res.Message, // Message
                            type: "error", // Toast type,
                        });

                    }
                    setTimeout(function () {
                        $("#confirmdeleteaccount").removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').prop('disabled', false);
                    }, 500)
                    $('#confiraccountdeletionmodal').modal('hide');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setTimeout(function () {
                        $("#confirmdeleteaccount").removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').prop('disabled', false);
                    }, 500)
                });

        },
        HiddenConfiraccountdeletionmodal() {
            if (this.accountDeleted == false) {
                this.accountdeleteStatus = false;
            }
        },
        ChangeEmail() {
            this.CheckForm();

        },
        CheckForm(e) {
            this.emailErrors = [];

            if (!this.newEmail) {
                this.emailErrors.push('E-Mail adresini girin');
            } else if (!this.ValidEmail(this.newEmail)) {
                this.emailErrors.push('E-Mail adresi geçerli değil');
            }

            if (!this.emailErrors.length) {

                var url = new URL(location.origin + '/Profile/ChangeEmail');

                var data = { NewEmailAddress: this.newEmail }
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((res) => {
                        var title = "E-Mail Adresini Değiştir";
                        if (res.Status == 200) {

                            this.$toastr.Add({
                                title: title, // Toast Title
                                msg: res.Message, // Message
                            });

                        }
                        else {
                            this.$toastr.Add({
                                title: title, // Toast Title
                                msg: res.Message, // Message
                                type: "error", // Toast type,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                return true;

            }

        },
        ValidEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        ValidateNewPasswordForm(event) {
            event.preventDefault();

            this.attemptSubmit = true;

            this.newPassword.errors = [];

            if (!this.newPassword.password) {
                this.newPassword.errors.push('Eski şifrenizi girin.');
            }
            else if (!this.newPassword.newPassword) {
                this.newPassword.errors.push('Yeni şifrenizi girin.');
            }
            else if (this.newPassword.newPassword.length<6) {
                this.newPassword.errors.push('Yeni şifreniz en az 6 karakter olmalı.');
            }
            else if (!this.newPassword.newPassword2) {
                this.newPassword.errors.push('Yeni şifrenizi tekrar girin');
            }
            else if (this.newPassword.newPassword2 != this.newPassword.newPassword) {
                this.newPassword.errors.push('"Yeni şifre" ve "Yeni şifre tekrar" alanları birbiriyle uyuşmuyor.');
            }

            if (!this.newPassword.errors.length) {

                var data = {
                    OldPassword: this.newPassword.password,
                    NewPassword: this.newPassword.newPassword2,
                };
                var url = new URL(location.origin + '/Profile/ResetPassword');

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((res) => {
                        var title = "Şifre Yenile";
                        if (res.Status == 200) {

                            this.$toastr.Add({
                                title: title, // Toast Title
                                msg: res.Message, // Message
                            });

                            setTimeout(function () {
                                location.href = res.RedirectUrl;
                            }, 1000)
                        }
                        else {
                            this.$toastr.Add({
                                title: title, // Toast Title
                                msg: res.Message, // Message
                                type: "error", // Toast type,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                return true;
            }


        },
        SwitchPasswordVisibility() {
            this.newPassword.passwordFieldType = this.newPassword.passwordFieldType === "password" ? "text" : "password";
        }

    },
    created() {
        //this.$toastr.s("warning","Üyeliğin pasif yapıldı.");

    },
    mounted() {
        $(this.$refs.confiraccountdeletionmodal).on("hidden.bs.modal", this.HiddenConfiraccountdeletionmodal)
        this.$nextTick(() => {

        })
    },
    beforeDestroy() {
    },
    watch: {

    },
});