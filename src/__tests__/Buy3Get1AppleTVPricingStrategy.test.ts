import { expect, describe, beforeEach, test, beforeAll } from "@jest/globals";
import { Buy3Get1AppleTVPricingStrategy } from "./../strategy/Buy3Get1AppleTVPricingStrategy";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { setupProductMap } from "../util/setupProductMap";

describe("Buy3Get1AppleTVPricingStrategy", () => {
  let pricingStrategy: Buy3Get1AppleTVPricingStrategy;
  let productMap: Map<string, Product>;

  beforeAll(() => {
    productMap = setupProductMap();
  });

  beforeEach(() => {
    pricingStrategy = new Buy3Get1AppleTVPricingStrategy();
  });

  test("should calculate total price for 4 Apple TVs", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 4)];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(328.5); // 3 chargeable, 1 free
  });

  test("should calculate total price for 5 Apple TVs", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 5)];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(438.0); // 4 chargeable, 1 free
  });

  test("should calculate total price for 7 Apple TVs", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 7)];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(657.0); // 5 chargeable, 2 free
  });

  test("should calculate total price for no Apple TVs", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 1),
      new OrderItem(productMap.get("vga")!, 2),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(609.99); // No discount applied
  });

  test("should return correct total when mixed items are present", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 4),
      new OrderItem(productMap.get("ipd")!, 1),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(878.49); // Total with discount on Apple TVs
  });

  test("should handle multiple product types correctly", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 8),
      new OrderItem(productMap.get("mbp")!, 1),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(657.0 + 1399.99); // Total with discount on Apple TVs + MacBook Pro price
  });

  test("should handle large quantities of Apple TVs correctly", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 100),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(100 * (109.5 - 109.5 / 4)); // Total with discounts applied
  });

  test("should calculate price with other products and no Apple TVs", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 2),
      new OrderItem(new Product("vga", "VGA Adapter", 30.0), 1),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(1129.98); // No discounts applied
  });

  test("should handle empty order items array", () => {
    const orderItems: OrderItem[] = [];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(0); // No items means no cost
  });

  test("should handle single Apple TV purchase correctly", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 1)];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(109.5); // Single unit, no discounts
  });

  test("should handle mixed quantities of Apple TVs and other products", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 3),
      new OrderItem(productMap.get("ipd")!, 2),
    ];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(328.5 + 1099.98); // Total with discount on Apple TVs
  });

  test("should not apply discounts if less than three Apple TVs are purchased", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 2)];
    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(219); // No discounts applied
  });

  test("should correctly calculate price when all items are discounted", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 12),
      new OrderItem(productMap.get("mbp")!, 2),
    ];

    // Total should include discounts on Apple TVs and full price for MacBooks
    const expectedTotal = (12 - Math.floor(12 / 4)) * 109.5 + 2 * 1399.99;

    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(expectedTotal);
  });

  test("should handle a large variety of products with some being eligible for discount", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 10),
      new OrderItem(productMap.get("ipd")!, 2),
      new OrderItem(productMap.get("mbp")!, 1),
      new OrderItem(productMap.get("vga")!, 4),
    ];

    const total = pricingStrategy.calculatePrice(orderItems);
    expect(total).toBe(3495.97);
  });
});
