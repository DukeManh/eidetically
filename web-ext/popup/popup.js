$(() => {
  $('.wrapper').css({
      'max-height': '1000px',
    }
  );
  const bg = chrome.extension.getBackgroundPage();
  if (!bg.auth.currentUser) {
    $('.loginProvider').on('click', function(ev) {
      const providerId = $(this).attr('data-provider-id');

      chrome.runtime.sendMessage(
        {
          command: 'signIn',
          payload: {
            providerId,
          },
        }
      );
    })
  }

  else{
  const user = bg.auth.currentUser;
  $('#signInProvider').hide();

  const userCard = `
    <div class='userCard'>
      <div class='avatar'>
        <img src="${user.photoURL}" alt="${user.displayName}'s avatar" /> 
        <div class="overlay"></div>
      </div>
      <div style='margin-bottom: 5px'>
        <h4 class="text-center">${user.displayName}</h4> 
        <p class="email">${user.email || user.providerData[0].email || user.providerData[0].providerId}</p>
      </div>
      <button class="signOutButton">Sign Out</button>
    </div>
  `;

  $('#userInfo').html(userCard);

  $('.signOutButton').on('click', function(ev) {
    bg.auth.signOut();
    window.location.reload();
  });
 }
});