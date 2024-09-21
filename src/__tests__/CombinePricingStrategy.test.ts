import { describe, expect, beforeAll, test } from "@jest/globals";
import { CombinePricingStrategy } from "../strategy/CombinePricingStrategy";
import { OrderItem } from "../entity/OrderItem";
import { setupProductMap } from "../util/setupProductMap";

describe("CombinePricingStrategy", () => {
  let pricingStrategy: CombinePricingStrategy;
  let productMap: Map<string, any>;

  beforeAll(() => {
    pricingStrategy = new CombinePricingStrategy();
    productMap = setupProductMap(); // Setup product map for testing
  });

  test("should calculate price correctly with only Apple TV items", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv"), 4)];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(328.5); // Expecting price based on Buy3Get1AppleTVPricingStrategy
  });

  test("should calculate price correctly with only iPad items", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("ipd"), 5)];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(2499.95); // Expecting price based on IPadBulkBuy4PlusPricingStrategy
  });

  test("should calculate price correctly with both Apple TV and iPad items", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv"), 4),
      new OrderItem(productMap.get("ipd"), 2),
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(1328.48); // Combined price
  });

  test("should calculate price correctly with other products", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv"), 2),
      new OrderItem(productMap.get("ipd"), 1),
      new OrderItem(productMap.get("mbp"), 3),
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);

    expect(totalPrice).toBe(4918.96); // Combined price
  });

  test("should return zero for an empty order", () => {
    const orderItems: OrderItem[] = [];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(0); // No items means no cost
  });

  test("should handle negative quantities correctly", () => {
    expect(() => {
      const orderItems: OrderItem[] = [
        new OrderItem(productMap.get("atv"), -1),
        new OrderItem(productMap.get("ipd"), -2),
      ];

      pricingStrategy.calculatePrice(orderItems);
    }).toThrow("You have passed an invalid quantity."); // Negative quantities should not contribute to price
  });

  test("should handle zero quantities correctly", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv"), 0),
      new OrderItem(productMap.get("ipd"), 0),
    ];
    const totalPrice = pricingStrategy.calculatePrice(orderItems);
    expect(totalPrice).toBe(0); // Zero quantities should not contribute to price
  });

  test("should calculate price correctly when there are mixed products", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv"), 3),
      new OrderItem(productMap.get("ipd"), 1),
      new OrderItem(productMap.get("mbp"), 2),
    ];

    const totalPrice = pricingStrategy.calculatePrice(orderItems);

    expect(totalPrice).toBe(3628.47); // Combined price calculation
  });
});
