import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  
  thresholds: {
    http_req_duration: ['p(95)<2000'], 
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const uniqueId = randomString(8);
  const email = `user_${uniqueId}@teste.com`;
  const senha = 'password123';
  const cpf = randomString(11, '0123456789'); 

  const payloadRegistro = JSON.stringify({
    nome: `User ${uniqueId}`,
    email: email,
    senha: senha,
    cpf: cpf
  });

  const paramsPublico = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'RegistrarUsuario' }, 
  };

  const resRegistro = http.post('http://localhost:8080/api/auth/registrar', payloadRegistro, paramsPublico);

  const checkRegistro = check(resRegistro, {
    'registro OK': (r) => r.status === 201,
  });

  if (!checkRegistro) return;

  const payloadLogin = JSON.stringify({
    email: email,
    senha: senha
  });

  const resLogin = http.post('http://localhost:8080/api/auth/login', payloadLogin, paramsPublico);

  const checkLogin = check(resLogin, {
    'login OK': (r) => r.status === 200,
    'token existe': (r) => r.json('token') !== undefined,
  });

  if (!checkLogin) return;

  const token = resLogin.json('token');

  const payloadCarrinho = JSON.stringify({
    produtoId: 13,
    quantidade: 1,
  });

  const paramsAutenticado = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    tags: { name: 'AdicionarCarrinho' }, 
  };

  const resCarrinho = http.post('http://localhost:8080/api/carrinho/adicionar', payloadCarrinho, paramsAutenticado);

  check(resCarrinho, {
    'carrinho OK': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);
}