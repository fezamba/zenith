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

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);