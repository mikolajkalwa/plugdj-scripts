const users = prompt('User(s) ID(s) separated by a comma').split(',').map(Number);
const role = parseInt(prompt('Role:\n1: Resident DJ\n2: Bouncer\n3: Manager\n4: Co-Host\n5: Host'));

users.forEach((user, i) => {
    if (isNaN(user)) return;

    setTimeout(() => {
        $.ajax({
            type: 'POST',
            url: 'https://plug.dj/_/staff/update',
            data: JSON.stringify({
                userID: user,
                roleID: role * 1000,
            }),
            dataType: 'json',
            contentType: 'application/json',
            error: e => {
                API.chatLog(e);
            }
        });
    }, i * 3500);
});
