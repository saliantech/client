function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case "register":
      return ContentService.createTextOutput(JSON.stringify(register(data.username, data.password, data.clientName, data.email)))
        .setMimeType(ContentService.MimeType.JSON);
    case "login":
      return ContentService.createTextOutput(JSON.stringify(login(data.username, data.password)))
        .setMimeType(ContentService.MimeType.JSON);
    case "fetchTickets":
      return ContentService.createTextOutput(JSON.stringify(fetchTickets(data.username)))
        .setMimeType(ContentService.MimeType.JSON);
    case "createTicket":
      return ContentService.createTextOutput(JSON.stringify(createTicket(data.username, data.subject, data.description)))
        .setMimeType(ContentService.MimeType.JSON);
    case "updateTicketStatus":
      return ContentService.createTextOutput(JSON.stringify(updateTicketStatus(data.ticketID, data.newStatus)))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// Register a new user
function register(username, password, clientName, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  // Check for duplicate username or email
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().trim() === username.trim()) {
      return { status: "error", message: "Username already exists" };
    }
    if (data[i][3].toString().trim() === email.trim()) {
      return { status: "error", message: "Email already exists" };
    }
  }

  // Add new user to the sheet
  sheet.appendRow([username, password, clientName, email]);
  return { status: "success", message: "Registration successful" };
}


// Authenticate user login
function login(username, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    // Trim whitespace and compare values
    const storedUsername = data[i][0].toString().trim();
    const storedPassword = data[i][1].toString().trim();

    if (storedUsername === username && storedPassword === password) {
      return { 
        status: "success", 
        message: "Login successful", 
        clientName: data[i][2], 
        email: data[i][3] 
      };
    }
  }

  return { status: "error", message: "Invalid username or password" };
}


// Fetch tickets for the logged-in user
function fetchTickets(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tickets");
  const data = sheet.getDataRange().getValues();
  const userTickets = data.filter(row => row[1] === username);

  return userTickets.length > 0 ? userTickets : [];
}

// Add a new ticket
function createTicket(username, subject, description) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tickets");
  const lastRow = sheet.getLastRow();
  const ticketID = "T" + (lastRow + 1);

  sheet.appendRow([ticketID, username, subject, description, "Open"]);
  return { status: "success", message: "Ticket created successfully" };
}

// Update ticket status
function updateTicketStatus(ticketID, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tickets");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ticketID) {
      sheet.getRange(i + 1, 5).setValue(newStatus);
      return { status: "success", message: "Ticket status updated" };
    }
  }
  return { status: "error", message: "Ticket ID not found" };
}
