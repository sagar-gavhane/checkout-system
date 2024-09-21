import { IPadBulkBuy4PlusPricingStrategy } from "../strategy/IPadBulkBuy4PlusPricingStrategy";
import { DefaultPricingStrategy } from "../strategy/DefaultPricingStrategy";
import { OrderItem } from "../entity/OrderItem";
import { setupProductMap } from "../util/setupProductMap";
import { expect, describe, beforeAll, test } from "@jest/globals";
import { Order } from "../entity/Order";
import { User } from "../entity/User";

describe("IPadBulkBuy4PlusPricingStrategy", () => {
  let pricingStrategy: IPadBulkBuy4PlusPricingStrategy;
  let productMap: Map<string, any>;

  beforeAll(() => {
    pricingStrategy = new IPadBulkBuy4PlusPricingStrategy();
    productMap = setupProductMap(); // Setup product map for testing
  });

  test("should calculate price correctly for 4 iPads", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 4 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(1999.96); // 499.99 * 4
  });

  test("should calculate price correctly for 5 iPads", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 5 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(2499.95); // 499.99 * 5
  });

  test("should calculate price correctly with mbp products", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 3 },
      { product: productMap.get("mbp"), quantity: 2 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(1499.97 + 2799.98);
  });

  test("should handle zero iPads in order", () => {
    const orderItems: OrderItem[] = [];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(0); // No items means no cost
  });

  test("should handle non-iPad products only", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("mbp"), quantity: 1 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(
      new DefaultPricingStrategy().calculatePrice(orderItems)
    ); // Only default pricing applies
  });

  test("should handle multiple SKUs with varying quantities", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 6 },
      { product: productMap.get("mbp"), quantity: 1 },
      { product: productMap.get("atv"), quantity: 2 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(4618.93);
  });

  test("should return correct price with mixed quantities of iPads and other products", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 2 },
      { product: productMap.get("mbp"), quantity: 5 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(7999.93);
  });

  test("should handle large quantities of iPads", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 100 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(49999); // Expecting bulk price calculation
  });

  test("should handle edge case of negative quantities", () => {
    expect(() => {
      const order = new Order(1, new User(1, "John"), [
        new OrderItem(productMap.get("ipd"), -1),
      ]);

      pricingStrategy.calculatePrice(order.orderItems);
    }).toThrow("You have passed an invalid quantity.");
  });

  test("should handle edge case of large mixed orders", () => {
    const orderItems: OrderItem[] = [];

    for (let i = 0; i < 50; i++) {
      orderItems.push({
        product: productMap.get("ipd"),
        quantity: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
      });
      orderItems.push({
        product: productMap.get("mbp"),
        quantity: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
      });
    }

    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBeGreaterThan(0); // Expecting a positive value based on random quantities
  });

  test("should calculate price correctly when all items are iPads", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 10 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(4999.9); // Expecting bulk price calculation
  });

  test("should handle multiple identical items", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 8 },
      { product: productMap.get("ipd"), quantity: 2 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(4999.9); // Expecting bulk price calculation
  });

  test("should return correct price when no iPads but other products exist", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 2 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(999.98); // Only default pricing applies
  });
});
