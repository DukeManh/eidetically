$(() => {
  let user = null;

  chrome.runtime.sendMessage(
    {
      command: 'getUser',
    },
    (usr) => {
      if (usr) {
        user = usr;
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length) {
            try {
              console.log('sending');
              chrome.tabs.sendMessage(tabs[0].id, { command: 'signIn' });
            } catch (e) {
              console.log(e);
            }
          }
        });
      }
    }
  );

  const container = document.createElement('div');
  let html;

  if (user) {
    html = `
      <p class="text-center">Signed in as ${user.displayName}</p>
      <button class="signOut loginButton">Sign out</button>
    `;
  } else {
    html = `
    <input id="auth_token" type="text" placeholder="token"></input>
    <button class="signIn loginButton">Sign in</button>
    `;
  }

  container.innerHTML = html;

  document.body.appendChild(container);

  $('.signIn').on('click', () => {
    console.log($('#auth_token').val());
    chrome.runtime.sendMessage({
      command: 'authenticate',
      payload: {
        token: $('#auth_token').val(),
      },
    });
  });

  $('.signOut').on('click', () => {
    chrome.runtime.sendMessage({
      command: 'signOut',
    });
  });
});
