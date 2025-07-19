import API_BASE_URL from "./apiConfig";

/* Simulação de pagamento!! */

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

let metodoSelecionado = null;

window.onload = () => {
  document.getElementById('amount-display').innerText = "Total a pagar: R$ 46,00";

  // Lógica para selecionar método
  const creditoBtn = document.getElementById('credito');
  const debitoBtn = document.getElementById('debito');

  creditoBtn.addEventListener('click', () => {
    metodoSelecionado = "Crédito";
    creditoBtn.classList.add('selected');
    debitoBtn.classList.remove('selected');
  });

  debitoBtn.addEventListener('click', () => {
    metodoSelecionado = "Débito";
    debitoBtn.classList.add('selected');
    creditoBtn.classList.remove('selected');
  });
};

document.getElementById("payment-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = document.getElementById("submit-button");
  const statusMessage = document.getElementById("status-message");

  if (!metodoSelecionado) {
    statusMessage.textContent = "Por favor, selecione Crédito ou Débito antes de pagar.";
    return;
  }

  submitButton.disabled = true;
  statusMessage.textContent = `Processando pagamento com ${metodoSelecionado.toLowerCase()}...`;

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
