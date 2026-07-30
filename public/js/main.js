// ---------------------------------------------------------
// Utility: post JSON to an API endpoint and return the parsed result
// ---------------------------------------------------------
async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = 'form-message ' + (type || '');
}

// ---------------------------------------------------------
// Login form
// ---------------------------------------------------------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageEl = document.getElementById('login-message');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    showMessage(messageEl, 'Signing in…', '');

    const { ok, body } = await postJSON('/api/login', { email, password });

    if (ok) {
      showMessage(messageEl, 'Success! Redirecting…', 'success');
      window.location.href = '/dashboard.html';
    } else {
      showMessage(messageEl, body.error || 'Login failed.', 'error');
    }
  });
}

// ---------------------------------------------------------
// Register form
// ---------------------------------------------------------
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageEl = document.getElementById('register-message');

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    showMessage(messageEl, 'Creating your account…', '');

    const { ok, body } = await postJSON('/api/register', {
      fullName, email, password, confirmPassword, role
    });

    if (ok) {
      showMessage(messageEl, body.message + ' Redirecting to login…', 'success');
      setTimeout(() => { window.location.href = '/login.html'; }, 1200);
    } else {
      showMessage(messageEl, body.error || 'Registration failed.', 'error');
    }
  });
}

// ---------------------------------------------------------
// Dashboard: load session info, wire up logout
// ---------------------------------------------------------
const dashboardName = document.getElementById('dashboard-name');
if (dashboardName) {
  fetch('/api/session')
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        dashboardName.textContent = data.fullName;
      } else {
        window.location.href = '/login.html';
      }
    })
    .catch(() => {
      window.location.href = '/login.html';
    });
}

const logoutButtons = document.querySelectorAll('.logout-btn');
logoutButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
  });
});