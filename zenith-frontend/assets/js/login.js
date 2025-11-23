import { Api } from './api.js';
import { Auth } from './auth.js';

document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const btn = document.getElementById('btnEntrar');

    try {
        btn.disabled = true;
        btn.textContent = "Entrando...";

        const data = await Api.auth.login({ email, senha });
        
        Auth.salvarToken(data.token);
        
        const user = Auth.getDadosUsuario();
        
        if (user.role === 'ADMIN') {
            window.location.href = 'painel-adm.html';
        } else if (user.role === 'VENDEDOR') {
            window.location.href = 'painel-vendedor.html';
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.href = redirect ? redirect : 'home.html';
        }

    } catch (error) {
        alert("Erro no login: " + error.message);
        btn.disabled = false;
        btn.textContent = "Entrar";
    }
});