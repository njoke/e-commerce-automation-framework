import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    userId: 'user-001',
    firstName: 'Test', lastName: 'User',
    email: 'test@test.com',
    address: '123 Main St', city: 'Seattle', state: 'WA', zip: '98101',
    items: [{ productId: 'prod-001', quantity: 1, price: 299.99 }]
  });
  const res = http.post('http://localhost:3001/api/checkout', payload, {
    headers: { 'Content-Type': 'application/json', 'x-user-id': 'user-001' }
  });
  check(res, { 'status is 201': (r) => r.status === 201 });
  sleep(1);
}
