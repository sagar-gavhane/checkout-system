import { OrderItem } from "../entity/OrderItem";
import { groupBy } from "../util/groupBy";
import { roundOff } from "../util/roundOff";
import { Buy3Get1AppleTVPricingStrategy } from "./Buy3Get1AppleTVPricingStrategy";
import { DefaultPricingStrategy } from "./DefaultPricingStrategy";
import { IPadBulkBuy4PlusPricingStrategy } from "./IPadBulkBuy4PlusPricingStrategy";
import { PricingStrategy } from "./PricingStrategy";

export class CombinePricingStrategy implements PricingStrategy {
  private readonly strategies: Record<string, PricingStrategy> = {
    atv: new Buy3Get1AppleTVPricingStrategy(),
    ipd: new IPadBulkBuy4PlusPricingStrategy(),
    default: new DefaultPricingStrategy(),
  };

  calculatePrice(orderItems: OrderItem[]): number {
    console.log("Calculating price using CombinePricingStrategy");

    const groupedItems = this.groupOrderItems(orderItems);
    const atvItemsPrice = this.calculateAppleTVPrice(groupedItems.atv);
    const ipadItemsPrice = this.calculateIPadPrice(groupedItems.ipd);
    const remainingItemsPrice = this.calculateRemainingItemsPrice(groupedItems);

    return roundOff(atvItemsPrice + ipadItemsPrice + remainingItemsPrice);
  }

  private groupOrderItems(
    orderItems: OrderItem[]
  ): Record<string, OrderItem[]> {
    return groupBy(orderItems, "product.sku");
  }

  private calculateAppleTVPrice(atvItems?: OrderItem[]): number {
    return this.strategies.atv.calculatePrice(atvItems || []);
  }

  private calculateIPadPrice(ipadItems?: OrderItem[]): number {
    return this.strategies.ipd.calculatePrice(ipadItems || []);
  }

  private calculateRemainingItemsPrice(
    groupedItems: Record<string, OrderItem[]>
  ): number {
    const remainingOrderItems = Object.keys(groupedItems)
      .filter((key) => key !== "atv" && key !== "ipd")
      .flatMap((key) => groupedItems[key]);

    return this.strategies.default.calculatePrice(remainingOrderItems);
  }
}
