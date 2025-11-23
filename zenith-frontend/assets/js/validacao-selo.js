import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

const params = new URLSearchParams(window.location.search);
const produtoId = params.get('id');

if(!Auth.isLogado() || !Auth.temPermissao('ADMIN')) {
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    if(!produtoId) {
        alert("ID inválido");
        window.location.href = 'painel-adm.html';
        return;
    }
    
    // Header simples
    $('#menuUsuario').innerHTML = `<span style="font-weight:bold">Admin</span>`;

    try {
        const prod = await Api.produtos.buscarPorId(produtoId);
        
        $('#prodNome').innerText = prod.nome;
        $('#prodVendedor').innerText = `Vendedor: ${prod.nomeVendedor || 'Parceiro Zenith'}`;
        $('#prodPreco').innerText = formatarMoeda(prod.preco);
        $('#prodJustificativa').innerText = prod.justificativaSelo || "Justificativa não carregada pelo DTO público.";

    } catch (e) {
        console.error(e);
        alert("Erro ao carregar produto.");
    }

    $('#btnAprovar').addEventListener('click', () => decidir('APROVADO'));
    $('#btnRejeitar').addEventListener('click', () => decidir('REJEITADO'));
});

async function decidir(status) {
    if(!confirm(`Tem certeza que deseja ${status} este selo?`)) return;
    
    try {
        await Api.admin.aprovarSelo(produtoId, status);
        alert("Status atualizado com sucesso!");
        window.location.href = 'painel-adm.html';
    } catch (e) {
        alert("Erro: " + e.message);
    }
}