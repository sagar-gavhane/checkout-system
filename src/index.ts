import { Order } from "./entity/Order";
import { CheckoutServiceImpl } from "./service/CheckoutService";
import { PricingStrategyManagerService } from "./service/PricingStrategyManagerService";
import { setupProductMap } from "./util/setupProductMap";

export function getTotalCheckoutPrice(order: Order) {
  setupProductMap();

  const pricingStrategyManagerService = new PricingStrategyManagerService();
  const pricingStrategy =
    pricingStrategyManagerService.getPricingStrategy(order);

  const checkoutService = new CheckoutServiceImpl(pricingStrategy);

  order.orderItems.forEach((item) => {
    checkoutService.scan(item);
  });

  const totalCheckoutPrice = checkoutService.total();
  return totalCheckoutPrice;
}
