import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

const loading = $('#loading');
const emptyState = $('#emptyState');
const cartContent = $('#cartContent');
const listaItens = $('#listaItens');
const elSubtotal = $('#subtotalValue');
const elTotal = $('#totalValue');
const menuUsuario = $('#menuUsuario');

let carrinhoAtual = null;

document.addEventListener('DOMContentLoaded', () => {
    atualizarHeader();
    carregarCarrinho();
    
    $('#btnCheckout').addEventListener('click', () => {
        if (carrinhoAtual && carrinhoAtual.itens && carrinhoAtual.itens.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert("Seu carrinho está vazio.");
        }
    });
});

function atualizarHeader() {
    if (Auth.isLogado()) {
    } else {
        alert("Faça login para ver seu carrinho.");
        window.location.href = 'tela_login.html';
    }
}

async function carregarCarrinho() {
    try {
        loading.style.display = 'block';
        cartContent.style.display = 'none';
        emptyState.style.display = 'none';

        const dados = await Api.carrinho.buscar();
        carrinhoAtual = dados;

        loading.style.display = 'none';

        if (!dados || !dados.itens || dados.itens.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        renderizarItens(dados.itens);
        
        let total = dados.valorTotal;
        if (total === undefined || total === null) {
            total = calcularTotalLocal(dados.itens);
        }
        atualizarTotais(total);
        
        cartContent.style.display = 'grid';

    } catch (error) {
        console.error(error);
        loading.innerHTML = `<p style="color:red">Erro ao carregar carrinho: ${error.message}</p>`;
    }
}

function calcularTotalLocal(itens) {
    return itens.reduce((acc, item) => {
        return acc + (item.precoUnitario * item.quantidade);
    }, 0);
}

function renderizarItens(itens) {
    listaItens.innerHTML = '';

    itens.forEach(item => {
        const totalItem = item.precoUnitario * item.quantidade;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-image" style="background:#eee; display:flex; align-items:center; justify-content:center; font-size:2rem;">📦</div>
            
            <div class="cart-item-details">
                <h3>${item.nomeProduto}</h3>
                <div class="cart-item-seller">Ref: ${item.produtoId}</div>
            </div>

            <div class="quantity-controls">
                <button class="quantity-btn btn-menos" data-id="${item.produtoId}">-</button>
                <span style="font-weight:600; margin:0 10px;">${item.quantidade}</span>
                <button class="quantity-btn btn-mais" data-id="${item.produtoId}">+</button>
            </div>

            <div style="text-align:right">
                <div class="cart-item-price">${formatarMoeda(totalItem)}</div>
                <div style="font-size:0.8rem; color:#999">(${formatarMoeda(item.precoUnitario)} cada)</div>
                <button class="remove-btn" data-id="${item.produtoId}">Remover</button>
            </div>
        `;
        listaItens.appendChild(itemDiv);
    });

    adicionarEventosAosBotoes();
}

function atualizarTotais(valorTotal) {
    const valor = Number(valorTotal) || 0;
    const formatado = formatarMoeda(valor);
    elSubtotal.innerText = formatado;
    elTotal.innerText = formatado;
}

function adicionarEventosAosBotoes() {
    document.querySelectorAll('.btn-menos').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = carrinhoAtual.itens.find(i => i.produtoId == id);
            if (item.quantidade > 1) {
                alterarQuantidade(id, item.quantidade - 1);
            } else {
                if(confirm("Remover este item?")) removerItem(id);
            }
        });
    });

    document.querySelectorAll('.btn-mais').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = carrinhoAtual.itens.find(i => i.produtoId == id);
            alterarQuantidade(id, item.quantidade + 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if(confirm("Remover do carrinho?")) removerItem(btn.dataset.id);
        });
    });
}

async function alterarQuantidade(produtoId, novaQuantidade) {
    try {
        await Api.carrinho.atualizar({
            produtoId: parseInt(produtoId),
            quantidade: parseInt(novaQuantidade)
        });
        carregarCarrinho(); 
    } catch (error) {
        alert("Erro ao atualizar: " + error.message);
    }
}

async function removerItem(produtoId) {
    try {
        await Api.carrinho.remover(produtoId);
        carregarCarrinho();
    } catch (error) {
        alert("Erro ao remover: " + error.message);
    }
}