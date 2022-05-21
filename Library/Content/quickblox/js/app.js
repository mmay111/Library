;(function(window, QB, app, CONFIG, $, Backbone) {
    'use strict';

    $(function () {
        var conservationTime=null;
        var sounds = {
            'call': 'callingSignal',
            'end': 'endCallSignal',
            'rington': 'ringtoneSignal'
        };

        var recorder = null;
        var recorderTimeoutID;

        var recorderOpts = {
            onstart: function onStartRecord() {
                $('.j-record').addClass('active');

                recorderTimeoutID = setTimeout(function() {
                    if(recorder) {
                        recorder.stop();
                    }
                }, 600000); // 10min
            },
            onstop: function(blob) {
                $('.j-record').removeClass('active');

                var down = confirm('Do you want to download video?');

                if (down) {
                    recorder.download('QB_WEBrtc_sample' + Date.now(), blob);
                }

                recorder = null;
                clearTimeout(recorderTimeoutID);
            },
            onerror: function(error) {
                console.error('Recorder error', error);
            }
        };
        var isAudio = false;
        var ui = {
            'income_call': '#videoCall',
            'filterSelect': '.j-filter',
            'videoSourceFilter': '.j-video_source',
            'audioSourceFilter': '.j-audio_source',
            'bandwidthSelect': '.j-bandwidth',
            'insertOccupants': function(empty = true) {
                var $occupantsCont = $('.j-users');

                function cb($cont, res, empty) {
                    if(empty){
                        $cont.empty();
                    }
                    $cont.append(res).removeClass('wait');
                }

                return new Promise(function(resolve, reject) {
                    $occupantsCont.addClass('wait');
                    app.helpers.renderUsers().then(function(res) {
                        cb($occupantsCont, res.usersHTML,empty);
                        resolve(res.users);
                    }, function(error) {
                        if(empty){
                            cb($occupantsCont, error.message, empty);
                        }else{
                            $occupantsCont.removeClass('wait');
                            app.helpers.renderUsers.stop = true;
                        }
                        reject('Not found users');
                    });
                });
            }
            };

        QB.init(
         CONFIG.CREDENTIALS.appId,
         CONFIG.CREDENTIALS.authKey,
         CONFIG.CREDENTIALS.authSecret,
         CONFIG.APP_CONFIG
     );
        var statesPeerConn = _.invert(QB.webrtc.PeerConnectionState);
        if (!QB.webrtc) {
            alert('Error: ' + CONFIG.MESSAGES.webrtc_not_avaible);
            return;
        }

        if (!_.isEmpty(app.caller)) {
            //app.router.navigate('dashboard');
            return false;
        }

        //this.container
        //    .removeClass('page-dashboard')
        //    .addClass('page-join');

        app.helpers.setFooterPosition();

        app.caller = {};
        app.callees = {};
        app.calleesAnwered = [];
        app.calleesRejected = [];
        app.users = [];

        var user = JSON.parse(localStorage.getItem('data'));
         
        if (user) {
            $('.j-join__username').val(user.username);
        }
        var call = {
            callTime: 0,
            callTimer: null,
            updTimer: function() {
                this.callTime += 1000;

                $('#timer').removeClass('invisible')
                    .text( new Date(this.callTime).toUTCString().split(/ /)[4] );
            }
        };

        var remoteStreamCounter = 0;

        fillMediaSelects();
        var newUserID= parseInt($("[id$=hdnCurrentUserID]").val());
        var data={"username": "um_"+newUserID,"login":"topm"+newUserID,"externaluserid":newUserID};
        localStorage.setItem('data', JSON.stringify(data));

        /** Check internet connection */
        if(!window.navigator.onLine) {
            alert(CONFIG.MESSAGES['no_internet']);
            return false;
        }

        if(localStorage.getItem('isAuth')) {
            //$('#already_auth').modal();
            //return false;
        }

        app.helpers.join(data).then(function(user) {
            app.caller = user;
            QB.chat.connect({
                jid: QB.chat.helpers.getUserJid( app.caller.id, CONFIG.CREDENTIALS.appId ),
                password: 'quickblox'
            }, function(err, res) {
                if(err) {
                    if(!_.isEmpty(app.currentSession)) {
                        app.currentSession.stop({});
                        app.currentSession = {};
                    }

                    app.helpers.changeFilter('#localVideo', 'no');
                    app.helpers.changeFilter('#main_video', 'no');
                    app.mainVideo = 0;

                    $(ui.filterSelect).val('no');
                    app.calleesAnwered = [];
                    app.calleesRejected = [];
                    if(call.callTimer) {
                        $('#timer').addClass('invisible');
                        clearInterval(call.callTimer);
                        call.callTimer = null;
                        call.callTime = 0;
                        app.helpers.network = {};
                    }
                } else {

                    localStorage.setItem('isAuth', true);
                    //app.router.navigate('dashboard', { trigger: true });
                }
            });
        }).catch(function(error) {
            try {
                if(typeof error.message == "string"){
                    $('#join_err').find('.error',0).text(error.message);
                }else {
                    $('#join_err').find('.error', 0).text(error.message.errors.base[0]);
                }
            }catch (e) {
                console.log(error);
            }
            $('#join_err').modal();
        });
        $(document).on('click', '.j-caller__ctrl', function() {
            var $btn = $(this),
                isActive = $btn.hasClass('active');

            if( _.isEmpty(app.currentSession) || $btn.data('target') == 'screen') {
                return false;
            }

            if(isActive) {
                $btn.removeClass('active');
              
                app.currentSession.unmute( $btn.data('target') );
                if($btn.data('target')=='video')
                {
                    $('.j-caller__ctrl[data-target="'+$btn.data('target')+'"] img').attr('src','https://img.icons8.com/ios/30/000000/video-call.png').attr("title","Kamerayı kapat");
                }
                else{
                    $('.j-caller__ctrl[data-target="'+$btn.data('target')+'"] img').attr('src','https://img.icons8.com/ios-glyphs/30/000000/microphone.png').attr("title","Mikrofonu kapat");
                }
              
            } else {
                
                $btn.addClass('active');
                app.currentSession.mute( $btn.data('target') );
                if($btn.data('target')=='video')
                {
                    $('.j-caller__ctrl[data-target="'+$btn.data('target')+'"] img').attr('src','https://img.icons8.com/ios/30/000000/no-video.png').attr("title","Kamerayı aç");
                }
                else{
                    $('.j-caller__ctrl[data-target="'+$btn.data('target')+'"] img').attr('src','https://img.icons8.com/ios-glyphs/30/000000/no-microphone.png').attr("title","Mikrofonu aç");
                }
              
            }

        });
        $(document).on('click', '.btn-end-call,.returnchat', function () {

            if ($(this).hasClass("calling")) {
                if (!_.isEmpty(app.currentSession)) {
           
                    if (recorder && recorderTimeoutID) {
                        recorder.stop();
                    }
                    app.currentSession.stop({});
                    app.currentSession = {};

                    app.helpers.setFooterPosition();
                    $("#video-content" ).remove();
                    $(".btn.call-actions.video-call").show();
                    $("#onvideocall").modal("hide");
       
                    $(".btn-end-call").hide();

                    return false;
                }
            }
            else{
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'exit-queueconversation',
                        cancelButton: 'continue-queueconversation'
                    },
                    buttonsStyling: false
                })
                swalWithBootstrapButtons.fire({
                    text: "Video görüşmeyi sonlandırdığınızda chat ekranına dönüş yaparsınız. Görüşmeye yazılı olarak devam edebilirsiniz.",
                    //icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ONAYLA',
                    cancelButtonText: 'VAZGEÇ<i class="btn-arrow"></i>',
                    reverseButtons: false
                }).then((result) => {
                    if (result.value) {
                        if (!_.isEmpty(app.currentSession)) {
           
                            if (recorder && recorderTimeoutID) {
                                recorder.stop();
                            }
                            app.currentSession.stop({});
                            app.currentSession = {};

                            app.helpers.setFooterPosition();
                            $("#video-content" ).remove();
                            $(".btn.call-actions.video-call").show();
                            $("#onvideocall").modal("hide");
       
                            $(".btn-end-call").hide();

                            return false;
                        }
                  
                    }
                });
            }
           
            //if (!_.isEmpty(app.currentSession)) {
           
            //    if (recorder && recorderTimeoutID) {
            //        recorder.stop();
            //    }
            //    app.currentSession.stop({});
            //    app.currentSession = {};

            //    app.helpers.setFooterPosition();
            //    $("#video-content" ).remove();
            //    $(".btn.call-actions.video-call").show();
            //    $("#onvideocall").modal("hide");
       
            //    $(".btn-end-call").hide();

            //    return false;
            //}

        });
        $(document).on('click', '.j-decline', function() {
            if (!_.isEmpty(app.currentSession)) {
                app.currentSession.reject({});
           
                $(ui.income_call).modal('hide');
                document.getElementById(sounds.rington).pause();
            }
        });

        $(document).on('click', '.j-accept', function() {
            isAudio = app.currentSession.callType === QB.webrtc.CallType.AUDIO;

            var $videoSourceFilter = $(ui.videoSourceFilter),
                $audioSourceFilter = $(ui.audioSourceFilter),
                mediaParams;

            if(isAudio){
              
            } else {
                mediaParams = {
                    audio: {
                        deviceId: $audioSourceFilter.val() ? $audioSourceFilter.val() : undefined
                    },
                    video: {
                        deviceId: $videoSourceFilter.val() ? { exact: $videoSourceFilter.val() } : undefined
                    },
                    elemId: 'localVideo',
                    options: {
                        muted: true,
                        mirror: true
                    }
                };

                //document.querySelector('.j-actions[data-call="audio"]').setAttribute('hidden', true);
            }

            var videoElems = '';

            $(ui.income_call).modal('hide');
            document.getElementById(sounds.rington).pause();

            app.currentSession.getUserMedia(mediaParams, function(err, stream) {
                if (err || !stream.getAudioTracks().length || (isAudio ? false : !stream.getVideoTracks().length)) {
                    var errorMsg = '';
                    app.currentSession.stop({});
                    $(".btn.call-actions.video-call").show();
                    //app.helpers.stateBoard.update({
                    //    'title': 'tpl_device_not_found',
                    //    'isError': 'qb-error',
                    //    'property': {
                    //        'name': app.caller.full_name
                    //    }
                    //});
                } else {

                    app.currentSession.attachMediaStream('main_video', stream);
                    $('#modal-video').modal();
                    $(".btn-end-call").show();

                    //var opponents = [app.currentSession.initiatorID],
                    //    compiled = _.template( $('#callee_video').html() );

                    //$('.j-actions').addClass('hangup');
                    $(ui.bandwidthSelect).attr('disabled', true);

                    /** get all opponents */
                    //app.currentSession.opponentsIDs.forEach(function(userID, i, arr) {
                    //    if(userID != app.currentSession.currentUserID){
                    //        opponents.push(userID);
                    //    }
                    //});
                    //opponents.forEach(function(userID, i, arr) {

                    //    var peerState = app.currentSession.connectionStateForUser(userID),
                    //        userInfo = _.findWhere(app.users, {'id': +userID});
                    //    if( (document.getElementById('remote_video_' + userID) === null) ) {
                    //        videoElems += compiled({
                    //            'userID': userID,
                    //            'name': userInfo ? userInfo.full_name : 'userID ' + userID,
                    //            'state': app.helpers.getConStateName(peerState)
                    //        });

                    //        if(peerState === QB.webrtc.PeerConnectionState.CLOSED){
                    //            app.helpers.toggleRemoteVideoView(userID, 'clear');
                    //        }
                    //    }
                    //});
                    //$('.j-callees').append(videoElems);
                    //app.helpers.stateBoard.update({
                    //    'title': 'tpl_during_call',
                    //    'property': {
                    //        'name': app.caller.full_name
                    //    }
                    //});
                    app.helpers.setFooterPosition();
                    app.currentSession.accept({});
                }
            });
        });
        $(document).on('click','.btn-savenotes',function () {
            console.log("clicked btn-savenotes")
            var _candidateId=$(".btn-savenotes").data("candidateId");
            var notes= $("#videoscreen-conversationnote").val();
            $.ajax({
                url: "/Company/OnlineCareerFair/SaveNote",
                type: "Post",
                data: { candidateId: _candidateId, Note: notes, networkingID: $('#Networking_NetworkingID').val() },
                success: function (data) {
                    if (data != null) {
                        if (data.Status == 200) {
                            toastr.success("Notunuz kaydedildi.")
                            console.log("200")
                        }
                        else {
                     
                        }
                    }
                },
            });
        })
      
        $(document).on('click', '.video-call', function () {
            var candidateUserPhoto = $("li.contact.active img.user-photo").attr("src");
            var candidateUserName = $(".contact.active .info .name").html();
            //var tmplM = {
            //    photo: candidateUserPhoto,
            //    candidateUserName: candidateUserName
            //}
           
            $(".c-name").empty().text(candidateUserName);
            $("#onvideocall .photo").attr("src",candidateUserPhoto);

            $("#onvideocall").modal('show');
            $(".btn-end-call").show();

            //$("#tmpl-calling-video").tmpl(tmplM).appendTo("#mesgs #messaagedetail");
            var userId= $("li.contact.active").prop("id");

            var login="topc"+userId;
            var searchParams = {login: login};
            QB.users.get(searchParams, function(error, user){
                app.callees[user.id] = candidateUserName;
                if(error)
                {

                }
                else{
                    var $btn = $(this),
                $videoSourceFilter = $(ui.videoSourceFilter),
                $audioSourceFilter = $(ui.audioSourceFilter),
                $bandwidthSelect = $(ui.bandwidthSelect),
                bandwidth = 2048,
                videoElems = '',
                mediaParams = {
                    'audio': {
                        deviceId: $audioSourceFilter.val() ? $audioSourceFilter.val() : undefined
                    },
                    'video': {
                        deviceId: $videoSourceFilter.val() ? { exact: $videoSourceFilter.val() } : undefined
                    },
                    'options': {
                        'muted': true,
                        'mirror': true
                    },
                    'elemId': 'localVideo'
                };

                    /** Hangup */
                    if ($btn.hasClass('hangup')) {
                        if (!_.isEmpty(app.currentSession)) {

                            if (recorder && recorderTimeoutID) {
                                recorder.stop();

                            }

                            app.currentSession.stop({});
                            app.currentSession = {};
                            $(".btn.call-actions.video-call").show();
                            //app.helpers.stateBoard.update({
                            //    'title': 'tpl_default',
                            //    'property': {
                            //        'name':  app.caller.full_name,
                            //    }
                            //});

                            app.helpers.setFooterPosition();

                            return false;
                        }
                    } else {
                        /** Check internet connection */
                        //if(!window.navigator.onLine) {
                        //    app.helpers.stateBoard.update({'title': 'no_internet', 'isError': 'qb-error'});
                        //    return false;
                        //}

                        /** Check callee */
                        if (_.isEmpty(app.callees)) {
                            $('#error_no_calles').modal();
                            return false;
                        }


                        isAudio = $btn.data('call') === 'audio';
                        app.currentSession = QB.webrtc.createNewSession(Object.keys(app.callees), isAudio ? QB.webrtc.CallType.AUDIO : QB.webrtc.CallType.VIDEO, null, { 'bandwidth': bandwidth });
                        app.currentSession.getUserMedia(mediaParams, function (err, stream) {

                            if (err || !stream.getAudioTracks().length || (isAudio ? false : !stream.getVideoTracks().length)) {
                                var errorMsg = '';
                                app.currentSession.stop({});

                            } else {
                                var callParameters = {};

                                if (isAudio) {
                                    callParameters.callType = 2;
                                }

                                // Call to users
                                //
                                var pushRecipients = [];
                                app.currentSession.call({}, function () {

                                    if (!window.navigator.onLine) {
                                        console.log("window.navigator.onLine")
                                        app.currentSession.stop({});

                                    } else {
                                        //var compiled = _.template( $('#callee_video').html() );

                                        //app.helpers.stateBoard.update({'title': 'calling'});
                                        //<button class="btn call-actions video-call"  data-call="video"><i class="fa fa-video-camera" aria-hidden="true"></i></button>
                                        document.getElementById(sounds.call).play();

                                        Object.keys(app.callees).forEach(function (id, i, arr) {
                                            pushRecipients.push(id);
                                        });

                                        //$('.j-callees').append(videoElems);

                                        //$bandwidthSelect.attr('disabled', true);
                                        ////$btn.addClass('hangup');
                                        $(".btn.call-actions.video-call").hide();
                                        $(".btn-end-call").show();
                                        $("#local-videocontent").show();
                                        app.helpers.setFooterPosition();
                                    }
                                });

                                // and also send push notification about incoming call
                                // (corrently only iOS/Android users will receive it)
                                //
                                //var params = {
                                //    notification_type: 'push',
                                //    user: { ids: pushRecipients },
                                //    environment: 'development', // environment, can be 'production' as well.
                                //    message: QB.pushnotifications.base64Encode(JSON.stringify({
                                //        "message": app.caller.full_name + " is calling you",
                                //        "ios_voip": "1",
                                //        "VOIPCall": "1"
                                //    }))
                                //};
                                ////
                                //console.log("Run push notification")
                                //QB.pushnotifications.events.create(params, function (err, response) {
                                //    if (err) {
                                //        console.log(err);
                                //    } else {
                                //        // success
                                //        console.log("Push Notification is sent.");
                                //    }
                                //});


                            }
                        });
                    }
                }
            });
          
    
            
        });
        function extractuserId(username) {
            var userId=0;
            if(username.indexOf("uc_")!=-1)
            {
                userId=  username.substring(3, username.length);
            }
            return userId;
        }
        QB.webrtc.onCallListener = function onCallListener(session, extension) {
            console.group('onCallListener.');
            console.log('Session: ', session);
            console.log('Extension: ', extension);
            console.groupEnd();

            app.currentSession = session;
            console.log(session)
            QB.users.get(Number(session.initiatorID), function(error, user){

                if (error) {
                    console.log(error);
                } else {
                    app.users = app.users.filter(function (item) {
                        return user.id !== item.id;
                    });
                    app.users.push(user);
                    /** close previous modal */
                    $(ui.income_call).modal('hide');
                    console.log("user")

                    console.log(user);
                    var qbcustomUserId=  extractuserId(user.full_name);
                    
                    var username="deff";
                    var photo="";
                    if(qbcustomUserId)
                    {
                        username=  $("#"+qbcustomUserId).find('.name').html();
                        photo=$("#" + qbcustomUserId).find('.user-photo').attr('src');
                    }
                   
                    $('.j-ic_initiator').text(username);
                    $('.j-ic_initiator-photo').attr('src',photo);

                    // check the current session state
                    if (app.currentSession.state !== QB.webrtc.SessionConnectionState.CLOSED){
                        $(ui.income_call).modal('show');
                        document.getElementById(sounds.rington).play();
                    }
                }
            });
        };
        QB.webrtc.onSessionCloseListener = function onSessionCloseListener(session){
            console.log('onSessionCloseListener: ', session);

            document.getElementById(sounds.call).pause();
            document.getElementById(sounds.end).play();
            $("#modal-video").modal("hide");
            $('.j-caller__ctrl').removeClass('active');
            $('.j-caller__ctrl[data-target="video"] img').attr('src','https://img.icons8.com/ios/30/000000/video-call.png').attr("title","Kamerayı kapat");
            $('.j-caller__ctrl[data-target="audio"] img').attr('src','https://img.icons8.com/ios-glyphs/30/000000/microphone.png').attr("title","Mikrofonu kapat");

            $("#videoCall").modal("hide");
            document.getElementById(sounds.rington).pause();
            //$('#chat-content .qb-video').hide();
            $(".btn-end-call").hide();
            clearInterval(conservationTime);
            
            //$(".btn.call-actions.video-call").show();
            //$('.call-actions').removeClass('hangup');
            $(ui.bandwidthSelect).attr('disabled', false);

            app.currentSession.detachMediaStream('main_video');
            app.currentSession.detachMediaStream('localVideo');

            remoteStreamCounter = 0;

            if(session.opponentsIDs.length > 1) {
                //app.helpers.stateBoard.update({
                //    'title': 'tpl_call_stop',
                //    'property': {
                //        'name': app.caller.full_name
                //    }
                //});
            } else {
                //app.helpers.stateBoard.update({
                //    title: 'tpl_default',
                //    property: {
                //        'name':  app.caller.full_name,
                //    }
                //});
            }
            if(document.querySelector('.j-actions[hidden]')){
                document.querySelector('.j-actions[hidden]').removeAttribute('hidden');
            }
            if(document.querySelector('.j-caller__ctrl')){
                document.querySelector('.j-caller__ctrl').removeAttribute('hidden');
            }

        };
        QB.webrtc.onStopCallListener = function onStopCallListener(session, userId, extension) {
            console.group('onStopCallListener.');
            console.log('UserId: ', userId);
            console.log('Session: ', session);
            console.log('Extension: ', extension);
            console.groupEnd();

            //$('#chat-content .qb-video').hide();
            $("#modal-video").modal("hide");
            $(".btn-end-call").hide();
            $(ui.income_call).modal('hide');
            document.getElementById(sounds.rington).pause();
            $(".btn.call-actions.video-call").show();
            //app.helpers.notifyIfUserLeaveCall(session, userId, 'hung up the call', 'Hung Up');

            if(recorder) {
                recorder.stop();
            }
        };
        QB.webrtc.onRejectCallListener = function onRejectCallListener(session, userId, extension) {
            console.log('onRejectCallListener.');
            //$('#chat-content .qb-video').hide();
            $("#modal-video").modal("hide");
            $(".btn-end-call").hide();
            $("#onvideocall").modal("hide");
            $(".btn.call-actions.video-call").show();

            //if(app.currentSession.ID !== session){
            //    console.log("onRejectCallListener11")
            //    return;
            //}
            console.group('onRejectCallListener.');
            console.log('UserId: ' + userId);
            console.log('Session: ' + session);
            console.log('Extension: ' + JSON.stringify(extension));
            console.groupEnd();

            var user = _.findWhere(app.users, {'id': +userId}),
                userCurrent = _.findWhere(app.users, {'id': +session.currentUserID});

            /** It's for p2p call */
            if(session.opponentsIDs.length === 1) {
                //app.helpers.stateBoard.update({
                //    'title': 'p2p_call_stop',
                //    'property': {
                //        'name': user.full_name,
                //        'currentName': userCurrent.full_name,
                //        'reason': 'rejected the call'
                //    }
                //});
            } else {
                app.calleesRejected.push(userInfo);
            }
        };
        QB.webrtc.onRemoteStreamListener = function onRemoteStreamListener(session, userId, stream) {
            console.group('onRemoteStreamListener.');
            console.log('userId: ', userId);
            console.log('Session: ', session);
            console.log('Stream: ', stream);
            console.groupEnd();

            var state = app.currentSession.connectionStateForUser(userId),
                peerConnList = QB.webrtc.PeerConnectionState;

            if(state === peerConnList.DISCONNECTED || state === peerConnList.FAILED || state === peerConnList.CLOSED) {
              
                return false;
            }

            app.currentSession.peerConnections[userId].stream = stream;

            console.info('onRemoteStreamListener add video to the video element', stream);

            app.currentSession.attachMediaStream('main_video', stream);
          
            //if( remoteStreamCounter === 0) {
            //    app.currentSession.attachMediaStream('main_video', stream);

            //    app.mainVideo = userId;
            //    ++remoteStreamCounter;
            //}
            if(!call.callTimer) {
                call.callTimer = setInterval( function(){ call.updTimer.call(call); }, 1000);
            }

            $('.frames_callee__bitrate').show();
        };
        QB.webrtc.onUserNotAnswerListener = function onUserNotAnswerListener(session, userId) {
            console.group('onUserNotAnswerListener.');
            console.log('UserId: ', userId);
            console.log('Session: ', session);
            console.groupEnd();

            var opponent = _.findWhere(app.users, {'id': +userId});

            /** It's for p2p call */
            if(session.opponentsIDs.length === 1) {
                //$('#chat-content .qb-video').hide();
                $("#modal-video").modal("hide");
                $(".btn.call-actions.video-call").show();

                $("#onvideocall").modal("hide");
                $(".btn-end-call").hide();
                //app.helpers.stateBoard.update({
                //    'title': 'p2p_call_stop',
                //    'property': {
                //        'name': opponent.full_name,
                //        'currentName': app.caller.full_name,
                //        'reason': 'not answered'
                //    }
                //});
            } else {
            }
        };
        QB.webrtc.onAcceptCallListener = function onAcceptCallListener(session, userId, extension) {
            console.group('onAcceptCallListener.');
            console.log('UserId: ', userId);
            console.log('Session: ', session);
            console.log('Extension: ', extension);
            console.groupEnd();

            var userInfo = _.findWhere(app.users, {'id': +userId}),
                filterName = $.trim( $(ui.filterSelect).val() );

            document.getElementById(sounds.call).pause();
            //app.currentSession.update({'filter': filterName});

            /** update list of callee who take call */
            app.calleesAnwered.push(userInfo);



            //$('.qb-video').show();
            $("#modal-video").modal();
            $("#modal-video .video-user-sidebar").empty();
            var copyContent=document.querySelector("#gorusulen li.contact.active");
            //var copyContent = document.querySelector('.contact-profile');

            var clone=copyContent.cloneNode(true);

            var pasteContent = document.querySelector('#modal-video .video-user-sidebar');
            //var pasteContent = document.querySelector('.contact-profile .col-md-7.col-6');
            pasteContent.innerHtml="";
            pasteContent.appendChild(clone);
            //$("#local-videocontent").show();
            conservationTime= setInterval(function () {
              
                var copyTime=$("#gorusulen li.contact.active .time");
                var timeClass= copyTime.attr("class");
                $("#modal-video .video-user-sidebar .time").removeClass("red").addClass(timeClass).html(copyTime.clone().html());
               

            }, 1000);
            $("#modal-video .sidebar-buttons").empty();
            $(".taketime").clone().appendTo("#modal-video .sidebar-buttons");

            var btnReeturnChatText='CHAT'+"'"+'E DÖN';
            var btnReturnChat=$('<a class="returnchat btn" href="javascript:void(0);" >'+btnReeturnChatText+'</a>');
            btnReturnChat.appendTo("#modal-video .sidebar-buttons");

            $(".btn-endconversation").clone().appendTo("#modal-video .sidebar-buttons").addClass("confirmendconversation").removeClass("btn-endconversation");

      

            $("#modal-video .confirmendconversation").addClass("btn").removeClass("d-flex").removeClass("justify-content-end").removeClass("mr-md-0").removeClass("mr-6");

            var $candidateinfo=$(".candidateinfo");
            var eduLevel=$candidateinfo.find(".cedu-level").text();
            var eduUni=$candidateinfo.find(".cedu-uni").text();
            var eduProg=$candidateinfo.find(".cedu-prog").text();
            var eduStartDate=$candidateinfo.find(".cedu-startdate").text();
            var eduFinishDate=$candidateinfo.find(".cedu-finishdate").text();
            var eduScore=$candidateinfo.find(".cedu-score").text();
            var positionLevel=$candidateinfo.find(".cpositionlevel-value").text();
            var departments=$candidateinfo.find(".cpositionlevel-departments").text();


            var $videoCanInfo=$(".u-infos");
            $videoCanInfo.find(".edu-level").text(eduLevel);
            $videoCanInfo.find(".edu-uni").text(eduUni);
            $videoCanInfo.find(".edu-prog").text(eduProg);
            $videoCanInfo.find(".edu-startdate").text(eduStartDate);
            $videoCanInfo.find(".edu-finishdate").text(eduFinishDate);
            $videoCanInfo.find(".edu-score").text(eduScore);
            $videoCanInfo.find(".positionlevel-value").text(positionLevel);
            $videoCanInfo.find(".positionlevel-departments").text(departments);
            var candidateId=$("#gorusulen li.contact.active").attr("id");
            $(".btn-savenotes").data("candidateId",candidateId);
            GetCandidateNote(candidateId);



            //var conversationid=copyContent.data("conversationid");
            //chat.server.GetConversation(conversationid).then(function (thisConversation) {
            //    console.log("unblocked")
             
            //    if (thisConversation && thisConversation.CandidateConnectDate > 0) {
            //        var timeId = "timevideo" + thisConversation.CandidateID;
            //        setTimeout(function () {
            //            //var deadline = new Date(1570458711000); 
            //            var deadline = new Date(Date.parse(new Date()) + conversation.RemainingTime);
            //            //var deadline = new Date(conversation.FinishDateTimeTimeStamp);
            //            console.log(deadline);
            //            console.log(conversation.FinishDateTimeTimeStamp);
            //            //var deadline = new Date(1570458711000);
            //            initializeClock(timeId, userId, deadline);
            //        });
            //    }
            //});
         
            //$("li.contact.active").clone().appendTo("#modal-video .video-user-sidebar" );
            $('#onvideocall').modal("hide");

        };
        QB.webrtc.onSessionConnectionStateChangedListener = function onSessionConnectionStateChangedListener(session, userId, connectionState) {
            console.group('onSessionConnectionStateChangedListener.');
            console.log('UserID:', userId);
            console.log('Session:', session);
            console.log('Сonnection state:', connectionState, statesPeerConn[connectionState]);
            console.groupEnd();

            var connectionStateName = _.invert(QB.webrtc.SessionConnectionState)[connectionState],
                $calleeStatus = $('.j-callee_status_' + userId),
                isCallEnded = false;

            if(connectionState === QB.webrtc.SessionConnectionState.CONNECTING) {
                $calleeStatus.text(connectionStateName);
            }

            if(connectionState === QB.webrtc.SessionConnectionState.CONNECTED) {
                app.helpers.toggleRemoteVideoView(userId, 'show');
                $calleeStatus.text(connectionStateName);
                $(".btn.call-actions.video-call").show();
            }

            if(connectionState === QB.webrtc.SessionConnectionState.COMPLETED) {
                app.helpers.toggleRemoteVideoView(userId, 'show');
                $calleeStatus.text('connected');
            }

            if(connectionState === QB.webrtc.SessionConnectionState.DISCONNECTED) {
                app.helpers.toggleRemoteVideoView(userId, 'hide');
                $calleeStatus.text('disconnected');
            }

            if(connectionState === QB.webrtc.SessionConnectionState.CLOSED){
                app.helpers.toggleRemoteVideoView(userId, 'clear');

                if(app.mainVideo === userId) {
                    $('#remote_video_' + userId).removeClass('active');
                    app.helpers.changeFilter('#main_video', 'no');
                    app.mainVideo = 0;
                    for(var key in app.currentSession.peerConnections){
                        if(key != userId
                            && app.currentSession.peerConnections[key].stream !== undefined
                            && app.currentSession.peerConnections[key].stream.active) {
                            app.currentSession.attachMediaStream('main_video', app.currentSession.peerConnections[key].stream);
                            app.mainVideo = key;
                            break;
                        }
                    }
                }

                if( !_.isEmpty(app.currentSession) ) {
                    if ( Object.keys(app.currentSession.peerConnections).length === 1 || userId === app.currentSession.initiatorID) {
                        $(ui.income_call).modal('hide');
                        document.getElementById(sounds.rington).pause();
                    }
                }

                isCallEnded = _.every(app.currentSession.peerConnections, function(i) {
                    return i.iceConnectionState === 'closed';
                });

                /** remove filters */

                if( isCallEnded ) {
                    app.helpers.changeFilter('#localVideo', 'no');
                    app.helpers.changeFilter('#main_video', 'no');
                    $(ui.filterSelect).val('no');

                    app.calleesAnwered = [];
                    app.calleesRejected = [];
                    app.network[userId] = null;
                }

                if (app.currentSession.currentUserID === app.currentSession.initiatorID && !isCallEnded) {
                    var userInfo = _.findWhere(app.users, {'id': +userId});

                    /** get array if users without user who ends call */
                    app.calleesAnwered = _.reject(app.calleesAnwered, function(num){ return num.id === +userId; });
                    app.calleesRejected.push(userInfo);

                    app.helpers.stateBoard.update({
                        'title': 'tpl_call_status',
                        'property': {
                            'users': app.helpers.getUsersStatus()
                        }
                    });
                }

                if( _.isEmpty(app.currentSession) || isCallEnded ) {
                    if(call.callTimer) {
                        $('#timer').addClass('invisible');
                        clearInterval(call.callTimer);
                        call.callTimer = null;
                        call.callTime = 0;
                        app.helpers.network = {};
                    }
                }
            }
        };
        function StopSession() {
            if (typeof app !== 'undefined' && !_.isEmpty(app.currentSession)) {

                app.currentSession.stop({});
                app.currentSession = {};
                $("#video-content").remove();
                $(".btn.call-actions.video-call").show();
                $("#onvideocall").modal("hide");

                $(".btn-end-call").hide();

            }
    
        }
        function showMediaDevices(kind) {
            return new Promise(function(resolve, reject) {
                QB.webrtc.getMediaDevices(kind).then(function(devices) {
                    var isVideoInput = (kind === 'videoinput'),
                        $select = isVideoInput ? $(ui.videoSourceFilter) : $(ui.audioSourceFilter);

                    $select.empty();

                    if (devices.length) {
                        for (var i = 0; i !== devices.length; ++i) {
                            var deviceInfo = devices[i],
                                option = document.createElement('option');

                            option.value = deviceInfo.deviceId;

                            if (deviceInfo.kind === kind) {
                                option.text = deviceInfo.label || (isVideoInput ? 'Camera ' : 'Mic ') + (i + 1);
                                $select.append(option);
                            }
                        }

                        $('.j-media_sources').removeClass('invisible');
                    } else {
                        $('.j-media_sources').addClass('invisible');
                    }
                
                    resolve();
                }).catch(function(error) {
                    console.warn('getMediaDevices', error);

                    reject();
                });
            });
        }
        function fillMediaSelects() {
            return new Promise(function(resolve, reject) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                }).then(function(stream) {
                    showMediaDevices('videoinput').then(function() {
                        return showMediaDevices('audioinput');
                    }).then(function() {
                        stream.getTracks().forEach(function(track) {
                            track.stop();
                        });
                        
                        resolve();
                    });
                }).catch(function(error) {
                    console.warn('Video devices were shown without names (getUserMedia error)', error);
                    
                    showMediaDevices('videoinput').then(function() {
                        return showMediaDevices('audioinput');
                    }).then(function() {
                        resolve();
                    });
                });
            });
        }
        function GetCandidateNote(candidateId) {
            $.get("/Company/OnlineCareerFair/GetCandidateNote?candidateId=" + candidateId, function (res) {
                console.log(res.Notes);
                $("#videoscreen-conversationnote").val(res.Notes);
            });
        }
        
        function switchMediaTracks() {

            var localVideo = document.getElementById('localVideo');
            if ( (typeof localVideo == "object" && !localVideo.srcObject) || !app.currentSession) {
                return true;
            }

            var audioDeviceId = $(ui.audioSourceFilter).val() ? $(ui.audioSourceFilter).val() : undefined,
                videoDeviceId = $(ui.videoSourceFilter).val() ? { exact: $(ui.videoSourceFilter).val() } : undefined,
                deviceIds = {
                    audio: audioDeviceId,
                    video: videoDeviceId
                };

            var callback = function(err, stream) {
                if (err || (!stream.getAudioTracks().length && !stream.getVideoTracks().length)) {
                    app.currentSession.stop({});

                    app.helpers.stateBoard.update({
                        'title': 'tpl_device_not_found',
                        'isError': 'qb-error',
                        'property': {
                            'name': app.caller.full_name
                        }
                    });
                }
            };

            app.currentSession.switchMediaTracks(deviceIds, callback);
        }
    });


}(window, window.QB, window.app, window.CONFIG,  jQuery, Backbone));

