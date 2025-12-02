import { Api } from './api.js';
import { Auth } from './auth.js';
import { $ } from './utils.js';

if (!Auth.isLogado() || !Auth.temPermissao('ADMIN')) {
    alert("Acesso restrito.");
    window.location.href = 'home.html';
}

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
        const msg = $('#msgSelos');

        if(!lista || lista.length === 0) {
            listaSelos.innerHTML = '';
            if(msg) msg.style.display = 'block';
            return;
        }
        if(msg) msg.style.display = 'none';

        listaSelos.innerHTML = lista.map(p => {
            const isLocal = p.tipoSelo === 'LOCAL';
            const badgeStyle = isLocal 
                ? 'background-color: #e1f5fe; color: #0277bd; border: 1px solid #b3e5fc;' // Azul
                : 'background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;'; // Verde
            
            const textoSelo = isLocal ? '📍 Local' : '🌱 Sustentável';

            return `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${p.nomeVendedor || 'ID: ' + p.vendedorId}</td>
                
                <td>
                    <span style="padding: 4px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; display: inline-block; white-space: nowrap; ${badgeStyle}">
                        ${textoSelo}
                    </span>
                </td>
                
                <td style="font-style:italic; color:#666;">"${p.justificativaSelo || ''}"</td>
                
                <td>
                    <div style="display:flex; gap:5px;">
                        <button class="btn btn-sm btn-primary" onclick="aprovarSelo(${p.id}, 'APROVADO')" title="Aprovar">✅</button>
                        <button class="btn btn-sm btn-outline" style="color:red; border-color:red" onclick="aprovarSelo(${p.id}, 'REJEITADO')" title="Rejeitar">❌</button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');

        window.aprovarSelo = async (id, status) => {
            if(!confirm(`Deseja definir o selo como ${status}?`)) return;
            try {
                await Api.admin.aprovarSelo(id, status);
                carregarSelos();
            } catch(e) { alert(e.message); }
        };
    } catch (e) { console.error(e); }
}

async function carregarCategorias() {
    try {
        const cats = await Api.admin.categorias(); 
        
        listaCategorias.innerHTML = cats.map(c => {
            const isAtivo = c.status === 'ATIVO';
            
            return `
            <div class="cat-item" style="
                display: flex; 
                flex-wrap: wrap; 
                justify-content: space-between; 
                align-items: center; 
                gap: 10px; 
                margin-bottom: 10px; 
                padding: 15px; 
                border: 1px solid #eee; 
                border-radius: 8px; 
                background-color: ${isAtivo ? '#fff' : '#f9f9f9'}; /* Fundo levemente cinza se inativo */
                opacity: ${isAtivo ? '1' : '0.8'};
            ">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px;">
                    <strong style="font-size: 1.05rem; color: #333; word-break: break-word;">
                        ${c.nome}
                    </strong>
                    
                    <span style="
                        font-size: 0.75rem; 
                        padding: 3px 8px; 
                        border-radius: 4px; 
                        font-weight: 700;
                        background: ${isAtivo ? '#e8f5e9' : '#ffebee'}; 
                        color: ${isAtivo ? '#2e7d32' : '#c62828'};
                        text-transform: uppercase;
                        white-space: nowrap;
                    ">
                        ${c.status}
                    </span>
                </div>
                
                <div style="display: flex; gap: 8px; flex-shrink: 0;">
                    <button class="btn btn-outline" 
                            style="padding: 5px 10px; display: flex; align-items: center; justify-content: center; min-width: 40px;" 
                            onclick="editarCategoria(${c.id}, '${c.nome}')" 
                            title="Editar">
                        ✏️
                    </button>
                    
                    ${isAtivo 
                        ? `<button class="btn btn-outline" 
                                style="padding: 5px 10px; color: #d32f2f; border-color: #d32f2f; display: flex; align-items: center; justify-content: center; min-width: 40px;" 
                                onclick="removerCategoria(${c.id})" 
                                title="Desativar">
                            🗑️
                           </button>`
                        : `<button class="btn btn-outline" 
                                style="padding: 5px 10px; color: #2e7d32; border-color: #2e7d32; display: flex; align-items: center; justify-content: center; min-width: 40px;" 
                                onclick="ativarCategoria(${c.id})" 
                                title="Reativar">
                            ✅
                           </button>`
                    }
                </div>
            </div>
            `;
        }).join('');

    } catch (e) {
        console.error(e);
        listaCategorias.innerHTML = '<p style="color: #666;">Erro ao carregar categorias.</p>';
    }
}

window.editarCategoria = async (id, nomeAtual) => {
    const novoNome = prompt("Novo nome da categoria:", nomeAtual);
    if (novoNome && novoNome !== nomeAtual) {
        try {
            await Api.admin.atualizarCategoria(id, { nome: novoNome });
            alert('Categoria atualizada!');
            carregarCategorias();
        } catch (e) {
            alert('Erro: ' + e.message);
        }
    }
};

window.removerCategoria = async (id) => {
    if (confirm("Tem certeza que deseja desativar esta categoria?")) {
        try {
            await Api.admin.removerCategoria(id);
            alert('Categoria desativada!');
            carregarCategorias();
        } catch (e) {
            alert('Erro: ' + e.message);
        }
    }
};

window.ativarCategoria = async (id) => {
    if (confirm("Deseja reativar esta categoria?")) {
        try {
            await Api.admin.ativarCategoria(id);
            alert('Categoria reativada com sucesso!');
            carregarCategorias();
        } catch (e) {
            alert('Erro: ' + e.message);
        }
    }
};

async function criarCategoria() {
    const nome = $('#novaCategoriaNome').value;
    if(!nome) return;
    await Api.admin.criarCategoria({ nome });
    $('#novaCategoriaNome').value = '';
    carregarCategorias();
}