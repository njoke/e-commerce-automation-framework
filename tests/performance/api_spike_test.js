import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: { http_req_failed: ['rate<0.05'] },
};

export default function () {
  const res = http.get('http://localhost:3001/api/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
