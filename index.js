const body = document.querySelector("body"), 
      modeToggle = body.querySelector(".mode-toggle"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

// Get and apply saved mode and sidebar status from localStorage
initializeSettings();

function initializeSettings() {
    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
        body.classList.add("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
        sidebar.classList.add("close");
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    body.classList.toggle("dark");
    const mode = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("mode", mode);
}

// Function to toggle sidebar open/close
function toggleSidebar() {
    sidebar.classList.toggle("close");
    const status = sidebar.classList.contains("close") ? "close" : "open";
    localStorage.setItem("status", status);
}

// Event Listeners
modeToggle.addEventListener("click", toggleDarkMode);
sidebarToggle.addEventListener("click", toggleSidebar);


//---------
 // Display user info or intro
const userStatusUrl = "https://script.google.com/macros/s/AKfycbzFgpCMbyypB9oat7GW05uvncFiayTSzoXqcT3t6WrlKyz8Oe07ZpLO9fpHLcjdEQ9c/exec"; // Replace with your web app URL
const email = localStorage.getItem("email"); // Assuming 'userEmail' is stored in local storage

window.onload = async function () {
    const passwordResetMessage = localStorage.getItem("passwordResetMessage");
  
    if (passwordResetMessage) {
    // Display the message (you can use a div or modal to show it)
    showPopupMessage(passwordResetMessage);  // Simple alert for demonstration
    
    // Remove the message from localStorage after displaying
    localStorage.removeItem("passwordResetMessage");
  }
    
  if (!email) {
      window.location.href = "#";
      waitSec(() => {
          loadimg.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
          waitSec(() => {
              draft.style.display = "block";
              }, 3);
          waitSec(() => {
              hideLoading();
              }, 6);
          waitSec(() => {
              alertPopup.style.display = "block";
              }, 10);
}, 5);
      
      return;
  }

  try {
    const response = await fetch(userStatusUrl);
    const data = await response.json();

    // Find the user details by email
    const clientData = data.find(row => row[1] === email); // Assuming column index 2 contains the email

    if (clientData) {
      document.getElementById("userName").textContent = clientData[0]; // Name (column 0)
      document.getElementById("profileName").textContent = clientData[0]; // Name (column 0)
      document.getElementById("frontName").textContent = clientData[0]; // Name (column 0)
        document.getElementById("userEmail").textContent = clientData[1]; // Email (column 2)
      const userPasswordElement = document.getElementById("userPassword");
  userPasswordElement.setAttribute("data-password", clientData[2]); // Store the actual password in a data attribute
document.getElementById("userRole").textContent = clientData[3]; // Role (column 4)
     alert("All done!");
        logindone();
        loadTickets();
    } else {
      alert("User not found!");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to load. Please login again.");
      window.location.href = "in.html";
  }
};

function closePopupalert() {
    document.getElementById("alertPopup").style.display = "none";
document.getElementById("alertEdit").style.display = "none";
  }

  function logout() {
  // Clear the stored user data from localStorage
  localStorage.removeItem("email");
    // Optionally, clear any other session-related data if needed
  // localStorage.removeItem('otherKey'); // Example for other session data
  
  // Redirect the user back to the login page
  window.location.href = "index.html"; // Change to your login page URL
}

function viewHome(){
    yourTicket.style.display = "none";
    viewBoxs.style.display = "block";
}

function viewTickets(){
    yourTicket.style.display = "block";
    viewBoxs.style.display = "none";
}

function waitSec(callback, seconds = 2) {
  setTimeout(callback, seconds * 1000);
}

function showLoading() {
                loadimg.style.display = "flex";
            }

function hideLoading() {
                loadimg.style.display = "none";
            }

function logindone(){
    menuTickets.style.display = "block";
    modeLogout.style.display = "block";
    profiletrue.style.display = "block";
    profilefalse.style.display = "none";
    draft.style.display = "none";
    viewBoxs.style.display = "block";
    
}
//-------------

let currentlyVisibleGrid = null; // Keeps track of the currently visible grid

function filterSuggestionsAndContent() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const grids = document.querySelectorAll('.content-grid');
    const suggestionList = document.getElementById('suggestion-list');
    
    suggestionList.innerHTML = ''; // Clear previous suggestions
    let suggestionAdded = false; // Flag to track if any suggestion was added

    grids.forEach(grid => {
        const gridType = grid.dataset.grid; // Get grid type (e.g., 'video', 'image')
        const items = grid.querySelectorAll('.content-item');
        let matchFound = false;

        items.forEach(item => {
            const content = item.innerText.toLowerCase(); // Get the visible text content
            if (content.includes(query)) {
                matchFound = true;
            }
        });

        if (matchFound) {
            // Add matching grid type to suggestions
            const suggestion = document.createElement('li');
            suggestion.innerText = capitalize(gridType);
            suggestion.onclick = () => showGrid(gridType);
            suggestionList.appendChild(suggestion);
            searchicon.style.color = "green";
            searchbox.style.border = "1px solid green"
            suggestionList.style.border = "1px solid #ccc";
            suggestionAdded = true; // Mark that a suggestion was added
        }

        // Also filter content in the visible grid in real-time based on the query
        if (currentlyVisibleGrid && grid.dataset.grid === currentlyVisibleGrid) {
            const items = grid.querySelectorAll('.content-item');
            items.forEach(item => {
                const content = item.innerText.toLowerCase();
                if (content.includes(query)) {
                    item.style.display = 'block'; // Show the matching item
                } else {
                    item.style.display = 'none'; // Hide non-matching item
                }
            });
        }
    });

    // If no grid is selected, show all content
    if (!currentlyVisibleGrid) {
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.content-item');
            items.forEach(item => {
                const content = item.innerText.toLowerCase();
                if (content.includes(query)) {
                    item.style.display = 'block'; // Show the matching item
                } else {
                    item.style.display = 'none'; // Hide non-matching item
                }
            });
        });
    }

    // If no suggestion was added, show "No matches found" and show all content
    if (!suggestionAdded) {
        const noMatches = document.createElement('li');
        noMatches.innerText = 'No matches found';
        suggestionList.appendChild(noMatches);
        searchicon.style.color = "red";
        searchbox.style.border = "1px solid red"
        suggestionList.style.border = "1px solid red";

        // Show all items instead of hiding them
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.content-item');
            items.forEach(item => {
                item.style.display = 'block'; // Show all items
            });
        });
    }
}

