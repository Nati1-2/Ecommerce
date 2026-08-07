import { describe, it, expect } from 'vitest';

describe('Order Calculation & Business Logic Unit Tests', () => {
  it('calculates order grand total correctly with shipping and tax', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = subtotal * 0.05;
    const shipping = 10;
    const grandTotal = subtotal + tax + shipping;

    expect(subtotal).toBe(250);
    expect(tax).toBe(12.5);
    expect(grandTotal).toBe(272.5);
  });

  it('formats order ID correctly with ORD prefix', () => {
    const generateOrderId = (timestamp: number, randomStr: string) =>
      `ORD-${timestamp.toString(36).toUpperCase()}-${randomStr.toUpperCase()}`;

    const orderId = generateOrderId(1754568000000, 'ab12');
    expect(orderId).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
  });
});
