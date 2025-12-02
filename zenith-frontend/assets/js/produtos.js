import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

const gridProdutos = $('#gridProdutos');
const inputSearch = $('#searchInput');
const inputPrecoMin = $('#precoMin');
const inputPrecoMax = $('#precoMax');
const selectSelo = $('#filtroSelo');
const btnBuscar = $('#btnBuscar');
const btnFiltrar = $('#btnFiltrar');
const btnLimpar = $('#btnLimpar');

document.addEventListener('DOMContentLoaded', () => {
    atualizarHeader();

    carregarCategorias(); 

    if (btnBuscar) btnBuscar.addEventListener('click', () => aplicarFiltros());
    if (btnFiltrar) btnFiltrar.addEventListener('click', () => aplicarFiltros());
    if (btnLimpar) btnLimpar.addEventListener('click', limparFiltros);
    
    if (inputSearch) {
        inputSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') aplicarFiltros();
        });
    }

    if (selectSelo) {
        selectSelo.addEventListener('change', () => aplicarFiltros());
    }
});

function atualizarHeader() {
    const menu = $('#menuUsuario');
    if (!menu) return;

    if (Auth.isLogado()) {
        const user = Auth.getDadosUsuario();
        let html = `<a href="carrinho.html" class="btn btn-outline">🛒 Carrinho</a> <a href="perfil.html" class="btn btn-outline">Conta</a>`;
        
        if(user && user.role === 'VENDEDOR') {
            html += `<a href="painel-vendedor.html" class="btn btn-primary" style="margin-left:5px">Vendedor</a>`;
        }
        if(user && user.role === 'ADMIN') {
            html += `<a href="painel-adm.html" class="btn btn-primary" style="margin-left:5px">Admin</a>`;
        }
        
        html += `<button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>`;
        menu.innerHTML = html;
        
        const btnSair = document.getElementById('btnSair');
        if(btnSair) btnSair.addEventListener('click', Auth.logout);
    } else {
        menu.innerHTML = `<a href="tela_login.html" class="btn btn-outline">Entrar</a>`;
    }
}

async function carregarCategorias() {
    const container = $('#listaCategorias');
    if (!container) return;

    try {
        const cats = await Api.produtos.listarCategorias();
        
        if (!cats || cats.length === 0) {
            container.innerHTML = '<p>Nenhuma categoria.</p>';
        } else {
            container.innerHTML = cats.map(c => `
                <label style="display:block; margin-bottom:5px; cursor:pointer;">
                    <input type="radio" name="catFilter" value="${c.id}" style="margin-right:8px;"> 
                    ${c.nome}
                </label>
            `).join('');
        }
        
        const params = new URLSearchParams(window.location.search);
        const catId = params.get('cat') || params.get('categoriaId');
        if(catId) {
            const radio = document.querySelector(`input[name="catFilter"][value="${catId}"]`);
            if(radio) radio.checked = true;
        }

        const termoInicial = params.get('termo') || params.get('busca');
        if (termoInicial && inputSearch) {
            inputSearch.value = termoInicial;
        }

        aplicarFiltros();

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        container.innerHTML = '<p>Erro ao carregar opções.</p>';
    }
}

async function aplicarFiltros() {
    
    let termo = inputSearch ? inputSearch.value : '';
    
    const radioCat = document.querySelector('input[name="catFilter"]:checked');
    const cat = radioCat ? radioCat.value : '';

    const min = inputPrecoMin ? inputPrecoMin.value : '';
    const max = inputPrecoMax ? inputPrecoMax.value : '';

    const selo = selectSelo ? selectSelo.value : '';

    let query = `?termo=${encodeURIComponent(termo)}`;
    if (cat) query += `&categoriaId=${cat}`;
    if (min) query += `&precoMin=${min}`;
    if (max) query += `&precoMax=${max}`;
    if (selo) query += `&tipoSelo=${selo}`;

    if(gridProdutos) gridProdutos.innerHTML = '<p>Carregando...</p>';

    try {
        const produtos = await Api.produtos.listar(query);
        renderizarProdutos(produtos);
    } catch (error) {
        console.error(error);
        if(gridProdutos) gridProdutos.innerHTML = '<p>Erro ao filtrar produtos. Tente novamente.</p>';
    }
}

function renderizarProdutos(produtos) {
    if (!gridProdutos) return;

    if (!produtos || produtos.length === 0) {
        gridProdutos.innerHTML = '<p>Nenhum produto encontrado com esses filtros.</p>';
        return;
    }

    gridProdutos.innerHTML = produtos.map(p => {
        let seloHtml = '';
        if (p.statusSelo === 'APROVADO') {
            if (p.tipoSelo === 'LOCAL') {
                seloHtml = `<span class="product-badge badge-local" style="position:absolute; top:10px; right:10px;">📍 Local</span>`;
            } else {
                seloHtml = `<span class="product-badge badge-sustentavel" style="position:absolute; top:10px; right:10px;">🌱 Sustentável</span>`;
            }
        }

        return `
        <div class="product-card" onclick="window.location.href='produto-detalhe.html?id=${p.id}'" style="position: relative; cursor: pointer;">
            ${seloHtml}
            <div class="product-image">
                <span style="font-size:3rem">📦</span>
            </div>
            <div class="product-info">
                <h3>${p.nome}</h3>
                <p class="product-category">${p.nomeCategoria || 'Geral'}</p>
                <div class="product-price">${formatarMoeda(p.preco)}</div>
            </div>
        </div>
        `;
    }).join('');
}

function limparFiltros() {
    if(inputSearch) inputSearch.value = '';
    if(inputPrecoMin) inputPrecoMin.value = '';
    if(inputPrecoMax) inputPrecoMax.value = '';
    if(selectSelo) selectSelo.value = '';
    
    document.querySelectorAll('input[name="catFilter"]').forEach(r => r.checked = false);
    
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);

    aplicarFiltros();
}