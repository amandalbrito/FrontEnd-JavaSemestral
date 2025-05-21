document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const listaCarrinho = document.getElementById("listaCarrinho");
  const totalSpan = document.getElementById("totalValor");

  document.getElementById("btnContinuar").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  async function buscarCarrinho() {
    try {
      const response = await fetch("http://localhost:8080/api/cart", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao buscar o carrinho");

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

      atualizarTotal(produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0));

    } catch (err) {
      listaCarrinho.innerHTML = `<p>${err.message}</p>`;
    }
  }

  async function atualizarQuantidade(id, novaQuantidade) {
    try {
      await fetch(`http://localhost:8080/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantidade: novaQuantidade })
      });

      await buscarCarrinho();
    } catch (err) {
      alert('Erro ao atualizar quantidade');
    }
  }

  async function removerProduto(id) {
    try {
      await fetch(`http://localhost:8080/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

  finalizarBtn.addEventListener("click", () => {
    const selected = document.querySelector(".payment-option.selected");
    if (!selected) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }

    // Aqui você pode integrar com o endpoint de pagamento ou redirecionar
    window.location.href = "../Pagamento/payment.html";
  });

  buscarCarrinho();
});
