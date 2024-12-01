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

function createTicket() {
  const type = document.getElementById("type").value;
  const dueDate = document.getElementById("dueDate").value;
  const fileUrl = document.getElementById("fileUrl").value;
  const description = document.getElementById("description").value;

  if (type && dueDate && fileUrl && description) {
    alert("Ticket Created Successfully!");
    closeAddTicketPopup();
  } else {
    alert("Please fill in all fields.");
  }
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

    async function createTicket() {
      const type = document.getElementById("type").value;
      const dueDate = document.getElementById("dueDate").value;
      const fileUrl = document.getElementById("fileUrl").value;
      const description = document.getElementById("description").value;

      const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
        method: "POST",
        body: JSON.stringify({
          action: "createTicket",
          email,
          type,
          dueDate,
          fileUrl,
          description
        }),
      });

      const result = await response.json();
      alert(result.message);
      if (result.status === "success") {
        location.reload();
      }
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
