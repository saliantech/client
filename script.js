function logout() {
  alert("Logged out successfully!");
  // Redirect to login page or implement logout logic
}

function openAddTicketPopup() {
  document.getElementById("ticketModal").style.display = "block";
}

function closeAddTicketPopup() {
  document.getElementById("ticketModal").style.display = "none";
}
   // Display user info or intro
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (username && email) {
      document.getElementById("usernameDisplay").textContent = `${username}`;
      document.getElementById("user-name").textContent = `${username}`;
       document.getElementById("user-email").textContent = `${email}`;
     document.getElementById("emailDisplay").textContent = `${email}`;
   fetchTickets();
    }
async function createTicket(event) {
  event.preventDefault(); // Prevent form submission refresh

  // Get form field values
  const type = document.getElementById("type").value.trim();
  const dueDate = document.getElementById("dueDate").value.trim();
  const fileUrl = document.getElementById("fileUrl").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validate inputs
  if (!type || !dueDate || !fileUrl || !description) {
    alert("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(fileUrl)) {
    alert("Please provide a valid URL for the file link.");
    return false;
  }

  try {
    const email = localStorage.getItem("email"); // Get user email from localStorage
    if (!email) {
      alert("User email is missing. Please log in again.");
      return false;
    }

    // API call
    const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createTicket",
        email,
        type,
        dueDate,
        fileUrl,
        description,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Ticket created successfully!");
      document.getElementById("ticketForm").reset(); // Reset the form
      document.getElementById("id01").style.display = "none"; // Close the modal
    } else {
      alert(`Failed to create ticket: ${result.message}`);
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    alert("An error occurred while creating the ticket. Please try again.");
  }

  return false; // Prevent default form submission
}

async function fetchTickets() {
  const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
    method: "POST",
    body: JSON.stringify({
      action: "fetchTickets",
      email
    }),
  });

  const result = await response.json();
  const tableBody = document.getElementById("ticketTable");
  result.tickets.forEach(ticket => {
    const formattedDate = formatDate(ticket[3]); // Format the date
    const isBlinking = isDateNearExpiry(ticket[3]); // Check if near expiry
 const row = `<tr>
      <td>${ticket[0]}</td>
      <td>${ticket[2]}</td>
      <td class="${isBlinking ? "blinking" : ""}">${formattedDate}</td>
      <td>${ticket[5]}</td>
     <td data-status="${ticket[6].toLowerCase()}">${ticket[6]}</td>
     </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}
function formatDate(dateString) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function isDateNearExpiry(dateString) {
  const today = new Date();
  const dueDate = new Date(dateString);
  const timeDifference = dueDate - today; // Time difference in milliseconds
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days
  return daysDifference <= 2 && daysDifference >= 0; // Check if within 2 days
}
// Function to determine the CSS class based on status
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "status-pending";
    case "accepted":
      return "status-accepted";
    case "on process":
      return "status-on-process";
    case "rejected":
      return "status-rejected";
    default:
      return ""; // Default class for unknown status
  }
}
