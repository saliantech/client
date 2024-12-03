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

      case "updateTicket":
      return ContentService.createTextOutput(
        JSON.stringify(updateTicket(data))
      ).setMimeType(ContentService.MimeType.JSON);

    case "deleteTicket":
      return ContentService.createTextOutput(
        JSON.stringify(deleteTicket(data.id))
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

function updateTicket(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tickets");
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.id) {
      const today = new Date();
      const dueDate = new Date(rows[i][3]);

      // Check if the ticket is editable (5 days before due date)
      if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 5) {
        sheet.getRange(i + 1, 3).setValue(data.dueDate); // Update Due Date
        sheet.getRange(i + 1, 4).setValue(data.fileUrl); // Update File URL
        sheet.getRange(i + 1, 5).setValue(data.description); // Update Description

        return { status: "success", message: "Ticket updated successfully." };
      } else {
        return { status: "error", message: "Ticket cannot be updated within 5 days of due date." };
      }
    }
  }

  return { status: "error", message: "Ticket ID not found." };
}

function deleteTicket(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tickets");
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Ticket deleted successfully." };
    }
  }

  return { status: "error", message: "Ticket ID not found." };
}

