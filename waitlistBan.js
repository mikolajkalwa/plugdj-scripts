(function () {
    const users = prompt('User(s) ID(s) separated by a comma').split(',').map(Number);
    const reason = parseInt(prompt('Reason:\n1: Spamming/Trolling\n2: Verbal abuse or offensive language\n3: Playing offensive videos/songs\n4: Repeatedly playing inappropriate genre(s)\n5: Negative attitude'));
    const duration = prompt('Duration \ns=15min, \nm=hour,\nl=day,\nf=forever').trim().toLowerCase();

    users.forEach((user, i) => {
        if (isNaN(user)) return;

        setTimeout(() => {
            $.ajax({
                type: 'POST',
                url: 'https://plug.dj/_/booth/waitlistban',
                data: JSON.stringify({
                    userID: user,
                    reason,
                    duration
                }),
                dataType: 'json',
                contentType: 'application/json',
                error: e => {
                    API.chatLog(e);
                }
            });
        }, i * 3500);
    });
})();
