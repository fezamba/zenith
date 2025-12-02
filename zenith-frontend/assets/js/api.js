import { Auth } from './auth.js';

const API_BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = Auth.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (response.status === 401 || response.status === 403) {
            if (!window.location.pathname.includes('login.html')) {
                console.warn("Sessão expirada.");
                Auth.logout();
            }
        }

        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error(`Erro na API [${method} ${endpoint}]:`, error);
        throw error;
    }
}

export const Api = {
    
    auth: {
        login: (creds) => request('/auth/login', 'POST', creds), // {email, senha}
        registrarCliente: (dados) => request('/auth/registrar', 'POST', dados),
        registrarVendedor: (dados) => request('/auth/registrar-vendedor', 'POST', dados)
    },

    produtos: {
        listar: (params = '') => request(`/produtos${params}`), // ex: ?termo=celular&precoMax=1000
        buscarPorId: (id) => request(`/produtos/${id}`),
        listarCategorias: () => request('/produtos/categorias')
    },

    carrinho: {
        buscar: () => request('/carrinho'),
        adicionar: (item) => request('/carrinho/adicionar', 'POST', item), // {produtoId, quantidade}
        atualizar: (item) => request('/carrinho/atualizar', 'PUT', item),
        remover: (produtoId) => request(`/carrinho/remover/${produtoId}`, 'DELETE')
    },

    pedidos: {
        checkout: (dados) => request('/pedidos/checkout', 'POST', dados), // {enderecoId, usarZenithPoints}
        meusPedidos: () => request('/pedidos/meus-pedidos') 
    },

    avaliacoes: {
        criar: (dados) => request('/avaliacoes', 'POST', dados),
        listarDoProduto: (produtoId) => request(`/avaliacoes/produto/${produtoId}`)
    },

    vendedor: {
        meusProdutos: () => request('/vendedor/produtos'),
        criarProduto: (prod) => request('/vendedor/produtos', 'POST', prod),
        editarProduto: (id, prod) => request(`/vendedor/produtos/${id}`, 'PUT', prod),
        inativarProduto: (id) => request(`/vendedor/produtos/${id}`, 'DELETE'),
        
        meusPedidos: () => request('/vendedor/pedidos'),
        atualizarStatusPedido: (id, status) => request(`/vendedor/pedidos/${id}/status`, 'PATCH', { novoStatus: status }),
        
        solicitarSelo: (id, dados) => request(`/vendedor/produtos/${id}/solicitar-selo`, 'POST', dados)
    },

    admin: {
        vendedoresPendentes: () => request('/admin/vendedores/pendentes'),
        aprovarVendedor: (id, status) => request(`/admin/vendedores/${id}/status`, 'PATCH', { novoStatus: status }), // status: APROVADO/REJEITADO
        
        selosPendentes: () => request('/admin/selos/pendentes'),
        aprovarSelo: (id, status) => request(`/admin/selos/produtos/${id}/status`, 'PATCH', { novoStatus: status }),
        
        categorias: () => request('/admin/categorias'),
        criarCategoria: (cat) => request('/admin/categorias', 'POST', cat)
    },

    enderecos: {
        criar: (dados) => request('/enderecos', 'POST', dados),
        listar: () => request('/enderecos')
    }
};