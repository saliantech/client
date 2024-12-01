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
    const formattedDate = formatDate(ticket[3]); // Assuming ticket[3] is the due date
    const row = `<tr>
      <td>${ticket[0]}</td>
      <td>${ticket[2]}</td>
      <td>${formattedDate}</td>
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
