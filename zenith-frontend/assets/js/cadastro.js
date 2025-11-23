import { Api } from './api.js';

const tabs = document.querySelectorAll('.tab-btn');
const inputCpf = document.getElementById('cpf');
const groupCpf = document.getElementById('group-cpf');
const inputCnpj = document.getElementById('cnpj');
const groupCnpj = document.getElementById('group-cnpj');
const tipoInput = document.getElementById('tipoUsuario');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tipo = tab.dataset.type;
        tipoInput.value = tipo;

        if (tipo === 'cliente') {
            groupCpf.style.display = 'block';
            inputCpf.required = true;
            groupCnpj.style.display = 'none';
            inputCnpj.required = false;
        } else {
            groupCpf.style.display = 'none';
            inputCpf.required = false;
            groupCnpj.style.display = 'block';
            inputCnpj.required = true;
        }
    });
});

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirma = document.getElementById('confirmaSenha').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const tipo = tipoInput.value;

    if (senha !== confirma) {
        alert("As senhas não coincidem!");
        return;
    }

    const btn = document.getElementById('btnCadastrar');
    btn.disabled = true;
    btn.textContent = "Cadastrando...";

    try {
        if (tipo === 'cliente') {
            const cpf = document.getElementById('cpf').value;
            await Api.auth.registrarCliente({ nome, email, senha, cpf });
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            window.location.href = 'tela_login.html';
        } else {
            const cnpj = document.getElementById('cnpj').value;
            await Api.auth.registrarVendedor({ nome, email, senha, cnpj });
            // RN09: Vendedor precisa de aprovação
            alert("Solicitação enviada! Sua conta de vendedor está pendente de aprovação pelo administrador.");
            window.location.href = 'tela_login.html';
        }
    } catch (error) {
        alert("Erro no cadastro: " + error.message);
        btn.disabled = false;
        btn.textContent = "Cadastrar";
    }
});