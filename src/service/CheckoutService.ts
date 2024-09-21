import { OrderItem } from "../entity/OrderItem";
import { PricingStrategy } from "../strategy/PricingStrategy";

interface CheckoutService {
  scan(orderItem: OrderItem): void;
  total(): number;
}

export class CheckoutServiceImpl implements CheckoutService {
  private readonly pricingStrategy: PricingStrategy;
  private orderItems: OrderItem[] = [];

  constructor(pricingStrategy: PricingStrategy) {
    this.pricingStrategy = pricingStrategy;
  }

  scan(orderItem: OrderItem): void {
    if (orderItem?.product) {
      console.log(`
        Scanning order item: [${orderItem.product.sku}] : ${orderItem.product.name} x ${orderItem.quantity}
        `);
    }

    this.validateOrderItem(orderItem);
    this.orderItems.push(orderItem);
  }

  total(): number {
    return this.pricingStrategy.calculatePrice(this.orderItems);
  }

  private validateOrderItem(orderItem?: OrderItem): void {
    if (!orderItem) {
      throw new Error(
        "Invalid product: order item cannot be undefined or null."
      );
    }
  }
}
