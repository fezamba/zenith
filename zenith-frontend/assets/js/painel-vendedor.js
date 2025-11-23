import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, formatarData, $ } from './utils.js';

const listaProdutos = $('#listaProdutos');
const listaVendas = $('#listaVendas');
const loadingProdutos = $('#loadingProdutos');
const emptyProdutos = $('#emptyProdutos');
const loadingVendas = $('#loadingVendas');
const emptyVendas = $('#emptyVendas');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

document.addEventListener('DOMContentLoaded', () => {
    verificarPermissao();
    renderizarHeader();
    configurarTabs();
    carregarProdutos();
    carregarVendas();
});

function verificarPermissao() {
    if (!Auth.isLogado() || !Auth.temPermissao('VENDEDOR')) {
        alert("Acesso negado. Área exclusiva para vendedores.");
        window.location.href = 'home.html';
    }
}

function renderizarHeader() {
    const user = Auth.getDadosUsuario();
    $('#menuUsuario').innerHTML = `
        <span style="margin-right:15px; font-weight:bold;">Olá, ${user.sub}</span>
        <a href="home.html" class="btn btn-outline">Ir para Loja</a>
        <button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>
    `;
    $('#btnSair').addEventListener('click', Auth.logout);
}

function configurarTabs() {
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

async function carregarProdutos() {
    try {
        const produtos = await Api.vendedor.meusProdutos();
        loadingProdutos.style.display = 'none';

        if (produtos.length === 0) {
            emptyProdutos.style.display = 'block';
            return;
        }

        listaProdutos.innerHTML = produtos.map(prod => `
            <tr>
                <td>#${prod.id}</td>
                <td>
                    <strong>${prod.nome}</strong><br>
                    <small style="color:#999">${prod.nomeCategoria || 'Sem categoria'}</small>
                </td>
                <td>${formatarMoeda(prod.preco)}</td>
                <td>${prod.estoque} un</td>
                <td><span class="status-badge ${prod.status === 'ATIVO' ? 'status-ativo' : 'status-inativo'}">${prod.status}</span></td>
                <td>
                    ${renderizarStatusSelo(prod)}
                </td>
                <td>
                    <button class="action-btn" onclick="alert('Editar em breve!')">✏️</button>
                    <button class="action-btn btn-danger btn-excluir" data-id="${prod.id}">🗑️</button>
                    ${prod.statusSelo === 'NAO_SOLICITADO' ? 
                        `<button class="action-btn btn-selo" data-id="${prod.id}" title="Solicitar Selo">🏅</button>` : ''}
                </td>
            </tr>
        `).join('');

        configurarBotoesProduto();

    } catch (error) {
        console.error(error);
        loadingProdutos.innerText = "Erro ao carregar produtos.";
    }
}

function renderizarStatusSelo(prod) {
    if (prod.statusSelo === 'APROVADO') return '<span class="status-badge status-ativo">🏅 Selo Ativo</span>';
    if (prod.statusSelo === 'PENDENTE') return '<span class="status-badge status-pendente">⏳ Em Análise</span>';
    if (prod.statusSelo === 'REJEITADO') return '<span class="status-badge status-inativo">❌ Recusado</span>';
    return '<span style="color:#ccc">-</span>';
}

function configurarBotoesProduto() {
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm("Tem certeza que deseja desativar este produto? Ele não aparecerá mais na loja.")) {
                try {
                    await Api.vendedor.inativarProduto(e.target.dataset.id);
                    carregarProdutos(); // Recarrega a lista
                } catch (err) {
                    alert("Erro ao desativar: " + err.message);
                }
            }
        });
    });

    document.querySelectorAll('.btn-selo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            window.location.href = `solicitacao-selo.html?produtoId=${id}`;
        });
    });
}

async function carregarVendas() {
    try {
        const vendas = await Api.vendedor.meusPedidos();
        loadingVendas.style.display = 'none';

        if (!vendas || vendas.length === 0) {
            emptyVendas.style.display = 'block';
            return;
        }

        listaVendas.innerHTML = vendas.map(pedido => `
            <tr>
                <td>#${pedido.id}</td>
                <td>${formatarData(pedido.data)}</td>
                <td>${pedido.nomeCliente || 'Cliente'}</td>
                <td>${formatarMoeda(pedido.valorTotal)}</td>
                <td><span class="status-badge status-pendente">${pedido.status}</span></td>
                <td>
                    ${pedido.status === 'PAGAMENTO_APROVADO' ? 
                        `<button class="btn btn-primary btn-sm btn-enviar" data-id="${pedido.id}">Marcar Enviado</button>` : 
                        '-'}
                </td>
            </tr>
        `).join('');
        
        configurarBotoesVenda();

    } catch (error) {
        console.error(error);
        loadingVendas.innerText = "Nenhuma venda encontrada.";
    }
}

function configurarBotoesVenda() {
    document.querySelectorAll('.btn-enviar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm("Confirmar envio do pedido?")) {
                try {
                    await Api.vendedor.atualizarStatusPedido(e.target.dataset.id, 'ENVIADO');
                    carregarVendas();
                } catch (err) {
                    alert("Erro: " + err.message);
                }
            }
        });
    });
}