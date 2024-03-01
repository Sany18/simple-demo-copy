const CLIENT_ID = '552031383715-pag4r7bf3ebmrp2p777l6gmhsjh07hg3.apps.googleusercontent.com'; // SGP Oauth Client ID
const API_KEY = 'AIzaSyB-750APMiFYlMk-uU6zETbJ4uJ4p0N7Vw'; // WEB API KEY

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = `
  https://www.googleapis.com/auth/drive.metadata.readonly
`;

let gisCient;
let gisInited = false; // gis = Google Identity Service
let gapiInited = false; // gapi = Google API



function gisLoaded() {
  gisCient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
}
window.gisLoaded = gisLoaded;

function gapiLoaded() {
  gapi.load('client', async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    window.gapiToken && gapi.client.setToken(window.gapiToken);
    changeGoogleButtonsVisibility();
    getUserProfile();
  });
}
window.gapiLoaded = gapiLoaded;

function handleAuthClick() {
  gisCient.callback = async (resp) => {
    if (resp.error !== undefined) throw (resp);
    saveGAPITokenToLocalStorage(gapi.client.getToken());
    changeGoogleButtonsVisibility();
    listFiles();
  };

  const token = gapi.client.getToken();
  if (token === null) {
    gisCient.requestAccessToken();
  } else {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    removeTokenFromLocalStorage();
  }
  changeGoogleButtonsVisibility();
}
window.handleAuthClick = handleAuthClick;

async function listFiles() {
  let response;

  try {
    response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    });
  } catch (err) {
    console.error(err);
    return;
  }

  const files = response.result.files;
  if (!files || files.length == 0) {
    console.info('No files found.');
    return;
  }
  // Flatten to string to display
  console.log(files);
}


function changeGoogleButtonsVisibility() {
  const authButton = document.querySelector('#auth-button');
  const profile = document.querySelector('#profile');

  if (window.gapiToken) {
    authButton.innerHTML = 'Logout';
    profile.style.display = 'block';
    // profile.innerHTML = `
    //   <img src="${currentUser.userInfo.picture}" alt="profile" />
    //   <span>${currentUser.userInfo.name}</span>
    // `;
  } else {
    authButton.innerHTML = 'Login with Google';
    profile.style.display = 'none';
  }
}
window.changeGoogleButtonsVisibility = changeGoogleButtonsVisibility;

function saveGAPITokenToLocalStorage(gapiToken) {
  localStorage.setItem('gapiToken', JSON.stringify(gapiToken));
  window.gapiToken = gapiToken;
}
window.saveGAPITokenToLocalStorage = saveGAPITokenToLocalStorage;

function removeTokenFromLocalStorage() {
  localStorage.removeItem('gapiToken');
  window.gapiToken = null;
}
window.removeTokenFromLocalStorage = removeTokenFromLocalStorage;

function getGAPITokenFromLocalStorage() {
  const gapiTokenJSON = localStorage.getItem('gapiToken');
  if (!gapiTokenJSON) return null;
  return JSON.parse(gapiTokenJSON);
}
window.getGAPITokenFromLocalStorage = getGAPITokenFromLocalStorage;

function getUserProfile() {
  gapi.client.request({
    path: `https://www.googleapis.com/oauth2/v1/userinfo`,
    callback: (resp) => {
      if (resp.error !== undefined) throw (resp);
      return resp;
    }
  });
}
window.getUserProfile = getUserProfile;

window.addEventListener('load', () => {
  window.gapiToken = getGAPITokenFromLocalStorage();
  changeGoogleButtonsVisibility();
});

//////////////////////
// helpers
//////////////////////

function decodeJwtResponseFromGoogleAPI(token) {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
window.decodeJwtResponseFromGoogleAPI = decodeJwtResponseFromGoogleAPI;
