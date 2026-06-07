# Requirements Document

## Introduction

This feature enhances the existing product and category management system to support seafood-related goods and associated supplies. The system currently manages products and categories with basic CRUD operations, caching, and inventory tracking. This expansion will introduce new product categories (seafood, ice, cleaning supplies) and ensure the system can handle seafood-specific attributes such as perishability, storage requirements, and regulatory compliance.

## Glossary

- **System**: The Laravel-based product and category management system
- **Category_Manager**: The component responsible for creating, updating, and managing product categories
- **Product_Manager**: The component responsible for creating, updating, and managing products
- **Seafood_Product**: A product classified under seafood categories (fish, shellfish, crustaceans, etc.)
- **Perishable_Product**: A product with an expiration date that requires special handling
- **Storage_Requirement**: Environmental conditions needed to maintain product quality (temperature, humidity)
- **Regulatory_Compliance**: Adherence to food safety standards and traceability requirements
- **Cache_Service**: The component responsible for managing cached product and category data
- **Inventory_Manager**: The component responsible for tracking product quantities and stock levels

## Requirements

### Requirement 1: Seafood Category Management

**User Story:** As a store manager, I want to create and manage seafood-specific categories, so that I can organize seafood products separately from other inventory.

#### Acceptance Criteria

1. THE Category_Manager SHALL support creation of categories with names "Fresh Seafood", "Frozen Seafood", "Shellfish", "Crustaceans", and "Fish"
2. WHEN a seafood category is created, THE Category_Manager SHALL assign appropriate icons for visual identification
3. THE Category_Manager SHALL enforce unique category names within the maximum 50 character limit
4. WHEN a seafood category is updated, THE Cache_Service SHALL clear category cache immediately
5. THE Category_Manager SHALL prevent deletion of categories that have associated products

### Requirement 2: Support Categories Management

**User Story:** As a store manager, I want to create categories for seafood-related supplies, so that I can manage ice, cleaning items, and other supporting products.

#### Acceptance Criteria

1. THE Category_Manager SHALL support creation of categories with names "Ice & Cooling", "Cleaning Supplies", "Packaging Materials", and "Seafood Equipment"
2. WHEN a support category is created, THE Category_Manager SHALL assign appropriate icons for visual identification
3. THE Category_Manager SHALL maintain the same validation rules for support categories as other categories
4. THE System SHALL allow products to be assigned to support categories using the existing category_id foreign key relationship

### Requirement 3: Seafood Product Creation

**User Story:** As a store manager, I want to add seafood products with specific attributes, so that I can track inventory and sales of seafood items.

#### Acceptance Criteria

1. WHEN a seafood product is created, THE Product_Manager SHALL require product_name, category_id, price, and unit fields
2. THE Product_Manager SHALL support units specific to seafood such as "kg", "lb", "piece", "dozen", and "box"
3. WHEN a seafood product is created, THE Product_Manager SHALL automatically create an associated inventory record with quantity set to 0
4. THE Product_Manager SHALL enforce unique product names within the maximum 100 character limit
5. WHEN a seafood product has an expiration_date, THE Product_Manager SHALL validate that the date is in the future
6. THE Product_Manager SHALL set is_active to true only when the product is not expired AND has stock quantity greater than 0

### Requirement 4: Perishable Product Tracking

**User Story:** As a store manager, I want to track expiration dates for seafood products, so that I can prevent selling expired items and manage inventory rotation.

#### Acceptance Criteria

1. WHEN a perishable seafood product is created or updated, THE Product_Manager SHALL accept an expiration_date field
2. THE System SHALL automatically set is_active to false when a product's expiration_date is in the past
3. WHEN a product's expiration_date is updated, THE Product_Manager SHALL recalculate the is_active status
4. THE System SHALL maintain the existing CheckExpiredProducts command functionality for seafood products
5. WHEN a product expires, THE System SHALL preserve all historical transaction and order records

### Requirement 5: Storage Requirement Documentation

**User Story:** As a store manager, I want to document storage requirements for seafood products, so that staff can maintain proper storage conditions.

#### Acceptance Criteria

1. WHEN a seafood product is created or updated, THE Product_Manager SHALL accept storage requirements in the description field
2. THE Product_Manager SHALL support description text of unlimited length for detailed storage instructions
3. THE System SHALL display storage requirements when retrieving product details
4. WHEN storage requirements are updated, THE Cache_Service SHALL clear product cache immediately

### Requirement 6: Ice and Cooling Product Management

**User Story:** As a store manager, I want to manage ice and cooling products, so that I can track supplies needed for seafood preservation.

#### Acceptance Criteria

1. WHEN an ice or cooling product is created, THE Product_Manager SHALL assign it to the "Ice & Cooling" category
2. THE Product_Manager SHALL support units for ice products such as "bag", "kg", "lb", and "block"
3. THE System SHALL apply the same inventory tracking rules to ice products as other products
4. WHEN ice products are sold, THE System SHALL record transactions in the existing ProductTransaction table

### Requirement 7: Cleaning Supply Management

**User Story:** As a store manager, I want to manage cleaning supplies for seafood handling areas, so that I can maintain hygiene standards.

#### Acceptance Criteria

