const scriptURL = 'https://script.google.com/macros/s/AKfycbyaxChhZtB5h5UhVRXOzB55VochpvYFVJ_kKU20eOxjAOWPaA3qrOUz_01EhfCBlRI9pQ/exec';

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password }),
  });
  const result = await response.json();

  if (result.status === 'success') {
    localStorage.setItem('username', username);
    localStorage.setItem('clientName', result.clientName);
    localStorage.setItem('email', result.email);
    window.location.href = 'main.html';
  } else {
    document.getElementById('loginMessage').textContent = result.message;
  }
});

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
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

  document.getElementById('registerMessage').textContent = result.message;

  if (result.status === 'success') {
    setTimeout(() => (window.location.href = 'index.html'), 2000);
  }
});

// Populate main page data
document.addEventListener('DOMContentLoaded', async function () {
  const username = localStorage.getItem('username');
  const clientName = localStorage.getItem('clientName');
  const email = localStorage.getItem('email');

  if (document.getElementById('clientName')) {
    document.getElementById('clientName').textContent = clientName;
    document.getElementById('clientEmail').textContent = email;
    document.getElementById('profileName').textContent = clientName;
    document.getElementById('profileEmail').textContent = email;

    const ticketsResponse = await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify({ action: 'fetchTickets', username }),
    });
    const tickets = await ticketsResponse.json();

    const ticketsTable = document.getElementById('ticketsTable');
    tickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticket[0]}</td>
        <td>${ticket[2]}</td>
        <td>${ticket[3]}</td>
        <td>${ticket[4]}</td>
      `;
      ticketsTable.appendChild(row);
    });
  }

  // Tab switching logic
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });
});

// Handle ticket creation
document.getElementById('createTicketForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = localStorage.getItem('username');
  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ action: 'createTicket', username, subject, description }),
  });
  const result = await response.json();

  if (result.status === 'success') {
    alert('Ticket created successfully');
    location.reload();
  } else {
    alert('Error creating ticket');
  }
});
