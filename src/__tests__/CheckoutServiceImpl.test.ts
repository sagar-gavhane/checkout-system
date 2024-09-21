import { expect, describe, beforeEach, test } from "@jest/globals";
import { CheckoutServiceImpl } from "../service/CheckoutService";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { setupProductMap } from "../util/setupProductMap";
import { DefaultPricingStrategy } from "../strategy/DefaultPricingStrategy";

describe("CheckoutServiceImpl", () => {
  let checkoutService: CheckoutServiceImpl;
  let productMap: Map<string, Product>;

  beforeEach(() => {
    productMap = setupProductMap(); // Setup product map for testing
    checkoutService = new CheckoutServiceImpl(new DefaultPricingStrategy());
  });

  test("should scan a valid order item", () => {
    const product = productMap.get("ipd");
    const orderItem = new OrderItem(product!, 1);
    checkoutService.scan(orderItem);
    expect(checkoutService.total()).toBe(product!.price); // Total should match the price of the scanned item
  });

  test("should throw error when scanning an invalid order item", () => {
    expect(() => checkoutService.scan(undefined!)).toThrow(
      "Invalid product: order item cannot be undefined or null."
    ); // Expecting error for undefined item
  });

  test("should calculate total correctly for multiple scanned items", () => {
    const orderItem1 = new OrderItem(productMap.get("ipd")!, 1);
    const orderItem2 = new OrderItem(productMap.get("mbp")!, 2);

    checkoutService.scan(orderItem1);
    checkoutService.scan(orderItem2);

    expect(checkoutService.total()).toBe(3349.97); // Total should match the sum of all scanned items
  });

  test("should return zero total when no items are scanned", () => {
    expect(checkoutService.total()).toBe(0); // No items means total should be zero
  });

  test("should handle scanning the same item multiple times", () => {
    const orderItem = new OrderItem(productMap.get("ipd")!, 1);

    checkoutService.scan(orderItem);
    checkoutService.scan(orderItem); // Scan the same item again

    expect(checkoutService.total()).toBe(1099.98); // Total should be double the price of the item
  });

  test("should handle scanning items with zero quantity", () => {
    const orderItem = new OrderItem(productMap.get("ipd")!, 0);

    checkoutService.scan(orderItem);

    expect(checkoutService.total()).toBe(0); // Zero quantity should not contribute to total
  });

  test("should handle negative quantities gracefully", () => {
    expect(() => {
      new OrderItem(productMap.get("mbp")!, -1); // Should throw an error for negative quantity
    }).toThrow("Quantity must be a non-negative number.");
  });

  test("should allow scanning multiple different items and calculate total correctly", () => {
    const orderItems = [
      new OrderItem(productMap.get("ipd")!, 1),
      new OrderItem(productMap.get("mbp")!, 2),
      new OrderItem(productMap.get("atv")!, 3),
    ];

    orderItems.forEach((item) => checkoutService.scan(item));

    expect(checkoutService.total()).toBe(3678.47); // Total should match the sum of all scanned items
  });
});
