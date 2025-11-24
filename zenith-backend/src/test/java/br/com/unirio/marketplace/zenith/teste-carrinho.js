import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '10s',
};

export default function () {
  const url = 'http://localhost:8080/api/carrinho/adicionar';
  
  const payload = JSON.stringify({
    produtoId: 5,
    quantidade: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmZXBldGl0dEBnbWFpbC5jb20iLCJyb2xlIjoiQ0xJRU5URSIsImlhdCI6MTc2Mzk0MTQ4OSwiZXhwIjoxNzYzOTQ1MDg5fQ.xeY8zZ8k7AkAbF5UYJslQ6ZF-jTISWSwx2jGhGwzqqYF6BcGdGbWpGSRC3GnNqB21gO9TZYfNBRKOEaHUiJItQ', 
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.5); 
}