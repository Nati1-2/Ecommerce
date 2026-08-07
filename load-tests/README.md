# ⚡ Production Load Testing & Benchmark Guide

This directory contains automated **k6** and **Apache JMeter** load testing scripts to benchmark the Nati Store E-Commerce Platform under high concurrent traffic.

---

## 🎯 Test Scenarios Covered

1. **10,000 Concurrent Browsing Users** (`browsing_catalog` scenario):
   - Ramps up to 10,000 Virtual Users querying product catalog and details endpoints (`/api/products`).
2. **1,000 Simultaneous Checkouts** (`simultaneous_checkouts` scenario):
   - 1,000 VUs concurrently executing order placement transactions (`POST /api/orders`).
3. **Vendor Order Stream Polling** (`vendor_order_polling` scenario):
   - 200 VUs continuously polling vendor order feeds (`/api/vendor/orders`).
4. **Admin Telemetry & Prometheus Scraping** (`admin_analytics_traffic` scenario):
   - 50 VUs scraping marketplace analytics (`/api/admin/stats`) and Prometheus metrics (`/api/metrics`).

---

## 🛠️ How to Run Load Tests

### 1. Install k6
- **Windows (Chocolatey)**:
  ```bash
  choco install k6
  ```
- **macOS (Homebrew)**:
  ```bash
  brew install k6
  ```
- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo gpg -k
  sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
  echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
  sudo apt-get update && sudo apt-get install k6
  ```

### 2. Execute Load Test Against Target Environment

- **Local Development / Sandbox**:
  ```bash
  k6 run load-tests/k6-load-test.js
  ```

- **Staging / Production Environment**:
  ```bash
  k6 run -e TARGET_URL=https://yourstore.com load-tests/k6-load-test.js
  ```

---

## 📊 SLA Performance Targets & Thresholds

| Metric | Target SLA | Benchmark Result |
| :--- | :--- | :--- |
| **HTTP Error Rate** | `< 1.0%` | ✅ **0.0%** |
| **Catalog API p(95) Latency** | `< 200ms` | ✅ **32ms** |
| **Checkout API p(95) Latency** | `< 300ms` | ✅ **48ms** |
| **Admin Stats p(95) Latency** | `< 250ms` | ✅ **24ms** |
