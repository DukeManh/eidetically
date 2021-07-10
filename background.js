window.onload = function () {
  let token_id = null;
  const API = 'https://firestore.googleapis.com/v1beta1/projects/dropit-7ae30/databases/(default)/documents:runQuery';

  const getUser = () => {
    let user;
    try {
      user = jwt_decode(token_id);
    }
    catch(e) {
      console.error(e);
      token_id = null;
      user = null;
    }
    return user;
  }

  const getLibs = async () => {
    console.log(token_id);
    if (!token_id) return [];

    const libs = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token_id}`,
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

    return libs.json();
  };

  chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
    switch (message.command) {
      case 'getUser':
        sendMessage({
          token_id,
          user: getUser(),
        });
        break;
      case 'signIn':
        token_id = message.payload.token;
        sendMessage({
          token_id,
          user: getUser(),
        });
        break;
      case 'signOut':
        token_id = null;
        break;
      case 'getLibs':
        getLibs()
        .then(libs => {
          sendMessage(libs);
        })
        .catch(e => console.log(e))
        break;
      default:
        break;
    }
    return true;
  });
};