window.onload = function () {
  let refresh_token = null;
  let id_token = null;
  let current_user = null;
  const API_KEY = 'AIzaSyCUgKWDq2dxiXW3SYBFknfXka7DpYMGacw';
  const API_URL = 'https://firestore.googleapis.com/v1beta1/projects/dropit-7ae30/databases/(default)/documents:runQuery';
  const TOKEN_URL = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;

  function tokenExpired(){
    return Date.now() / 1000 > current_user?.exp || 0;
  }

  async function getIdToken(){
    if (!refresh_token) {
      return null;
    }
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      'Content-Type': 'application/x-www-form-urlencoded',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    });

    if (!res.ok){
      console.error('Error fetching id_token');
      return null;
    }

    const credentials = await res.json();
    refresh_token = credentials.refresh_token;
    id_token = credentials.id_token;
    return id_token;
  }

  function parseToken(){
    let user;
    try {
      user = jwt_decode(id_token);
    }
    catch(e) {
      console.error('Invalid id_token of ', id_token);
      id_token = null;
      user = null;
    }
    current_user = user;
    return user;
  }

  async function getUser() {
    if (!refresh_token){
      return null;
    }

    if (!id_token){
      await getIdToken();
      if (!id_token){
        refresh_token = null;
        return null;
      }
    }

    const user = parseToken();
    if (tokenExpired()){
      await getIdToken();
    }

    return parseToken();
  }

  const getLibs = async () => {
    if (!current_user){
      return null;
    }

    if (tokenExpired()){
      await getIdToken();
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${id_token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "structuredQuery": {
          "where": {
            "fieldFilter": {
              "field": {
                "fieldPath": "owner"
              },
              "op": "EQUAL",
              "value": {
                "stringValue": "laLvpMgONMPO5nMyqXuot38U8jp2"
              }
            }
          },
          "from": [
            {
              "collectionId": "libraries"
            }
          ]
        }
      })
    });

    if (!res.ok){
      console.error('Error fetching libraries');
      return null;
    }

    const libs = await res.json();

    if (libs[0].error) {
      return null;
    }

    return libs;
  };

  chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
    switch (message.command) {
      case 'getUser':
        if (!current_user){
          sendMessage({
            status: 'failed',
          })
        }
        else{
          sendMessage({
            status: 'success',
            payload: {
              id_token,
              user: current_user,
            }
          });
        }
        break;
      case 'signIn':
        refresh_token = message.payload.token;
        getUser().then((user) => {
          if (!user){
            sendMessage({
              status: 'failed',
            });
          }
          else{
            sendMessage({
              status: 'success',
              payload: {
                id_token,
                user,
              }
            });
          }
        });
      break;
      case 'signOut':
        refresh_token = null;
        id_token = null;
        current_user = null;
        sendMessage({status: 'succes'})
        break;
      case 'getLibs':
        getLibs().then((libs) => {
          if (!libs){
            sendMessage({
              status: 'failed'
            });
          }
          else{
            sendMessage({
              status: 'success',
              payload: {
                libs,
              }
            });
          }
        });
        break;
      default:
        break;
    }
    return true;
  });
};