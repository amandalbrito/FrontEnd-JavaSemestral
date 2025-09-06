import API_BASE_URL from "./apiConfig.js";

document.addEventListener('DOMContentLoaded', () => {
  const btnVoltar = document.getElementById('btnVoltar');
  const inputCodigoManual = document.getElementById('inputCodigoManual');
  const btnAdicionarManual = document.getElementById('btnAdicionarManual');
  const status = document.getElementById('status');
  const API_CART_ADD_URL = 'https://backend-javasemestral.onrender.com/api/cart/add';

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  btnVoltar.addEventListener('click', () => {
    window.location.href = 'lista-compras.html';
  });

  btnAdicionarManual.addEventListener('click', async () => {
    const codigoBarras = inputCodigoManual.value.trim();

    if (!codigoBarras) {
      status.textContent = 'Digite um código de barras válido.';
      status.style.color = 'red';
      return;
    }

    try {
      const response = await fetch(API_CART_ADD_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigoBarras: codigoBarras,
          quantidade: 1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      status.textContent = 'Produto adicionado com sucesso!';
      status.style.color = 'green';
      inputCodigoManual.value = '';

      setTimeout(() => {
        window.location.href = 'carrinho.html';
      }, 1000);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      status.textContent = err.message;
      status.style.color = 'red';
    }
  });
});
