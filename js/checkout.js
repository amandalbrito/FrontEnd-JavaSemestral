// payment.js

const stripe = Stripe('pk_test_51RO0r iDAnzzTLg7ZQ7paDAPDlYeTYzVkBYbe5bglrfEUymf6PQtBA9OvulvgjEJgJJCtsx8OABByA2pgMN4lstFx00RIrW2giR');
let clientSecret = null;

const token     = localStorage.getItem("token");     // mesmo nome usado no carrinho.js
const userId    = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");
console.log({ token, userId, userEmail });


window.onload = async () => {
  // 1) Pega o total em centavos do carrinho
  const totalCents = parseInt(localStorage.getItem('cartTotalCents'), 10);
  if (!totalCents || totalCents <= 0) {
    document.getElementById('amount-display').innerText = 'Carrinho vazio.';
    return;
  }

  try {
    // 2) Chama o backend para criar o PaymentIntent
    const response = await fetch(
      `http://localhost:8080/api/stripe/payment?userId=${userId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: totalCents,            // agora variável, não 1000 fixo
          currency: 'brl',
          description: 'Pagamento de produtos do carrinho'
        })
      }
    );
    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    clientSecret = data.clientSecret;
    document.getElementById('amount-display').innerText =
      `Total a pagar: ${data.amountFormatted}`;

  } catch (err) {
    console.error('Erro ao iniciar pagamento:', err);
    document.getElementById('amount-display').innerText =
      "Erro ao carregar valor do pagamento.";
    return;
  }
};

// 3) Monta o Stripe Elements
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

// 4) Trata o submit do formulário
document.getElementById("payment-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!clientSecret) {
    document.getElementById("status-message").textContent =
      "Erro: clientSecret não recebido.";
    return;
  }

  const submitButton = document.getElementById("submit-button");
  submitButton.disabled = true;
  document.getElementById("status-message").textContent =
    "Processando pagamento...";

  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card }
  });

  if (error) {
    document.getElementById("status-message").textContent =
      "Erro no pagamento: " + error.message;
    submitButton.disabled = false;
    return;
  }

  // 5) Confirmação final no backend
  if (paymentIntent.status === "succeeded") {
    try {
      const confirmResp = await fetch(
        `http://localhost:8080/api/stripe/confirmar-pagamento` +
        `?paymentIntentId=${paymentIntent.id}` +
        `&destinatario=${encodeURIComponent(userEmail)}` +
        `&pessoa=${userId}`,
        {
          method: "POST",
          headers: { 'Authorization': 'Bearer ' + token }
        }
      );
      if (!confirmResp.ok) throw new Error(`Status ${confirmResp.status}`);
      const msg = await confirmResp.text();
      document.getElementById("status-message").textContent =
        "✔️ Pagamento confirmado! " + msg;
      // window.location.href = "sucesso.html";
    } catch (err) {
      document.getElementById("status-message").textContent =
        "Pagamento efetuado, mas erro na confirmação: " + err.message;
    }
  }
});
