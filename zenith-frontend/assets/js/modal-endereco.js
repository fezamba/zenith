import { Api } from './api.js';
import { $ } from './utils.js';
import { validarCEP } from './utils.js';

export function setupModalEndereco(aoSalvarSucesso) {
    const modal = $('#modalCadastroEndereco');
    const btnAbrir = $('#btnAbrirModalEndereco');
    const btnFechar = $('#btnFecharModal');
    const form = $('#formModalEndereco');

    if (!modal || !btnAbrir || !form) {
        console.warn("Elementos do modal de endereço não encontrados nesta página.");
        return;
    }

    btnAbrir.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    });

    const fechar = () => { modal.style.display = 'none'; };
    btnFechar.addEventListener('click', fechar);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fechar();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cepInput = $('#modal-cep');
        
        if (!validarCEP(cepInput.value)) {
            alert("CEP inválido! Use o formato 00000-000 ou apenas números.");
            return;
        }
        const btnSalvar = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSalvar.innerText;

        const novoEndereco = {
            cep: cepInput.value,
            logradouro: $('#modal-logradouro').value,
            numero: $('#modal-numero').value,
            cidade: $('#modal-cidade').value,
            estado: $('#modal-estado').value.toUpperCase()
        };

        try {
            btnSalvar.disabled = true;
            btnSalvar.innerText = "Salvando...";

            await Api.enderecos.criar(novoEndereco);
            
            alert("Endereço cadastrado com sucesso!");
            fechar();
            form.reset();

            if (aoSalvarSucesso) aoSalvarSucesso();

        } catch (error) {
            alert("Erro ao salvar: " + error.message);
        } finally {
            btnSalvar.disabled = false;
            btnSalvar.innerText = textoOriginal;
        }
    });
}