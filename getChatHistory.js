(async () => {
  const fetchData = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  };

  const chatModule = _.find(require.s.contexts._.defined, m => m && m._events && m._events.notify);
  const amount = prompt('How many messages?');
  const [chatData] = await fetchData(`https://plug.dj/_/chat/history?limit=${amount}`);

  chatData.history.forEach((message) => {
    message.type = 'message';
    message.timestamp = message.timestamp.substring(0, message.timestamp.lastIndexOf('.'));
    chatModule.trigger('chat:receive', message);
  });
})();