# Checkout System

This is a TypeScript-based checkout system that scans items and applies various promotional pricing strategies. The system is designed with flexibility in mind, allowing pricing rules to be easily extended or modified.

## Project Structure

The project is organized into several directories for modular and maintainable code:

### 1. `src/entity/`

This directory contains the core entities of the checkout system:

- **`Order.ts`**: Represents the overall order with multiple items.
- **`OrderItem.ts`**: Represents individual items within an order.
- **`Product.ts`**: Defines the product entity, including attributes like SKU, name, and price.
- **`User.ts`**: (Optional) Represents a user interacting with the checkout system.

### 2. `src/service/`

This directory includes services responsible for handling checkout logic and pricing strategies:

- **`CheckoutService.ts`**: Interface for the checkout service.
- **`PricingStrategyManagerService.ts`**: Manages multiple pricing strategies to be applied during checkout.

### 3. `src/strategy/`

This directory defines different pricing strategies and promotions:

- **`Buy3Get1AppleTVPricingStrategy.ts`**: Implements the "3 for 2" deal for Apple TVs.
- **`CombinePricingStrategy.ts`**: Combines multiple pricing strategies into a single strategy.
- **`DefaultPricingStrategy.ts`**: A fallback strategy for products without promotions.
- **`IPadBulkBuy4PlusPricingStrategy.ts`**: Implements the bulk discount for iPads when more than 4 are purchased.
- **`PricingStrategy.ts`**: Interface for defining custom pricing strategies.

### 4. `src/util/`

Contains utility functions to assist with calculations and data transformations:

- **`groupBy.ts`**: Groups items in an order by their product type or SKU.
- **`roundOff.ts`**: Utility function to round off prices to two decimal points.
- **`setupProductMap.ts`**: Initializes the product catalog with product details (SKU, name, price).

### 5. `src/__tests__/`

This directory includes the unit tests for validating the functionality of each module:

- **`Buy3Get1AppleTVPricingStrategy.test.ts`**: Tests for the "3 for 2" Apple TV pricing rule.
- **`CheckoutServiceImpl.test.ts`**: Tests for the core checkout service.
- **`CombinePricingStrategy.test.ts`**: Verifies combining multiple pricing strategies.
- **`DefaultPricingStrategy.test.ts`**: Tests for the default pricing rule when no special conditions are met.
- **`IPadBulkBuy4PlusPricingStrategy.test.ts`**: Tests for the bulk discount rule for iPads.
- **`PricingStrategyManagerService.test.ts`**: Validates the pricing strategy manager’s functionality.
- **`setupProductMap.test.ts`**: Ensures that the product catalog is set up correctly.

### 6. `src/index.ts`

The entry point for the application. It handles initialization and acts as a bridge between services and strategies.

### 7. `src/main.ts`

Contains the main application logic to simulate a checkout session. It ties together the scanning of items and calculating the total price with the applied promotions.

## Installation

To set up the project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sagar-gavhane/checkout-system
   ```

2. **Navigate to the project directory**:

   ```bash
   cd checkout-system
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

## Testing Approach

The project follows a test-driven development (TDD) approach to ensure all pricing rules and services behave as expected. Unit tests are written for each strategy and service module to verify the correct application of rules in different scenarios.

### Running Tests

Run the following command to execute the test suite:

```bash
yarn run test
```

```bash
yarn run test:coverage
```
