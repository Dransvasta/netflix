const URI_APP = "http://localhost:5000";
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get username and password input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let windowurl="";
    let payload = {};
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            windowurl = tabs[0].url;
            console.log("Active Tab URL:", windowurl);
            payload = {"windowurl":windowurl};
            const regex = /\/(?:watch|title)\/(\d+)/;

// Extract the ID
const match = windowurl.match(regex);
let id = "";
if (match) {
    id = match[1];
    console.log(id); // Output: 81051649
} else {
   
    console.log("No ID found");
}
            fetch(URI_APP + "/movieinfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ websiteurl: id }), // Ensure payload matches the backend expectation
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Movie Data:", data);
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                });
            

    // Send login request to Flask backend
    fetch(URI_APP+'/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password,windowurl})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful' || data.message === '') {
            // Hide the login section and show the redirect section
            console.log(data.message)
            document.getElementById("login-section").classList.add("hidden");
            document.getElementById("redirect-section").classList.remove("hidden");
        } else {
            // Show error message if login fails
            document.getElementById("error-message").classList.remove("hidden");
            console.log(data.message)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("error-message").classList.remove("hidden");
    });
        } else {
            console.log("No active tab found.");
        }
    });
    
});

// Redirect to Netflix comments section (for example)
document.getElementById("comments-btn").addEventListener("click", function() {
    window.open(URI_APP+"/comments", "_blank");
});
