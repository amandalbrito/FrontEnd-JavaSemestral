const stripe = Stripe('pk_test_51RO0riDAnzzTLg7ZQ7paDAPDlYeTYzVkBYbe5bglrfEUymf6PQtBA9OvulvgjEJgJJCtsx8OABByA2pgMN4lstFx00RIrW2giR');

let clientSecret = null;
let formattedAmount = null;

const token = localStorage.getItem("jwt");
// Supondo que você tenha salvo o userId e email no localStorage
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

window.onload = async () => {
  // Cria PaymentIntent, enviando userId no query param
  const res = await fetch(`http://localhost:8080/api/stripe/create-payment-intent?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();

  if (data.clientSecret) {
    clientSecret = data.clientSecret;

    // Busca detalhes do pagamento (formatação etc)
    const valor = await fetch("http://localhost:8080/api/stripe/create-payment-dto", {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000, // valor em centavos
        currency: 'brl',
        description: 'Pagamento de produtos do carrinho'
      })
    });

    const valorData = await valor.json();
    formattedAmount = valorData.amountFormatted;
    document.getElementById('amount-display').innerText = `Total a pagar: ${formattedAmount}`;
  }
};

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
    // Envia confirmação, passando destinatario e pessoa (userId)
    const confirm = await fetch(`http://localhost:8080/api/stripe/confirmar-pagamento?paymentIntentId=${paymentIntent.id}&destinatario=${encodeURIComponent(userEmail)}&pessoa=${userId}`, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const msg = await confirm.text();
    document.getElementById("status-message").textContent = "✔️ Pagamento confirmado! " + msg;
  }
});
