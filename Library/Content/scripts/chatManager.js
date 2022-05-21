var chat;
var chatting = false;
var conversationId = 0;
var chattingUserID = 0;
var height = 0;
var chatSignalrUrl;
var finishedConversationQueue = [];
var timeintervals = [];
var blockhtml = '<div class="loading-message"><div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';
var canVideoCall = false;

var blockOptions = {
    message: blockhtml,
    baseZ: 1000,
    centerY: true,
    css: {
        top: '10%',
        border: '0',
        padding: '0',
        backgroundColor: 'transparent'
    },
    overlayCSS: {
        backgroundColor: 'transparent',
        cursor: 'wait'
    }
};

window.addEventListener("focus", handleBrowserState.bind(document, true));
window.addEventListener("blur", handleBrowserState.bind(document, false));
var browserState = true;
function handleBrowserState(isActive) {
    browserState = isActive;
}
$(document).ready(function () {
    if (document.getElementById('canVideoCall').value == "true")
    {
        canVideoCall = true;
    }

    $(".sidebar-toggler").click();
    $("#mesgs").on("click", ".showcandidateinfo", function () {
        $(".contact-profile").toggleClass("show");
        $(this).find("div").removeClass("rectangle2").removeClass("rectangle");

        if ($(".contact-profile.show").length > 0) {
            $(this).find("div:first").addClass("rectangle2");
            $(this).find("div:nth-child(2)").addClass("rectangle");
        }
        else {
            $(this).find("div:first").addClass("rectangle");
            $(this).find("div:nth-child(2)").addClass("rectangle2");


        }
        console.log("105100")

    })
    setInterval(ResetTypingFlag, 3000);
    chatSignalrUrl = document.getElementById('chatSignalrUrl').value;

    // Declare a proxy to reference the hub. 
    $.connection.hub.url = chatSignalrUrl + "/signalr";
    chat = $.connection.chatHub;
    $.connection.hub.logging = true;
    chat.state.networkingID = $("#Networking_NetworkingID").val();
    chat.state.networkingUrlValue = $("#Networking_UrlValue").val();
    //$.connection.hub.reconnecting(function () {
    //    alert("reconnecting")
    //});

    //$.connection.hub.reconnected(function () {
    //    alert("reconnected")
    //});
    registerClientMethods(chat);
    // Start Hub
    console.log("Start Hub")
    $.connection.hub.start().done(function () {
        //toastr.info('Now connected, connection ID=' + $.connection.hub.id);
        //toastr.info("Connected, transport = " + $.connection.hub.transport.name);
        //toastr.success("Connected, transport = " + $.connection.hub.transport.name);
        console.log('Now connected, connection ID=' + $.connection.hub.id);
        console.log("Connected, transport = " + $.connection.hub.transport.name);
        registerEvents(chat);
        toastr.success(Res.Others.ConnectedMessage);

    }).fail(function (error) {
        //toastr.info('Invocation of ChatMessage failed. Error: ' + error)
        console.log('Invocation of ChatMessage failed. Error: ' + error);
    });
    $.connection.hub.disconnected(function () {
        $("#profile span.contact-status").removeClass("online");
        //toastr.warning("Connection disconnected. Reconnecting...");

        setTimeout(function () {
            $.connection.hub.start().done(function () {
                //toastr.info('Now reconnected, connection ID=' + $.connection.hub.id);
                //toastr.info("ReConnected, transport = " + $.connection.hub.transport.name);
                //toastr.success("ReConnected, transport = " + $.connection.hub.transport.name);

                console.log('Now reconnected, connection ID=' + $.connection.hub.id);
                console.log("ReConnected, transport = " + $.connection.hub.transport.name);
                registerEvents(chat);
            }).fail(function (error) {
                console.log('Invocation of ChatMessage failed. Error: ' + error);
            });
        }, 3000); // Restart connection after 3 seconds.
    });
    chat.client.ReceiveTypingRequest = function (userId, userName) {
        var ctrId = 'private_' + userId;
        if ($('#' + ctrId).length > 0) {
            $('#typing_' + userId).html(userName + Res.Others.Typing).show();
            $('#typing_' + userId).delay(3000).fadeOut("slow");
        }
    }
    chat.client.SendNotification = function (message) {
        toastr.info(message);
    }

    chat.client.RemoveUserWaitingList = function (userId) {
        console.log("RemoveUserWaitingList")
        RemoveUserFromWaitingList(userId);
        var ctrId = 'private_' + userId;
        if ($("#" + ctrId).length > 0) {
            RemoveChatContent();
        }
    }

    chat.client.EndThisConversation = function (candidate, companyUser, conversation) {
        console.log("started EndThisConversation");
        if (candidate) {
            var ctrId = 'private_' + candidate.UserID;

            if ($('#' + candidate.UserID).length > 0) {
                $('#' + candidate.UserID).addClass("endeduser")

                var timeId = "time" + candidate.UserID;
                $('#' + timeId).hide();
                if (timeintervals.length > 0) {
                    var timeItem = timeintervals.filter(function (e) {
                        return e.userId == candidate.UserID;
                    });
                    for (var i = 0; i < timeItem.length; i++) {
                        clearInterval(timeItem[i].timeObject);
                        DeleteInterval(timeItem[i].userId);
                    }
                }
            }
            if ($("#" + ctrId).length > 0) {
                $('#' + candidate.UserID).trigger("click");
            }
        }

        //var finishedConversation = {
        //    conversation: conversation,
        //    candidate: candidate,
        //    user: companyUser
        //}

        //finishedConversationQueue.push(finishedConversation);

        //if (newFinishedConversation == false) {
        //    FinishedConversations();
        //}
        //------------------------------------
        //RemoveUserChattingList(candidate.UserID);
        //var ctrId = 'private_' + candidate.UserID;
        //if ($('#' + ctrId).length > 0) {
        //    RemoveChatContent()
        //}
        //if (conversation.Status == 2)//Candidate
        //{
        //    $('#EndConversationModal .modal-title').empty().append(candidate.UserName + " görüşmeyi sonlandırdı. Bu yetenekle nasıl ilerlemek istersiniz?");
        //    $('#EndConversationModal').data('id', candidate.UserID);
        //    $('#EndConversationModal').data('cstatus', conversation.Status);

        //    $('#EndConversationModal').modal();
        //}
        //else if (conversation.Status == 3)//Moderator
        //{

        //}
        //else {
        //    $('#EndConversationModal .modal-title').empty().append("Süren bittiği için " + candidate.UserName + " ile olan görüşmen sonlandı. Bu yetenekle nasıl ilerlemek istersiniz?");
        //    $('#EndConversationModal').data('cstatus', conversation.Status);
        //    $('#EndConversationModal').data('id', candidate.UserID);
        //    $('#EndConversationModal').modal();
        //}

        //console.log("EndThisConversation");

    }
    //$(".messages").animate({ scrollTop: $(document).height() }, "fast");
    chat.client.GetLastMessages = function (TouserID, CurrentChatMessages, conversation) {

        var divMessage = $(".messages");
        var ctrId = 'private_' + TouserID;
        var AllmsgHtml = "";
        //$('.mesgs').append('<div class="msg_history"> <div class="incoming_msg"> <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"> <div class="received_withd_msg"> <p> Test which is a new approach to have all solutions </p><span class="time_date"> 11:01 AM | June 9</span> </div></div></div><div class="incoming_msg"> <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"> <div class="received_withd_msg"> <p> We work directly with our designers and suppliers, and sell direct to you, which means quality, exclusive products, at a price anyone can afford. </p><span class="time_date"> 11:01 AM | Today</span> </div></div></div></div><div class="type_msg"> <div class="input_msg_write"> <input type="text" class="write_msg" placeholder="Type a message"/> <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button> </div></div>');
        AllmsgHtml += '<ul>';
        //BlockElementMessage("sd");
        //var $ss = $('.right-sidebar .user-info');
        //App.blockUI({
        //    target: '.user-info',
        //    overlayColor: 'none',
        //    animate: true
        //});

        if (conversation && conversation.CandidateConnectDate > 0) {

            var strTime = GetTimeFromDateTime(conversation.CandidateConnectDate);
            var userName = '';
            if ($('#' + ctrId).length > 0) {
                userName = $('#' + ctrId).find(".companyusername").text();
            }
            AllmsgHtml += '<li class="connectedtime">  <p>' + userName + Res.Others.SomeoneConnectedToChat + '<span>' + strTime + '</span></p></li>';
        }
        else {

            var strTime = GetTimeFromDateTime(conversation.CandidateConnectDate);
            var userName = '';
            if ($('#' + ctrId).length > 0) {
                userName = $('#' + ctrId).find(".companyusername").text();
            }
            AllmsgHtml += '<li class="connectedtime red">  <p>' + userName + Res.Others.SomeoneNotConnectedToChat + '</p></li>';
        }

        var userPhoto = $('#hdnProfilePhoto').val();
        var profilePhoto = "";
        for (i = 0; i < CurrentChatMessages.length; i++) {
            var message = CurrentChatMessages[i];

            //console.log("ToUserID" + message.ToUserID);
            //console.log("FromUserID" + message.FromUserID);
            if (message.MessageType == 1) {
                AllmsgHtml += '<li class="connectedtime">  <p>' + Res.Others.AddedToChatTwoMinutes + '<span>' + GetTimeFromDateTime(message.DateTime) + '</span></p></li>';
            }
            else {
                if (TouserID == message.ToUserID) {
                    AllmsgHtml += '<li class="sent">  <p>' + message.Message + '<span>' + GetTimeFromDateTime(message.DateTime) + '</span></p></li>';
                }
                else {
                    console.log(message);
                    profilePhoto = GetProfilePhotoFromUserList(message.FromUserID);
                    AllmsgHtml += '<li class="replies"> <p>' + message.Message + '<span>' + GetTimeFromDateTime(message.DateTime) + '</span></p></li>'
                }
            }


            //AllmsgHtml += '<div class="outgoing_msg">';
            //AllmsgHtml += '<div class="sent_msg"> <p> ' + '<b>' + CurrentChatMessages[i].FromUserName + '</b></p>' + ' <p class="msg_detail">' + CurrentChatMessages[i].Message + '</p><span class="time_date"> 11:01 AM | June 9</span> </div>'
            //AllmsgHtml += "</div>";
        }
        console.log(AllmsgHtml)
        AllmsgHtml += '</ul>';
        $('#' + ctrId).find('.messages').append(AllmsgHtml);
        //App.unblockUI({ target: '.msg_history' });
        console.log("scroll started")
        ScrollToMessages(0);


        //for (i = 0; i < CurrentChatMessages.length; i++) {
        //    AllmsgHtml += "<div style=\"display: block; max-width: 200px;\" class=\"ui-chatbox-msg\">";
        //    if (i == CurrentChatMessages.length - 1) {
        //        if ($('#' + ctrId).children().last().html() != "<b>" + CurrentChatMessages[i].FromUserName + ": </b><span>" + CurrentChatMessages[i].Message + "</span>") {
        //            AllmsgHtml += "<b>" + CurrentChatMessages[i].FromUserName + ": </b><span>" + CurrentChatMessages[i].Message + "</span>";
        //        }
        //    }
        //    else {
        //        AllmsgHtml += "<b>" + CurrentChatMessages[i].FromUserName + ": </b><span>" + CurrentChatMessages[i].Message + "</span>";
        //    }
        //    AllmsgHtml += "</div>";
        //}
    }

    // On New User Connected
    chat.client.onNewUserConnected = function (id, name, userid, uniName, uniProgram, uniClass, profilePhoto, level, conversation) {
        console.log("onNewUserConnected");
        //console.log(id);
        //console.log(name);
        //console.log(userid);
        //console.log(uniName);
        //console.log(uniProgram);
        //console.log(uniClass);
        //console.log(profilePhoto);
        //console.log(conversation)
        console.log(conversation);
        AddUser(chat, id, name, id, uniName, uniProgram, uniClass, profilePhoto, level, conversation, true, true);
    }
    chat.client.onNewWaitingUserConnected = function (id, name, userid, uniName, uniProgram, uniClass, profilePhoto, level) {
        AddWaitingUser(id, name, id, uniName, uniProgram, uniClass, profilePhoto, level)
    }


    // On User Disconnected
    chat.client.onUserDisconnected = function (id, userName) {
        console.log("Runing onUserDisconnected");
        //console.log("Disconnected id:" + id);
        if ($('#' + id).length != 0) {
            $('#' + id).find('.contact-status').removeClass("online");
        }
        var ctrId = 'private_' + id;
        //console.log("Disconnected ctrId:" + ctrId);

        if ($('#' + ctrId).length != 0) {
            console.log("lock chat 2");
            $('#mesgs .write_msg').prop("disabled", true);
            $('#SendMessage').prop("disabled", true);
        }
    }
    chat.client.sendPrivateMessage = function (windowId, fromUserName, chatTitle, message, time, ownMessage, conversation) {
        TypingFlag = true;
        console.log(time)
        console.log("dd")

        console.log("Runing sendPrivateMessage");
        //console.log(windowId);
        //console.log(fromUserName);
        //console.log(chatTitle);
        //console.log(message);
        //console.log(time);
        var userId = $('#hdnCurrentUserID').val();
        var ctrId = 'private_' + windowId;
        //console.log("length:" + $('#' + ctrId).length)
        if ($('#' + ctrId).length == 0) {

            if (chatting == false) {

                createPrivateChatWindow(chat, windowId, ctrId, fromUserName, chatTitle, conversation, true);
                chatting = true;
            }
            else {
                if ($('#' + windowId).hasClass('active') == false) {
                    //if ($('#' + windowId).hasClass('.contact-status')) {

                    //}
                    //else {

                    //}
                    var $badge = $('#' + windowId).find('.unreadMessage');
                    var badgeValue = $badge.text();

                    if (badgeValue === '') {
                        $('#' + windowId).find('.unreadMessage').text(1);
                    }
                    else {
                        var newBadge = parseInt(badgeValue) + 1;
                        $('#' + windowId).find('.unreadMessage').text(newBadge);
                    }
                    $('#' + windowId).find('.unreadMessage').show();
                    $('#chatAudio')[0].play();
                    //console.log("shakeId:" + windowId);
                    $('#' + windowId).effect("shake", { times: 2 }, 1000);
                }
            }
        }
        else {

            //console.log("shake");
            //if ($('#' + windowId).hasClass('active') == false) {
            //    console.log("shakeId:" + windowId);
            //    $('#' + windowId).effect("shake", { times: 2 }, 1000);
            //}
            var AllmsgHtml = "";
            var userPhoto = $('#hdnProfilePhoto').val();
            //console.log("ownMessage:" + ownMessage);
            if (ownMessage) {
                AllmsgHtml += '<li class="sent">  <p>' + message + '<span>' + GetTimeFromDateTime(time) + '</span></p></li>';
            }
            else {

                var profilePhoto = "";
                profilePhoto = GetProfilePhotoFromUserList(windowId);
                AllmsgHtml += '<li class="replies"> <p>' + message + '<span>' + GetTimeFromDateTime(time) + '</span></p></li>'
            }

            $('#' + ctrId).find('.messages ul').append(AllmsgHtml);
            ScrollToMessages(0);
        }
        if (!browserState) {
            $('#chatAudio')[0].play();
        }
        //$('#' + ctrId).append("option", "boxManager").addMsg(fromUserName, message);

    }
    $("#mesgs").on('keydown', '.write_msg', function (event) {
        //console.log(event.keyCode);
        if (event.keyCode === 13) {
            $("#SendMessage").trigger("click");
        }
        SetBlueToChatButton(this);

    });

    $("#mesgs ").on('keyup', '.write_msg', function (event) {
        SetBlueToChatButton(this);
        var userId = $(this).data("userid");
        if (TypingFlag == true) {
            chat.server.SendCandidateTypingRequest(userId);
        }
        TypingFlag = false;
    });

    $("#mesgs").on('blur', '.write_msg', function () {

        SetBlueToChatButton(this);
    });

});
function SetBlueToChatButton(item) {
    console.log(item)
    if ($(item).val().length === 0) {
        $(item).removeClass("wrote");
        $(item).siblings().find(".fa").removeClass("blue-arrow");
    }
    else {
        $(item).addClass("wrote");
        $(item).siblings().find(".fa").addClass("blue-arrow");
    }
}
function GetTimeFromDateTime(datetime) {
    var time = new Date(datetime);

    return ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2);

}
function FinishedConversations() {

    console.log("started FinishedConversations")
    console.log(finishedConversationQueue);
    if (finishedConversationQueue.length > 0) {
        newFinishedConversation = true;
        console.log("finish converastion")

        var finishedConversation = finishedConversationQueue[0];
        var conversation = finishedConversation.conversation;
        var candidate = finishedConversation.candidate;
        var user = finishedConversation.user;

        RemoveUserChattingList(conversation.CandidateID);
        var ctrId = 'private_' + conversation.CandidateID;
        if ($('#' + ctrId).length > 0) {
            RemoveChatContent()
        }

        if (conversation.Status == 2)//Candidate
        {
            $('#EndConversationModal .modal-title').empty().append(candidate.UserName + Res.Others.CandidateRateYourEndingChat);
            $('#EndConversationModal').data('id', candidate.UserID);
            $('#EndConversationModal').data('cstatus', conversation.Status);

            $('#EndConversationModal').modal();
        }
        else if (conversation.Status == 3)//Moderator
        {

        }
        else {
            $('#EndConversationModal .modal-title').empty().append(Res.EndConversationModal.ForChatTimeEnded + candidate.UserName + Res.EndConversationModal.ForChatTimeEnded2);
            $('#EndConversationModal').data('cstatus', conversation.Status);
            $('#EndConversationModal').data('id', candidate.UserID);
            $('#EndConversationModal').modal();
        }
        finishedConversationQueue.splice($.inArray(finishedConversation, finishedConversationQueue), 1);
    }

}
function GetProfilePhotoFromUserList(userId) {
    var photo = "";

    if ($("#" + userId).length > 0) {
        photo = $("#" + userId).find('.user-photo').attr('src');
    }
    else {
        $.ajax({
            async: false,
            url: "/Company/OnlineCareerDay/GetProfilePhoto",
            type: "GET",
            data: { userId: userId },
            success: function (data) {
                photo = data;
            },
            error: function (response) {
                console.log(response.responseText + " - " + response.status);
            },
        });
    }

    return photo;
}
function SetActive(toChatDiv) {
    if (toChatDiv) {
        //console.log(toChatDiv)
        //$('#chattingList .btn-usercontactlist').trigger("click");

    }
    else {
        //console.log(toChatDiv)

        //$('#waitingList .btn-usercontactlist').trigger("click");

    }
}
function DeleteInterval(userId) {
    console.log("DeleteInterval:" + userId)
    $.each(timeintervals, function (i, e) {
        if (e.userId == userId) {
            timeintervals.splice(i, 1);
            return false;
        }
    });
}
function EndConversation(cId, userId, expired) {
    console.log("start function EndConversation")
    console.log(cId);

    //RemoveUserChattingList(chattingUserID);
    chat.server.CompanyEndConversation(cId);
    console.log("chattingUserID:" + userId)
    var ctrId = 'private_' + userId;
    var openedChatWindow = false;
    if ($('#' + ctrId).length > 0) {
        //RemoveChatContent();
        console.log("a21");
        console.log(ctrId);
        openedChatWindow = true;

    }
    if ($('#' + userId).length > 0) {
        console.log("a22");
        console.log(userId);
        $('#' + userId).addClass("endeduser");
        var timeId = "time" + userId;
        $('#' + timeId).hide();
        console.log("expired22");
        console.log(expired);
        if (expired) {
            var expiredId = "expired_" + userId;

            $('#' + expiredId).show();
        }
        console.log("timeintervals")
        console.log(timeintervals)
        if (timeintervals.length > 0) {
            var timeItem = timeintervals.filter(function (e) {
                return e.userId == userId;
            });
            console.log("timeinterval")
            console.log(timeItem);
            for (var i = 0; i < timeItem.length; i++) {
                clearInterval(timeItem[i].timeObject);
                DeleteInterval(timeItem[i].userId);

            }
        }

        if (openedChatWindow) {
            $('#' + userId).trigger("click");
        }
    }
    //setTimeout(function () {
    //    $('#mesgs').addClass('chat-bg');
    //}, 1000);

    //chattingUserID = 0;
    //conversationId = 0;
}


