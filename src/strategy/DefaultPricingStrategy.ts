import { OrderItem } from "../entity/OrderItem";
import { roundOff } from "../util/roundOff";
import { PricingStrategy } from "./PricingStrategy";

export class DefaultPricingStrategy implements PricingStrategy {
  calculatePrice(orderItems: OrderItem[]): number {
    console.log("Calculating price using DefaultPricingStrategy");

    const total = orderItems.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    );

    return roundOff(total);
  }
}
