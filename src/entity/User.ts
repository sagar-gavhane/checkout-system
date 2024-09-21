export class User {
  private _userId = 0;
  private _name = "";

  constructor(userId: number, name: string) {
    this.setUserId(userId);
    this.setName(name);
  }

  get userId(): number {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  setUserId(userId: number): void {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("User ID must be a positive integer.");
    }
    this._userId = userId;
  }

  setName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long.");
    }
    this._name = name.trim();
  }

  toString(): string {
    return `User: ${this._name} (ID: ${this._userId})`;
  }
}