function SendMessage(item) {
    console.log('sendMessage');
    var userId = $(item).data("userid");
    var ad = $(".submit");
    //console.log(ad)
    console.log("userId:" + userId);
    var message = $(".message-input input").val();
    //console.log("sending message=" + message);

    if ($.trim(message) == '') {
        return false;
    }
    chat.server.SendPrivateMessage(userId, message);
    $('.message-input .wrap input').val('');
    $('.message-input .wrap input').focus();
    //ScrollToMessages();
    return false;
}
var waitingUserCount = 0, chattingUserCount = 0;
function UpdateWaitingUserCount() {
    var licount = $('#bekleyen ul li').length;
    $(".waitingTotalCandidateCount").html(licount);
    if (licount > 0) {
        $('#bekleyen').removeClass("shownotalent");
    }
    else {
        $('#bekleyen').addClass("shownotalent");

    }
}
function UpdateChattingUserCount() {
    var licount = $('#gorusulen ul li').length;
    $(".chattingTotalCandidateCount").html(licount);

    if (licount > 0) {
        $('#gorusulen').removeClass("shownotalent");
    }
    else {
        $('#gorusulen').addClass("shownotalent");

    }
}

function RemoveUserFromWaitingList(userId) {
    if (userId != 0) {
        $('#bekleyen ul li').each(function (index, value) {
            var $user = $(this);
            if ($user.prop("id") == userId) {
                console.log("removed")
                $user.remove();
            }
        });
    }

    UpdateWaitingUserCount();
}
function RemoveUserChattingList(userId) {

    $('#gorusulen ul li').each(function (index, value) {
        var $user = $(this);
        if ($user.prop("id") == userId) {
            console.log("removed")
            $user.remove();
        }
    });
    UpdateChattingUserCount();
}
function registerClientMethods(chat) {
    // Calls when user successfully logged in
    chat.client.onConnected = function (id, userName, allChatUsers, allWaitingUsers, messages, userid) {
        var abcd = "aabbbb";

        console.log("Event: onConnected")
        $('#hdId').val(id);
        $('#hdUserName').val(userName);
        console.log("allWaitingUsers");
        //console.log(allWaitingUsers);
        $("#profile span.contact-status").addClass("online");
        if (allWaitingUsers.length > 0) {
            waitingUserCount = allWaitingUsers.length;
            //var chatUsers = allUsers.find(e => e.UserStatus ==2);
            //$(".chattingTotalCandidateCount").html(chatUsers.length);
            console.log($(".waitingTotalCandidateCount"));
            $(".waitingTotalCandidateCount").html(allWaitingUsers.length);
        }
        else {
            $(".waitingTotalCandidateCount").html(0);
        }
        if (allChatUsers.length > 0) {
            chattingUserCount = allChatUsers.length;
        }

        var last_element = allChatUsers[allChatUsers.length - 1];
        // Add All Users
        for (i = 0; i < allChatUsers.length; i++) {
            console.log("idd");
            console.log(allChatUsers[i])
            AddUser(chat, allChatUsers[i].UserID, allChatUsers[i].UserName, allChatUsers[i].UserID, allChatUsers[i].UniName, allChatUsers[i].UniProgram, allChatUsers[i].UniClass, allChatUsers[i].ProfilePhoto, allChatUsers[i].Level, allChatUsers[i].Conversastion, (last_element.UserID == allChatUsers[i].UserID), allChatUsers[i].CandidateOnline);
            //if (last_element.UserID == allChatUsers[i].UserID) {
            //    console.log("active user")

            //}
            //else {
            //    console.log("normal user")

            //    AddUser(chat, allChatUsers[i].UserID, allChatUsers[i].UserName, userid, allChatUsers[i].UniName, allChatUsers[i].UniProgram, allChatUsers[i].UniClass, allChatUsers[i].ProfilePhoto, allChatUsers[i].Level, allChatUsers[i].Conversastion, false);
            //}

        }
        $.each(allWaitingUsers, function (i, user) {
            AddWaitingUser(user.UserID, user.UserName, userid, user.UniName, user.UniProgram, user.UniClass, user.ProfilePhoto, user.Level);
        });
        //for (i = 0; i < allWaitingUsers.length; i++) {

        //    AddWaitingUser(allWaitingUsers[i].UserID, allWaitingUsers[i].UserName, userid, allWaitingUsers[i].UniName, allWaitingUsers[i].UniProgram, allWaitingUsers[i].UniClass, allWaitingUsers[i].ProfilePhoto, allWaitingUsers[i].Level);
        //}

    }

}
function GetWaitingUsers() {

    var UserID = parseInt($("[id$=hdnCurrentUserID]").val());
    chat.server.GetWaitingUsers(UserID).then(function (allWaitingUsers) {
        console.log(allWaitingUsers);
        $.each(allWaitingUsers, function (i, user) {
            AddWaitingUser(user.UserID, user.UserName, user.UserID, user.UniName, user.UniProgram, user.UniClass, user.ProfilePhoto, user.Level);
        });
    });
}

