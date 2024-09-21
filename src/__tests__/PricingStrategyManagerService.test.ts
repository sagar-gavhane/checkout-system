import { describe, expect, test, beforeAll } from "@jest/globals";
import { PricingStrategyManagerService } from "../service/PricingStrategyManagerService";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { setupProductMap } from "../util/setupProductMap";
import { Buy3Get1AppleTVPricingStrategy } from "../strategy/Buy3Get1AppleTVPricingStrategy";
import { CombinePricingStrategy } from "../strategy/CombinePricingStrategy";
import { DefaultPricingStrategy } from "../strategy/DefaultPricingStrategy";
import { IPadBulkBuy4PlusPricingStrategy } from "../strategy/IPadBulkBuy4PlusPricingStrategy";
import { User } from "../entity/User";

describe("PricingStrategyManagerService", () => {
  let pricingStrategyManager: PricingStrategyManagerService;
  let productMap: Map<string, Product>;

  beforeAll(() => {
    pricingStrategyManager = new PricingStrategyManagerService();
    productMap = setupProductMap(); // Setup product map for testing
  });

  test("should use CombinePricingStrategy when there are 4 iPads and 3 Apple TVs", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 4),
      new OrderItem(productMap.get("atv")!, 3),
    ];
    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(CombinePricingStrategy);
  });

  test("should use IPadBulkBuy4PlusPricingStrategy when there are 4 iPads only", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("ipd")!, 4)];
    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(IPadBulkBuy4PlusPricingStrategy);
  });

  test("should use Buy3Get1AppleTVPricingStrategy when there are 3 Apple TVs only", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("atv")!, 3)];
    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(Buy3Get1AppleTVPricingStrategy);
  });

  test("should use DefaultPricingStrategy when there are no qualifying items", () => {
    const orderItems: OrderItem[] = [new OrderItem(productMap.get("mbp")!, 2)];

    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(DefaultPricingStrategy);
  });

  test("should use DefaultPricingStrategy when there are less than 3 Apple TVs and less than 4 iPads", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 2),
      new OrderItem(productMap.get("ipd")!, 3),
    ];
    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(DefaultPricingStrategy);
  });

  test("should use CombinePricingStrategy when there are exactly 4 iPads and exactly 3 Apple TVs", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 4),
      new OrderItem(productMap.get("atv")!, 3),
    ];

    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(CombinePricingStrategy); // Edge case
  });

  test("should use IPadBulkBuy4PlusPricingStrategy with more than four iPads", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 5),
      new OrderItem(productMap.get("atv")!, 2),
    ];

    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(IPadBulkBuy4PlusPricingStrategy); // Only iPads
  });

  test("should use Buy3Get1AppleTVPricingStrategy with more than three Apple TVs", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("atv")!, 4),
      new OrderItem(productMap.get("ipd")!, 2),
    ];
    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(Buy3Get1AppleTVPricingStrategy); // Only Apple TVs
  });

  test("should handle mixed products without triggering any special strategy", () => {
    const orderItems: OrderItem[] = [
      new OrderItem(productMap.get("ipd")!, 1),
      new OrderItem(productMap.get("mbp")!, 2),
    ];

    const order = new Order(1, new User(1, "John"), orderItems);

    const strategy = pricingStrategyManager.getPricingStrategy(order);

    expect(strategy).toBeInstanceOf(DefaultPricingStrategy); // No qualifying items
  });
});
