const amount = prompt('How many messages?');

const chat = $('#chat-messages');
$.get(`https://plug.dj/_/chat/history?limit=${amount}`, chatData => {
    const history = chatData.data[0].history;
    const users = chatData.data[0].users;
    $.get('https://plug.dj/_/staff', roomStaff => {
        const staff = roomStaff.data;

        function getUserFromChat(id) {
            return users.find(user => {
                return user.id === id;
            });
        }

        function getUserFromStaff(id) {
            return staff.find(user => {
                return user.id === id;
            });
        }

        history.forEach(message => {
            const user = mergeUserObject(getUserFromChat(message.uid), getUserFromStaff(message.uid));
            createMessage(user, message);
        });
    });
});

function mergeUserObject(chatData, roomStaffData) { // merges data from 2 different endpoints
    const user = Object.assign(chatData, roomStaffData);
    if (!roomStaffData) {
        user['role'] = 0;
    }
    return user;
}

function addImage(text) {
    const imageRegex = /(https?:)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
    return text.replace(imageRegex, imageUrl => {
        return `<img src="${imageUrl}" class="cimg"></img>`;
    });
}

function urlify(text) { // makes urls clickable
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => {
        return `<a href="${url}" target="_blank">${addImage(url)}</a>`;
    });
}

function getBadge(badgeName) {
    if (!badgeName || badgeName === 'blankb') {
        return {
            class: 'badge-box no-badge clickable',
            icon: '<i></i>'
        };
    } else if (badgeName.indexOf('-') === -1) {
        return {
            class: 'badge-box clickable',
            icon: `<i class="bdg bdg-${badgeName}"></i>`
        };
    } else {
        return {
            class: 'badge-box clickable',
            icon: `<i class="bdg bdg-${badgeName} ${badgeName.split('-')[1][0]}"></i>`
        };
    }
}

function getMessageCreationTime(timestamp) {
    const difference = new Date().getTimezoneOffset() / 60;
    const createDate = new Date(timestamp);
    createDate.setHours(createDate.getHours() - difference);
    const dateText = createDate.toTimeString().split(' ')[0];
    return dateText.substr(0, 5);
}

function createMessage(user, messageData) {
    let userAttributes = '';
    let messageType = '';
    if (messageData.message.startsWith('/me ')) {
        messageType = 'emote';
        messageData.message = messageData.message.substring(4, messageData.message.length);
    } else {
        messageType = 'message';
    }
    let subIcon = '';
    if (user.silver) {
        userAttributes += ' has-sub';
        if (user.sub === 1) subIcon = '<i class="icon icon-chat-subscriber"></i>';
        else subIcon = '<i class="icon icon-chat-silver-subscriber"></i>';
    }
    let roomRoleIcon = '';
    if (user.role > 0) {
        if (user.gRole > 0) userAttributes += ' has-staff';
        else userAttributes += ' staff';
        switch (user.role) {
        case 1000:
            roomRoleIcon = '<i class="icon icon-chat-dj"></i>';
            break;
        case 2000:
            roomRoleIcon = '<i class="icon icon-chat-bouncer"></i>';
            break;
        case 3000:
            roomRoleIcon = '<i class="icon icon-chat-manager"></i>';
            break;
        case 4000:
            roomRoleIcon = '<i class="icon icon-chat-host"></i>';
            break;
        case 5000:
            roomRoleIcon = '<i class="icon icon-chat-host"></i>';
            break;
        }
    }
    let gRoleIcon = '';
    switch (user.gRole) {
    case 500:
        userAttributes += ' promoter';
        gRoleIcon += '<i class="icon icon-chat-promoter"></i>';
        break;
    case 750:
        userAttributes += ' plot';
        gRoleIcon += '<i class="icon icon-chat-plot"></i>';
        break;
    case 2500:
        userAttributes += ' sitemod';
        gRoleIcon += '<i class="icon icon-chat-sitemod"></i>';
        break;
    case 3000:
        userAttributes += ' ambassador';
        gRoleIcon += '<i class="icon icon-chat-ambassador"></i>';
        break;
    case 5000:
        userAttributes += ' admin';
        gRoleIcon += '<i class="icon icon-chat-admin"></i>';
        break;
    }
    const messegeElement = ` <div class="cm ${messageType}" data-cid="${messageData.cid}"> <div class="${getBadge(user.badge).class}"> ${getBadge(user.badge).icon} </div> <div class="msg cid-${messageData.cid}"> <div class="from ${userAttributes}"> ${subIcon} ${roomRoleIcon} ${gRoleIcon} <span class="un clickable">${decodeURIComponent(messageData.un)}</span> <span class="timestamp" style="display: inline;">${getMessageCreationTime(messageData.timestamp)}</span> </div> <div class="text cid-${messageData.cid}">${urlify(decodeURIComponent(messageData.message))}</div> </div> </div>`;
    $(chat).append(messegeElement);
}