//function GetChattingUsers() {

//}
function OpenPrivateChatWindow(chat, id, userName, conversation, hasWaiting) {

    var openPrivateChat = true;
    chattingUserID = id;
    var ctrId = 'private_' + id;
    //if ($('#' + ctrId).length > 0) {
    //    if (conversation && conversation.Status != 0) {

    //    }
    //    else {
    //        if ($('#' + ctrId).hasClass("waiting")) {

    //        }
    //        else {
    //            openPrivateChat = false;
    //        }

    //    }

    //}
    //console.log(openPrivateChat)
    //if (openPrivateChat == false) {
    //    return;
    //} else {
    //    if (conversation) {
    //        conversationId = conversation.ID;

    //    }
    //}


    //console.log("invoking createPrivateChatWindow")
    //console.log(conversation);
    //console.log(chattingUserID);
    createPrivateChatWindow(chat, id, ctrId, userName, userName, conversation, hasWaiting);
}

var showList = new Array();
var addedSendButton = false;
var profilePhotos = [];
function CheckProfilePhoto(photo, userName, id) {
    //console.log(profilePhotos);
    if (photo == '') {
        var dummyImagePhoto = "";

        $.each(profilePhotos, function (i, photo) {

            if (photo.userId == id) {
                dummyImagePhoto = photo.photo;
                return false;
            }
        });
        //console.log("test");
        var size = "100x100", bgColor = "", textColor = "fff";
        bgColor = (Math.random() * 0xFFFFFF << 0).toString(16);
        console.log()
        if (dummyImagePhoto == "") {
            dummyImagePhoto = "https://dummyimage.com/" + size + "/" + bgColor + "/" + textColor + "&text=" + userName.charAt(0);
            var profilePhoto = { userId: id, photo: dummyImagePhoto };
            profilePhotos.push(profilePhoto);

        }

        return dummyImagePhoto; c
    }
    return photo;
}
function CandidateSaw(item) {
    var notes = $("#notes").val();
    console.log(notes);
    var radioValue = $("input[name='rate']:checked").val();
    var conversationScore = 0;
    if (radioValue) {
        conversationScore = radioValue;
    }
    console.log(radioValue);
    const urlParams = new URLSearchParams(window.location.search);
    var conversationId = urlParams.get('c');

    $.ajax({
        url: "/OnlineCareerFair/UpdateModeratorSawConverationWasEnded",
        type: "POST",
        data: { conversationId: conversationId },
        success: function (data) {
        },
        error: function (response) {
            console.log(response.responseText + " - " + response.status);
        }
    }).done(function () {
        setTimeout(function () {
            var url = $('#hdnRedirectUrlForOnlineCompaniesPage').val();
            document.location.href = url;
        }, 500);
    });
}
function ShowFinishedConversationWindow(chat, userId, ctrId, userName, chatTitle, conversation, profilePhoto) {

    var uniname = "", uniProgName = "";
    if ($('#' + userId).length != 0) {
        uniname = $('#' + userId).find('.info .title').text();
        uniProgName = $('#' + userId).find('.info .candidate-uni').text();
    }
    $("#mesgs").removeClass("chat-bg");

    var contactProfile = '<div class="contact-profile"> <ul> <li > <div class="row"> <div class="col-md-7 col-6 d-flex px-0 px-md-3"> <div class="col-md-3 col-4 justify-content-center align-self-center" style="max-width:100px;"> <img class="dot" src="' + profilePhoto + '"> <span class="contact-status online" style="top:0;margin:45px 0 0 55px;"></span> </div><div class="col-md-8 col-8 align-self-center px-0" style="padding:0;"> <h5 class="companyusername mb-1 ml-2">' + userName + '</h5> <h5 class="companyusertitle mb-1 ml-2">' + uniname + '</h5> <h5 class="candidate-uni mb-1 ml-2">' + uniProgName + '</h5> </div></div><div class="col-md-5 col-6 d-flex justify-content-end align-self-end"> <div class="col-md-12 col-12 d-flex flex-column justify-content-center"> </div></div></div><div class="row"> <div class="col-md-12 "> <div class="candidateinfo" style=""> </div><div class="row showcandidateinfo d-flex justify-content-center flex-column align-items-center"> <div class="rectangle"></div><div class="rectangle2"></div></div></div></li></ul> </div>';

    var messages = '<div class="messages"></div>';
    var endedConverastion = ' <div class="endedConverastion"> <div class="col-md-12 d-flex justify-content-center mb-3"><span class="congratulations-icon">🎉</span> </div><div class="col-md-12 d-flex flex-column align-items-center"> <span class="congratulations-text mb-2">' + Res.EndConversationModal.Congrats + '</span> <span class="congratulations-stext">' + Res.EndConversationModal.CompletedToChat + '</span> </div><div class="col-md-12 hr my-md-5 my-4"></div><div class="col-md-12 d-flex flex-column "> <div> <h4 class="nasil-ilerlemek-istersin">' + Res.EndConversationModal.Title + '</h4> </div><div> <div> <div class="radio"> <label> <input class="hicbir-sey-yapma" id="r1" type="radio" name="Action" value="1" checked>' + Res.EndConversationModal.Options.DoNothing + ' <span>' + Res.EndConversationModal.Options.DoNothingSpan + '</span></label> </div><div class="radio"> <label> <input class="hicbir-sey-yapma" id="r2" type="radio" name="Action" value="2">' + Res.EndConversationModal.Options.AddToptalens + '<span>' + Res.EndConversationModal.Options.AddToptalensSpan + '</span></label> </div><div class="radio"> <label> <input class="hicbir-sey-yapma" id="r3" type="radio" name="Action" value="3">' + Res.EndConversationModal.Options.Block + ' <span>' + Res.EndConversationModal.Options.BlockSpan + '</span></label> </div></div><div class="col-md-12 conversation-notes mt-3 mb-2 px-0"> <textarea class="col-md-12" name="note" id="note" maxlength="1500" placeholder="' + Res.EndConversationModal.WriteNotes + '"></textarea> </div><div class="col-md-12 d-flex justify-content-end"> <a href="javascript:void(0)" onclick="FinishConversation(\'' + conversation.ID + '\',' + userId + ')" class="btn-saveandreturnfair">' + Res.EndConversationModal.SaveAndContinue + '<i class="btn-arrow"></i></a> </div></div></div>';

    var mesgs = $('<div class="msg_history" id=' + ctrId + '>' + contactProfile + endedConverastion + '</div>');

    $("#mesgs").append(mesgs);

    console.log(conversation);

}
function createPrivateChatWindow(chat, userId, ctrId, userName, chatTitle, conversation, hasWaiting) {
    console.log(conversation);
    console.log("invoked createPrivateChatWindow")
    $('#mesgs').html("");
    $('#mesgs').removeClass('chat-bg');
    var profilePhoto = "";
    profilePhoto = GetProfilePhotoFromUserList(userId);

    if (conversation && conversation.Status != 0 && conversation.ModeratorSaw == false) {
        console.log("this conversation finished")
        ShowFinishedConversationWindow(chat, userId, ctrId, userName, chatTitle, conversation, profilePhoto);
    }
    else {
        if (hasWaiting) {
            console.log("wwwwwww")

            var uniname = "", uniProgName = "", level = "";
            if ($('#' + userId).length != 0) {
                uniname = $('#' + userId).find('.info .title').text();
                uniProgName = $('#' + userId).find('.info .candidate-uni').text();
                level = $('#' + userId).find('.info .candidate-level').text();

            }
            //var contactProfile = '<div class="contact-profile">  <p  style="font-size: 16px;margin-left:10px;">Şimdi <span style="font-weight: 600;">' + userName + '</span> ile konuşuyorsunuz</p><p style="float:right;"><span class="time-chatwindow  blue ' + timeId + '" id="' + timeId + '"><span class="minutes"></span><span class="seconds"></span></span></p>  </div>';


            var contactProfile = '<div class="contact-profile"> <ul> <li> <div class="row"> <div class="col-md-7 col-6 d-flex px-0 px-md-3"> <div class="col-md-3 col-4 justify-content-center align-self-center" style="max-width:100px;"> <img class="dot" src="' + profilePhoto + '"> <span class="contact-status online" style="top:0;margin:45px 0 0 55px;"></span> </div><div class="col-md-8 col-8 align-self-center px-0" style="padding:0;"> <h5 class="companyusername mb-1 ml-2">' + userName + '</h5> <h5 class="companyusertitle mb-1 ml-2">' + uniname + '</h5> <h5 class="candidate-uni mb-1 ml-2">' + uniProgName + '</h5> </div></div> <div class="col-md-5 col-6 d-flex"> <div class="col-md-12 col-12 d-flex justify-content-end"> <button type="button"  onclick="AddChatList(this)" class="btn btn-start align-items-center justify-content-center d-flex" data-fullname="' + userName + '" data-userid="' + userId + '"> ' + Res.Others.BtnStartConversation + ' </button> </div></div></div><div class="row"> <div class="col-md-12 "> <div class="candidateinfo" style=""> </div><div class="row showcandidateinfo d-flex justify-content-center flex-column align-items-center"> <div class="rectangle"></div><div class="rectangle2"></div></div></div></li></ul> </div>';
            console.log(contactProfile);
            var messages = '<div class="messages"></div>';
            var messageInput = '<div class="message-input"> <div class="wrap"> <input type="text" class="write_msg"   placeholder="' + Res.Others.PlaceHolderWriteSomething + '"> <button id="SendMessage"  onclick="SendMessage(this)" class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button> </div></div>';


            var mesgs = $('<div class="msg_history waiting" id=' + ctrId + '>' + contactProfile + messages + messageInput + '</div>');

            $('#bekleyen .contact').each(function (index, value) {
                var link = $(this).removeClass('active');
            });
            $('#gorusulen .contact').each(function (index, value) {
                var link = $(this).removeClass('active');
            });
            $('#' + userId).addClass('active');

            //console.log("mesgs:" + mesgs);
            $("#mesgs").append(mesgs);//Daha sonra açalım
            //var video = $('<div id="video-content"><div class="qb-video"><video id="main_video" class="frames__main_v qb-video_source" autoplay playsinline></video></div></div>');
            //$("#mesgs").append(video);
            if ($('#' + ctrId).length != 0) {

                $('#mesgs .write_msg').prop("disabled", true);
                $('#SendMessage').prop("disabled", true);
            }
        }
        else {
            //profilePhoto = CheckProfilePhoto(profilePhoto, userName, userId);
            var comanyLogo = $("#hdnUserCompanyprofilePhoto").val();
            var companyName = $("#hdnUserCompanyName").val();
            var uniname = "", uniProgName = "";
            if ($('#' + userId).length != 0) {
                uniname = $('#' + userId).find('.info .title').text();
                uniProgName = $('#' + userId).find('.info .candidate-uni').text();
            }
            //var contactProfile = '<div class="contact-profile"> <a href="' + profilePhoto + '" data-lightbox="' + profilePhoto + '"><img  src="' + profilePhoto + '" alt=""> </a>  <p>' + userName + '</p><div class="social-media"><a style="text-decoration:none;" class="user-profile-link" target="_blank" href=/candidateprofile/index/' + userId + '> <i class="fa fa-instagram" aria-hidden="true"></i></a> </div></div>';
            //var contactProfile = '<div class="contact-profile"> <a href="' + comanyLogo + '" data-lightbox="' + comanyLogo + '"><img  src="' + comanyLogo + '" alt=""> </a>  <p style="font-size: 16px;font-weight: 600;">' + companyName + '</p></div>';
            var timeId = "timetwo" + userId;
            //var timeId = "time" + userId;
            //var contactProfile = '<div class="contact-profile">  <p  style="font-size: 16px;margin-left:10px;">Şimdi <span style="font-weight: 600;">' + userName + '</span> ile konuşuyorsunuz</p><p style="float:right;"><span class="time-chatwindow  blue ' + timeId + '" id="' + timeId + '"><span class="minutes"></span><span class="seconds"></span></span></p>  </div>';

            //var contactProfile = '<div class="contact-profile"> <ul> <li> <div class="row"> <div class="col-md-6 col-6 d-flex px-0 px-md-3"> <div class="col-md-3 col-4 justify-content-center align-self-center" style="max-width:100px;"> <img class="dot" src="' + profilePhoto + '"> <span class="contact-status online" style="top:0;margin:45px 0 0 55px;"></span> </div><div class="col-md-8 col-8 align-self-center px-0" style="padding:0;"> <h5 class="companyusername mb-1 ml-2">' + userName + '</h5> <h5 class="companyusertitle mb-1 ml-2">' + uniname + '</h5> <h5 class="candidate-uni mb-1 ml-2">' + uniProgName + '</h5> </div></div> <div class="col-md-6 col-6 d-flex"> <div class="col-md-12 col-12 d-flex justify-content-end"> <button type="button"  onclick="AddChatList(this)" class="btn btn-start align-items-center justify-content-center d-flex" data-fullname="' + userName + '" data-userid="' + userId + '"> BAŞLAT </button> </div></div></div><div class="row"> <div class="col-md-12 "> <div class="candidateinfo" style=""> </div><div class="row showcandidateinfo d-flex justify-content-center flex-column align-items-center"> <div class="rectangle"></div><div class="rectangle2"></div></div></div></li></ul> </div>';

            var btnVideoCall = '';

            if (canVideoCall)
            {
                btnVideoCall='<button class="btn call-actions video-call"  data-call="video" title="Görüntülü arama başlat"><span>Görüntülü ara</span></button>';
            }
            var contactProfile = '<div class="contact-profile"> <ul> <li > <div class="row"> <div class="col-md-7 col-6 d-flex px-0 px-md-3"> <div class="col-md-3 col-4 justify-content-center align-self-center" style="max-width:100px;"> <img class="dot" src="' + profilePhoto + '"> <span class="contact-status online" style="top:0;margin:45px 0 0 55px;"></span> </div><div class="col-md-8 col-8 align-self-center px-0" style="padding:0;"> <h5 class="companyusername mb-1 ml-2">' + userName + '</h5> <h5 class="companyusertitle mb-1 ml-2">' + uniname + '</h5> <h5 class="candidate-uni mb-1 ml-2">' + uniProgName + '</h5> </div></div><div class="col-md-5 col-6 d-flex justify-content-end align-self-end"> <div class="col-md-12 col-12 d-flex flex-column justify-content-center"> <a class="btn-endconversation d-flex justify-content-end mr-md-0 mr-6" href="javascript:void(0);" data-cid="' + conversation.ID + '" data-uid="' + userId + '">' + Res.Others.BtnEndConversation + '</a> <p class="remainingtime d-flex justify-content-end align-items-end"> ' + btnVideoCall + '<button class="btn taketime" onclick="TakeExtraTime(this)" title="Görüşmeye 2 dakika ekle" data-userid="' + userId + '" data-cid="' + conversation.ID + '">' + Res.Others.BtnAddTwoMinutes + '</button><span class="time-text d-inline-flex position-relative align-self-center">' + Res.Others.RemainingTime + '</span> <span id="' + timeId + '" class="time d-inline-flex position-relative justify-content-end"> <span class="minutes"></span> <span class="seconds"></span> </span> </p></div></div></div><div class="row"> <div class="col-md-12 "> <div class="candidateinfo" style=""> </div><div class="row showcandidateinfo d-flex justify-content-center flex-column align-items-center"> <div class="rectangle"></div><div class="rectangle2"></div></div></div></li></ul> </div>';
            var messages = '<div class="messages"></div>';
            var typingId = "typing_" + userId;

            var messageInput = '<div class="message-input"> <div class="wrap"> <div id="' + typingId + '" class="typing" data-uid="' + userId + '"></div> <input type="text" class="write_msg" data-userid="' + userId + '" placeholder="' + Res.Others.PlaceHolderWriteSomething + '"> <button data-userid="' + userId + '" id="SendMessage"  onclick="SendMessage(this)" class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button> </div></div>';
            var video = '<div class="qb-video" id="qb-video" style="display:none;"><video id="main_video" class="frames__main_v qb-video_source" autoplay playsinline></video></div>';
            var mesgs = $('<div class="msg_history" id=' + ctrId + '>' + contactProfile + '<div id="chat-content">'  + messages + messageInput + '</div>' + '</div>');
            $('#gorusulen .contact').each(function (index, value) {
                var link = $(this).removeClass('active');
            });
            $('#' + userId).addClass('active');

            //console.log("mesgs:" + mesgs);
            $("#mesgs").append(mesgs);//Daha sonra açalım

            //var newParent = document.getElementById('qb-video');
            //var oldParent = document.getElementById('temporary-video-content');
            
            //if (oldParent != null && !_.isEmpty(oldParent.innerHTML))
            //{
            //    console.log("move qb-video................................")

            //    if (oldParent.childNodes.length)
            //    {
            //        $(newParent).empty();
            //    }
            
            //    while (oldParent.childNodes.length > 0) {
            //        newParent.appendChild(oldParent.childNodes[0]); 
            //    }
            //    $(newParent).show();

            //}
            
            //$("#mesgs").append(video);
            console.log("conversation")

            console.log(conversation)
            if (conversation.Status != 0) {
                alert("df")

                var ctrId = 'private_' + userId;
                if ($('#' + ctrId).length != 0) {

                    if ($('#' + ctrId).find(".contact-status.online").length > 0) {
                        console.log("unlock chat 1");
                        $('#mesgs .write_msg').prop("disabled", false);
                        $('#SendMessage').prop("disabled", false);
                    }
                    else {
                        console.log("lock chat 1");
                        $('#mesgs .write_msg').prop("disabled", true);
                        $('#SendMessage').prop("disabled", true);
                    }

                }
            }
            else if (conversation.Status == 0) {
                if ($('#' + ctrId).length != 0) {
                    if ($('#' + userId).find(".contact-status.online").length > 0) {
                        console.log("unlock chat 1");
                        $('#mesgs .write_msg').prop("disabled", false);
                        $('#SendMessage').prop("disabled", false);
                    }
                    else {
                        console.log("lock chat 1");
                        $('#mesgs .write_msg').prop("disabled", true);
                        $('#SendMessage').prop("disabled", true);
                    }

                }
            }
            else {
                $('#mesgs .write_msg').focus();
            }
            showList.push(ctrId);
            if (conversation && conversation.CandidateConnectDate > 0) {
                setTimeout(function () {
                    //var deadline = new Date(1570458711000); 
                    var deadline = new Date(Date.parse(new Date()) + conversation.RemainingTime);
                    //var deadline = new Date(conversation.FinishDateTimeTimeStamp);
                    console.log(deadline);
                    console.log(conversation.FinishDateTimeTimeStamp);
                    //var deadline = new Date(1570458711000);
                    initializeClock(timeId, userId, deadline);
                });
            }

            addedSendButton = true;
            //$('.mesgs').append('<div class="msg_history"> <div class="incoming_msg"> <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"> <div class="received_withd_msg"> <p> Test which is a new approach to have all solutions </p><span class="time_date"> 11:01 AM | June 9</span> </div></div></div><div class="incoming_msg"> <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"> <div class="received_withd_msg"> <p> We work directly with our designers and suppliers, and sell direct to you, which means quality, exclusive products, at a price anyone can afford. </p><span class="time_date"> 11:01 AM | Today</span> </div></div></div></div><div class="type_msg"> <div class="input_msg_write"> <input type="text" class="write_msg" placeholder="Type a message"/> <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button> </div></div>');

            //$('#' + ctrId).chatbox({
            //    id: ctrId,
            //    title: chatTitle,
            //    user: userName,
            //    offset: getNextOffset(),
            //    width: 200,
            //    messageSent: function (id, user, msg) {
            //        chatHub.server.sendPrivateMessage(userId, msg);
            //        TypingFlag = true;
            //    },
            //    boxClosed: function (removeid) {
            //        $('#' + removeid).remove();
            //        var idx = showList.indexOf(removeid);
            //        if (idx != -1) {
            //            showList.splice(idx, 1);
            //            diff = config.width + config.gap;
            //            for (var i = idx; i < showList.length; i++) {
            //                offset = $("#" + showList[i]).chatbox("option", "offset");
            //                $("#" + showList[i]).chatbox("option", "offset", offset - diff);
            //            }
            //        }
            //    }

            //});
            //$('#' + ctrId).siblings().css("position", "relative");
            //$('#' + ctrId).siblings().append("<div id=\"typing_" + userId + "\" style=\"width:20px; height:20px; display:none; position:absolute; right:14px; top:8px\"><img height=\"20\" src=\"" + srp + "images/pencil.gif\" /></div>");
            //$('#' + ctrId).siblings().find('textarea').on('input', function (e) {
            //    if (TypingFlag == true) {
            //        chatHub.server.sendUserTypingRequest(userId);
            //    }
            //    TypingFlag = false;
            //});

            //$('#' + ctrId).next().find('.input_msg_write').append("<div id=\"typing_" + userId + "\" style=\"height:20px; display:none; position:absolute; right:40px; top:18px\"><img height=\"20\" src=\"/images/typing.gif\" /></div>");
            //$('#' + ctrId).next().find('input_msg_write').on('input', function (e) {
            //    if (TypingFlag == true) {
            //        chatHub.server.sendUserTypingRequest(userId);
            //    }
            //    TypingFlag = false;
            //});
            //$(".messaging").on('keyup', '.write_msg', function (event) {
            //    if (TypingFlag == true) {
            //        chat.server.sendUserTypingRequest(userId);
            //    }btn call-actions btn-end-call
            //    TypingFlag = false;

            //})

            var FromUserID = parseInt($("[id$=hdnCurrentUserID]").val());
            var ToUserID = userId;
            chat.server.RequestLastMessageForCompany(FromUserID, ToUserID, conversation.ID);
        }
    }

    //console.log("control")

    //if ($("#" + userId).length > 0)
    //{
    //    var image = $("#" + userId).find('.user-photo').attr('src');
    //    console.log(image)
    //}
    //user-photo
    //$.ajax({
    //    async: true,
    //    url: "/Company/OnlineCareerDay/GetProfilePhoto",
    //    type: "GET",
    //    data: { userId: userId },
    //    success: function (data) {
    //        profilePhoto = data;
    //    },
    //    error: function (response) {
    //        console.log(response.responseText + " - " + response.status);
    //    },
    //});


}
function CheckWaitingUsers() {

}
function TakeExtraTime(item) {
    var converastionId = $(item).data("cid");
    var userId = $(item).data("userid");

    if ($("#" + userId).length > 0) {
        if (converastionId) {
            chat.server.TakeExtraTime(converastionId).then(function (result) {
                console.log("TakeExtraTime response: " + result)
                if (result && result > 0) {
                    var timeId = "time" + userId;
                    if (timeintervals.length > 0) {
                        var timeItem = timeintervals.filter(function (e) {
                            return e.userId == userId;
                        });
                        for (var i = 0; i < timeItem.length; i++) {
                            console.log(timeItem[i])
                            clearInterval(timeItem[i].timeObject);
                            DeleteInterval(timeItem[i].userId);
                        }
                    }
                    setTimeout(function () {
                        //var deadline = new Date(result);
                        var deadline = new Date(Date.parse(new Date()) + result);
                        initializeClock(timeId, id, deadline);
                        $('.message-input .wrap input').focus();

                    }, 50);
                    $("#" + userId).click();
                    $("#" + timeId).removeClass("red");

                }
            }).fail(function (error) {
                $('.message-input .wrap input').focus();
                console.log("TakeExtraTime:" + error)
            });
        }
    }
}
function registerEvents(chat) {
    var UserName = $("[id$=hdnCurrentUserName]").val();
    var UserID = parseInt($("[id$=hdnCurrentUserID]").val());
    var RoomID = parseInt($("[id$=hdnRoomID]").val());
    var CompanyName = $("[id$=hdnCompanyName]").val();
    var CompanyId = $("[id$=hdnCompanyID]").val();
    var Title = $("[id$=hdnTitle]").val();
    var Avatar = $("[id$=hdnProfilePhoto]").val();
    chat.server.ConnectCompanyUser(UserName, UserID, RoomID, CompanyName, CompanyId, Title, Avatar);
}
function AddWaitingUser(id, name, userid, uniName, uniProgram, uniClass, profilePhoto, level) {
    console.log("run onNewWaitingUserConnected")
    var currentuserid = parseInt($("[id$=hdnCurrentUserID]").val());
    var connectionid = $('#hdId').val();
    var code = "";

    if (connectionid == "") {
        if (userid == currentuserid) {
            $('#hdId').val(id);
            connectionid = id;
            $('#hdUserName').val(name);
        }
    }

    if (connectionid != id) {

        if ($('#' + id).length == 0) {

            profilePhoto = GetProfilePhotoFromUserList(id);
            //console.log(profilePhoto);
            var timeId = "time" + id;
            //code = $('<li id="' + id + '"class="contact"> <div class="wrap"> <button onclick="AddChatList(this)" data-fullname="' + name + '" data-userid="' + id + '" class="add-chatlist">Başla</button> </span>  <img src="' + profilePhoto + '" alt=""> <div class="meta"> <p class="name">' + name + '</p><p class="preview">' + uniName + '</p><p class="preview">' + uniProgram + '</p> <p class="preview">' + uniClass + '</p> </div> </div></li>')
            //$('#waiting-users ul').append(code);

            var timeId = "time" + id;
            code = $('<li id="' + id + '" class="candidate contact"  data-fullname="' + name + '" data-userid="' + id + '"> <img class="profile-img user-photo" src="' + profilePhoto + '" alt="avatar"> <span class="contact-status online"></span> <div class="info"> <div class="name mb-1">' + name + '</div><div class="title"> ' + uniName + '</div><div class="candidate-uni"> ' + uniProgram + ' </div><div class="candidate-level"> ' + level + ' </div></div><div></div></li>')

            $(code).click(function () {
                console.log($(this))
                var endCall = true;
                //if (app.currentSession && app.currentSession.state=== QB.webrtc.SessionConnectionState.CONNECTED) {
                //    if (confirm("Aktif bir görüşmeniz var. Devam ederseniz görüntülü görüşmeniz sonlandırılacak! Devam etmek istiyor musunuz?")) {
                //        app.currentSession.stop({});
                //    } else {
                //        console.log("move temporary................................")
                //        var newParent = document.getElementById('temporary-video-content');
                //        var oldParent = document.getElementById('qb-video');

                //        while (oldParent.childNodes.length > 0) {
                //            newParent.appendChild(oldParent.childNodes[0]);
                //        }
                //        endCall = false;

                //    }
                //}
                if (endCall)
                {
                    var id = $(this).attr('id');
                    $('#gorusulen .contact').each(function (index, value) {
                        var link = $(this).removeClass('active');
                    });
                    $('#bekleyen .contact').each(function (index, value) {
                        var link = $(this).removeClass('active');
                    });
                    $(this).addClass('active');
                    var $clickedItem = $(this);

                    //$(".chat-buttons").css("display", "block");
                    OpenPrivateChatWindow(chat, id, name, null, true);
                    $clickedItem.find('.unreadMessage').text('');
                    $clickedItem.find('.unreadMessage').hide();
                    GetCandidateInfo2(id, true);
                }
               

                //AddChatList(this)
            });

            $('#bekleyen ul').append(code);
            UpdateWaitingUserCount();
            SetActive(false);
            $('#waitingUserAudio')[0].play();

        }
    }
}
function GetCandidateInfo2(userId, hasWaiting) {
    App.blockUI({
        target: '.candidateinfo',
        animate: true,
        overlayColor: 'none',
    });
    //console.log("GetCandidateInfo2")
    //var userId = $("#hdnChatUserID").val();
    $.ajax({
        url: "/Company/OnlineCareerFair/GetCandidateInfo",
        type: "GET",
        data: { candidateId: userId, hasWaiting: hasWaiting },
        success: function (data) {
            if (data != null) {
                $('.candidateinfo').empty().html(data);
                if (hasWaiting) {
                    $(".showcandidateinfo").trigger("click");
                }
                if ($("#" + userId).length > 0) {
                    console.log("1111111");
                    //photo = $("#" + userId).find('.user-photo').attr('src');

                    //$('.candidate-info #profile-img').attr('src', photo);
                }
            }
            App.unblockUI({ target: '.candidateinfo' });

        },
        error: function (response) {
            App.unblockUI({ target: '.candidateinfo' });
            console.log(response.responseText + " - " + response.status);
        },
    });
}
function UnBlockWaiting() {

    setTimeout(function () {
        var $waiting = $('#bekleyen');
        $waiting.unblock();
    }, 1000)
}
function UnBlockChatting() {
    setTimeout(function () {
        var $chatting = $('#gorusulen');
        $chatting.unblock();
    }, 1000)
}
function UnBlockChattingAndWaiting() {
    UnBlockChatting();
    UnBlockWaiting();
}

