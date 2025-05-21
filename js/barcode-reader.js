document.addEventListener('DOMContentLoaded', () => {
  const resultadoSpan = document.getElementById('resultado');
  const statusP = document.getElementById('status');
  const btnVoltar = document.getElementById('btnVoltar');
  const token = localStorage.getItem('token');

  // Verifica token (autenticação)
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  btnVoltar.addEventListener('click', () => {
    window.location.href = 'lista-compras.html';
  });

  // Inicializa o Quagga
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera"),
      constraints: {
        facingMode: "environment" // tenta usar câmera traseira (ambiente)
      }
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    },
    locate: true // ajuda no foco para encontrar o código
  }, function(err) {
    if (err) {
      console.error("Erro ao iniciar câmera:", err);
      statusP.textContent = "Erro ao iniciar câmera: " + err.message || err;
      return;
    }
    statusP.textContent = "Pronto para ler o código.";
    Quagga.start();
  });

  // Evento disparado quando um código é detectado
  Quagga.onDetected(async (data) => {
    const codigo = data.codeResult.code;
    resultadoSpan.textContent = codigo;
    statusP.textContent = "Código detectado, adicionando ao carrinho...";

    try {
      const response = await fetch('https://seuservidor.com/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoProduto: codigo })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao adicionar produto');
      }

      statusP.textContent = "Produto adicionado com sucesso!";
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      statusP.textContent = "Erro: " + error.message;
    }
  });
});
