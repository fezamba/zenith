import { $ } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    configurarBuscaGlobal();
    configurarBotaoVoltar();
});

function configurarBuscaGlobal() {
    const btn = $('#btnBuscar');
    const input = $('#searchInput');

    if (!btn || !input) return;

    const realizarBusca = () => {
        const termo = input.value.trim();
        if (termo) {
            window.location.href = `produtos.html?termo=${encodeURIComponent(termo)}`;
        }
    };

    btn.addEventListener('click', realizarBusca);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusca();
    });
}

function configurarBotaoVoltar() {
    const btn = $('#btnVoltar');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });
}