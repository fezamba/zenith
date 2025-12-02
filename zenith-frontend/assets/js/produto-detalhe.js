import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, formatarData, $ } from './utils.js';

const params = new URLSearchParams(window.location.search);
const produtoId = params.get('id');

const elNome = $('#produtoNome');
const elPreco = $('#produtoPreco');
const elDescricao = $('#produtoDescricao');
const elVendedor = $('#produtoVendedor');
const elSelo = $('#seloContainer');
const inputQtd = $('#inputQtd');

document.addEventListener('DOMContentLoaded', async () => {
    atualizarHeader();
    
    if (!produtoId) {
        alert("Produto não especificado.");
        window.location.href = 'home.html';
        return;
    }

    await carregarDetalhes();
    await carregarAvaliacoes();
    configurarEventos();
});

function atualizarHeader() {
    const menuUsuario = document.getElementById('menuUsuario');
    
    if (Auth.isLogado()) {
        const user = Auth.getDadosUsuario();
        
        const formAvaliacaoContainer = document.getElementById('formAvaliacaoContainer');
        const avisoLoginAvaliacao = document.getElementById('avisoLoginAvaliacao');
        if (formAvaliacaoContainer) formAvaliacaoContainer.style.display = 'block';
        if (avisoLoginAvaliacao) avisoLoginAvaliacao.style.display = 'none';
        
        let html = `<a href="carrinho.html" class="btn btn-outline">🛒 Carrinho</a>`;
        
        if (user && user.role === 'VENDEDOR') {
            html += `<a href="painel-vendedor.html" class="btn btn-primary">Vendedor</a>`;
        } else if (user && user.role === 'ADMIN') {
            html += `<a href="painel-adm.html" class="btn btn-primary">Admin</a>`;
        }
        
        html += `<button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>`;
        
        menuUsuario.innerHTML = html;
        
        document.getElementById('btnSair').addEventListener('click', Auth.logout);
    } else {
        menuUsuario.innerHTML = `<a href="tela_login.html" class="btn btn-outline">Entrar</a>`;
    }
}

async function carregarDetalhes() {
    try {
        const prod = await Api.produtos.buscarPorId(produtoId);
        
        document.title = `${prod.nome} - Zenith`;
        elNome.innerText = prod.nome;
        elPreco.innerText = formatarMoeda(prod.preco);
        elDescricao.innerText = prod.descricao || "Sem descrição.";
        elVendedor.innerText = prod.nomeVendedor || "Parceiro Zenith";
        
        $('#breadcrumbNome').innerText = prod.nome;
        $('#breadcrumbCategoria').innerText = prod.nomeCategoria || "Categoria";

        if (prod.statusSelo === 'APROVADO') {
            let badgeHtml = '';
            if (prod.tipoSelo === 'LOCAL') {
                badgeHtml = `
                    <span class="badge" style="font-size:1rem; padding:8px 12px; background-color:#0288d1; color:white; display:inline-flex; align-items:center; gap:5px; border-radius:20px;">
                        📍 Produção Local Certificada
                    </span>`;
            } else {
                badgeHtml = `
                    <span class="badge badge-sustentavel" style="font-size:1rem; padding:8px 12px; display:inline-flex; align-items:center; gap:5px; border-radius:20px;">
                        🌱 Produto Sustentável Certificado
                    </span>`;
            }
            elSelo.innerHTML = badgeHtml;
        } else {
            elSelo.innerHTML = '';
        }

        inputQtd.max = prod.estoque;
        if (prod.estoque <= 0) {
            $('#btnAdicionarCarrinho').disabled = true;
            $('#btnAdicionarCarrinho').innerText = "Esgotado";
            $('#btnAdicionarCarrinho').style.background = "#ccc";
        }

    } catch (error) {
        console.error(error);
        elNome.innerText = "Erro ao carregar produto";
        elNome.style.color = "red";
    }
}

async function carregarAvaliacoes() {
    const lista = $('#listaAvaliacoes');
    lista.innerHTML = '<p>Carregando avaliações...</p>';

    try {
        const stats = await Api.avaliacoes.listarDoProduto(produtoId);
        
        const avaliacoes = stats.avaliacoes; 

        if (!avaliacoes || avaliacoes.length === 0) {
            lista.innerHTML = '<p style="color:#777; font-style:italic;">Este produto ainda não tem avaliações. Seja o primeiro!</p>';
            return;
        }

        lista.innerHTML = avaliacoes.map(av => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${av.nomeCliente || 'Cliente Anônimo'}</span>
                    <span class="review-date">${formatarData(av.data)}</span>
                </div>
                <div class="review-stars">${'⭐'.repeat(av.nota)}</div>
                <p>${av.comentario || ''}</p>
            </div>
        `).join('');

    } catch (error) {
        console.warn("Erro ao carregar avaliações:", error);
        lista.innerHTML = '<p>Não foi possível carregar as avaliações.</p>';
    }
}

function configurarEventos() {
    $('#btnQtdMenos').addEventListener('click', () => {
        if (inputQtd.value > 1) inputQtd.value--;
    });
    $('#btnQtdMais').addEventListener('click', () => {
        const max = parseInt(inputQtd.max) || 99;
        if (inputQtd.value < max) inputQtd.value++;
    });

    $('#btnAdicionarCarrinho').addEventListener('click', async () => {
        if (!Auth.isLogado()) {
            alert("Faça login para comprar!");
            window.location.href = `tela_login.html?redirect=produto-detalhe.html?id=${produtoId}`;
            return;
        }

        try {
            const btn = $('#btnAdicionarCarrinho');
            const textoOriginal = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Adicionando...";

            await Api.carrinho.adicionar({
                produtoId: parseInt(produtoId),
                quantidade: parseInt(inputQtd.value)
            });

            alert("Produto adicionado ao carrinho!");
            window.location.href = 'carrinho.html';

        } catch (error) {
            alert("Erro: " + error.message);
            const btn = $('#btnAdicionarCarrinho');
            btn.disabled = false;
            btn.innerText = "Adicionar ao Carrinho";
        }
    });

    $('#formAvaliacao').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await Api.avaliacoes.criar({
                produtoId: parseInt(produtoId),
                nota: parseInt($('#notaAvaliacao').value),
                comentario: $('#textoAvaliacao').value
            });
            
            alert("Avaliação enviada! Você ganhou Zenith Points!");
            window.location.reload();
        } catch (error) {
            alert("Erro ao avaliar: " + error.message);
        }
    });
}