function showGrid(gridType) {
    const grids = document.querySelectorAll('.content-grid');
    if (!email) {
      hideLoading();
      alertPopup.style.display = "block";
      return;
  }
    
    grids.forEach(grid => {
        if (grid.dataset.grid === gridType) {
            grid.style.display = 'block'; // Show the matching grid
            currentlyVisibleGrid = gridType; // Set the currently visible grid
        } else {
            grid.style.display = 'none'; // Hide others
        }
    });

    document.getElementById('suggestion-list').innerHTML = ''; // Clear dropdown
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Hide the dropdown when clicking outside
document.addEventListener('click', (event) => {
    const input = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');

    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ''; // Clear dropdown
        suggestionList.style.border = "none";
        searchicon.style.color = "var(--black-light-color)";
        searchbox.style.border = "none"
    }
});


//-------
  const API_URL = "https://script.google.com/macros/s/AKfycbzq26e3QS4XQqFgqjJjIm7qU6k0YymCv0IXgCo5rmpErhOQs0MCCGq7Fib3qoubGYM9lA/exec";

async function loadTickets() {
  const data = { action: "getTickets", email: localStorage.getItem("email") };
  const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
  const result = await res.json();

  if (result.success) {
    const tableBody = document.getElementById("ticketTable");
    const totalCountElement = document.getElementById("totalTickets");

    const tickets = result.tickets;

    // Update the total tickets count
    totalCountElement.textContent = tickets.length;

    // Populate the ticket table
    tableBody.innerHTML = tickets
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
        let editButton = "";

        if (daysRemaining < 0) {
          // Expired (date is in the past)
          dateStyle = "color: red; font-weight: bold;";
          editButton = `<button class="btn btn-warning" onclick="NonEdit()"> 
            <i class="fa fa-pencil fa-sm"></i>
          </button>`;
        } else if (daysRemaining <= 5) {
          // Near expiration (5 days or less)
          blinkClass = "blink-red";
          editButton = `<button class="btn btn-warning" onclick="NonEdit('${ticket[0]}', '${ticket[3]}')"> 
            <i class="fa fa-pencil fa-sm"></i>
          </button>`;
        } else {
          // Not near expiration
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
  } else {
    alert("Failed to load tickets");
  }
}


//---
function testtemp(){
    localStorage.setItem("email", "sachethansalian@gmail.com");
    window.location.href = "index.html";
}
function reloadpage(){
    window.location.href = "index.html";
}

function toggleSearchBox() {
    const title = document.getElementById('title-container');
    const searchInput = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');

    // Hide the main title and show the search input
    title.style.display = 'none';
    searchInput.style.display = 'inline-block'; // Display search input
    suggestionList.style.display = 'block'; // Display suggestion list (optional)
    searchInput.focus(); // Focus on the input
}

// Event listener for clicking outside
document.addEventListener('click', (event) => {
    const searchBox = document.getElementById('searchbox');
    const searchInput = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');
    const title = document.getElementById('title-container');
    const searchIcon = document.getElementById('searchicon');

    // Check if the clicked element is outside the search box and search icon
    if (!searchBox.contains(event.target) && event.target !== searchIcon) {
        searchInput.style.display = 'none'; // Hide the search input
        suggestionList.style.display = 'none'; // Hide suggestion list
        title.style.display = 'inline'; // Show the main title
    }
});
