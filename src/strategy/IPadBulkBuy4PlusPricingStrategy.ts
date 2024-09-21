import { OrderItem } from "../entity/OrderItem";
import { groupBy } from "../util/groupBy";
import { roundOff } from "../util/roundOff";
import { DefaultPricingStrategy } from "./DefaultPricingStrategy";
import { PricingStrategy } from "./PricingStrategy";

export class IPadBulkBuy4PlusPricingStrategy implements PricingStrategy {
  private static readonly IPAD_PRICE = 499.99;

  calculatePrice(orderItems: OrderItem[] = []): number {
    console.log("Calculating price using IPadBulkBuy4PlusPricingStrategy");

    const groupedItems = this.groupOrderItems(orderItems);
    const ipadTotal = this.calculateIPadPrice(groupedItems.ipd);
    const otherItemsTotal = this.calculateOtherItemsPrice(groupedItems);

    return roundOff(ipadTotal + otherItemsTotal);
  }

  private groupOrderItems(
    orderItems: OrderItem[]
  ): Record<string, OrderItem[]> {
    return groupBy(orderItems, "product.sku");
  }

  private calculateIPadPrice(ipadItems?: OrderItem[]): number {
    if (!Array.isArray(ipadItems) || ipadItems.length === 0) {
      return 0;
    }

    return ipadItems.reduce(
      (total, item) =>
        total + item.quantity * IPadBulkBuy4PlusPricingStrategy.IPAD_PRICE,
      0
    );
  }

  private calculateOtherItemsPrice(
    groupedItems: Record<string, OrderItem[]>
  ): number {
    const otherOrderItems = Object.keys(groupedItems)
      .filter((key) => key !== "ipd")
      .flatMap((key) => groupedItems[key]);

    return new DefaultPricingStrategy().calculatePrice(otherOrderItems);
  }
}
