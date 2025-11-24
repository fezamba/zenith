import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

const listaResumo = $('#listaResumoItens');
const elSubtotal = $('#subtotalVal');
const elTotal = $('#totalVal');
const elDesconto = $('#descontoPontos');
const checkPontos = $('#usarPontos');
const btnConfirmar = $('#btnConfirmarPedido');

let valorTotalCarrinho = 0;

document.addEventListener('DOMContentLoaded', () => {
    if(!Auth.isLogado()) window.location.href = 'tela_login.html';
    carregarResumo();
    
    checkPontos.addEventListener('change', recalcularTotal);
    btnConfirmar.addEventListener('click', finalizarPedido);
});

async function carregarResumo() {
    try {
        const carrinho = await Api.carrinho.buscar();
        
        if(!carrinho || !carrinho.itens.length) {
            alert("Seu carrinho está vazio.");
            window.location.href = 'home.html';
            return;
        }

        valorTotalCarrinho = carrinho.valorTotal;

        listaResumo.innerHTML = carrinho.itens.map(item => `
            <div class="summary-item-row">
                <span>${item.quantidade}x ${item.nomeProduto}</span>
                <span>${formatarMoeda(item.precoUnitario * item.quantidade)}</span>
            </div>
        `).join('');

        recalcularTotal();

    } catch (e) {
        console.error(e);
        alert("Erro ao carregar pedido.");
    }
}

function recalcularTotal() {
    let total = valorTotalCarrinho;
    let desconto = 0;

    if (checkPontos.checked) {
        elDesconto.innerText = "(Calculado no fechamento)";
    } else {
        elDesconto.innerText = "- R$ 0,00";
    }

    elSubtotal.innerText = formatarMoeda(valorTotalCarrinho);
    elTotal.innerText = formatarMoeda(total);
}

async function finalizarPedido() {
    const enderecoId = $('#enderecoId').value;
    const usarPontos = checkPontos.checked;

    if(!enderecoId) {
        alert("Por favor, informe o ID do endereço.");
        return;
    }

    try {
        btnConfirmar.disabled = true;
        btnConfirmar.innerText = "Processando...";

        const pedido = await Api.pedidos.checkout({
            enderecoId: parseInt(enderecoId),
            usarZenithPoints: usarPontos
        });

        $('#numeroPedido').innerText = `#${pedido.id}`;
        $('#modalSucesso').style.display = 'flex';

    } catch (error) {
        alert("Erro ao finalizar: " + error.message);
        btnConfirmar.disabled = false;
        btnConfirmar.innerText = "CONFIRMAR PEDIDO";
    }
}