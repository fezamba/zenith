import { Api } from './api.js';
import { formatarMoeda } from './utils.js';

const listaProdutos = document.getElementById('listaProdutos');
const listaCategorias = document.getElementById('listaCategorias');

const searchInput = document.getElementById('searchInput'); 
const btnBuscar = document.getElementById('btnBuscar');

document.addEventListener('DOMContentLoaded', () => {
    
    carregarCategorias();
    carregarProdutos();
    
    if(btnBuscar) {
        btnBuscar.addEventListener('click', realizarBusca);
    }
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') realizarBusca();
        });
    }
});

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

        listaProdutos.innerHTML = produtos.map(p => {
            
            let seloHtml = '';
            if (p.statusSelo === 'APROVADO') {
                if (p.tipoSelo === 'LOCAL') {
                    seloHtml = `<span class="product-badge badge-local" style="position:absolute; top:10px; right:10px;">📍 Local</span>`;
                } else {
                    seloHtml = `<span class="product-badge badge-sustentavel" style="position:absolute; top:10px; right:10px;">🌱 Sustentável</span>`;
                }
            }

            return `
            <div class="product-card" onclick="window.location.href='produto-detalhe.html?id=${p.id}'" style="position:relative; cursor:pointer;">
                ${seloHtml}
                <div class="product-image">
                    <span style="font-size:3rem">📦</span>
                </div>
                <div class="product-info">
                    <h3>${p.nome}</h3>
                    <div class="product-price">${formatarMoeda(p.preco)}</div>
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        listaProdutos.innerHTML = '<p style="color:red">Erro ao conectar com o servidor.</p>';
    }
}