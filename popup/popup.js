$(() => {
  const signedIn = $("#signedIn");
  const signedOut = $("#signedOut");
  const name = $("#username");
  const token = $("#token_id");

  signedIn.hide();

  const updateUser = (user) => {
    if (user){
      signedIn.show();
      signedOut.hide();
      name.text(`Signed in as ${user.name}`)
    }
    else {
      signedIn.hide();
      signedOut.show();
      name.text('');
    }
  };

  chrome.runtime.sendMessage(
    {
      command: 'getUser',
    },
    (auth) => {
      if (auth) {
        updateUser(auth.user);
      }

      $('.signIn').on(`click`, () => {
        chrome.runtime.sendMessage({
          command: 'signIn',
          payload: {
            token: token.val(),
          },
        }, (auth) => {
          if (auth){
            token.val('');
            updateUser(auth.user);
          }
        });
      });

      $('.signOut').on('click', () => {
        chrome.runtime.sendMessage({
          command: 'signOut',
        });
        updateUser(null);
      });
    },
  );
});