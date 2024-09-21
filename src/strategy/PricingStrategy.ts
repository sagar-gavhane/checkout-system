import { OrderItem } from "../entity/OrderItem";

export interface PricingStrategy {
  calculatePrice(order: OrderItem[]): number;
}
