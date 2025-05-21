document.addEventListener('DOMContentLoaded', async () => {
  carregarResumo();

  const stripe = Stripe('SEU_PUBLISHABLE_KEY_STRIPE'); // Coloque sua public key aqui
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  document.getElementById('btnFinalizar').addEventListener('click', async () => {
    await finalizarCompra(stripe, cardElement);
  });
});

function carregarResumo() {
  const listaItens = JSON.parse(localStorage.getItem('carrinho')) || [];

  const ul = document.getElementById('listaItens');
  ul.innerHTML = '';

  let total = 0;

  listaItens.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
    ul.appendChild(li);
    total += item.preco * item.quantidade;
  });

  document.getElementById('totalCompra').textContent = total.toFixed(2);
}

async function finalizarCompra(stripe, cardElement) {
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = '';

  const itens = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (itens.length === 0) {
    mensagem.textContent = 'Carrinho está vazio.';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    mensagem.textContent = 'Usuário não autenticado. Faça login novamente.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/users/"/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ itens })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao criar pagamento');
    }

    const { clientSecret } = await response.json();

    // 2. Confirma o pagamento com Stripe.js
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (result.error) {
      // Exibe o erro para o cliente
      mensagem.textContent = result.error.message;
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Compra finalizada com sucesso!');
        localStorage.removeItem('carrinho');
        window.location.href = 'lista-compras.html';
      }
    }

  } catch (err) {
    mensagem.textContent = err.message;
  }
}
