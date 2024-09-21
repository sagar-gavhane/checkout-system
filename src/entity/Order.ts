import { OrderItem } from "./OrderItem";
import { User } from "./User";

export class Order {
  id: number;
  user: User;
  orderItems: OrderItem[];

  constructor(id: number, user: User, orderItems: OrderItem[]) {
    this.id = id;
    this.user = user;
    this.orderItems = orderItems;
  }
}
