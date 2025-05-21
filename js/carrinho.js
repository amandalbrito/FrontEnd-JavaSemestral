document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const userId = 1; // hardcoded igual no backend, futuramente extrair do token

  const listaCarrinho = document.getElementById("listaCarrinho");
  const totalSpan = document.getElementById("totalValor");

  document.getElementById("btnContinuar").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  async function buscarCarrinho() {
    try {
      // Usar o endpoint que retorna os itens do carrinho para o usuário
      const response = await fetch(`http://localhost:8080/api/cart/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 204) { // No Content
          listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
          atualizarTotal(0);
          return;
        }
        throw new Error("Erro ao buscar o carrinho");
      }

      const produtos = await response.json();
      listaCarrinho.innerHTML = '';

      if (produtos.length === 0) {
        listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
        atualizarTotal(0);
        return;
      }

      produtos.forEach(produto => {
        const div = document.createElement("div");
        div.className = "produto";

        div.innerHTML = `
          <img src="${produto.imagem || 'https://via.placeholder.com/100'}" alt="${produto.nomeProduto}">
          <div class="info">
            <strong>${produto.nomeProduto}</strong>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <div class="controle">
              <button class="menos">-</button>
              <span>${produto.quantidade}</span>
              <button class="mais">+</button>
              <button class="remover">🗑️</button>
            </div>
          </div>
        `;

        const btnMenos = div.querySelector('.menos');
        const btnMais = div.querySelector('.mais');
        const btnRemover = div.querySelector('.remover');
        const spanQtd = div.querySelector('span');

        btnMenos.addEventListener('click', async () => {
          if (produto.quantidade > 1) {
            await atualizarQuantidade(produto.id, produto.quantidade - 1);
          }
        });

        btnMais.addEventListener('click', async () => {
          await atualizarQuantidade(produto.id, produto.quantidade + 1);
        });

        btnRemover.addEventListener('click', async () => {
          await removerProduto(produto.id);
        });

        listaCarrinho.appendChild(div);
      });

      // Calcular total
      const total = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
      atualizarTotal(total);

    } catch (err) {
      listaCarrinho.innerHTML = `<p>${err.message}</p>`;
      atualizarTotal(0);
    }
  }

  async function atualizarQuantidade(productId, novaQuantidade) {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantidade: novaQuantidade })
      });

      if (!response.ok) throw new Error("Erro ao atualizar quantidade");

      await buscarCarrinho();
    } catch (err) {
      alert('Erro ao atualizar quantidade');
    }
  }

  async function removerProduto(productId) {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao remover produto");

      await buscarCarrinho();
    } catch (err) {
      alert('Erro ao remover produto');
    }
  }

  function atualizarTotal(total) {
    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
  }

  // Pagamento
  const telaPagamento = document.getElementById("tela-pagamento");
  const abrirPagamento = document.getElementById("abrirPagamento");
  const fecharPagamento = document.getElementById("fecharPagamento");

  abrirPagamento.addEventListener("click", () => {
    telaPagamento.classList.remove("hidden");
  });

  fecharPagamento.addEventListener("click", () => {
    telaPagamento.classList.add("hidden");
  });

  const options = document.querySelectorAll(".payment-option");
  const finalizarBtn = document.getElementById("finalizarBtn");

  options.forEach(option => {
    option.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
    });
  });

  finalizarBtn.addEventListener("click", async () => {
    const selected = document.querySelector(".payment-option.selected");
    if (!selected) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }

    try {
      // Chamar endpoint de checkout do backend
      const response = await fetch(`http://localhost:8080/api/cart/checkout?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao finalizar compra: ${errorText}`);
        return;
      }

      const paymentResponse = await response.json();
      // Aqui você pode redirecionar para a página de sucesso, ou exibir mensagem
      alert('Compra finalizada com sucesso!');
      window.location.href = "../Pagamento/payment.html";

    } catch (error) {
      alert('Erro na finalização da compra.');
    }
  });

  buscarCarrinho();
});
