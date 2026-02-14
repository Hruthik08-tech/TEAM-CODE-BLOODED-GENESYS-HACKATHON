# Database Requirements for Backend Compatibility

## Overview

This document specifies the **minimum database schema requirements** needed for the backend matching API to work. The actual database will be managed by the frontend team, but these requirements **must** be met for compatibility.

---

## Critical Requirements

### 1. Three Required Tables

The backend expects **exactly three tables** with these **exact names**:

1. `organization`
2. `organization_supply`
3. `organization_demand`

**Note:** Table names are case-sensitive in some databases. Use lowercase.

---

##  Required Fields Per Table

### Table 1: `organization`

**Purpose:** Store information about companies/organizations registered on the platform.

**Required Fields:**

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `org_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique organization ID |
| `org_name` | VARCHAR(255) | NOT NULL | Organization name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Contact email |
| `phone_number` | VARCHAR(20) | NULLABLE | Contact phone |
| `address` | TEXT | NULLABLE | Physical address |
| `latitude` | FLOAT | NOT NULL | GPS latitude |
| `longitude` | FLOAT | NOT NULL | GPS longitude |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Verification status |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Registration date |

**Optional Fields:** You can add more fields (company_type, industry, etc.) but the above are **required**.

**Example:**
```sql
CREATE TABLE organization (
    org_id INT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    address TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- You can add additional fields here:
    -- company_size VARCHAR(50),
    -- industry VARCHAR(100),
    -- etc.
    
    INDEX idx_verified (is_verified),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### Table 2: `organization_supply`

**Purpose:** Store what each organization is offering (waste materials they want to sell/give away).

**Required Fields:**

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `supply_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique supply ID |
| `org_id` | INT | FOREIGN KEY → organization(org_id), NOT NULL | Which organization owns this |
| `category_id` | INT | NOT NULL | Category/type of material |
| `item_name` | VARCHAR(255) | NOT NULL | What they're offering |
| `item_description` | TEXT | NULLABLE | Detailed description |
| `price_per_unit` | FLOAT | NULLABLE | Price per unit (optional) |
| `unit` | VARCHAR(50) | NULLABLE | Unit of measurement (ton, kg, m³) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Is this listing active? |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | When listed |

**Important Notes:**
- `item_name` is used for matching - should be descriptive (e.g., "Basmati Rice", "Wood Sawdust")
- `category_id` must match between supply and demand for matching to occur
- If you change field names, you'll need to update `models.py` in backend

**Example:**
```sql
CREATE TABLE organization_supply (
    supply_id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    price_per_unit FLOAT,
    unit VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (org_id) REFERENCES organization(org_id) ON DELETE CASCADE,
    
    INDEX idx_category (category_id),
    INDEX idx_active (is_active),
    INDEX idx_item_name (item_name),
    INDEX idx_org_category (org_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### Table 3: `organization_demand`

**Purpose:** Store what each organization needs (waste materials they want to buy/acquire).

**Required Fields:**

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `demand_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique demand ID |
| `org_id` | INT | FOREIGN KEY → organization(org_id), NOT NULL | Which organization needs this |
| `category_id` | INT | NOT NULL | Category/type of material |
| `item_name` | VARCHAR(255) | NOT NULL | What they're looking for |
| `item_description` | TEXT | NULLABLE | Detailed requirements |
| `max_price_per_unit` | FLOAT | NULLABLE | Maximum price willing to pay |
| `latitude` | FLOAT | NOT NULL | Search location (GPS) |
| `longitude` | FLOAT | NOT NULL | Search location (GPS) |
| `search_radius` | FLOAT | NOT NULL | Search radius in kilometers |
| `search_time` | DATETIME | NULLABLE | Last search timestamp |
| `is_active` | BOOLEAN | DEFAULT TRUE | Is this demand active? |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | When created |

**Important Notes:**
- `latitude`/`longitude` can be different from organization's location (search from different warehouse, etc.)
- `search_radius` determines how far to look for suppliers (in kilometers)
- `item_name` is used for semantic matching

**Example:**
```sql
CREATE TABLE organization_demand (
    demand_id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    max_price_per_unit FLOAT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    search_radius FLOAT NOT NULL,
    search_time DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (org_id) REFERENCES organization(org_id) ON DELETE CASCADE,
    
    INDEX idx_category (category_id),
    INDEX idx_active (is_active),
    INDEX idx_demand_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Critical Matching Rules

For the backend to find matches, these conditions **must** be met:

### 1. Category Matching
```
supply.category_id MUST EQUAL demand.category_id
```
- Both must use the same category numbering system
- Example: If category 3 = "Wood Products", both supply and demand must use 3

### 2. Geographic Matching
```
distance(demand.lat/lon, supply_org.lat/lon) <= demand.search_radius
```
- Calculated using Haversine formula
- Distance in kilometers

### 3. Name Similarity
```
similarity(demand.item_name, supply.item_name) >= threshold (default: 0.6)
```
- Uses semantic + fuzzy matching
- "rice" will match "basmati rice", "jasmine rice"

### 4. Price Filtering (Optional)
```
IF both max_price and price_per_unit are set:
    supply.price_per_unit <= demand.max_price_per_unit
```

### 5. Active Status
```
supply.is_active = TRUE
demand.is_active = TRUE
organization.is_verified = TRUE
```

---

## Category System

You need a consistent category system. Here's a recommended structure:

### Option 1: Simple Categories (Recommended)

| category_id | Name | Examples |
|-------------|------|----------|
| 1 | Grains & Agricultural | Rice, wheat, corn, grain waste |
| 2 | Textiles | Fabric scraps, textile waste |
| 3 | Wood Products | Sawdust, wood chips, lumber scraps |
| 4 | Organic Waste | Food waste, kitchen waste, compost |
| 5 | Metals | Scrap metal, aluminum, steel |
| 6 | Plastics | Plastic waste, containers |
| 7 | Paper & Cardboard | Paper waste, cardboard boxes |
| 8 | Electronics | E-waste, circuit boards |
| 9 | Construction | Construction debris, concrete |
| 10 | Chemicals | Chemical waste, solvents |

### Option 2: Category Table (Better for Large Scale)

Create a separate `categories` table:

```sql
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Then add foreign keys to supply and demand tables
ALTER TABLE organization_supply 
    ADD FOREIGN KEY (category_id) REFERENCES categories(category_id);
    
ALTER TABLE organization_demand 
    ADD FOREIGN KEY (category_id) REFERENCES categories(category_id);
```

**Important:** Whatever system you choose, **document it** so frontend and backend teams use the same IDs.

---

##  If You Need to Change Field Names

If you **must** change field names, you'll need to update `models.py` in the backend.

### Example: Changing `item_name` to `material_name`

**1. Update your database:**
```sql
ALTER TABLE organization_supply 
    CHANGE COLUMN item_name material_name VARCHAR(255) NOT NULL;
    
ALTER TABLE organization_demand 
    CHANGE COLUMN item_name material_name VARCHAR(255) NOT NULL;
```

**2. Update backend `models.py`:**
```python
# OLD:
item_name = Column(String(255), nullable=False)

# NEW:
material_name = Column(String(255), nullable=False)
```

**3. Update `matching_service.py` and `schemas.py`:**
Search for all occurrences of `item_name` and replace with `material_name`.

**Note:** This requires coordination! Better to stick with the field names if possible.

---

## Data Validation Rules

### GPS Coordinates
- **Latitude**: Must be between -90 and 90
- **Longitude**: Must be between -180 and 180
- **Format**: Decimal degrees (e.g., 12.9716, 77.5946)

### Search Radius
- **Minimum**: 1 km (recommended)
- **Maximum**: 500 km (recommended)
- **Default**: 50 km

### Price
- Must be positive (> 0)
- NULL is acceptable (means "not specified")

### Item Name
- Should be descriptive
- Min length: 3 characters
- Max length: 255 characters
- **Good examples**: "Basmati Rice", "Pine Wood Sawdust", "Organic Food Waste"
- **Bad examples**: "Item 1", "Stuff", "Material"

---

##  Required Database Indexes

For performance, these indexes are **highly recommended**:

```sql
-- organization table
CREATE INDEX idx_verified ON organization(is_verified);
CREATE INDEX idx_location ON organization(latitude, longitude);

-- organization_supply table
CREATE INDEX idx_category ON organization_supply(category_id);
CREATE INDEX idx_active ON organization_supply(is_active);
CREATE INDEX idx_item_name ON organization_supply(item_name);

-- organization_demand table
CREATE INDEX idx_category ON organization_demand(category_id);
CREATE INDEX idx_active ON organization_demand(is_active);
CREATE INDEX idx_demand_location ON organization_demand(latitude, longitude);
```

---

##  Test Data Requirements

For testing, you need at least:

- **3 organizations** (different locations)
- **5 supplies** (mix of categories)
- **3 demands** (mix of categories)

### Minimal Test Data Example

```sql
-- Organizations
INSERT INTO organization (org_name, email, latitude, longitude, is_verified) VALUES
('Test Supplier A', 'suppliera@test.com', 12.9716, 77.5946, TRUE),
('Test Supplier B', 'supplierb@test.com', 13.0358, 77.5970, TRUE),
('Test Buyer C', 'buyerc@test.com', 12.9352, 77.6245, TRUE);

-- Supplies
INSERT INTO organization_supply (org_id, category_id, item_name, price_per_unit, unit, is_active) VALUES
(1, 1, 'Rice', 50.0, 'kg', TRUE),
(2, 3, 'Wood Sawdust', 40.0, 'ton', TRUE);

-- Demands
INSERT INTO organization_demand (org_id, category_id, item_name, max_price_per_unit, latitude, longitude, search_radius, is_active) VALUES
(3, 1, 'rice', 60.0, 12.9716, 77.5946, 50.0, TRUE);
```

---

## Compatibility Checklist

Before deploying, verify:

- [ ] All three tables exist with correct names
- [ ] All required fields exist with correct data types
- [ ] Foreign keys are set up correctly
- [ ] Indexes are created for performance
- [ ] Category system is defined and documented
- [ ] Test data is inserted
- [ ] GPS coordinates are valid (decimal degrees)
- [ ] At least one verified organization exists
- [ ] At least one active supply and demand exist

---

##  Breaking Changes to Avoid

**DO NOT:**
- Change table names (`organization`, `organization_supply`, `organization_demand`)
- Remove any required fields listed above
- Change `org_id`, `supply_id`, `demand_id` from auto-increment
- Use different data types (e.g., VARCHAR for latitude instead of FLOAT)
- Remove foreign key relationships

**YOU CAN:**
- Add new fields (won't break backend)
- Add new tables (backend will ignore them)
- Change field order (doesn't matter)
- Add more indexes
- Change default values for new fields

---

##  Contact

If you need to make changes that might affect compatibility:

1. **Check with backend team first**
2. **Update `models.py` if field names change**
3. **Test with sample data before deploying**

---

##  Migration Path

If you already have a database with different field names:

### Option 1: Rename Fields (Recommended)
```sql
ALTER TABLE your_table CHANGE old_name new_name TYPE;
```

### Option 2: Create Views (If you can't change schema)
```sql
CREATE VIEW organization AS 
SELECT 
    company_id AS org_id,
    company_name AS org_name,
    -- ... map all fields
FROM your_companies_table;
```

### Option 3: Update Backend (Last resort)
Modify `models.py` to match your schema.

---

##  Additional Resources

- **Backend API Docs**: See `API_DOCUMENTATION.md`
- **Testing Guide**: See `README.md`
- **Database Setup**: See `MYSQL_REDIS_SETUP.md`

---

## Summary for Database Team

**You need:**
1. Three tables: `organization`, `organization_supply`, `organization_demand`
2.  All required fields as specified above
3.  Consistent category system (same IDs for same categories)
4.  Valid GPS coordinates (decimal degrees)
5.  Foreign keys properly set up
6.  Performance indexes created

**You can add:**
-  More fields to any table
-  More tables for your needs
-  More categories
-  User authentication tables
-  Transaction history tables
-  Rating/review tables

**The backend matching API will work as long as the required fields exist!** 
