$(() => {
  const signedIn = $('#signedIn');
  const signedOut = $('#signedOut');
  const name = $('#username');
  const token = $('#token_id');

  signedIn.hide();

  const updateUser = (user) => {
    if (user) {
      signedIn.show();
      signedOut.hide();
      name.text(`Signed in as ${user.name}`);
    } else {
      signedIn.hide();
      signedOut.show();
      name.text('');
    }
  };

  chrome.runtime.sendMessage(
    {
      command: 'getUser',
    },
    (res) => {
      if (res.status === 'success') {
        updateUser(res.payload.user);
      }

      $('.signIn').on(`click`, () => {
        chrome.runtime.sendMessage(
          {
            command: 'signIn',
            payload: {
              token: token.val(),
            },
          },
          ({ status, payload }) => {
            if (status === 'success') {
              token.val('');
              updateUser(payload.user);
            }
          }
        );
      });

      $('.signOut').on('click', () => {
        chrome.runtime.sendMessage({
          command: 'signOut',
        });
        updateUser(null);
      });
    }
  );
});
