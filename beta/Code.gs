function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case "register":
      return ContentService.createTextOutput(
        JSON.stringify(register(data.username, data.email, data.password))
      ).setMimeType(ContentService.MimeType.JSON);
      
    case "login":
      return ContentService.createTextOutput(
        JSON.stringify(login(data.email, data.password))
      ).setMimeType(ContentService.MimeType.JSON);
      
    case "fetchTickets":
      return ContentService.createTextOutput(
        JSON.stringify(fetchTickets(data.email))
      ).setMimeType(ContentService.MimeType.JSON);
      
    case "createTicket":
      return ContentService.createTextOutput(
        JSON.stringify(createTicket(data.email, data.type, data.dueDate, data.fileUrl, data.description))
      ).setMimeType(ContentService.MimeType.JSON);
      
    default:
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Invalid action specified" })
      ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Register a new user
function register(username, email, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { status: "error", message: "Users sheet not found" };

  const data = sheet.getDataRange().getValues();

  // Validate input
  if (!username || !email || !password) {
    return { status: "error", message: "All fields are required" };
  }

  // Check for duplicate email
  for (let i = 1; i < data.length; i++) {
    if (data[i][1].toString().trim() === email.trim()) {
      return { status: "error", message: "Email already exists" };
    }
  }

  // Add new user to the sheet
  sheet.appendRow([username, email, password]);
  return { status: "success", message: "Registration successful" };
}

// Authenticate user login
function login(email, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { status: "error", message: "Users sheet not found" };

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1].toString().trim() === email.trim() && data[i][2].toString().trim() === password.trim()) {
      return { status: "success", message: "Login successful", username: data[i][0], email: data[i][1] };
    }
  }
  return { status: "error", message: "Invalid email or password" };
}

// Fetch tickets for a user
function fetchTickets(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tickets");
  if (!sheet) return { status: "error", message: "Tickets sheet not found" };

  const data = sheet.getDataRange().getValues();
  const userTickets = data.filter((row) => row[1] === email);

  return { status: "success", tickets: userTickets };
}

// Create a new ticket
function createTicket(email, type, dueDate, fileUrl, description) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tickets");
  if (!sheet) return { status: "error", message: "Tickets sheet not found" };

  const lastRow = sheet.getLastRow();
  const ticketID = "T" + (lastRow + 1);

  sheet.appendRow([ticketID, email, type, dueDate, fileUrl, description, "Pending"]);
  return { status: "success", message: "Ticket created successfully" };
}
