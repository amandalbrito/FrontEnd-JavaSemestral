import API_BASE_URL from "./apiConfig.js";

const { Quagga } = require("quagga");

document.addEventListener('DOMContentLoaded', () => {
  const resultadoSpan = document.getElementById('resultado');
  const statusP = document.getElementById('status');
  const btnVoltar = document.getElementById('btnVoltar');
  const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
  const API_CART_ADD_URL = 'https://backend-javasemestral.onrender.com/api/cart/add';

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  let codigoDetectado = null;

  btnVoltar.addEventListener('click', () => {
    window.location.href = 'lista-compras.html';
  });

  btnAdicionar.addEventListener('click', async () => {
  if (!codigoDetectado) {
    statusP.textContent = 'Nenhum código disponível para adicionar.';
    statusP.style.color = 'red';
    return;
  }
  console.log('Enviando código:', codigoDetectado);

  try {
    const response = await fetch(API_CART_ADD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codigoBarras: codigoDetectado, 
        quantidade: 1
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `HTTP ${response.status}`);
    }

    const updatedCart = await response.json();
    statusP.textContent = 'Produto adicionado com sucesso!';
    statusP.style.color = 'green';
    btnAdicionar.disabled = true;
    resultadoSpan.textContent = 'Nenhum';
    codigoDetectado = null;
  } catch (error) {
    statusP.textContent = 'Erro: ' + error.message;
    statusP.style.color = 'red';
  }
});


  // INÍCIO DO QUAGGA
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#camera'),
      constraints: {
        facingMode: "environment"  // para usar câmera traseira em celulares
      },
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]  // leitores comuns de códigos de barras
    },
    locate: true
  }, function(err) {
    if (err) {
      console.error(err);
      statusP.textContent = 'Erro ao iniciar câmera: ' + err.message;
      statusP.style.color = 'red';
      return;
    }
    Quagga.start();
    statusP.textContent = 'Aguardando código de barras...';
    statusP.style.color = 'black';
  });

  Quagga.Quagga();
    statusPl

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    if (code !== codigoDetectado) {
      codigoDetectado = code;
      resultadoSpan.textContent = code;
      btnAdicionar.disabled = false;
      statusP.textContent = 'Código detectado, pode adicionar ao carrinho.';
    }
  });
});
