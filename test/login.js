 // Select all necessary elements
const signUp = document.getElementById('sign-up'),
      signIn = document.getElementById('sign-in'),
      resetPass = document.getElementById('reset-pass'),
      backToLogin = document.getElementById('back-to-login'),
      backToRequestReset = document.getElementById('back-to-request-reset'),
      loginIn = document.getElementById('login-in'),
      loginUp = document.getElementById('login-up'),
      requestResetPassword = document.getElementById('request-reset-password'),
      verifyOtpResetPassword = document.getElementById('verify-otp-reset-password');

// Toggle to Sign Up Form
signUp.addEventListener('click', () => {
    loginIn.classList.remove('block');
    loginUp.classList.remove('none');
    loginIn.classList.toggle('none');
    loginUp.classList.toggle('block');
});

// Toggle to Sign In Form
signIn.addEventListener('click', () => {
    loginIn.classList.remove('none');
    loginUp.classList.remove('block');
    loginIn.classList.toggle('block');
    loginUp.classList.toggle('none');
});

// Show Request Reset Password Form
resetPass.addEventListener('click', () => {
    loginIn.classList.remove('block');
    requestResetPassword.classList.remove('none');
    loginIn.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
});

// Back to Sign In from Request Reset Password
backToLogin.addEventListener('click', () => {
    requestResetPassword.classList.remove('block');
    loginIn.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    loginIn.classList.toggle('block');
});

// Back to Request Reset Password from Verify OTP
backToRequestReset.addEventListener('click', () => {
    verifyOtpResetPassword.classList.remove('block');
    requestResetPassword.classList.remove('none');
    verifyOtpResetPassword.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
});

// Show Verify OTP Form
function showVerifyOTPForm() {
    requestResetPassword.classList.remove('block');
    verifyOtpResetPassword.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    verifyOtpResetPassword.classList.toggle('block');
}

function log_in() {
        loginIn.classList.remove('none');
                loginUp.classList.remove('block');
                loginIn.classList.toggle('block');
                loginUp.classList.toggle('none');
      }
const API_URL = "https://script.google.com/macros/s/AKfycbzq26e3QS4XQqFgqjJjIm7qU6k0YymCv0IXgCo5rmpErhOQs0MCCGq7Fib3qoubGYM9lA/exec";

// Check if the user is already logged in by checking localStorage
window.onload = function() {
  const storedEmail = localStorage.getItem('email');
  const storedUsername = localStorage.getItem('username');
  if (storedEmail && storedUsername) {
    // Redirect to main page if email is found in localStorage
    window.location.href = "test.html"; // Change to your main page URL
  }
};


    async function register() {
        showLoading();
      const data = {
        action: "register",
        username: document.getElementById("r_username").value,
        email: document.getElementById("r_email").value,
        password: document.getElementById("r_password").value,
      };
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      showPopupMessage(await res.text());
      hideLoading();
      log_in();
    }

    async function login() {
      const data = {
        action: "login",
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        alert("Login successful");
        window.location.href = "test.html";
        loadTickets();
      } else {
        alert("Invalid credentials");
      }
    }

 function showPopupMessage(message) {
    popupMsg.textContent = message;
    popupMsg.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popupMsg.classList.remove('show');
    }, 3000);
    }

    function showLoading() {
                loading.style.display = "flex";
            }

function hideLoading() {
                loading.style.display = "none";
            }

// Request OTP
async function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value;

  const data = {
    action: "requestPasswordReset",
    email: email,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
      document.getElementById("request-reset-password").style.display = "none";
      document.getElementById("verify-otp-reset-password").style.display = "block";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Verify OTP & Reset Password
async function verifyOTPAndResetPassword() {
  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const data = {
    action: "resetPasswordWithOTP",
    email: email,
    otp: otp,
    newPassword: newPassword,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
      document.getElementById("verify-otp-reset-password").style.display = "none";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Event Listeners
document.getElementById("request-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  requestPasswordReset();
});

document.getElementById("verify-otp-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  verifyOTPAndResetPassword();
});
