import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
import { User } from "./entity/User";
import { getTotalCheckoutPrice } from ".";
import { setupProductMap } from "./util/setupProductMap";

const john = new User(1, "John");

const productsMap = setupProductMap();

const order = new Order(1, john, [
  new OrderItem(productsMap.get("ipd")!, 4),
  new OrderItem(productsMap.get("atv")!, 4),
  new OrderItem(productsMap.get("vga")!, 1),
  new OrderItem(productsMap.get("mbp")!, 1),
]);

console.log(getTotalCheckoutPrice(order));
