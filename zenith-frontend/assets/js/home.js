import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda } from './utils.js';

const menuUsuario = document.getElementById('menuUsuario');
const listaProdutos = document.getElementById('listaProdutos');
const listaCategorias = document.getElementById('listaCategorias');
const searchInput = document.getElementById('searchInput');
const btnBuscar = document.getElementById('btnBuscar');

document.addEventListener('DOMContentLoaded', () => {
    atualizarHeader();
    carregarCategorias();
    carregarProdutos();
    
    btnBuscar.addEventListener('click', realizarBusca);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusca();
    });
});

function atualizarHeader() {
    if (Auth.isLogado()) {
        const user = Auth.getDadosUsuario();
        let html = `
            <a href="carrinho.html" class="btn btn-outline">🛒 Carrinho</a>
            <a href="perfil.html" class="btn btn-outline">Minha Conta</a>
        `;

        if (user && user.role === 'VENDEDOR') {
            html += `<a href="painel-vendedor.html" class="btn btn-primary">Vendedor</a>`;
        } else if (user && user.role === 'ADMIN') {
            html += `<a href="painel-adm.html" class="btn btn-primary">Admin</a>`;
        }

        html += `<button id="btnSair" class="btn" style="background-color:#d32f2f; color:white; margin-left:10px;">Sair</button>`;
        menuUsuario.innerHTML = html;

        document.getElementById('btnSair').addEventListener('click', Auth.logout);
    } else {
        menuUsuario.innerHTML = `
            <a href="tela_login.html" class="btn btn-outline">Entrar</a>
            <a href="tela_cadastro.html" class="btn btn-primary">Cadastrar</a>
        `;
    }
}

function realizarBusca() {
    const termo = searchInput.value;
    const titulo = document.getElementById('tituloProdutos');
    if(titulo) titulo.innerText = termo ? `Resultados para "${termo}"` : 'Destaques';
    carregarProdutos(termo);
}

async function carregarCategorias() {
    try {
        const categorias = await Api.produtos.listarCategorias();
        if (categorias && categorias.length > 0) {
            listaCategorias.innerHTML = categorias.map(cat => `
                <div class="category-card" style="cursor:pointer;" onclick="window.location.href='produtos.html?cat=${cat.id}'">
                    <h3>${cat.nome}</h3>
                </div>
            `).join('');
        } else {
            listaCategorias.innerHTML = '<p>Nenhuma categoria.</p>';
        }
    } catch (error) {
        console.error(error);
        listaCategorias.innerHTML = '<p>Erro ao carregar categorias.</p>';
    }
}

async function carregarProdutos(termo = '') {
    try {
        listaProdutos.innerHTML = '<p>Buscando...</p>';
        const query = termo ? `?termo=${encodeURIComponent(termo)}` : '';
        const produtos = await Api.produtos.listar(query);

        if (!produtos || produtos.length === 0) {
            listaProdutos.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        listaProdutos.innerHTML = produtos.map(prod => {
            let selo = '';
            if (prod.statusSelo === 'APROVADO') {
                selo = `<div class="badge-container"><span class="badge badge-sustentavel">🌱 Sustentável</span></div>`;
            }

            return `
            <a href="produto-detalhe.html?id=${prod.id}" class="product-card">
                <div class="product-image">📦</div>
                <div class="product-info">
                    ${selo}
                    <h3 class="product-name">${prod.nome}</h3>
                    <div class="product-price">${formatarMoeda(prod.preco)}</div>
                    <div class="seller-info">
                        <span>Vendedor: ${prod.nomeVendedor || 'Parceiro Zenith'}</span>
                    </div>
                </div>
            </a>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        listaProdutos.innerHTML = '<p style="color:red">Erro ao conectar com o servidor.</p>';
    }
}