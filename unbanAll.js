if (confirm('Unban all users?')) {
    const bannedUsers = API.getBannedUsers();
    bannedUsers.forEach((user, i) => {
        setTimeout(() => {
            $.ajax({
                type: 'DELETE',
                url: `https://plug.dj/_/bans/${user.id}`,
                error: e => {
                    API.chatLog(e);
                },
                success: () => {
                    API.chatLog(`${user.username} has been successfully unbanned.`);
                }
            });
        }, i * 3500);
    });
} else {
    alert('Canceled');
}
