const webAppUrl = "https://script.google.com/macros/s/AKfycbzFgpCMbyypB9oat7GW05uvncFiayTSzoXqcT3t6WrlKyz8Oe07ZpLO9fpHLcjdEQ9c/exec"; // Replace with your web app URL
const email = localStorage.getItem("email"); // Assuming 'userEmail' is stored in local storage

window.onload = async function () {
  if (!email) {
    alert("Email is not found in local storage!");
    return;
  }

  try {
    const response = await fetch(webAppUrl);
    const data = await response.json();

    // Find the user details by email
    const clientData = data.find(row => row[2] === email); // Assuming column index 2 contains the email

    if (clientData) {
      document.getElementById("userName").textContent = clientData[0]; // Name (column 0)
      document.getElementById("userEmail").textContent = clientData[2]; // Email (column 2)
      document.getElementById("userPassword").textContent = clientData[3]; // Password (column 3)
      document.getElementById("userRole").textContent = clientData[4]; // Role (column 4)
    } else {
      alert("User not found!");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to load user details.");
  }
};