function AddChatList(item) {
    //    App.blockUI({
    //        target: '#bekleyen',
    //        animate: true,
    //        overlayColor: 'none'
    //});
    $('#bekleyen').block(blockOptions);;
    $('#gorusulen').block(blockOptions);

    //el.block({
    //    message: html,
    //    baseZ: options.zIndex ? options.zIndex : 1000,
    //    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
    //    css: {
    //        top: '10%',
    //        border: '0',
    //        padding: '0',
    //        backgroundColor: 'none'
    //    },
    //    overlayCSS: {
    //        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
    //        opacity: options.boxed ? 0.05 : 0.1,
    //        cursor: 'wait'
    //    }
    //});
    console.log("Running AddChatList");
    var userId = $(item).data("userid");
    var fullName = $(item).data("fullname");
    var moderatorUserID = parseInt($("[id$=hdnCurrentUserID]").val());
    $(item).prop("disabled", true);

    chat.server.CountOfActiveConversation(moderatorUserID).then(function (result) {
        if (result && result >= 3) {
            toastr.info(Res.Others.MaxChatCountSameTimeMessage);
            UnBlockChattingAndWaiting();
            $(item).prop("disabled", false);
        }
        else {
            var chattingUserCount = $('#gorusulen ul li').length;

            if (chattingUserCount >= 3) {
                toastr.info(Res.Others.MaxChatCountSameTimeMessage);
                UnBlockChattingAndWaiting();
                $(item).prop("disabled", false);

            }
            else {
                chat.server.AddChatList(userId).then(function (response) {
                    if (response == 1) {
                        RemoveUserFromWaitingList(userId);
                        chat.server.GetChattingUsers(moderatorUserID).then(function (users) {
                            console.log(users);
                            $.each(users, function (i, user) {
                                AddUser(chat, user.UserID, user.UserName, user.UserID, user.UniName, user.UniProgram, user.UniClass, user.ProfilePhoto, user.Level, user.Conversastion, false, false);
                            });
                            UnBlockChattingAndWaiting();
                        }).fail(function () {
                            UnBlockChattingAndWaiting();
                        });
                        //GetChattingUsers();
                        toastr.success(fullName + Res.Others.Connecting);
                    }
                    else {
                        toastr.warning(fullName + Res.Others.NotConnectedToChat);
                        UnBlockChattingAndWaiting();
                    }
                    $(item).prop("disabled", false);

                }).fail(function (error) {
                    UnBlockChattingAndWaiting();
                    console.log("AddChatList error:" + error)
                    $(item).prop("disabled", false);
                });
            }
        }

    })

}
function GetConversation(conversationId) {
    var _conversation;
    var response = false;

    chat.server.GetConversation(conversationId).done(function (thisConversation) {
        console.log("GetConversation");
        console.log(thisConversation);
        response = true;
        _conversation = thisConversation;
        //_conversation = thisConversation;


    });




    console.log("GetConversation2");
    console.log(_conversation);
    return _conversation;


}
function AddUser(chat, id, name, userid, uniName, uniProgram, uniClass, profilePhoto, level, conversation, activeUser, online) {
    console.log("Add user")
    var currentuserid = parseInt($("[id$=hdnCurrentUserID]").val());
    //console.log(currentuserid)

    var connectionid = $('#hdId').val();
    //console.log(connectionid)

    var code = "";
    if (connectionid == "") {
        if (userid == currentuserid) {
            $('#hdId').val(id);
            connectionid = id;
            $('#hdUserName').val(name);
        }
    }

    var timeId = "time" + id;
    if (connectionid != id) {

        if ($('#' + id).length == 0) {
            profilePhoto = GetProfilePhotoFromUserList(id);
            //console.log(conversation)


            var timeSpan = '<span data-cid="' + conversation.ID + '" data-uid="' + userid + '" id="' + timeId + '" class="time"><span class="minutes"></span><span class="seconds"></span></span>';
            var expiredId = "expired_" + id;
            var expireSpan = '<span data-cid="' + conversation.ID + '" data-uid="' + userid + '" id="' + expiredId + '" class="expired">' + Res.Others.TimesUp + '</span></span>';

            //code = $('<li id="' + id + '" data-conversationid="' + conversation.ID + '" class="contact"> <div class="wrap"> <span class="contact-status online"></span> <span class="unreadMessage" style="display:none;"></span> <span id="' + timeId + '" class="time blue ' + timeId + '"><span class="minutes"></span><span class="seconds"></span></span> <img class="user-photo" src="' + profilePhoto + '" alt=""> <div class="meta"> <p class="name">' + name + '</p><p class="preview">' + uniName + '</p><p class="preview">' + uniProgram + '</p><p class="preview">' + uniClass + '</p></div></div></li>');

            var classOnline = '';
            if (online) {
                classOnline = 'online'
            }
            code = $('<li  id="' + id + '" data-conversationid="' + conversation.ID + '" class="candidate contact"> <img class="profile-img user-photo" src="' + profilePhoto + '" alt="avatar"> <span class="contact-status ' + classOnline + '"></span> <div class="info"> <div class="name mb-1">' + name + '</div><div class="title">' + uniName + '</div><div class="candidate-uni">' + uniProgram + '</div><div class="candidate-level">' + level + '</div></div><div> ' + timeSpan + expireSpan + ' <span class="unreadMessage" style="display:none;"></span> </div></li>');

            //code = $('<div id="' + id + '" class="chat_list"><div class="chat_people"><div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="chat_ib"><h5>' + name + ' <span class="chat_date">Dec 25</span></h5><p>dsf</p></div></div></div>')
            //code = $('<a id="' + id + '" class="col-sm-12 bg-success" > <i class=\"fa fa-user\"></i> ' + name + '<a>');
            $(code).click(function () {

                var endCall = true;
                //if (app.currentSession && app.currentSession.state === QB.webrtc.SessionConnectionState.CONNECTED) {
                //    if (confirm("Aktif bir görüşmeniz var. Devam ederseniz görüntülü görüşmeniz sonlandırılacak! Devam etmek istiyor musunuz?")) {
                //        app.currentSession.stop({});
                //    } else {
                //        console.log("move temporary................................")
                //        var newParent = document.getElementById('temporary-video-content');
                //        var oldParent = document.getElementById('qb-video');

                //        while (oldParent.childNodes.length > 0) {
                //            newParent.appendChild(oldParent.childNodes[0]);
                //        }
                //        endCall = false;

                //    }
                //}
                if (endCall)
                {
                    console.log($(this))
                    var id = $(this).attr('id');
                    $('#gorusulen .contact').each(function (index, value) {
                        var link = $(this).removeClass('active');
                    });
                    $(this).addClass('active');
                    if (connectionid != id) {
                        chattingUserID = id;
                        console.log("currentConversation");
                        conversationId = conversation.ID;
                        var $clickedItem = $(this);
                        chatting = true;

                        chat.server.GetConversation(conversationId).then(function (thisConversation) {
                            console.log("unblocked")

                            $(".chat-buttons").css("display", "block");
                            OpenPrivateChatWindow(chat, id, name, thisConversation, false);
                            $clickedItem.find('.unreadMessage').text('');
                            $clickedItem.find('.unreadMessage').hide();
                            GetCandidateInfo2(id, false);
                        });
                    }
                }
                
            });

            var ctrId = 'private_' + id;
            if ($('#' + ctrId).length > 0) {
                console.log("x5")
                if ($('#' + ctrId).hasClass("waiting")) {
                    console.log("x6")
                    setTimeout(function () {
                        $('#' + id).trigger("click");
                    })
                }
            }
        }
        else {

            if ($('#' + id).length != 0) {
                $('#' + id).find('.contact-status').addClass('online');

                if ($(".write_msg").length > 0 && $(".write_msg").val().length === 0) {
                    $('#' + id).click();
                }
            }
            var ctrId = 'private_' + id;
            if ($('#' + ctrId).length != 0) {
                console.log("unlock chat 1");
                $('#mesgs .write_msg').prop("disabled", false);
                $('#SendMessage').prop("disabled", false);
            }
            else {

            }

        }
    }
    else {
        //if ($('#curruser_' + id).length == 0) {
        //    code = $('<div id="curruser_' + id + '" class="col-sm-12 bg-info"  ><i class=\"fa fa-user\"></i> ' + name + '<div>');

        //}
    }
    console.log(code);
    //$('#contacts ul').append(code);
    $('#gorusulen ul').append(code);
    UpdateChattingUserCount();
    SetActive(true);
    if (conversation && conversation.CandidateConnectDate > 0) {
        setTimeout(function () {
            //var deadline = new Date(1570458711000); 
            var deadline = new Date(Date.parse(new Date()) + conversation.RemainingTime);
            //var deadline = new Date(conversation.FinishDateTimeTimeStamp);
            //var deadline = new Date(1570458711000);
            initializeClock(timeId, id, deadline);
        }, 100);
    }
    if ($('#mesgs').find('.msg_history').hasClass('msg_history')) {
    }
    else {
        if (activeUser) {
            $('#' + id).trigger("click");
        }
    }

    //$("#chat_box").append(code);
}
var TypingFlag = true;

