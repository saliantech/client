const API_URL = "https://script.google.com/macros/s/AKfycbwQo6nKeB6X6m7GwgcmqpynLhFlNxoohKx3y6j2oPBIKaYGK64nYLCWSc26SBn1EKMw/exec";

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
   loadTickets();
    }

 async function loadTickets() {
  const data = { action: "getTickets", email: localStorage.getItem("email") };
  const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
  const result = await res.json();

  if (result.success) {
    const tableBody = document.getElementById("ticketTable");
    tableBody.innerHTML = result.tickets
      .map(ticket => `
        <tr>
          <td>${ticket[0]}</td>
          <td>${ticket[2]}</td>
          <td>${ticket[3]}</td>
          <td>${ticket[5]}</td>
          <td>${ticket[6]}</td>
          <td>
            <button class="btn btn-primary" onclick="openEditModal('${ticket[0]}', '${ticket[2]}', '${ticket[3]}', '${ticket[4]}', '${ticket[5]}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteTicket(${ticket[0]})">Delete</button>
          </td>
        </tr>`)
      .join("");
  } else {
    alert("Failed to load tickets");
  }
}


async function deleteTicket(id) {
      const data = { action: "deleteTicket", id };
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      alert(await res.text());
      loadTickets();
    }

async function addTicket(event) {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();

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
    // Get user email from localStorage
    const email = localStorage.getItem("email");
    if (!email) {
      alert("User email is missing. Please log in again.");
      return false;
    }

    // Create the ticket data object
    const data = {
      action: "addTicket",
      email,
      type_of_edit: type,
      due_date: dueDate,
      files_url: fileUrl,
      description,
    };

    // Send ticket data to the server
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });

    // Check if the response is valid
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json(); // Parse response as JSON

    // Handle server response
    if (result.success) {
      alert("Ticket added successfully!");
      document.getElementById('id01').style.display = 'none'; // Close popup
      loadTickets(); // Refresh ticket list
    } else {
      alert("Failed to add ticket: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error adding ticket:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}
//-----------------------
async function updateTicket(event) {
  event.preventDefault(); // Prevent form submission

  const id = document.getElementById("editTicketId").value;
  const type_of_edit = document.getElementById("editType").value.trim();
  const due_date = document.getElementById("editDueDate").value.trim();
  const files_url = document.getElementById("editFilesUrl").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  // Validate inputs
  if (!type_of_edit || !due_date || !files_url || !description) {
    alert("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(files_url)) {
    alert("Please provide a valid URL for the file link.");
    return false;
  }

  const data = {
    action: "updateTicket",
    id,
    type_of_edit,
    due_date,
    files_url,
    description
  };

  try {
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();

    if (result.success) {
      alert("Ticket updated successfully");
      loadTickets(); // Reload tickets
      closeEditModal(); // Close modal after success
    } else {
      alert("Error updating ticket");
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}

function openEditModal(id, type, dueDate, fileUrl, description) {
  // Set values in the modal inputs
  document.getElementById("editTicketId").value = id;
  document.getElementById("editType").value = type;
  document.getElementById("editDueDate").value = dueDate;
  document.getElementById("editFilesUrl").value = fileUrl;
  document.getElementById("editDescription").value = description;

  // Display the modal
  document.getElementById("editTicketModal").style.display = "block";
}

function closeEditModal() {
  // Close the modal by hiding it
  document.getElementById("editTicketModal").style.display = "none";
}
