// @ts-check
(async function () {
  const fetchData = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  };

  const mergeUserObject = (userFromChat, userFromStaff) => {
    const user = Object.assign(userFromChat, userFromStaff);
    if (!userFromStaff) {
      user['role'] = 0;
    }

    return user;
  };

  const getRole = (user) => {
    switch (user.role) {
      case 0:
        return '';
      case 1000:
        return 'Dj';
      case 2000:
        return 'Bouncer';
      case 3000:
        return 'Manager';
      case 4000:
        return 'Co-Host';
      case 5000:
        return 'Host';
      default:
        return 'Unknown role';
    }
  };

  const getGlobalRole = (user) => {
    switch (user.gRole) {
      case 0:
        return '';
      case 500:
        return 'Promoter';
      case 750:
        return 'pLoT Member';
      case 2500:
        return 'Site Moderator';
      case 3000:
        return 'Brand Ambassador';
      case 5000:
        return 'Admin';
      default:
        return 'Unknown gRole';
    }
  };

  const download = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content),
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const [[chatData], staff, [roomData]] = await Promise.all([
    fetchData('https://plug.dj/_/chat/history?limit=10000'),
    fetchData('https://plug.dj/_/staff'),
    fetchData('https://plug.dj/_/rooms/state'),
  ]);

  const staffMap = new Map();
  const usersMap = new Map();

  staff.forEach((staffMember) => {
    staffMap.set(staffMember.id, staffMember);
  });

  chatData.users.forEach((user) => {
    const userObj = mergeUserObject(user, staffMap.get(user.id));
    usersMap.set(userObj.id, userObj);
  });

  let chatHistory = '';
  chatData.history.forEach((message) => {
    const user = usersMap.get(message.uid);
    chatHistory += `${message.timestamp} ${message.uid} [${getRole(
      user,
    )} ${getGlobalRole(user)}] ${message.un}: ${message.message}\n`;
  });

  download(roomData.meta.name, chatHistory);
})();
