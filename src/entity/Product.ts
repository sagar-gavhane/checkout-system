export class Product {
  private _sku = "";
  private _name = "";
  private _price = 0;

  constructor(sku: string, name: string, price: number) {
    this.setSku(sku);
    this.setName(name);
    this.setPrice(price);
  }

  get sku(): string {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  setSku(sku: string): void {
    if (!sku || sku.trim() === "") {
      throw new Error("SKU cannot be empty.");
    }
    this._sku = sku.trim();
  }

  setName(name: string): void {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty.");
    }
    this._name = name.trim();
  }

  setPrice(price: number): void {
    if (price < 0) {
      throw new Error("Price must be a non-negative number.");
    }
    this._price = price;
  }

  toString(): string {
    return `${this._name} (SKU: ${this._sku}) - $${this._price.toFixed(2)}`;
  }
}
