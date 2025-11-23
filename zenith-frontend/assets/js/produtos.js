import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    atualizarHeader();
    carregarCategorias();
    
    const params = new URLSearchParams(window.location.search);
    const termoInicial = params.get('termo');
    const catInicial = params.get('cat');
    
    if (termoInicial) $('#searchInput').value = termoInicial;
    
    aplicarFiltros(catInicial);

    // Eventos
    $('#btnBuscar').addEventListener('click', () => aplicarFiltros());
    $('#btnFiltrar').addEventListener('click', () => aplicarFiltros());
    $('#btnLimpar').addEventListener('click', limparFiltros);
    $('#searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') aplicarFiltros();
    });
});

function atualizarHeader() {
    const menu = $('#menuUsuario');
    if (Auth.isLogado()) {
        const user = Auth.getDadosUsuario();
        let html = `<a href="carrinho.html" class="btn btn-outline">🛒 Carrinho</a> <a href="perfil.html" class="btn btn-outline">Conta</a>`;
        if(user && user.role === 'VENDEDOR') html += `<a href="painel-vendedor.html" class="btn btn-primary">Vendedor</a>`;
        if(user && user.role === 'ADMIN') html += `<a href="painel-adm.html" class="btn btn-primary">Admin</a>`;
        html += `<button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>`;
        menu.innerHTML = html;
        $('#btnSair').addEventListener('click', Auth.logout);
    } else {
        menu.innerHTML = `<a href="tela_login.html" class="btn btn-outline">Entrar</a>`;
    }
}

async function carregarCategorias() {
    const container = $('#listaCategorias');
    try {
        const cats = await Api.produtos.listarCategorias();
        if (!cats || cats.length === 0) {
            container.innerHTML = '<p>Nenhuma categoria.</p>';
            return;
        }
        
        container.innerHTML = cats.map(c => `
            <label style="display:block; margin-bottom:5px; cursor:pointer;">
                <input type="radio" name="catFilter" value="${c.id}" style="margin-right:8px;"> 
                ${c.nome}
            </label>
        `).join('');
        
        const params = new URLSearchParams(window.location.search);
        if(params.get('cat')) {
            const radio = document.querySelector(`input[name="catFilter"][value="${params.get('cat')}"]`);
            if(radio) radio.checked = true;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Erro.</p>';
    }
}

async function aplicarFiltros(catIdForcado = null) {
    const grid = $('#gridProdutos');
    const contador = $('#contadorProdutos');
    grid.innerHTML = '<p>Carregando...</p>';
    
    try {
        let query = '?';
        
        const catRadio = document.querySelector('input[name="catFilter"]:checked');
        const catId = catIdForcado || (catRadio ? catRadio.value : null);
        if (catId) query += `categoriaId=${catId}&`;

        const termo = $('#searchInput').value;
        if(termo) query += `termo=${encodeURIComponent(termo)}&`;
        
        const min = $('#precoMin').value;
        const max = $('#precoMax').value;
        if(min) query += `precoMin=${min}&`;
        if(max) query += `precoMax=${max}&`;

        const seloCheckbox = $('#filtroSelo');
        if(seloCheckbox && seloCheckbox.checked) query += `statusSelo=APROVADO&`;

        const produtos = await Api.produtos.listar(query);

        renderizarProdutos(produtos);
        
    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="color:red">Erro ao buscar.</p>';
    }
}

function renderizarProdutos(lista) {
    const grid = $('#gridProdutos');
    const contador = $('#contadorProdutos');
    
    if(!lista || lista.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px;">Nenhum produto encontrado.</div>';
        contador.innerText = `0 produtos`;
        return;
    }

    contador.innerText = `${lista.length} produtos`;

    grid.innerHTML = lista.map(p => `
        <a href="produto-detalhe.html?id=${p.id}" class="product-card">
            <div class="product-image">📦</div>
            <div class="product-info">
                ${p.statusSelo === 'APROVADO' ? '<span class="badge-sustentavel" style="font-size:0.8rem">🌱 Sustentável</span>' : ''}
                <h3 class="product-title">${p.nome}</h3>
                <div class="product-price">${formatarMoeda(p.preco)}</div>
                <small style="color:#888">Vendedor: ${p.nomeVendedor || 'Parceiro'}</small>
            </div>
        </a>
    `).join('');
}

function limparFiltros() {
    $('#searchInput').value = '';
    $('#precoMin').value = '';
    $('#precoMax').value = '';
    if($('#filtroSelo')) $('#filtroSelo').checked = false;
    document.querySelectorAll('input[name="catFilter"]').forEach(r => r.checked = false);
    aplicarFiltros();
}