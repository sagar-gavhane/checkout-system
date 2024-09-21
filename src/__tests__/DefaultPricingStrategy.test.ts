import { describe, beforeAll, test, expect } from "@jest/globals";
import { DefaultPricingStrategy } from "../strategy/DefaultPricingStrategy";
import { OrderItem } from "../entity/OrderItem";
import { setupProductMap } from "../util/setupProductMap";

describe("DefaultPricingStrategy", () => {
  let pricingStrategy: DefaultPricingStrategy;
  let productMap: Map<string, any>;

  beforeAll(() => {
    pricingStrategy = new DefaultPricingStrategy();
    productMap = setupProductMap(); // Setup product map for testing
  });

  test("should calculate price correctly for a single item", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("mbp"), quantity: 1 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(productMap.get("mbp").price); // Price should match the product price
  });

  test("should calculate price correctly for multiple identical items", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("mbp"), quantity: 3 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(productMap.get("mbp").price * 3); // Total price should be price * quantity
  });

  test("should calculate price correctly for multiple different items", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 2 },
      { product: productMap.get("mbp"), quantity: 2 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(3899.96); // Total price should be sum of all products
  });

  test("should return zero for an empty order", () => {
    const orderItems: OrderItem[] = [];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(0); // No items means no cost
  });

  test("should handle edge case of negative quantities", () => {
    expect(() => {
      const orderItems: OrderItem[] = [
        new OrderItem(productMap.get("ipd"), -2),
      ];

      pricingStrategy.calculatePrice(orderItems);
    }).toThrow("You have passed an invalid quantity."); // Negative quantities should not contribute to price
  });

  test("should handle edge case of zero quantity", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 0 },
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(0); // Zero quantity should not contribute to price
  });

  test("should handle large quantities correctly", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("mbp"), 1000),
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(productMap.get("mbp").price * 1000); // Large quantity calculation
  });

  test("should handle multiple products with varying quantities and prices", () => {
    const orderItems: OrderItem[] = [
      { product: productMap.get("ipd"), quantity: 2 },
      { product: productMap.get("mbp"), quantity: 4 },
      { product: productMap.get("atv"), quantity: 2 },
    ];

    const totalPrice = pricingStrategy.calculatePrice(orderItems);

    expect(totalPrice).toBe(6918.94); // Total should match expected calculation
  });
});
