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
    const menu = $('#menuUsuario');
    if(menu) {
        menu.innerHTML = `
            <span style="margin-right:15px; font-weight:bold;">Olá, ${user.sub}</span>
            <a href="home.html" class="btn btn-outline">Ir para Loja</a>
            <button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>
        `;
        document.getElementById('btnSair').addEventListener('click', Auth.logout);
    }
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
        if(loadingProdutos) loadingProdutos.style.display = 'none';

        if (!produtos || produtos.length === 0) {
            if(emptyProdutos) emptyProdutos.style.display = 'block';
            listaProdutos.innerHTML = '';
            return;
        }

        if(emptyProdutos) emptyProdutos.style.display = 'none';

        listaProdutos.innerHTML = produtos.map(prod => {
            const isAtivo = prod.status === 'ATIVO';

            return `
            <tr style="${!isAtivo ? 'opacity: 0.6; background-color: #f9f9f9;' : ''}">
                <td>#${prod.id}</td>
                <td>
                    <strong>${prod.nome}</strong><br>
                    <small style="color:#999">${prod.nomeCategoria || 'Sem categoria'}</small>
                </td>
                <td>${formatarMoeda(prod.preco)}</td>
                <td>${prod.estoque} un</td>
                <td>
                    <span class="status-badge ${isAtivo ? 'status-ativo' : 'status-inativo'}">
                        ${prod.status || 'INATIVO'} </span>
                </td>
                <td>
                    ${renderizarStatusSelo(prod)}
                </td>
                <td>
                    <button class="action-btn" onclick="alert('Editar em breve!')" title="Editar">✏️</button>
                    
                    ${isAtivo 
                        ? `<button class="action-btn btn-danger" onclick="desativarProduto(${prod.id})" title="Desativar">❌</button>`
                        : `<button class="action-btn" style="color:green; border-color:green;" onclick="ativarProduto(${prod.id})" title="Ativar">✅</button>`
                    }

                    ${isAtivo && prod.statusSelo === 'NAO_SOLICITADO' ? 
                        `<button class="action-btn btn-selo" onclick="solicitarSelo(${prod.id})" title="Solicitar Selo">🏅</button>` : ''}
                </td>
            </tr>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        if(loadingProdutos) loadingProdutos.innerText = "Erro ao carregar produtos.";
    }
}

function renderizarStatusSelo(prod) {
    if (prod.statusSelo === 'APROVADO') return '<span class="status-badge status-ativo">🏅 Selo Ativo</span>';
    if (prod.statusSelo === 'PENDENTE') return '<span class="status-badge status-pendente">⏳ Em Análise</span>';
    if (prod.statusSelo === 'REJEITADO') return '<span class="status-badge status-inativo">❌ Recusado</span>';
    return '<span style="color:#ccc">-</span>';
}

window.desativarProduto = async (id) => {
    if(confirm("Deseja desativar este produto? Ele deixará de aparecer na loja.")) {
        try {
            await Api.vendedor.desativarProduto(id);
            carregarProdutos();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }
};

window.ativarProduto = async (id) => {
    if(confirm("Deseja reativar a venda deste produto?")) {
        try {
            await Api.vendedor.ativarProduto(id);
            carregarProdutos();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }
};

window.solicitarSelo = (id) => {
    window.location.href = `solicitacao-selo.html?produtoId=${id}`;
};

async function carregarVendas() {
    try {
        const vendas = await Api.vendedor.meusPedidos();
        if(loadingVendas) loadingVendas.style.display = 'none';

        if (!vendas || vendas.length === 0) {
            if(emptyVendas) emptyVendas.style.display = 'block';
            listaVendas.innerHTML = '';
            return;
        }
        
        if(emptyVendas) emptyVendas.style.display = 'none';

        listaVendas.innerHTML = vendas.map(pedido => `
            <tr>
                <td>#${pedido.id}</td>
                <td>${formatarData(pedido.data)}</td>
                <td>${pedido.nomeCliente || 'Cliente'}</td>
                <td>${formatarMoeda(pedido.valorTotal)}</td>
                <td><span class="status-badge status-pendente">${pedido.status}</span></td>
                <td>
                    ${pedido.status === 'PAGAMENTO_APROVADO' ? 
                        `<button class="btn btn-primary btn-sm" onclick="enviarPedido(${pedido.id})">Marcar Enviado</button>` : 
                        '-'}
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error(error);
        if(loadingVendas) loadingVendas.innerText = "Nenhuma venda encontrada.";
    }
}

window.enviarPedido = async (id) => {
    if(confirm("Confirmar envio do pedido?")) {
        try {
            await Api.vendedor.atualizarStatusPedido(id, 'ENVIADO');
            alert("Pedido marcado como enviado!");
            carregarVendas();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }
};