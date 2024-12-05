const CLIENT_ID = '1057044268418-njvj1pt2fnf8s9duct6kma4ve3j38pkc.apps.googleusercontent.com'; // Use your OAuth Client ID
const SCOPES = 'profile email'; // Define the required scopes

chrome.runtime.onInstalled.addListener(() => {
  console.log('OAuth Extension Installed');
});

function getOAuthToken() {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error('Error getting token:', chrome.runtime.lastError);
      alert('Error: ' + chrome.runtime.lastError.message); // Display error in popup
    } else {
      console.log('OAuth Token:', token);
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('User Info:', data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        alert('Error fetching user info: ' + error.message); // Display error in popup
      });
    }
  });
}

// Listen for when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  console.log('Icon clicked, starting OAuth flow...');
  getOAuthToken();
});
