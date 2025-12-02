import { Auth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    verificarPermissaoDeAcesso();

    renderizarHeader();
    
    configurarBusca();

    configurarBotaoVoltar(); 
});

function verificarPermissaoDeAcesso() {
    if (!Auth.isLogado()) return;

    const user = Auth.getDadosUsuario();
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'home.html';

    const paginasDeLoja = [
        'home.html', 'produtos.html', 'produto-detalhe.html', 
        'carrinho.html', 'checkout.html', 'perfil.html', 'cadastro-endereco.html'
    ];

    if (user.role === 'ADMIN' && paginasDeLoja.includes(page)) {
        window.location.href = 'painel-adm.html';
    } 
    else if (user.role === 'VENDEDOR' && paginasDeLoja.includes(page)) {
        window.location.href = 'painel-vendedor.html';
    }
}

function renderizarHeader() {
    const nav = document.querySelector('nav');
    const user = Auth.isLogado() ? Auth.getDadosUsuario() : null;
    const logoLink = nav.querySelector('.logo a');
    const searchBar = nav.querySelector('.search-bar');
    const btnVoltar = document.getElementById('btnVoltar');
    
    const page = window.location.pathname.split('/').pop();

    if (btnVoltar) {
        const deveEsconder = 
            page === 'home.html' || 
            page === 'painel-vendedor.html' || 
            page === 'painel-adm.html' ||
            page === ''; // Raiz

        if (deveEsconder) {
            btnVoltar.style.display = 'none';
        } else {
            btnVoltar.style.display = 'block';
        }
    }

    if (user) {
        if (user.role === 'ADMIN') {
            logoLink.href = 'painel-adm.html';
            logoLink.innerHTML = '<h1>Zenith <small style="font-size:0.5em; color:#666">ADMIN</small></h1>';
            if (searchBar) searchBar.style.display = 'none';
        } 
        else if (user.role === 'VENDEDOR') {
            logoLink.href = 'painel-vendedor.html';
            logoLink.innerHTML = '<h1>Zenith <small style="font-size:0.5em; color:#666">PARCEIRO</small></h1>';
            if (searchBar) searchBar.style.display = 'none';
        }
        else {
            logoLink.href = 'home.html';
            if (searchBar) searchBar.style.display = 'flex';
        }
    } else {
        logoLink.href = 'home.html';
        if (searchBar) searchBar.style.display = 'flex';
    }

    renderizarMenuUsuario(user);
}

function renderizarMenuUsuario(user) {
    const menuUsuario = document.getElementById('menuUsuario');
    if (!menuUsuario) return;

    if (user) {
        let html = '';
        if (user.role === 'CLIENTE') {
            html += `<a href="carrinho.html" class="btn btn-outline" style="margin-right:10px">🛒 Carrinho</a>`;
            html += `<a href="perfil.html" class="btn btn-primary">Minha Conta</a>`;
        } else if (user.role === 'VENDEDOR') {
            html += `<span style="margin-right:15px; font-weight:bold;">${user.sub}</span>`;
        } else if (user.role === 'ADMIN') {
            html += `<span style="margin-right:15px; font-weight:bold;">Admin</span>`;
        }
        
        html += `<button id="btnSair" class="btn" style="background:#d32f2f; color:white; margin-left:10px">Sair</button>`;
        menuUsuario.innerHTML = html;
        document.getElementById('btnSair').addEventListener('click', Auth.logout);
    } else {
        menuUsuario.innerHTML = `
            <a href="tela_login.html" class="btn btn-outline" style="margin-right:10px">Entrar</a>
            <a href="tela_cadastro.html" class="btn btn-primary">Criar Conta</a>
        `;
    }
}

function configurarBusca() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('btnBuscar');
    if (!input || !btn) return;

    const realizarBusca = () => {
        const termo = input.value.trim();
        if (termo) window.location.href = `produtos.html?busca=${encodeURIComponent(termo)}`;
    };

    btn.addEventListener('click', realizarBusca);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusca();
    });
}

function configurarBotaoVoltar() {
    const btnVoltar = document.getElementById('btnVoltar');
    if (!btnVoltar) return;

    btnVoltar.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (window.history.length > 1) {
            window.history.back();
        } else {
            const user = Auth.isLogado() ? Auth.getDadosUsuario() : null;
            if (user && user.role === 'VENDEDOR') window.location.href = 'painel-vendedor.html';
            else if (user && user.role === 'ADMIN') window.location.href = 'painel-adm.html';
            else window.location.href = 'home.html';
        }
    });
}