function ResetTypingFlag() {
    TypingFlag = true;
}

function RemoveChatContent() {
    console.log("RemoveChatContent")
    $('#mesgs').empty();
    setTimeout(function () {
        $('#mesgs').addClass('chat-bg');
    }, 200);
    $('.user-info').empty();
    $('.chat-buttons').css("display", "none");
}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, userId, endtime) {
    var clock = document.getElementById(id);


    if (clock != null) {
        //var daysSpan = clock.querySelector('.days');
        //var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');
        var conversationId = $("#" + id).data("cid");
        var userId = $("#" + id).data("uid");
        console.log("cccc:" + conversationId);
        function updateClock() {
            var t = getTimeRemaining(endtime);

            //daysSpan.innerHTML = t.days;
            //hoursSpan.innerHTML = ('0' + t.hours).slice(-2);

            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2) + ":";
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.minutes == 0) {
                minutesSpan.parentNode.classList.add("red");
            }
            if (t.total <= 0) {
                clearInterval(timeinterval);
                if (conversationId && id.indexOf("two") == -1) {

                    console.log("chat time expired")

                    if (typeof app !== 'undefined' && !_.isEmpty(app.currentSession)) {

                        app.currentSession.stop({});
                        app.currentSession = {};
                        $("#video-content").remove();
                        $(".btn.call-actions.video-call").show();
                        $("#onvideocall").modal("hide");

                        $(".btn-end-call").hide();

                    }
                    EndConversation(conversationId, userId, true);
                }
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
        if (id.indexOf("two") == -1) {
            console.log("timeintervals")
            timeintervals.push({ timeId: id, userId: userId, timeObject: timeinterval });
            console.log(timeintervals)

        }
    }


}
function scroll(height, ele, duration) {
    this.stop().animate({ scrollTop: height }, duration, function () {
        var dir = height ? "top" : "bottom";
        $(ele).html("scroll to " + dir).attr({ id: dir });
    });
};
function ScrollToMessages(duration) {
    if ($('.messages').length > 0) {
        height = 0;
        var wtf = $('.messages');
        console.log(height);
        if (height < wtf[0].scrollHeight) {
            console.log("scroll 1");
            height = wtf[0].scrollHeight
        }
        else {
            console.log("scroll 2");
            height = 0;
        }
        scroll.call(wtf, height, this, duration);
    }
    else {
        console.log("messages class not found")
    }

}
//var deadline = new Date(1569862209000);
//initializeClock('clockdiv', deadline);

function BlockElementMessage(message) {
    var $ss = $('.right-sidebar .user-info');

    //$('div.test').block({
    //    message: '<h1>Processing</h1>',
    //    css: { border: '3px solid #a00' }
    //});

    $ss.block({
        message: '<center><img src="/Areas/Admin/Content/layouts/layout2/img/loading-spinner-default.gif" align="center"></center>',
        target: '.right-sidebar',
        //message: '<div class="loading-message ' + ('loading-message-boxed') + '"><div class="lds-facebook"><div></div><div></div><div></div></div><div>&nbsp;&nbsp;' + (message) + '</div></div>',
        css: {
            border: '0',
            padding: '0',
            backgroundColor: 'none'
        },
        overlayCSS: {
            backgroundColor: '#555',
            opacity: 0.1,
            cursor: 'wait'
        }
    });

}