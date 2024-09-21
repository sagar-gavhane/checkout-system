import { Order } from "../entity/Order";
import { Buy3Get1AppleTVPricingStrategy } from "../strategy/Buy3Get1AppleTVPricingStrategy";
import { CombinePricingStrategy } from "../strategy/CombinePricingStrategy";
import { DefaultPricingStrategy } from "../strategy/DefaultPricingStrategy";
import { IPadBulkBuy4PlusPricingStrategy } from "../strategy/IPadBulkBuy4PlusPricingStrategy";
import { PricingStrategy } from "../strategy/PricingStrategy";

export class PricingStrategyManagerService {
  private pricingStrategy?: PricingStrategy;

  getPricingStrategy(order: Order): PricingStrategy {
    const itemCounts = this.getItemCounts(order);

    this.pricingStrategy = this.selectPricingStrategy(itemCounts);

    return this.pricingStrategy;
  }

  private getItemCounts(order: Order): Record<string, number> {
    return order.orderItems.reduce((acc, orderItem) => {
      const sku = orderItem.product.sku;
      acc[sku] = (acc[sku] || 0) + orderItem.quantity;
      return acc;
    }, {} as Record<string, number>);
  }

  private selectPricingStrategy(
    itemCounts: Record<string, number>
  ): PricingStrategy {
    const { atv = 0, ipd = 0 } = itemCounts;

    if (ipd >= 4 && atv >= 3) {
      return new CombinePricingStrategy();
    }

    if (ipd >= 4) {
      return new IPadBulkBuy4PlusPricingStrategy();
    }

    if (atv >= 3) {
      return new Buy3Get1AppleTVPricingStrategy();
    }

    return new DefaultPricingStrategy();
  }
}
