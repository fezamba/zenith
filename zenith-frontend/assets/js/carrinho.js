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
        alert("Funcionalidade de Checkout será implementada em breve!"); 
    });
});

function atualizarHeader() {
    if (Auth.isLogado()) {
        const user = Auth.getDadosUsuario();
        menuUsuario.innerHTML = `
            <a href="perfil.html" class="btn btn-outline">Minha Conta</a>
            <button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>
        `;
        $('#btnSair').addEventListener('click', Auth.logout);
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
        atualizarTotais(dados.valorTotal);
        cartContent.style.display = 'grid';

    } catch (error) {
        console.error(error);
        loading.innerHTML = `<p style="color:red">Erro ao carregar carrinho: ${error.message}</p>`;
    }
}

function renderizarItens(itens) {
    listaItens.innerHTML = '';

    itens.forEach(item => {
        const totalItem = item.precoUnitario * item.quantidade;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="../assets/img/placeholder.png" onerror="this.src='https://placehold.co/100'" alt="Produto" class="cart-item-image">
            
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
    const formatado = formatarMoeda(valorTotal);
    elSubtotal.innerText = formatado;
    elTotal.innerText = formatado;
}

function adicionarEventosAosBotoes() {
    // Botão Menos (-)
    document.querySelectorAll('.btn-menos').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const item = carrinhoAtual.itens.find(i => i.produtoId == id);
            
            if (item.quantidade > 1) {
                alterarQuantidade(id, item.quantidade - 1);
            } else {
                if(confirm("Remover este item?")) removerItem(id);
            }
        });
    });

    document.querySelectorAll('.btn-mais').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = carrinhoAtual.itens.find(i => i.produtoId == id);
            alterarQuantidade(id, item.quantidade + 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if(confirm("Tem certeza que deseja remover este item?")) {
                removerItem(id);
            }
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