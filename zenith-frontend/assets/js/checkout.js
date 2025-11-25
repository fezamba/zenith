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
        
        if(!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
            alert("Seu carrinho está vazio.");
            window.location.href = 'home.html';
            return;
        }

        valorTotalCarrinho = carrinho.valorTotal || calcularTotalLocal(carrinho.itens);

        listaResumo.innerHTML = carrinho.itens.map(item => `
            <div class="summary-item-row">
                <span>${item.quantidade}x ${item.nomeProduto}</span>
                <span>${formatarMoeda(item.precoUnitario * item.quantidade)}</span>
            </div>
        `).join('');

        recalcularTotal();

    } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
        alert("Erro ao carregar pedido: " + e.message);
    }
}

function calcularTotalLocal(itens) {
    return itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
}

function recalcularTotal() {
    let total = valorTotalCarrinho;
    let desconto = 0;

    if (checkPontos.checked) {
        elDesconto.innerText = "(Calculado no fechamento)";
        elDesconto.style.color = "green";
    } else {
        elDesconto.innerText = "- R$ 0,00";
        elDesconto.style.color = "inherit";
    }

    elSubtotal.innerText = formatarMoeda(valorTotalCarrinho);
    elTotal.innerText = formatarMoeda(total);
}

async function finalizarPedido() {
    const enderecoIdVal = $('#enderecoId').value;
    const usarPontos = checkPontos.checked;

    if(!enderecoIdVal) {
        alert("Por favor, informe o ID do endereço.");
        return;
    }

    try {
        btnConfirmar.disabled = true;
        btnConfirmar.innerText = "Processando...";

        console.log("Enviando pedido...", { enderecoId: parseInt(enderecoIdVal), usarZenithPoints: usarPontos });

        const pedido = await Api.pedidos.checkout({
            enderecoId: parseInt(enderecoIdVal),
            usarZenithPoints: usarPontos
        });

        console.log("Pedido criado com sucesso:", pedido);

        $('#numeroPedido').innerText = `#${pedido.id}`;
        $('#modalSucesso').style.display = 'flex';

    } catch (error) {
        console.error("Erro no checkout:", error);
        alert("Erro ao finalizar: " + error.message);
        btnConfirmar.disabled = false;
        btnConfirmar.innerText = "CONFIRMAR PEDIDO";
    }
}