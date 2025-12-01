import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  
  thresholds: {
    http_req_duration: ['p(95)<300'], 
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:8080/api/produtos?termo=Produto', {
    tags: { name: 'BuscaProdutos' },
  });

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 0.5); 
}