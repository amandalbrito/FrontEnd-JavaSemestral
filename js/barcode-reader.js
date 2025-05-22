document.addEventListener('DOMContentLoaded', () => {
  const resultadoSpan = document.getElementById('resultado');
  const statusP = document.getElementById('status');
  const btnVoltar = document.getElementById('btnVoltar');
  const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
  const token = localStorage.getItem('token');
  const API_CART_ADD_URL = 'http://localhost:8080/api/cart/add';
  console.log('>>> TOKEN para buscarCarrinho:', token);



  let codigoDetectado = null;

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  btnVoltar.addEventListener('click', () => {
    window.location.href = 'lista-compras.html';
  });

  btnAdicionar.addEventListener('click', async () => {
    if (!codigoDetectado) {
      statusP.textContent = 'Nenhum código disponível para adicionar.';
      statusP.style.color = 'red';
      return;
    }

    try {
      const response = await fetch(API_CART_ADD_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoBarras: codigoDetectado, quantidade: 1 })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const updatedCart = await response.json();
      console.log('Carrinho atualizado:', updatedCart);

      statusP.textContent = 'Produto adicionado com sucesso!';
      statusP.style.color = 'green';
      btnAdicionar.disabled = true;
      resultadoSpan.textContent = 'Nenhum';
      codigoDetectado = null;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      statusP.textContent = 'Erro: ' + error.message;
      statusP.style.color = 'red';
    }
  });

  // Inicializa o Quagga para ler código de barras
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#camera'),
      constraints: { facingMode: 'environment' }
    },
    decoder: { readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'] },
    locate: true
  }, (err) => {
    if (err) {
      console.error('Erro ao iniciar câmera:', err);
      statusP.textContent = 'Erro ao iniciar câmera: ' + (err.message || err);
      statusP.style.color = 'red';
      return;
    }
    statusP.textContent = 'Pronto para ler o código.';
    statusP.style.color = 'black';
    Quagga.start();
  });

  Quagga.onDetected((data) => {
    const codigo = data.codeResult.code;
    if (codigo !== codigoDetectado) {
      codigoDetectado = codigo;
      resultadoSpan.textContent = codigo;
      btnAdicionar.disabled = false;
      statusP.textContent = 'Código detectado. Clique em \'Adicionar ao Carrinho\'.';
      statusP.style.color = 'black';
    }
  });
});
