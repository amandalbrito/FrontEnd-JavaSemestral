document.addEventListener('DOMContentLoaded', () => {
  const btnVoltar = document.getElementById('btnVoltar');
  const inputCodigoManual = document.getElementById('inputCodigoManual');
  const btnAdicionarManual = document.getElementById('btnAdicionarManual');
  const status = document.getElementById('status');

  btnVoltar.addEventListener('click', () => {
    alert('Voltando para tela inicial...');
    window.location.href = 'lista-compras.html';
  });

  btnAdicionarManual.addEventListener('click', async () => {
    const codigo = inputCodigoManual.value.trim();
    if (!codigo) {
      status.textContent = 'Digite um código válido.';
      status.style.color = 'red';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoProduto: codigo })
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.message || 'Erro ao adicionar produto');
      }

      status.textContent = 'Produto adicionado com sucesso!';
      status.style.color = 'green';
      inputCodigoManual.value = '';
    } catch (err) {
      status.textContent = err.message;
      status.style.color = 'red';
    }
  });
});
