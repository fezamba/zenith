import { Api } from './api.js';
import { Auth } from './auth.js';
import { $ } from './utils.js';

if (!Auth.isLogado() || !Auth.temPermissao('ADMIN')) {
    alert("Acesso restrito.");
    window.location.href = 'home.html';
}

// Elementos
const listaVendedores = $('#listaVendedores');
const listaSelos = $('#listaSelos');
const listaCategorias = $('#listaCategorias');

document.addEventListener('DOMContentLoaded', () => {
    renderizarHeader();
    configurarTabs();
    carregarVendedores();
    carregarSelos();
    carregarCategorias();

    $('#btnCriarCategoria').addEventListener('click', criarCategoria);
});

function renderizarHeader() {
    const user = Auth.getDadosUsuario();
    $('#menuUsuario').innerHTML = `
        <span style="margin-right:15px">Admin: <strong>${user.sub}</strong></span>
        <button id="btnSair" class="btn" style="background:#d32f2f; color:white">Sair</button>
    `;
    $('#btnSair').addEventListener('click', Auth.logout);
}

function configurarTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

async function carregarVendedores() {
    try {
        const lista = await Api.admin.vendedoresPendentes();
        if(lista.length > 0) $('#msgVendedores').style.display = 'none';
        
        listaVendedores.innerHTML = lista.map(v => `
            <tr>
                <td>#${v.id}</td>
                <td>${v.nome}</td>
                <td>${v.cnpj}</td>
                <td>${v.email}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="aprovarVendedor(${v.id}, 'APROVADO')">✅</button>
                    <button class="btn btn-outline btn-sm" onclick="aprovarVendedor(${v.id}, 'REJEITADO')">❌</button>
                </td>
            </tr>
        `).join('');

        window.aprovarVendedor = async (id, status) => {
            if(!confirm(`Confirmar ${status}?`)) return;
            await Api.admin.aprovarVendedor(id, status);
            carregarVendedores();
        };
    } catch (e) { console.error(e); }
}

async function carregarSelos() {
    try {
        const lista = await Api.admin.selosPendentes();
        if(lista.length > 0) $('#msgSelos').style.display = 'none';

        listaSelos.innerHTML = lista.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.nomeVendedor || 'ID: ' + p.vendedorId}</td>
                <td><em>"${p.justificativaSelo || ''}"</em></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="aprovarSelo(${p.id}, 'APROVADO')">✅</button>
                    <button class="btn btn-outline btn-sm" onclick="aprovarSelo(${p.id}, 'REJEITADO')">❌</button>
                </td>
            </tr>
        `).join('');

        window.aprovarSelo = async (id, status) => {
            if(!confirm(`Definir selo como ${status}?`)) return;
            await Api.admin.aprovarSelo(id, status);
            carregarSelos();
        };
    } catch (e) { console.error(e); }
}

async function carregarCategorias() {
    const cats = await Api.produtos.listarCategorias();
    listaCategorias.innerHTML = cats.map(c => `
        <div class="cat-item">
            <span>${c.nome}</span>
            <span class="badge-status ${c.status === 'ATIVO' ? 'status-ativo' : 'status-inativo'}">${c.status}</span>
        </div>
    `).join('');
}

async function criarCategoria() {
    const nome = $('#novaCategoriaNome').value;
    if(!nome) return;
    await Api.admin.criarCategoria({ nome });
    $('#novaCategoriaNome').value = '';
    carregarCategorias();
}