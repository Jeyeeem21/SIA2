# Implementation Plan: Seafood Product Expansion

## Overview

This implementation plan converts the seafood product expansion design into actionable coding tasks. The core enhancement introduces decimal quantity support for per-kilo seafood products, enabling fractional weight sales (e.g., 2.5 kg of fish) while maintaining data integrity across orders, inventory, and transactions.

**Key Implementation Areas:**
- Database schema modifications for DECIMAL(10,3) quantity fields
- Model updates for decimal casting and validation
- Controller logic for fractional inventory management
- Seeders for seafood categories and sample products
- Property-based tests for 20 correctness properties
- Unit and integration tests for specific scenarios

## Tasks

- [ ] 1. Create database migrations for decimal quantity support
  - [ ] 1.1 Create migration to modify order_items table for decimal quantities
    - Change `quantity` column from INTEGER to DECIMAL(10,3)
    - Drop existing `subtotal` computed column
    - Recreate `subtotal` as DECIMAL(10,2) with ROUND(quantity * unit_price, 2) formula
    - File: `database/migrations/YYYY_MM_DD_HHMMSS_modify_order_items_for_decimal_quantities.php`
    - _Requirements: 13.1, 13.2, 13.3, 13.7_
  
  - [ ] 1.2 Create migration to modify inventories table for decimal quantities
    - Change `quantity` column to DECIMAL(10,3)
    - Change `reorder_level` column to DECIMAL(10,3)
    - Change `reorder_quantity` column to DECIMAL(10,3)
    - Change `last_restock_quantity` column to DECIMAL(10,3)
    - File: `database/migrations/YYYY_MM_DD_HHMMSS_modify_inventories_for_decimal_quantities.php`
    - _Requirements: 13.4, 13.5, 13.6, 13.7_
  
  - [ ] 1.3 Create migration to modify product_transactions table for decimal quantities
    - Change `quantity` column to DECIMAL(10,3)
    - File: `database/migrations/YYYY_MM_DD_HHMMSS_modify_product_transactions_for_decimal_quantities.php`
    - _Requirements: 13.8, 13.7_
  
  - [ ]* 1.4 Write unit tests for migration execution
    - Test that migrations run without errors
    - Verify column types after migration
    - Test rollback functionality
    - _Requirements: 13.7_

- [ ] 2. Update Eloquent models for decimal support
  - [ ] 2.1 Update OrderItem model for decimal quantity casting
    - Change `quantity` cast from 'integer' to 'decimal:3'
    - Update `getSubtotalAttribute()` to use `round($this->quantity * $this->unit_price, 2)`
    - File: `laravel-backend/app/Models/OrderItem.php`
    - _Requirements: 13.1, 13.3_
  
  - [ ] 2.2 Update Inventory model for decimal quantity casting
    - Change `quantity` cast from 'integer' to 'decimal:3'
    - Change `reorder_level` cast from 'integer' to 'decimal:3'
    - Change `reorder_quantity` cast from 'integer' to 'decimal:3'
    - Change `last_restock_quantity` cast from 'integer' to 'decimal:3'
    - Update `getStatusAttribute()` to handle decimal comparisons correctly
    - File: `laravel-backend/app/Models/Inventory.php`
    - _Requirements: 13.4, 13.5, 13.6_
  
  - [ ] 2.3 Update ProductTransaction model for decimal quantity casting
    - Change `quantity` cast from 'integer' to 'decimal:3'
    - File: `laravel-backend/app/Models/ProductTransaction.php`
    - _Requirements: 13.8_
  
  - [ ]* 2.4 Write unit tests for model decimal casting
    - Test OrderItem subtotal calculation with decimal quantities
    - Test Inventory status calculation with decimal quantities
    - Test ProductTransaction quantity preservation
    - _Requirements: 13.1, 13.3, 13.4, 13.8_

