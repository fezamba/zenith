import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '10s',
};

export default function () {
  const res = http.get('http://localhost:8080/api/produtos?termo=software');

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(0.1);
}