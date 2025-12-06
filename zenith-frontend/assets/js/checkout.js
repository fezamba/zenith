import { Api } from './api.js';
import { Auth } from './auth.js';
import { formatarMoeda, $ } from './utils.js';

const listaResumo = $('#listaResumoItens');
const elSubtotal = $('#subtotalVal');
const elTotal = $('#totalVal');
const elDesconto = $('#descontoPontos');
const checkPontos = $('#usarPontos');
const btnConfirmar = $('#btnConfirmarPedido');

const dropdownContainer = $('#dropdownContainer');
const dropdownSelectedText = $('#dropdownSelectedText span');
const dropdownOptionsList = $('#dropdownOptionsList');
const inputHiddenEnderecoId = $('#enderecoIdSelected');
const elMsgSemEndereco = $('#msgSemEndereco');

let valorTotalCarrinho = 0;

document.addEventListener('DOMContentLoaded', () => {
    if(!Auth.isLogado()) window.location.href = 'tela_login.html';
    
    carregarResumo();
    carregarEnderecos();
    setupDropdownEvents();
    
    checkPontos.addEventListener('change', recalcularTotal);
    btnConfirmar.addEventListener('click', finalizarPedido);
});

function setupDropdownEvents() {
    dropdownContainer.addEventListener('click', () => {
        if (!dropdownContainer.classList.contains('disabled')) {
            dropdownContainer.classList.toggle('open');
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
            dropdownContainer.classList.remove('open');
        }
    });
}

function selecionarOpcao(id, texto, elementoClicado) {
    dropdownSelectedText.innerText = texto;
    inputHiddenEnderecoId.value = id;
    
    document.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
    if(elementoClicado) elementoClicado.classList.add('selected');

    dropdownContainer.classList.remove('open');
}

async function carregarEnderecos() {
    try {
        const enderecos = await Api.enderecos.listar();
        
        dropdownOptionsList.innerHTML = '';

        if (!enderecos || enderecos.length === 0) {
            dropdownSelectedText.innerText = "Nenhum endereço disponível";
            dropdownContainer.classList.add('disabled');
            elMsgSemEndereco.style.display = 'block';
            inputHiddenEnderecoId.value = "";
            return;
        }

        dropdownContainer.classList.remove('disabled');
        elMsgSemEndereco.style.display = 'none';

        enderecos.forEach((end, index) => {
            const textoEndereco = `${end.logradouro}, ${end.numero || 'S/N'} - ${end.cidade}/${end.estado} (${end.cep})`;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'dropdown-option';
            optionDiv.innerText = textoEndereco;
            
            if (index === 0) {
                selecionarOpcao(end.id, textoEndereco, optionDiv);
            }

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                selecionarOpcao(end.id, textoEndereco, optionDiv);
            });

            dropdownOptionsList.appendChild(optionDiv);
        });

    } catch (error) {
        console.error("Erro ao carregar endereços:", error);
        dropdownSelectedText.innerText = "Erro ao carregar endereços";
        dropdownContainer.classList.add('disabled');
    }
}

async function carregarResumo() {
    try {
        const carrinho = await Api.carrinho.buscar();
        
        if(!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
            alert("Seu carrinho está vazio.");
            window.location.href = 'home.html';
            return;
        }
        valorTotalCarrinho = carrinho.valorTotal || carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        listaResumo.innerHTML = carrinho.itens.map(item => `
            <div class="summary-item-row">
                <span>${item.quantidade}x ${item.nomeProduto}</span>
                <span>${formatarMoeda(item.precoUnitario * item.quantidade)}</span>
            </div>
        `).join('');
        recalcularTotal();
    } catch (e) {
        console.error(e);
    }
}

function recalcularTotal() {
    let total = valorTotalCarrinho;
    if (checkPontos.checked) {
        elDesconto.innerText = "(Feature fora do escopo inicial)";
        elDesconto.style.color = "green";
    } else {
        elDesconto.innerText = "- R$ 0,00";
        elDesconto.style.color = "inherit";
    }
    elSubtotal.innerText = formatarMoeda(valorTotalCarrinho);
    elTotal.innerText = formatarMoeda(total);
}

async function finalizarPedido() {
    const enderecoIdVal = inputHiddenEnderecoId.value; 
    const usarPontos = checkPontos.checked;

    if(!enderecoIdVal) {
        alert("Por favor, selecione um endereço de entrega ou cadastre um novo.");
        if(!dropdownContainer.classList.contains('disabled')) {
             dropdownContainer.classList.add('open');
        }
        return;
    }

    try {
        btnConfirmar.disabled = true;
        btnConfirmar.innerText = "Processando...";

        const pedido = await Api.pedidos.checkout({
            enderecoId: parseInt(enderecoIdVal),
            usarZenithPoints: usarPontos
        });

        $('#numeroPedido').innerText = `#${pedido.id}`;
        $('#modalSucesso').style.display = 'flex';

    } catch (error) {
        console.error("Erro no checkout:", error);
        alert("Erro ao finalizar: " + error.message);
        btnConfirmar.disabled = false;
        btnConfirmar.innerText = "CONFIRMAR PEDIDO";
    }
}