window.onload = function () {
  let token_id = null;

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.command) {
      case 'getUser':
        break;
      case 'signOut':
        token_id = null;
        break;
      default:
        break;
    }
  });
};