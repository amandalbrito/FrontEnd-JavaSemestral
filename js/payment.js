const stripe = Stripe('pk_test_51RO0riDAnzzTLg7ZQ7paDAPDlYeTYzVkBYbe5bglrfEUymf6PQtBA9OvulvgjEJgJJCtsx8OABByA2pgMN4lstFx00RIrW2giR');

const userId = 1; // ID do usuário (fixo ou dinâmico, conforme seu app)

let clientSecret = null;
let paymentIntentId = null;
let formattedAmount = null;

// Ao carregar a página
window.onload = async () => {
  const res = await fetch(`http://localhost:8080/api/stripe/create-payment-intent?userId=${userId}`, {
    method: 'POST'
  });

  const data = await res.json();

  if (data.clientSecret) {
    clientSecret = data.clientSecret;

    // Recupera valor formatado (requisita novamente ou usa o último pagamento salvo)
    const valor = await fetch(`http://localhost:8080/api/stripe/create-payment-dto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000, // Você pode ajustar esse valor se quiser simular
        currency: 'brl',
        description: 'Pagamento de produtos do carrinho'
      })
    });

    const valorData = await valor.json();
    formattedAmount = valorData.amountFormatted;
    document.getElementById('amount-display').innerText = `Total a pagar: ${formattedAmount}`;
  }
};

// Elemento do cartão
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

const form = document.getElementById("payment-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card
    }
  });

  if (error) {
    document.getElementById("status-message").textContent = "Erro no pagamento: " + error.message;
  } else if (paymentIntent.status === "succeeded") {
    // Confirma e dispara o e-mail
    const confirm = await fetch(`http://localhost:8080/api/stripe/confirmar-pagamento?paymentIntentId=${paymentIntent.id}&destinatario=email&pessoa=${userId}`, {
      method: "POST"
    });

    const msg = await confirm.text();
    document.getElementById("status-message").textContent = "✔️ Pagamento confirmado! " + msg;
  }
});
