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
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
      method: "POST",
      body: JSON.stringify({
        action: "fetchTickets",
        email
      }),
    });

    const result = await response.json();
    const tableBody = document.getElementById("ticketTable");
    tableBody.innerHTML = ""; // Clear table rows before appending new ones

    result.tickets.forEach(ticket => {
      const formattedDate = formatDate(ticket[3]); // Format the date
      const isBlinking = isDateNearExpiry(ticket[3]); // Check if near expiry
      const isEditable = isEditableDueDate(ticket[3]); // Check if due date is editable

      const row = `<tr>
        <td>${ticket[0]}</td>
        <td>${ticket[2]}</td>
        <td class="${isBlinking ? "blinking" : ""}">${formattedDate}</td>
        <td>${ticket[5]}</td>
        <td data-status="${ticket[6].toLowerCase()}">${ticket[6]}</td>
        <td>
          <button class="btn btn-warning" onclick="openEditModal('${ticket[0]}', '${ticket[2]}', '${ticket[3]}', '${ticket[5]}', ${isEditable})">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-danger" onclick="deleteTicket('${ticket[0]}')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
}

// Utility Functions

// Format date to a readable format
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Check if the due date is near expiry (less than 3 days away)
function isDateNearExpiry(dueDate) {
  const currentDate = new Date();
  const targetDate = new Date(dueDate);
  const diffDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}

// Check if the due date allows editing (5+ days remaining)
function isEditableDueDate(dueDate) {
  const currentDate = new Date();
  const targetDate = new Date(dueDate);
  const diffDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
  return diffDays >= 5;
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

function openEditModal(id, type, dueDate, description, isEditable) {
  document.getElementById("editTicketId").value = id;
  document.getElementById("editType").value = type;
  document.getElementById("editDueDate").value = dueDate;
  document.getElementById("editDescription").value = description;

  document.getElementById("editType").disabled = !isEditable;
  document.getElementById("editDescription").disabled = !isEditable;

  if (!isEditable) {
    alert("This ticket cannot be edited as it is less than 5 days before the due date.");
  }

  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function updateTicket(event) {
  event.preventDefault();

  const id = document.getElementById("editTicketId").value;
  const type = document.getElementById("editType").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  if (!type || !description) {
    alert("Please fill in all fields.");
    return false;
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateTicket", id, type, description }),
    });

    const result = await response.json();
    if (result.status === "success") {
      alert("Ticket updated successfully!");
      closeEditModal();
      fetchTickets(); // Refresh table
    } else {
      alert(`Failed to update ticket: ${result.message}`);
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("An error occurred while updating the ticket.");
  }
}
async function deleteTicket(id) {
  if (!confirm("Are you sure you want to delete this ticket?")) return;

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwSWYsHeE9Q1rxjRnhSQp152IDEO3VWlCmKD3tNY38JMPqDvLjWTxEfn2031M9-ZyceuA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteTicket", id }),
    });

    const result = await response.json();
    if (result.status === "success") {
      alert("Ticket deleted successfully!");
      fetchTickets(); // Refresh table
    } else {
      alert(`Failed to delete ticket: ${result.message}`);
    }
  } catch (error) {
    console.error("Error deleting ticket:", error);
    alert("An error occurred while deleting the ticket.");
  }
}
