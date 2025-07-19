import API_BASE_URL from "./apiConfig";

// main.js (login e cadastro unificados)

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('login.html')) {
    setupLogin();
  } else if (path.endsWith('cadastro.html')) {
    setupCadastro();
  }
});

function setupCadastro() {
  const btnCadastrar = document.getElementById('btnCadastrar');
  const errorDiv     = document.getElementById('error');

  btnCadastrar.addEventListener('click', async () => {
    errorDiv.textContent = '';

    const nome  = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf   = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!nome || !email || !cpf || !senha) {
      errorDiv.textContent = 'Preencha todos os campos.';
      return;
    }

    try {
      const response = await fetch('https://backend-javasemestral-production.up.railway.app/api/users/cadastrarUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, cpf, senha })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao cadastrar');
      }

      alert('Cadastro realizado com sucesso! Faça login agora.');
      window.location.href = 'login.html';

    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}

function setupLogin() {
  const btnLogin = document.getElementById('btnLogin');
  const errorDiv = document.getElementById('error');

  btnLogin.addEventListener('click', async () => {
    errorDiv.textContent = '';
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
      errorDiv.textContent = 'Por favor, preencha email e senha.';
      return;
    }

    try {
      const response = await fetch('https://backend-javasemestral-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao fazer login');
      }
      

      localStorage.setItem('token',     data.token);
      localStorage.setItem('userId',    String(data.userId || data.id));
      localStorage.setItem('userEmail', data.email);

      window.location.href = 'lista-compras.html';

    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}
