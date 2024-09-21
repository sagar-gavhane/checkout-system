import { OrderItem } from "./OrderItem";
import { User } from "./User";

export class Order {
  id: number;
  user: User;
  orderItems: OrderItem[];

  constructor(id: number, user: User, orderItems: OrderItem[]) {
    if (id <= 0) {
      throw new Error("Order ID must be greater than zero");
    }

    if (!user) {
      throw new Error("User is required");
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error("Order must have at least one item");
    }

    this.id = id;
    this.user = user;
    this.orderItems = orderItems;
  }

  toString(): string {
    return `Order ${this.id} - User: ${
      this.user.name
    } - Items: ${this.orderItems.map((item) => item.toString()).join(", ")}`;
  }
}
