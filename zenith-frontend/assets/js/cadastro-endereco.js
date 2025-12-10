import { Api } from './api.js';
import { Auth } from './auth.js';
import { validarCEP } from './utils.js';

if (!Auth.isLogado()) {
    window.location.href = 'tela_login.html';
}

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'home.html';
    }
}

document.getElementById('btnCancelar').addEventListener('click', (e) => {
    e.preventDefault();
    voltar();
});

document.getElementById('formEndereco').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btnSalvar = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btnSalvar.innerText;

    const cepValor = document.getElementById('cep').value;

    if (!validarCEP(cepValor)) {
        alert("CEP inválido! Use o formato 00000-000 ou apenas números.");
        return;
    }

    const endereco = {
        cep: cepValor,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value.toUpperCase()
    };

    try {
        btnSalvar.disabled = true;
        btnSalvar.innerText = "Salvando...";

        await Api.enderecos.criar(endereco);
        
        alert("Endereço cadastrado com sucesso!");
        voltar();

    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
        btnSalvar.disabled = false;
        btnSalvar.innerText = textoOriginal;
    }
});