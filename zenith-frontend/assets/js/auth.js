const STORAGE_KEY = 'zenith_token';

export const Auth = {
    salvarToken(token) {
        localStorage.setItem(STORAGE_KEY, token);
    },

    getToken() {
        return localStorage.getItem(STORAGE_KEY);
    },

    isLogado() {
        return !!this.getToken();
    },

    logout() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = '/login.html';
    },

    getDadosUsuario() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Erro ao decodificar token", e);
            return null;
        }
    },

    temPermissao(roleNecessaria) {
        const user = this.getDadosUsuario();
        return user && user.role === roleNecessaria;
    }
};