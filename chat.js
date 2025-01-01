const apiBaseUrl = "https://script.google.com/macros/s/AKfycbxkyhvNQ4FGVFHybDViMQbNCMM3eqA4wbcQaOGTYp7AnI-uzcl_MrHLDNgNKoj_fKw_/exec";
let fetchMessagesInterval; // Variable to hold the setInterval ID
let isFetchingMessagesStopped = false; // Flag to check if fetching is stopped

document.addEventListener("DOMContentLoaded", () => {
const senderEmail = localStorage.getItem("email");
@@ -33,8 +32,6 @@ document.addEventListener("DOMContentLoaded", () => {

// Function to fetch and display chat messages
function fetchMessages() {
    if (isFetchingMessagesStopped) return; // Prevent fetching if stopped

fetch(`${apiBaseUrl}?action=getMessages&sender=${senderEmail}&receiver=${recipientEmail}`)
.then(response => response.json())
.then(messages => {
@@ -44,6 +41,7 @@ document.addEventListener("DOMContentLoaded", () => {
const messageItem = document.createElement("div");
messageItem.className = msg.sender === senderEmail ? "outgoing" : "incoming";

          // Create message structure with sender profile and name
const messageText = document.createElement("p");
messageText.textContent = msg.message;

@@ -55,7 +53,7 @@ document.addEventListener("DOMContentLoaded", () => {
           `;
} else {
const recipient = users.find(user => user.email === msg.sender);
            const recipientName = recipient ? recipient.username : msg.sender;
            const recipientName = recipient ? recipient.username : msg.sender; // Default to email if no username is found
messageItem.innerHTML = `
             <div class="details">
               <p><strong>${recipientName}:</strong> ${msg.message}</p>
@@ -83,8 +81,6 @@ document.addEventListener("DOMContentLoaded", () => {
// Handle message sending
document.getElementById("chat-form").addEventListener("submit", e => {
e.preventDefault();
    if (isFetchingMessagesStopped) return; // Prevent sending if fetching is stopped

const messageInput = document.getElementById("message-input");
const message = messageInput.value.trim();
if (message) {
@@ -98,15 +94,14 @@ document.addEventListener("DOMContentLoaded", () => {
})
.catch(error => {
console.error('Error sending message:', error);
         });
          alert('Error sending message. Please try again later.');
        });
}
});

  // Function to stop fetching messages and redirect
  // Function to stop fetching messages and redirect to index.html
window.stopsetInterval = function () {
clearInterval(fetchMessagesInterval); // Stop the interval
    isFetchingMessagesStopped = true; // Set the flag to prevent further fetching and sending
    alert('Fetching messages stopped.');
    window.location.href = "index.html"; // Redirect to index.html
      window.location.href = "index.html"; // Redirect to index.html
};
})
