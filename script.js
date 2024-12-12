 // Display user info or intro
const userStatusUrl = "https://script.google.com/macros/s/AKfycbzFgpCMbyypB9oat7GW05uvncFiayTSzoXqcT3t6WrlKyz8Oe07ZpLO9fpHLcjdEQ9c/exec"; // Replace with your web app URL
const email = localStorage.getItem("email"); // Assuming 'userEmail' is stored in local storage

window.onload = async function () {
    showLoading();
    const passwordResetMessage = localStorage.getItem("passwordResetMessage");
  
    if (passwordResetMessage) {
    // Display the message (you can use a div or modal to show it)
    showPopupMessage(passwordResetMessage);  // Simple alert for demonstration
    
    // Remove the message from localStorage after displaying
    localStorage.removeItem("passwordResetMessage");
  }
    
  if (!email) {
      hideLoading();
      window.location.href = "index.html";
      return;
  }

  try {
    const response = await fetch(userStatusUrl);
    const data = await response.json();

    // Find the user details by email
    const clientData = data.find(row => row[1] === email); // Assuming column index 2 contains the email

    if (clientData) {
      document.getElementById("userName").textContent = clientData[0]; // Name (column 0)
      document.getElementById("frontName").textContent = clientData[0]; // Name (column 0)
        document.getElementById("userEmail").textContent = clientData[1]; // Email (column 2)
      const userPasswordElement = document.getElementById("userPassword");
  userPasswordElement.setAttribute("data-password", clientData[2]); // Store the actual password in a data attribute
document.getElementById("userRole").textContent = clientData[3]; // Role (column 4)
        hideLoading();
        loadTickets();
    } else {
       hideLoading(); 
      alert("User not found!");
    }
  } catch (error) {
      hideLoading();
    console.error("Error fetching data:", error);
    alert("Failed to load. Please login again.");
      window.location.href = "index.html";
  }
};
//-------------

const API_URL = "https://script.google.com/macros/s/AKfycbzq26e3QS4XQqFgqjJjIm7qU6k0YymCv0IXgCo5rmpErhOQs0MCCGq7Fib3qoubGYM9lA/exec";

function openAddTicketPopup() {
  document.getElementById("ticketModal").style.display = "block";
}

function closeAddTicketPopup() {
  document.getElementById("ticketModal").style.display = "none";
}


 async function loadTickets() {
  showLoading();
  const data = { action: "getTickets", email: localStorage.getItem("email") };
  const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
  const result = await res.json();

  if (result.success) {
    const tableBody = document.getElementById("ticketTable");
    tableBody.innerHTML = result.tickets
      .map(ticket => {
        const dueDate = new Date(ticket[3]); // Convert to Date object
        const today = new Date(); // Current date
        const timeDifference = dueDate - today; // Time difference in milliseconds
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

        // Format date as DD-MMM-YY
        const formattedDate = dueDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit"
        }).replace(/ /g, "-");

        // Determine the style based on expiration status
        let dateStyle = "";
        let blinkClass = "";

        if (daysRemaining < 0) {
          // Expired (date is in the past)
          dateStyle = "color: red; font-weight: bold;";
            editButton = `<button class="btn btn-warning" onclick="NonEdit()"> 
            <i class="fa fa-pencil fa-sm"></i>
                        </button>`;
        } else if (daysRemaining <= 5) {
          // Near expiration (5 days or less)
          blinkClass = "blink-red";
            editButton = `<button class="btn btn-warning" onclick="NonEdit()"> 
            <i class="fa fa-pencil fa-sm"></i>
                        </button>`;
        }
          else if (daysRemaining >= 5) {
          // Near expiration (5 days or less)
            editButton = `<button class="btn btn-primary" onclick="openEditModal('${ticket[0]}', '${ticket[2]}', '${ticket[3]}', '${ticket[4]}', '${ticket[5]}')">
                          <i class="fa fa-pencil fa-sm"></i>
                        </button>`;
        }

        return `
          <tr>
            <td>${ticket[0]}</td>
            <td>${ticket[2]}</td>
            <td style="${dateStyle}" class="${blinkClass}">${formattedDate}</td>
            <td>${ticket[6]}</td>
            <td>
${editButton}
<button class="btn btn-danger" onclick="deleteTicket(${ticket[0]})">
  <i class="fa fa-trash fa-sm"></i>
</button>
</td>
          </tr>`;
      })
      .join("");
    hideLoading();
  } else {
    showPopupMessage("Failed to load tickets");
  }
}

async function deleteTicket(id) {
  showLoading();
      const data = { action: "deleteTicket", id };
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      showPopupMessage(await res.text());
      loadTickets();
    }

async function addTicket(event) {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();
showLoading();
  // Get form field values
  const type = document.getElementById("type").value.trim();
  const dueDate = document.getElementById("dueDate").value.trim();
  const fileUrl = document.getElementById("fileUrl").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validate inputs
  if (!type || !dueDate || !fileUrl || !description) {
    showPopupMessage("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(fileUrl)) {
    showPopupMessage("Please provide a valid URL for the file link.");
    return false;
  }

  try {
    // Get user email from localStorage
    const email = localStorage.getItem("email");
    if (!email) {
      showPopupMessage("User email is missing. Please log in again.");
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
      showPopupMessage("Ticket added successfully!");
      document.getElementById('id01').style.display = 'none'; // Close popup
      loadTickets(); // Refresh ticket list
    } else {
      showPopupMessage("Failed to add ticket: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error adding ticket:", error);
    showPopupMessage("An unexpected error occurred. Please try again later.");
  }
}
//-----------------------
async function updateTicket(event) {
  event.preventDefault(); // Prevent form submission
showLoading();
  const id = document.getElementById("editTicketId").value;
  const type_of_edit = document.getElementById("editType").value.trim();
  const due_date = document.getElementById("editDueDate").value.trim();
  const files_url = document.getElementById("editFilesUrl").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  // Validate inputs
  if (!type_of_edit || !due_date || !files_url || !description) {
    showPopupMessage("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(files_url)) {
    showPopupMessage("Please provide a valid URL for the file link.");
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
        showLoading();
      showPopupMessage("Ticket updated successfully");
      loadTickets(); // Reload tickets
      closeEditModal(); // Close modal after success
    } else {
      showPopupMessage("Error updating ticket");
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    showPopupMessage("An unexpected error occurred. Please try again later.");
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
function showLoading() {
                loadimg.style.display = "flex";
            }

function hideLoading() {
                loadimg.style.display = "none";
            }

function showPopupMessage(message) {
    popupMsg.textContent = message;
    popupMsg.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popupMsg.classList.remove('show');
    }, 3000);
    }

//---------
function logout() {
  // Clear the stored user data from localStorage
  localStorage.removeItem("email");
    // Optionally, clear any other session-related data if needed
  // localStorage.removeItem('otherKey'); // Example for other session data
  
  // Redirect the user back to the login page
  window.location.href = "index.html"; // Change to your login page URL
}

function NonEdit() {
    
  showPopupMessage("Non Editable, This ticket already expired or near to expire")
   }
