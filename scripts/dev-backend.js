const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'gateway', dir: 'backend/api-gateway' },
  { name: 'auth', dir: 'backend/services/auth-service' },
  { name: 'user', dir: 'backend/services/user-service' },
  { name: 'product', dir: 'backend/services/product-service' },
  { name: 'vendor', dir: 'backend/services/vendor-service' },
  { name: 'inventory', dir: 'backend/services/inventory-service' },
  { name: 'order', dir: 'backend/services/order-service' },
  { name: 'payment', dir: 'backend/services/payment-service' },
  { name: 'notification', dir: 'backend/services/notification-service' },
  { name: 'cart', dir: 'backend/services/cart-service' },
  { name: 'analytics', dir: 'backend/services/analytics-service' }
];

console.log('🚀 Starting E-Commerce microservices backend runner...');

services.forEach((service) => {
  const absoluteDir = path.resolve(__dirname, '..', service.dir);
  console.log(`[System] Starting ${service.name} in ${service.dir}...`);
  
  const child = spawn('npm', ['run', 'dev'], {
    cwd: absoluteDir,
    shell: true,
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.error(`[${service.name}] Failed to start:`, err);
  });

  child.on('exit', (code) => {
    console.log(`[${service.name}] Exited with code ${code}`);
  });
});
