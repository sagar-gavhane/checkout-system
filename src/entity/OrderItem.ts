import { Product } from "./Product";

export class OrderItem {
  private _product: Product;
  private _quantity: number = 1;

  constructor(product: Product, quantity: number) {
    this.setQuantity(quantity);
    this._product = product;
  }

  get product(): Product {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  setQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new Error("Quantity must be a non-negative number.");
    }
    this._quantity = quantity;
  }

  getTotalPrice(): number {
    return this._product.price * this._quantity;
  }

  toString(): string {
    return `${this._product.toString()} - Quantity: ${this._quantity}`;
  }
}
