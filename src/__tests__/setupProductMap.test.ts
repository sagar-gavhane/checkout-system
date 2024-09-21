import { setupProductMap } from "../util/setupProductMap";
import { Product } from "../entity/Product";
import { expect, describe, beforeEach, test } from "@jest/globals";

describe("setupProductMap", () => {
  let productMap: Map<string, Product>;

  beforeEach(() => {
    productMap = setupProductMap();
  });

  test("should return a Map instance", () => {
    expect(productMap).toBeInstanceOf(Map);
  });

  test("should contain 4 products", () => {
    expect(productMap.size).toBe(4);
  });

  test('should contain the product "ipd"', () => {
    const product = productMap.get("ipd");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Super iPad");
    expect(product?.price).toBe(549.99);
  });

  test('should contain the product "mbp"', () => {
    const product = productMap.get("mbp");
    expect(product).toBeDefined();
    expect(product?.name).toBe("MacBook Pro");
    expect(product?.price).toBe(1399.99);
  });

  test('should contain the product "atv"', () => {
    const product = productMap.get("atv");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Apple TV");
    expect(product?.price).toBe(109.5);
  });

  test('should contain the product "vga"', () => {
    const product = productMap.get("vga");
    expect(product).toBeDefined();
    expect(product?.name).toBe("VGA adapter");
    expect(product?.price).toBe(30.0);
  });

  test("should not contain a non-existent product", () => {
    const nonExistentProduct = productMap.get("xyz");
    expect(nonExistentProduct).toBeUndefined();
  });

  test("should return products with correct IDs", () => {
    const expectedIds = ["ipd", "mbp", "atv", "vga"];
    const actualIds = Array.from(productMap.keys());

    expect(actualIds).toEqual(expect.arrayContaining(expectedIds));
  });

  test("should return products with correct prices", () => {
    const expectedPrices = [549.99, 1399.99, 109.5, 30.0];

    const actualPrices = Array.from(productMap.values()).map(
      (product) => product.price
    );

    expect(actualPrices).toEqual(expect.arrayContaining(expectedPrices));
  });

  test("should return products with correct names", () => {
    const expectedNames = [
      "Super iPad",
      "MacBook Pro",
      "Apple TV",
      "VGA adapter",
    ];

    const actualNames = Array.from(productMap.values()).map(
      (product) => product.name
    );

    expect(actualNames).toEqual(expect.arrayContaining(expectedNames));
  });
});