- [ ] 3. Update OrderController for decimal quantity validation and logic
  - [ ] 3.1 Update order creation validation rules
    - Add validation rule: `'order_items.*.quantity' => ['required', 'numeric', 'min:0.001', 'max:9999.999', 'regex:/^\d+(\.\d{1,3})?$/']`
    - File: `laravel-backend/app/Http/Controllers/OrderController.php` (store method)
    - _Requirements: 13.1, 13.2_
  
  - [ ] 3.2 Update stock validation to use bccomp for decimal comparison
    - Replace `if ($inventory->quantity < $item['quantity'])` with `if (bccomp($inventory->quantity, $item['quantity'], 3) < 0)`
    - Update error response to show decimal quantities
    - File: `laravel-backend/app/Http/Controllers/OrderController.php` (store method)
    - _Requirements: 13.9_
  
  - [ ] 3.3 Update inventory decrement logic for decimal quantities
    - Replace `->decrement('quantity', $item['quantity'])` with `->update(['quantity' => DB::raw("quantity - {$item['quantity']}")])` for precision
    - File: `laravel-backend/app/Http/Controllers/OrderController.php` (store method)
    - _Requirements: 13.5_
  
  - [ ] 3.4 Update order update validation rules for decimal quantities
    - Add same decimal validation rules to update method
    - File: `laravel-backend/app/Http/Controllers/OrderController.php` (update method)
    - _Requirements: 13.1, 13.2_
  
  - [ ] 3.5 Update void order logic to restore fractional quantities accurately
    - Ensure inventory increment uses DB::raw for precision
    - Verify ProductTransaction records fractional quantities correctly
    - File: `laravel-backend/app/Http/Controllers/OrderController.php` (voidOrder method)
    - _Requirements: 13.10, 13.6_
  
  - [ ]* 3.6 Write integration tests for order creation with decimal quantities
    - Test order creation with fractional quantities (e.g., 2.5 kg)
    - Test insufficient stock error with decimal quantities
    - Test inventory decrement accuracy
    - _Requirements: 13.1, 13.5, 13.9_
  
  - [ ]* 3.7 Write integration tests for order void with decimal quantities
    - Test inventory restoration after void
    - Test ProductTransaction creation for void
    - _Requirements: 13.10_

- [ ] 4. Checkpoint - Ensure decimal quantity core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Update InventoryController for decimal quantity support
  - [ ] 5.1 Update restock validation rules for decimal quantities
    - Add validation rule: `'quantity' => ['required', 'numeric', 'min:0.001', 'max:9999.999', 'regex:/^\d+(\.\d{1,3})?$/']`
    - File: `laravel-backend/app/Http/Controllers/InventoryController.php`
    - _Requirements: 13.1, 13.2_
  
  - [ ] 5.2 Update inventory increment logic for decimal quantities
    - Use DB::raw for precise decimal arithmetic: `'quantity' => DB::raw("quantity + {$validated['quantity']}")`
    - File: `laravel-backend/app/Http/Controllers/InventoryController.php`
    - _Requirements: 13.6_
  
  - [ ]* 5.3 Write unit tests for inventory restock with decimal quantities
    - Test restock with fractional quantities
    - Test last_restock_quantity preservation
    - _Requirements: 13.6_

