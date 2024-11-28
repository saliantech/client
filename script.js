// Utility to show loading effect
function showLoading(show) {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = show ? 'block' : 'none';
}

// Utility to show a popup message
function showPopupMessage(message, type = 'success') {
  const popup = document.getElementById('popupMessage');
  popup.textContent = message;
  popup.className = `popup-message ${type}`;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.style.display = 'none';
      popup.style.opacity = '1';
    }, 1000);
  }, 3000);
}

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  showLoading(true);
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password }),
  });
  const result = await response.json();
  showLoading(false);

  if (result.status === 'success') {
    localStorage.setItem('username', username);
    localStorage.setItem('clientName', result.clientName);
    localStorage.setItem('email', result.email);
    window.location.href = 'main.html';
  } else {
    showPopupMessage(result.message, 'error');
  }
});

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  showLoading(true);
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const clientName = document.getElementById('clientName').value;
  const email = document.getElementById('email').value;

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'register',
      username,
      password,
      clientName,
      email,
    }),
  });
  const result = await response.json();
  showLoading(false);
  showPopupMessage(result.message, result.status === 'success' ? 'success' : 'error');

  if (result.status === 'success') {
    setTimeout(() => (window.location.href = 'index.html'), 2000);
  }
});

// Handle ticket creation
document.getElementById('createTicketForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  showLoading(true);
  const username = localStorage.getItem('username');
  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'createTicket', username, subject, description }),
  });
  const result = await response.json();
  showLoading(false);
  showPopupMessage(
    result.status === 'success' ? 'Ticket created successfully' : 'Error creating ticket',
    result.status === 'success' ? 'success' : 'error'
  );
  if (result.status === 'success') {
    setTimeout(() => location.reload(), 2000);
  }
});
