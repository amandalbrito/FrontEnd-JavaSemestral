const API_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const listaCarrinho = document.getElementById('listaCarrinho');
  const totalSpan = document.getElementById('totalValor');
  const btnContinuar = document.getElementById('btnContinuar');
  const btnFinalizar = document.getElementById('btnFinalizar');

  btnContinuar.addEventListener('click', () => window.location.href = 'lista-compras.html');
  btnFinalizar.addEventListener('click', () => window.location.href = 'checkout.html');

  async function buscarCarrinho() {
    try {
      const resp = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (resp.status === 204) {
        listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
        atualizarTotal(0);
        return;
      }

      if (!resp.ok) throw new Error(`Erro ${resp.status} ao buscar o carrinho`);

      const cart = await resp.json();
      const produtos = cart.cartItems || [];

      listaCarrinho.innerHTML = produtos.length
        ? produtos.map(renderProduto).join('')
        : '<p>Seu carrinho está vazio.</p>';

      produtos.forEach(attachProdutoHandlers);

      const total = produtos.reduce((acc, p) => acc + p.product.preco * p.quantity, 0);
      atualizarTotal(total);

    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
      listaCarrinho.innerHTML = '<p>Erro ao carregar carrinho</p>';
      atualizarTotal(0);
    }
  }

  function renderProduto(item) {
    return `
      <div class="cart-item" data-prod-id="${item.product.id}">
        <span class="nome">${item.product.nome}</span>
        <span class="qty">Qtd: ${item.quantity}</span>
        <span class="preco">R$ ${(item.product.preco * item.quantity).toFixed(2)}</span>
        <button class="btn-remover">Remover</button>
      </div>
    `;
  }

  function attachProdutoHandlers(item) {
    const container = document.querySelector(`.cart-item[data-prod-id="${item.product.id}"]`);
    if (!container) return;

    const btnRemover = container.querySelector('.btn-remover');
    btnRemover.addEventListener('click', async () => {
      try {
        const resp = await fetch(`${API_URL}/cart/${item.product.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error(`Erro ${resp.status}`);
        buscarCarrinho();
      } catch (err) {
        console.error('Erro ao remover item:', err);
        alert('Erro ao remover o item do carrinho.');
      }
    });
  }

  function atualizarTotal(total) {
    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
  }

  buscarCarrinho();
});
