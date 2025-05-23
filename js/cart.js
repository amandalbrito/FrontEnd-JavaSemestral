

/**ESSA CLASSE NAO SE REFERE AO CARRINHO, MAS SIM, AO LISTA-COMPRAS, QUE SERIA A TELA INICIAL DO PROJETO!!!!!!!!! */

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const listaDiv = document.getElementById('listaProdutos');
  const btnLogout = document.getElementById('btnLogout');
  const btnIrParaLeitura = document.getElementById('btnIrParaLeitura');
  const btnIrParaManual = document.getElementById('btnIrParaManual');
  const btnVerCarrinho = document.getElementById('btnVerCarrinho');
  
  btnVerCarrinho.addEventListener('click', () => {
  window.location.href = 'carrinho.html';
  });


  btnLogout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  btnIrParaLeitura.addEventListener('click', () => {
    window.location.href = 'barcode-reader.html';
  });

  btnIrParaManual.addEventListener('click', () => {
    window.location.href = 'codigo-manual.html';
  });

async function buscarLista() {
  try {
    const response = await fetch('http://localhost:8080/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao buscar lista');
    const lista = await response.json();
    if (lista.length === 0) {
      listaDiv.innerHTML = '<p>Lista de compras vazia.</p>';
      return;
    }    


    listaDiv.innerHTML = '';
    lista.cartItems.forEach(item => {
      const div = document.createElement('div');
      div.textContent = `${item.product.nome} - Quantidade: ${item.quantity}`;
      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.addEventListener('click', () => removerItem(item.product.id));
      div.appendChild(btnRemover);
      listaDiv.appendChild(div);
    });
  } catch (error) {
    listaDiv.textContent = error.message;
  }
}

  async function removerItem(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao remover item');
      await buscarLista();
    } catch (err) {
      alert(err.message);
    }
  }

  buscarLista();
});