1. WHEN a cleaning supply product is created, THE Product_Manager SHALL assign it to the "Cleaning Supplies" category
2. THE Product_Manager SHALL support units for cleaning supplies such as "bottle", "gallon", "piece", and "box"
3. THE System SHALL track inventory levels for cleaning supplies using the existing Inventory_Manager
4. WHEN cleaning supply inventory falls below reorder_level, THE Inventory_Manager SHALL flag the product for reordering

### Requirement 8: Product Search and Filtering

**User Story:** As a cashier, I want to search for seafood products by barcode or name, so that I can quickly process sales transactions.

#### Acceptance Criteria

1. WHEN a barcode search is performed, THE Product_Manager SHALL return products matching the exact barcode value
2. THE Product_Manager SHALL return products with their associated category and inventory information
3. THE System SHALL cache search results for 1 second to optimize repeated queries
4. WHEN a product is updated, THE Cache_Service SHALL invalidate all product search caches
5. THE Product_Manager SHALL return products ordered by creation date in descending order

### Requirement 9: Category-Based Product Retrieval

**User Story:** As a store manager, I want to view all products within a seafood category, so that I can review and manage category-specific inventory.

#### Acceptance Criteria

1. WHEN a category is retrieved, THE Category_Manager SHALL include a count of associated products
2. THE System SHALL support filtering products by category_id using the existing foreign key relationship
3. THE Category_Manager SHALL return categories with their product counts in real-time without caching
4. WHEN products are added or removed from a category, THE System SHALL reflect changes immediately in category product counts

### Requirement 10: Bulk Category and Product Seeding

**User Story:** As a system administrator, I want to seed the database with predefined seafood categories and sample products, so that the system is ready for immediate use.

#### Acceptance Criteria

1. THE System SHALL provide a database seeder for creating seafood-related categories
2. THE System SHALL provide a database seeder for creating sample seafood products with realistic attributes
3. WHEN the seeder is executed, THE System SHALL create categories "Fresh Seafood", "Frozen Seafood", "Shellfish", "Crustaceans", "Fish", "Ice & Cooling", "Cleaning Supplies", "Packaging Materials", and "Seafood Equipment"
4. WHEN the seeder is executed, THE System SHALL create at least 3 sample products for each seafood category
5. THE System SHALL assign appropriate icons, descriptions, and default values to seeded categories and products
6. WHEN the seeder is executed multiple times, THE System SHALL skip creation of duplicate categories and products

### Requirement 11: Data Integrity and Relationships

**User Story:** As a system administrator, I want to maintain referential integrity between products and categories, so that the database remains consistent.

#### Acceptance Criteria

1. THE System SHALL enforce the foreign key constraint between products.category_id and categories.category_id
2. WHEN a category deletion is attempted, THE Category_Manager SHALL prevent deletion if products are assigned to that category
3. THE System SHALL return an error message indicating the number of products preventing category deletion
4. WHEN a product is deleted, THE System SHALL preserve historical records in order_items and product_transactions tables
5. THE System SHALL maintain all existing indexes on category_id, status, and barcode fields for query performance

### Requirement 12: Cache Management for Seafood Products

**User Story:** As a system administrator, I want cache invalidation to work correctly for seafood products, so that users always see current data.

#### Acceptance Criteria

1. WHEN a seafood product is created, THE Cache_Service SHALL clear all product-related caches
2. WHEN a seafood category is created or updated, THE Cache_Service SHALL clear all category-related caches
3. THE System SHALL cache product listings for 1 second to balance performance and data freshness
4. THE System SHALL NOT cache category listings to ensure real-time product count accuracy
5. WHEN a cache key includes a search parameter, THE Cache_Service SHALL generate a unique cache key using MD5 hashing

### Requirement 13: Decimal Quantity Support for Per-Kilo Products

**User Story:** As a cashier, I want to sell seafood products by fractional kilograms (0.5 kg, 1.25 kg, 2.75 kg), so that customers can purchase exact weights of per-kilo items like fish.

#### Acceptance Criteria

1. WHEN an order item is created, THE System SHALL accept decimal quantity values with precision up to 3 decimal places
2. THE System SHALL validate that quantity values are greater than 0 and less than or equal to 9999.999
3. WHEN a decimal quantity is provided, THE System SHALL calculate subtotal as quantity multiplied by unit_price with 2 decimal place precision
4. THE Inventory_Manager SHALL track inventory quantities using decimal values with precision up to 3 decimal places
5. WHEN inventory is decremented for a per-kilo product, THE System SHALL support fractional quantity deductions (e.g., 2.5 kg sold reduces inventory by 2.5 kg)
6. WHEN inventory is incremented for a per-kilo product, THE System SHALL support fractional quantity additions (e.g., 3.75 kg restocked increases inventory by 3.75 kg)
7. THE System SHALL store quantity values in the database as DECIMAL(10,3) to preserve precision
8. WHEN a product transaction is recorded, THE System SHALL store decimal quantities with 3 decimal place precision
9. THE System SHALL validate that decimal quantities do not exceed available inventory before completing an order
10. WHEN an order is voided or cancelled, THE System SHALL return fractional quantities to inventory accurately

