import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const p50Trend = new Trend('latency_p50_ms');
const p95Trend = new Trend('latency_p95_ms');
const p99Trend = new Trend('latency_p99_ms');
const failureRate = new Rate('failure_rate');

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 5000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(50)<50', 'p(95)<200', 'p(99)<400'],
    failure_rate: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);
  
  p50Trend.add(res.timings.duration);
  p95Trend.add(res.timings.duration);
  p99Trend.add(res.timings.duration);

  const passed = check(res, {
    'status is 200': (r) => r.status === 200,
    'latency under 250ms': (r) => r.timings.duration < 250,
  });

  failureRate.add(!passed);
  sleep(1);
}
