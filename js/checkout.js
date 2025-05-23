/* Simulação de pagamento!! */

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

window.onload = () => {
  document.getElementById('amount-display').innerText = "Total a pagar: R$ 46,00";
};

document.getElementById("payment-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = document.getElementById("submit-button");
  const statusMessage = document.getElementById("status-message");

  submitButton.disabled = true;
  statusMessage.textContent = "Processando pagamento...";

  setTimeout(() => {
    const sucesso = Math.random() > 0.2;

    if (sucesso) {
      statusMessage.textContent = "✔️ Pagamento confirmado! Obrigado pela compra.";

      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotalCents');

      setTimeout(() => {
        window.location.href = "finalizacao.html";
      }, 2500);

    } else {
      statusMessage.textContent = "Erro no pagamento: cartão recusado (simulado). Tente novamente.";
      submitButton.disabled = false;
    }
  }, 2000);
});
