document.getElementById('btnResetPassword').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const verificationCode = document.getElementById('verificationCode').value;
  const newPassword = document.getElementById('newPassword').value;
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');

  errorDiv.textContent = '';
  successDiv.textContent = '';

  if (!email || !verificationCode || !newPassword) {
    errorDiv.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verificationCode, newPassword }),
    });

    if (response.ok) {
      successDiv.textContent = 'Senha alterada com sucesso!';
    } else {
      const data = await response.json();
      errorDiv.textContent = data.message || 'Erro ao alterar a senha.';
    }
  } catch (err) {
    errorDiv.textContent = 'Erro de conexão. Tente novamente.';
  }
});
