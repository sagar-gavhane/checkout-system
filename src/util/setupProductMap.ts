import { Product } from "../entity/Product";

export const setupProductMap = (): Map<string, Product> => {
  const productsMap = new Map<string, Product>();

  productsMap.set("ipd", new Product("ipd", "Super iPad", 549.99));
  productsMap.set("mbp", new Product("mbp", "MacBook Pro", 1399.99));
  productsMap.set("atv", new Product("atv", "Apple TV", 109.5));
  productsMap.set("vga", new Product("vga", "VGA adapter", 30.0));

  return productsMap;
};
