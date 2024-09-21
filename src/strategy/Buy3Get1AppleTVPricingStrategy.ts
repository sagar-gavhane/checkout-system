import { OrderItem } from "../entity/OrderItem";
import { groupBy } from "../util/groupBy";
import { roundOff } from "../util/roundOff";
import { DefaultPricingStrategy } from "./DefaultPricingStrategy";
import { PricingStrategy } from "./PricingStrategy";

export class Buy3Get1AppleTVPricingStrategy implements PricingStrategy {
  private readonly FREE_UNIT_THRESHOLD = 4;

  calculatePrice(orderItems: OrderItem[] = []): number {
    console.log("Calculating price using Buy3Get1AppleTVPricingStrategy");

    const groupedItems = this.groupOrderItems(orderItems);
    const appleTVPrice = this.calculateAppleTVPrice(groupedItems.atv);
    const otherItemsPrice = this.calculateOtherItemsPrice(groupedItems);

    return roundOff(appleTVPrice + otherItemsPrice);
  }

  private groupOrderItems(
    orderItems: OrderItem[]
  ): Record<string, OrderItem[]> {
    return groupBy(orderItems, "product.sku");
  }

  private calculateAppleTVPrice(appleTVItems?: OrderItem[]): number {
    if (!Array.isArray(appleTVItems) || appleTVItems.length === 0) {
      return 0;
    }

    const totalUnitsPurchased = this.getTotalUnitsPurchased(appleTVItems);
    const freeUnits = Math.floor(
      totalUnitsPurchased / this.FREE_UNIT_THRESHOLD
    );
    const chargeableUnits = totalUnitsPurchased - freeUnits;
    const appleTVUnitPrice = appleTVItems[0].product.price;

    return chargeableUnits * appleTVUnitPrice;
  }

  private getTotalUnitsPurchased(appleTVItems: OrderItem[]): number {
    return appleTVItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  private calculateOtherItemsPrice(
    groupedItems: Record<string, OrderItem[]>
  ): number {
    const otherOrderItems = Object.keys(groupedItems)
      .filter((key) => key !== "atv")
      .flatMap((key) => groupedItems[key]);

    return new DefaultPricingStrategy().calculatePrice(otherOrderItems);
  }
}
