import { Api } from './api.js';
import { Auth } from './auth.js';
import { $ } from './utils.js';

const form = $('#formProduto');
const selectCategoria = $('#categoria');
const btnSalvar = $('#btnSalvar');

document.addEventListener('DOMContentLoaded', () => {
    verificarPermissao();
    renderizarHeader();
    carregarCategorias();
    
    form.addEventListener('submit', salvarProduto);
});

function verificarPermissao() {
    if (!Auth.isLogado() || !Auth.temPermissao('VENDEDOR')) {
        alert("Acesso negado.");
        window.location.href = 'home.html';
    }
}

function renderizarHeader() {
    const user = Auth.getDadosUsuario();
    $('#menuUsuario').innerHTML = `
        <span style="margin-right:15px; color:var(--text-light);">Vendedor: <strong>${user.sub}</strong></span>
        <button id="btnSair" class="btn" style="background:#d32f2f; color:white;">Sair</button>
    `;
    $('#btnSair').addEventListener('click', Auth.logout);
}

async function carregarCategorias() {
    try {
        const categorias = await Api.produtos.listarCategorias();
        
        if (categorias.length === 0) {
            selectCategoria.innerHTML = '<option value="">Nenhuma categoria encontrada</option>';
            return;
        }

        selectCategoria.innerHTML = 
            `<option value="">Selecione uma categoria...</option>` +
            categorias.map(cat => `<option value="${cat.id}">${cat.nome}</option>`).join('');

    } catch (error) {
        console.error(error);
        selectCategoria.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

async function salvarProduto(e) {
    e.preventDefault();

    const produto = {
        nome: $('#nome').value,
        descricao: $('#descricao').value,
        preco: parseFloat($('#preco').value),
        estoque: parseInt($('#estoque').value),
        categoriaId: parseInt(selectCategoria.value)
    };

    try {
        btnSalvar.disabled = true;
        btnSalvar.innerText = "Salvando...";

        await Api.vendedor.criarProduto(produto);
        
        alert("Produto cadastrado com sucesso!");
        window.location.href = 'painel-vendedor.html';

    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar: " + error.message);
        btnSalvar.disabled = false;
        btnSalvar.innerText = "Publicar Produto";
    }
}