- [ ] 6. Create seafood category seeder
  - [ ] 6.1 Create SeafoodCategorySeeder class
    - Create categories: Fresh Seafood, Frozen Seafood, Shellfish, Crustaceans, Fish, Ice & Cooling, Cleaning Supplies, Packaging Materials, Seafood Equipment
    - Assign appropriate icons (🐟, ❄️, 🦪, 🦞, 🐠, 🧊, 🧹, 📦, 🔪)
    - Use `firstOrCreate` for idempotency
    - File: `database/seeders/SeafoodCategorySeeder.php`
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 10.1, 10.3, 10.6_
  
  - [ ]* 6.2 Write unit tests for SeafoodCategorySeeder
    - Test all 9 categories are created
    - Test seeder idempotency (running twice doesn't create duplicates)
    - _Requirements: 10.3, 10.6_

- [ ] 7. Create seafood product seeder
  - [ ] 7.1 Create SeafoodProductSeeder class
    - Create at least 3 sample products per seafood category
    - Include products with units: kg, lb, piece, dozen, box, bag, block, bottle, gallon
    - Set realistic prices, costs, and expiration dates for perishable items
    - Create associated inventory records with quantity 0
    - Use `firstOrCreate` for idempotency
    - File: `database/seeders/SeafoodProductSeeder.php`
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 6.1, 6.2, 7.1, 7.2, 10.2, 10.4, 10.5, 10.6_
  
  - [ ]* 7.2 Write unit tests for SeafoodProductSeeder
    - Test products are created with correct attributes
    - Test inventory records are created automatically
    - Test seeder idempotency
    - _Requirements: 3.3, 10.4, 10.5, 10.6_

- [ ] 8. Register seeders in DatabaseSeeder
  - [ ] 8.1 Add SeafoodCategorySeeder and SeafoodProductSeeder to DatabaseSeeder
    - Call seeders in correct order (categories before products)
    - File: `database/seeders/DatabaseSeeder.php`
    - _Requirements: 10.1, 10.2_

- [ ] 9. Checkpoint - Ensure seeders work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Install and configure property-based testing library
  - [ ] 10.1 Install Eris property-based testing library
    - Run: `composer require --dev giorgiosironi/eris`
    - Verify installation in composer.json
    - _Requirements: All properties (1-20)_

- [ ] 11. Write property-based tests for decimal quantity properties
  - [ ]* 11.1 Write property test for Property 1: Decimal Quantity Precision and Range Validation
    - **Property 1: Decimal Quantity Precision and Range Validation**
    - **Validates: Requirements 13.1, 13.2**
    - Test that order items accept decimal quantities with up to 3 decimal places
    - Test that values outside (0, 9999.999] are rejected
    - Use Eris generators for random decimal values
    - Tag: `@group property:1`
  
  - [ ]* 11.2 Write property test for Property 2: Subtotal Calculation Accuracy
    - **Property 2: Subtotal Calculation Accuracy**
    - **Validates: Requirements 13.3**
    - Test that subtotal = ROUND(quantity × unit_price, 2) for all valid inputs
    - Generate random quantities and prices
    - Tag: `@group property:2`
  
  - [ ]* 11.3 Write property test for Property 3: Inventory Decimal Arithmetic Precision
    - **Property 3: Inventory Decimal Arithmetic Precision**
    - **Validates: Requirements 13.4, 13.5, 13.6**
    - Test that inventory increment/decrement preserves 3 decimal precision
    - Test round-trip: increment then decrement returns to original value
    - Tag: `@group property:3`
  
  - [ ]* 11.4 Write property test for Property 4: Inventory Validation Before Order Completion
    - **Property 4: Inventory Validation Before Order Completion**
    - **Validates: Requirements 13.9**
    - Test that orders are rejected when any item quantity exceeds available inventory
    - Generate random inventory and order quantities
    - Tag: `@group property:4`
  
  - [ ]* 11.5 Write property test for Property 5: Round-Trip Inventory Restoration on Void/Cancel
    - **Property 5: Round-Trip Inventory Restoration on Void/Cancel**
    - **Validates: Requirements 13.10**
    - Test that voiding an order restores inventory to exact pre-order values
    - Generate random order quantities and verify restoration
    - Tag: `@group property:5`
  
  - [ ]* 11.6 Write property test for Property 20: Transaction Decimal Precision
    - **Property 20: Transaction Decimal Precision**
    - **Validates: Requirements 13.8**
    - Test that ProductTransaction records preserve 3 decimal places
    - Generate random fractional quantities and verify storage
    - Tag: `@group property:20`

- [ ] 12. Write property-based tests for data integrity properties
  - [ ]* 12.1 Write property test for Property 6: Cache Invalidation on Entity Changes
    - **Property 6: Cache Invalidation on Entity Changes**
    - **Validates: Requirements 1.4, 5.4, 8.4, 12.1, 12.2**
    - Test that cache is cleared after product/category create/update/delete
    - Tag: `@group property:6`
  
  - [ ]* 12.2 Write property test for Property 7: Category Deletion Prevention with Products
    - **Property 7: Category Deletion Prevention with Products**
    - **Validates: Requirements 1.5, 11.2**
    - Test that categories with products cannot be deleted
    - Tag: `@group property:7`
  
  - [ ]* 12.3 Write property test for Property 8: Error Message Content on Deletion Failure
    - **Property 8: Error Message Content on Deletion Failure**
    - **Validates: Requirements 11.3**
    - Test that error message includes product count
    - Tag: `@group property:8`
  
  - [ ]* 12.4 Write property test for Property 9: Historical Data Preservation
    - **Property 9: Historical Data Preservation**
    - **Validates: Requirements 4.5, 11.4**
    - Test that deleting/expiring products preserves order_items and product_transactions
    - Tag: `@group property:9`
  
  - [ ]* 12.5 Write property test for Property 11: Entity Uniqueness Enforcement
    - **Property 11: Entity Uniqueness Enforcement**
    - **Validates: Requirements 1.3, 3.4**
    - Test that duplicate category/product names are rejected
    - Test that length constraints are enforced (50 chars for categories, 100 for products)
    - Tag: `@group property:11`

- [ ] 13. Write property-based tests for business logic properties
  - [ ]* 13.1 Write property test for Property 10: Product is_active Status Calculation
    - **Property 10: Product is_active Status Calculation**
    - **Validates: Requirements 3.6, 4.2, 4.3**
    - Test that is_active = true iff (expiration_date is NULL OR expiration_date > now) AND inventory > 0
    - Tag: `@group property:10`
  
  - [ ]* 13.2 Write property test for Property 12: Automatic Inventory Creation
    - **Property 12: Automatic Inventory Creation**
    - **Validates: Requirements 3.3**
    - Test that creating a product automatically creates inventory with quantity 0
    - Tag: `@group property:12`
  
  - [ ]* 13.3 Write property test for Property 13: Expiration Date Future Validation
    - **Property 13: Expiration Date Future Validation**
    - **Validates: Requirements 3.5**
    - Test that past expiration dates are rejected
    - Tag: `@group property:13`
  
  - [ ]* 13.4 Write property test for Property 14: Reorder Level Flagging
    - **Property 14: Reorder Level Flagging**
    - **Validates: Requirements 7.4**
    - Test inventory status: 'out' when Q ≤ 0, 'low' when 0 < Q ≤ R, 'available' when Q > R
    - Tag: `@group property:14`
  
  - [ ]* 13.5 Write property test for Property 15: Barcode Exact Match Search
    - **Property 15: Barcode Exact Match Search**
    - **Validates: Requirements 8.1**
    - Test that barcode search returns only exact matches (case-sensitive)
    - Tag: `@group property:15`
  
  - [ ]* 13.6 Write property test for Property 16: Product Ordering by Creation Date
    - **Property 16: Product Ordering by Creation Date**
    - **Validates: Requirements 8.5**
    - Test that products are ordered by created_at DESC
    - Tag: `@group property:16`
  
  - [ ]* 13.7 Write property test for Property 17: Category Product Count Accuracy
    - **Property 17: Category Product Count Accuracy**
    - **Validates: Requirements 9.1**
    - Test that category product count equals actual number of products
    - Tag: `@group property:17`
  
  - [ ]* 13.8 Write property test for Property 18: Category Filtering Correctness
    - **Property 18: Category Filtering Correctness**
    - **Validates: Requirements 9.2**
    - Test that filtering by category_id returns all and only products with that category_id
    - Tag: `@group property:18`
  
  - [ ]* 13.9 Write property test for Property 19: Seeder Idempotency
    - **Property 19: Seeder Idempotency**
    - **Validates: Requirements 10.6**
    - Test that running seeders multiple times doesn't create duplicates
    - Tag: `@group property:19`

- [ ] 14. Write unit tests for specific seafood category scenarios
  - [ ]* 14.1 Write unit tests for seafood category creation
    - Test creation of all 9 seafood-related categories
    - Test icon assignment
    - Test status defaults to 'active'
    - _Requirements: 1.1, 1.2, 2.1, 2.2_
  
  - [ ]* 14.2 Write unit tests for category uniqueness validation
    - Test duplicate category name rejection
    - Test 50 character limit enforcement
    - _Requirements: 1.3_
  
  - [ ]* 14.3 Write unit tests for category deletion prevention
    - Test that categories with products cannot be deleted
    - Test error message includes product count
    - _Requirements: 1.5, 11.2, 11.3_

- [ ] 15. Write unit tests for seafood product scenarios
  - [ ]* 15.1 Write unit tests for seafood product creation
    - Test product creation with required fields (name, category_id, price, unit)
    - Test automatic inventory creation with quantity 0
    - Test seafood-specific units (kg, lb, piece, dozen, box)
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 15.2 Write unit tests for product uniqueness validation
    - Test duplicate product name rejection
    - Test 100 character limit enforcement
    - _Requirements: 3.4_
  
  - [ ]* 15.3 Write unit tests for expiration date validation
    - Test that future expiration dates are accepted
    - Test that past expiration dates are rejected
    - _Requirements: 3.5_
  
  - [ ]* 15.4 Write unit tests for is_active status calculation
    - Test is_active = false when expired
    - Test is_active = false when inventory = 0
    - Test is_active = true when not expired AND inventory > 0
    - _Requirements: 3.6, 4.2, 4.3_

- [ ] 16. Write unit tests for perishable product tracking
  - [ ]* 16.1 Write unit tests for CheckExpiredProducts command
    - Test that expired products are set to is_active = false
    - Test that non-expired products remain is_active = true
    - Test that historical records are preserved
    - _Requirements: 4.4, 4.5_
  
  - [ ]* 16.2 Write unit tests for storage requirement documentation
    - Test that description field accepts unlimited length
    - Test that storage requirements are displayed in product details
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 17. Write unit tests for ice, cleaning, and support products
  - [ ]* 17.1 Write unit tests for ice product management
    - Test ice product creation with "Ice & Cooling" category
    - Test units: bag, kg, lb, block
    - Test inventory tracking and transactions
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 17.2 Write unit tests for cleaning supply management
    - Test cleaning supply creation with "Cleaning Supplies" category
    - Test units: bottle, gallon, piece, box
    - Test reorder level flagging
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 18. Write integration tests for search and filtering
  - [ ]* 18.1 Write integration tests for product search
    - Test barcode exact match search
    - Test product search returns category and inventory info
    - Test search results are cached for 1 second
    - Test cache invalidation on product update
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 18.2 Write integration tests for product ordering
    - Test products are ordered by created_at DESC
    - _Requirements: 8.5_
  
  - [ ]* 18.3 Write integration tests for category-based retrieval
    - Test category includes product count
    - Test filtering products by category_id
    - Test real-time product count updates
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 19. Write integration tests for cache management
  - [ ]* 19.1 Write integration tests for cache behavior
    - Test product cache cleared on create/update/delete
    - Test category cache cleared on create/update
    - Test product listings cached for 1 second
    - Test category listings not cached
    - Test cache key generation with MD5 hashing
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 20. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (20 properties × 100 iterations = 2,000 test cases)
- Unit tests validate specific examples and edge cases (~40 tests)
- Integration tests validate end-to-end flows (~10 tests)
- Total estimated implementation time: 21 hours
- All decimal quantity operations use bccomp() and DB::raw() for precision
- Seeders use firstOrCreate() for idempotency
- Migrations use separate ALTER TABLE statements for computed columns
