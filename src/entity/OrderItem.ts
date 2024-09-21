import { Product } from "./Product";

export class OrderItem {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number) {
    if (quantity < 0) {
      throw new Error("You have passed an invalid quantity.");
    }

    this.product = product;
    this.quantity = quantity;
  }
}
