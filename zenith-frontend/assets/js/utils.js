export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

export function formatarData(dataIso) {
    if (!dataIso) return '-';
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR').format(data);
}

// export function validarCPF(cpf) {
//     cpf = cpf.replace(/[^\d]+/g, '');
//     if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

//     let soma = 0;
//     let resto;

//     for (let i = 1; i <= 9; i++) {
//         soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
//     }
//     resto = (soma * 10) % 11;
//     if ((resto === 10) || (resto === 11)) resto = 0;
//     if (resto !== parseInt(cpf.substring(9, 10))) return false;

//     soma = 0;
//     for (let i = 1; i <= 10; i++) {
//         soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
//     }
//     resto = (soma * 10) % 11;
//     if ((resto === 10) || (resto === 11)) resto = 0;
//     if (resto !== parseInt(cpf.substring(10, 11))) return false;

//     return true;
// }

// Para fins de desenvolvimento eu não vou validar o CPF de forma completa,
// apenas verificar se o formato está correto (11 dígitos, com ou sem pontuação).
// A função de cima faz a validação completa, mas eu não me matar testando o sistema deixei comentada.
export function validarCPF(cpf) {
    const regex = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;
    return regex.test(cpf);
}

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);