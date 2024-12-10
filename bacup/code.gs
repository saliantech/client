const USERS_SHEET = "Users";
const TICKETS_SHEET = "Tickets";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let response = { success: false };

  switch (data.action) {
    case "register":
      response = registerUser(data);
      break;
    case "login":
      response = loginUser(data);
      break;
    case "addTicket":
      response = addTicket(data);
      break;
    case "getTickets":
      response = getTickets(data);
      break;
    case "updateTicket":
      response = updateTicket(data);
      break;
    case "deleteTicket":
      response = deleteTicket(data);
      break;
    case "fetchUserDetails": // New action to fetch user details
      response = fetchUserDetails(data);
      break;
    case "modifyUserDetails": // New action to modify user details
      response = modifyUserDetails(data);
      break;
    case "requestPasswordReset":
      response = requestPasswordReset(data);
      break;
    case "verifyOTP":
      response = verifyOTP(data);
      break;
    case "resetPasswordWithOTP":
      response = resetPasswordWithOTP(data);
      break;
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function registerUser(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();

  // Check if the email already exists
  if (users.some(row => row[1] === data.email)) {
    return { success: false, message: "Email already exists" };
  }

  // Append a new row with the default role set to 'user'
  sheet.appendRow([data.username, data.email, data.password, 'user']); // Default role is 'user'

  return { success: true };
}


function loginUser(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const user = users.find(row => row[1] === data.email && row[2] === data.password);
  return user ? { success: true, username: user[0] } : { success: false, message: "Invalid credentials" };
}

function addTicket(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TICKETS_SHEET);
  const id = sheet.getLastRow() + 1;
  sheet.appendRow([id, data.email, data.type_of_edit, data.due_date, data.files_url, data.description, "Pending"]);
  return { success: true, id };
}

function getTickets(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TICKETS_SHEET);
  const tickets = sheet.getDataRange().getValues().filter(row => row[1] === data.email);
  return { success: true, tickets };
}

function updateTicket(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TICKETS_SHEET);
  const tickets = sheet.getDataRange().getValues();
  const rowIndex = tickets.findIndex(row => row[0] == data.id);
  if (rowIndex === -1) return { success: false, message: "Ticket not found" };
  sheet.getRange(rowIndex + 1, 3, 1, 4).setValues([[data.type_of_edit, data.due_date, data.files_url, data.description]]);
  return { success: true };
}

function deleteTicket(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TICKETS_SHEET);
  const tickets = sheet.getDataRange().getValues();
  const rowIndex = tickets.findIndex(row => row[0] == data.id);
  if (rowIndex === -1) return { success: false, message: "Ticket not found" };
  sheet.deleteRow(rowIndex + 1);
  return { success: true };
}

// New function to fetch user details
function fetchUserDetails(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const user = users.find(row => row[1] === data.email); // Find by email (column 1)
  if (user) {
    return {
      success: true,
      user: {
        username: user[0],  // Assuming username is column 0
        email: user[1],     // Email is column 1
        role: user[3]       // Assuming role is column 3
      }
    };
  } else {
    return { success: false, message: "User not found" };
  }
}

// New function to modify user details
function modifyUserDetails(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const rowIndex = users.findIndex(row => row[1] === data.email); // Find row by email

  if (rowIndex > 0) { // Ensure header row is skipped
    // Update only provided fields
    if (data.username !== undefined) users[rowIndex][0] = data.username; // Username
    if (data.password !== undefined) users[rowIndex][2] = data.password; // Password
    if (data.role !== undefined) users[rowIndex][3] = data.role;         // Role

    // Write updated data back to the sheet
    sheet.getRange(rowIndex + 1, 1, 1, users[rowIndex].length).setValues([users[rowIndex]]);
    return { success: true, message: "User details updated successfully" };
  } else {
    return { success: false, message: "User not found" };
  }
}

function requestPasswordReset(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const rowIndex = users.findIndex(row => row[1] === data.email); // Find user by email

  if (rowIndex === -1) {
    return { success: false, message: "Email not found" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  sheet.getRange(rowIndex + 1, 5).setValue(otp); // Store OTP in column 5

  // Send email with OTP
  GmailApp.sendEmail(data.email, "Password Reset OTP", `Your OTP for password reset is: ${otp}`);

  return { success: true, message: "OTP sent to your email" };
}

function verifyOTP(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const rowIndex = users.findIndex(row => row[1] === data.email); // Find user by email

  if (rowIndex === -1) {
    return { success: false, message: "Email not found" };
  }

  const storedOTP = users[rowIndex][4]; // Assuming OTP is in column 5
  if (storedOTP == data.otp) {
    return { success: true, message: "OTP verified" };
  } else {
    return { success: false, message: "Invalid OTP" };
  }
}

function resetPasswordWithOTP(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
  const users = sheet.getDataRange().getValues();
  const rowIndex = users.findIndex(row => row[1] === data.email); // Find user by email

  if (rowIndex === -1) {
    return { success: false, message: "Email not found" };
  }

  const storedOTP = users[rowIndex][4]; // Assuming OTP is in column 4
  if (storedOTP != data.otp) {
    return { success: false, message: "Invalid OTP" };
  }

  // Update password
  sheet.getRange(rowIndex + 1, 3).setValue(data.newPassword); // Update password in column 3
  sheet.getRange(rowIndex + 1, 5).setValue(""); // Clear OTP
  return { success: true, message: "Password reset successfully" };
}
