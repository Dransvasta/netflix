// Check if the current page matches a Netflix movie URL
if (window.location.href.includes("https://www.netflix.com/watch/")) {
    console.log("Netflix movie page detected.");
    // Initialize your extension's functionality here
    initializeExtension();
} else {
    console.log("Not a Netflix movie page. Extension is inactive.");
}

function initializeExtension() {
    // Add your extension logic here
    alert("Welcome to the Netflix Movie Comments extension!");
}
