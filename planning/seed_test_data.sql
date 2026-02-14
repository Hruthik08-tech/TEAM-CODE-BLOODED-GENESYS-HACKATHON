-- ================================================================
--  SEED DATA — CATEGORIES, SUPPLIES, DEMANDS & HISTORY
--  Platform : Supply-Demand Matching Platform
--  Version  : 1.0
--  Date     : February 2026
--
--  SCOPE
--  ----------------------------------------------------------------
--  Populates data for orgs 2–20 (CODE BLOODED org_id=1 is skipped).
--  Tables populated:
--    • item_category          (24 rows — 10 parent + 14 child)
--    • org_supply             (38 rows — 2 per org)
--    • org_supply_history     (38 rows — 'created' snapshot per supply)
--    • org_demand             (38 rows — 2 per org)
--    • org_demand_history     (38 rows — 'created' snapshot per demand)
--
--  MATCHING PAIRS SEEDED (for AI semantic testing)
--  ----------------------------------------------------------------
--  BioGrow(18) fertilizer/urea        → GreenHarvest(2) needs both
--  EcoWrap(8) biodeg. packaging       → FreshBowl(6), Sunrise Dairy(13), PharmaLink(9)
--  PureGrain(15) wheat/rice flour     → FreshBowl(6) needs both
--  GreenHarvest(2) wheat grain        → PureGrain(15) needs raw wheat
--  SteelForge(11) TMT bars/SS pipes   → BuildRight(7) needs steel + AquaFlow(16) needs pipes
--  TechParts(5) components            → NexGen(14) needs components
--  Sunrise Dairy(13) milk/paneer      → FreshBowl(6) needs dairy ingredients
--  ColdChain(12) cold storage         → Sunrise Dairy(13) + PharmaLink(9)
--  SafetyFirst(17) helmets/fire kits  → SteelForge(11), BuildRight(7), CloudStore(20)
--  SwiftLogix(3) logistics            → CloudStore(20) needs 3PL partner
--  UrbanTextiles(10) hi-vis fabric    → SafetyFirst(17) needs fabric
--  MediSource(4) surgical instruments → PharmaLink(9) + NexGen(14)
--  BuildRight(7) cement               → SteelForge(11) needs construction materials
--  AquaFlow(16) pumps/RO systems      → BuildRight(7) needs water systems
--  PrintWave(19) custom print         → EcoWrap(8) needs packaging print
--  CloudStore(20) warehousing         → GreenHarvest(2) + SwiftLogix(3)
-- ================================================================


-- ================================================================
--  MODULE 1 — ITEM CATEGORIES
-- ================================================================

INSERT INTO `item_category`
  (`category_id`, `parent_id`, `category_name`, `slug`, `description`, `is_active`, `display_order`, `created_at`)
VALUES
-- Parent categories
(1,  NULL, 'Food & Beverages',           'food-beverages',        'All food, drink, and consumable products',                     TRUE, 1,  NOW()),
(2,  NULL, 'Agriculture',                'agriculture',           'Farming inputs, raw produce, and agri-services',               TRUE, 2,  NOW()),
(3,  NULL, 'Pharmaceuticals & Medical',  'pharma-medical',        'Medicines, medical devices, and healthcare supplies',          TRUE, 3,  NOW()),
(4,  NULL, 'Electronics & Technology',   'electronics-tech',      'Electronic components, devices, and IT hardware',              TRUE, 4,  NOW()),
(5,  NULL, 'Industrial & Manufacturing', 'industrial-mfg',        'Raw materials and equipment for manufacturing and construction',TRUE, 5,  NOW()),
(6,  NULL, 'Packaging',                  'packaging',             'Packaging materials, boxes, bags, and containers',             TRUE, 6,  NOW()),
(7,  NULL, 'Logistics & Storage',        'logistics-storage',     'Transport, warehousing, and supply chain services',            TRUE, 7,  NOW()),
(8,  NULL, 'Textiles & Apparel',         'textiles-apparel',      'Fabrics, yarn, garments, and textile accessories',             TRUE, 8,  NOW()),
(9,  NULL, 'Safety Equipment',           'safety-equipment',      'Personal protective equipment and workplace safety gear',      TRUE, 9,  NOW()),
(10, NULL, 'Water & Utilities',          'water-utilities',       'Water treatment, pumps, and utility infrastructure',           TRUE, 10, NOW()),

-- Child categories
(11, 1, 'Dairy Products',               'dairy-products',         'Milk, paneer, butter, curd, and dairy derivatives',           TRUE, 1, NOW()),
(12, 1, 'Grains & Flour',               'grains-flour',           'Wheat, rice, corn, lentils, and milled flour products',       TRUE, 2, NOW()),
(13, 1, 'Packaged Foods',               'packaged-foods',         'RTE meals, snacks, and processed food products',              TRUE, 3, NOW()),
(14, 1, 'Fresh Produce',                'fresh-produce',          'Fruits, vegetables, and perishable farm produce',             TRUE, 4, NOW()),
(15, 2, 'Fertilizers & Pesticides',     'fertilizers-pesticides', 'Chemical and organic fertilizers and crop protection',        TRUE, 1, NOW()),
(16, 3, 'Medicines & Drugs',            'medicines-drugs',        'Pharmaceutical formulations, APIs, and bulk drugs',           TRUE, 1, NOW()),
(17, 3, 'Medical Equipment',            'medical-equipment',      'Surgical instruments, diagnostic devices, and hospital furniture', TRUE, 2, NOW()),
(18, 4, 'Electronic Components',        'electronic-components',  'Resistors, microcontrollers, PCBs, and passive components',   TRUE, 1, NOW()),
(19, 4, 'Consumer Electronics',         'consumer-electronics',   'Laptops, IoT devices, and end-user electronics',             TRUE, 2, NOW()),
(20, 5, 'Steel & Metals',               'steel-metals',           'TMT bars, structural steel, pipes, and metal products',       TRUE, 1, NOW()),
(21, 5, 'Construction Materials',       'construction-materials', 'Cement, sand, bricks, and building supplies',                 TRUE, 2, NOW()),
(22, 6, 'Eco Packaging',                'eco-packaging',          'Biodegradable, recyclable, and sustainable packaging',        TRUE, 1, NOW()),
(23, 7, 'Cold Chain & Refrigeration',   'cold-chain',             'Temperature-controlled storage and refrigerated transport',   TRUE, 1, NOW()),
(24, 7, 'Warehousing & Storage',        'warehousing-storage',    'Dry warehousing, inventory management, and fulfilment',       TRUE, 2, NOW());


-- ================================================================
--  MODULE 2 — SUPPLY LISTINGS (org_id 2–20, 2 each = 38 rows)
-- ================================================================

INSERT INTO `org_supply` (
  `supply_id`, `org_id`, `category_id`,
  `item_name`, `item_description`,
  `price_per_unit`, `currency`, `quantity`, `quantity_unit`, `min_order_qty`,
  `expiry_date`, `location_label`,
  `supplier_name`, `supplier_phone`, `supplier_email`, `supplier_address`,
  `is_active`, `is_flagged`, `version`,
  `created_at`, `updated_at`
) VALUES

-- ORG 2 — GreenHarvest Agri
(1, 2, 12,
 'Premium Wheat Grain (Raw)',
 'High-quality raw wheat grain sourced from Punjab farms. Moisture content <12%, suitable for milling into flour, semolina, and animal feed. Available in 50kg jute bags. Consistent quality across bulk orders.',
 22.50, 'INR', 10000, 'kg', 500,
 '2026-09-30', 'Warehouse — Bannerghatta Road, JP Nagar, Bangalore',
 'GreenHarvest Agri Procurement', '+91-9800000002', 'procurement@greenharvest.in', '45, Bannerghatta Road, JP Nagar, Bangalore - 560078',
 TRUE, FALSE, 1, NOW(), NOW()),

(2, 2, 14,
 'Fresh Tomatoes (Grade A)',
 'Farm-fresh Grade A tomatoes, firm and bright red, harvested from our partner farms in Kolar. Supplied in 10kg corrugated crates. Ideal for food processing, restaurant supply, and retail packaging. Shelf life 7–10 days at ambient temperature.',
 28.00, 'INR', 5000, 'kg', 100,
 '2026-03-15', 'Cold dispatch — Bannerghatta Road, Bangalore',
 'GreenHarvest Agri', '+91-9800000002', 'supply@greenharvest.in', '45, Bannerghatta Road, JP Nagar, Bangalore - 560078',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 3 — SwiftLogix
(3, 3, 23,
 'Refrigerated Last-Mile Transport',
 'Temperature-controlled refrigerated van delivery service for perishables within Bangalore and 50km radius. Maintains 2–8°C throughout transit. GPS-tracked, food-grade certified vehicles. Available for daily scheduled runs or on-demand slots.',
 4500.00, 'INR', 30, 'trip', 1,
 NULL, 'Dispatch Hub — Electronic City Phase 1, Bangalore',
 'SwiftLogix Fleet Operations', '+91-9800000003', 'fleet@swiftlogix.in', '78, Hosur Road, Electronic City Phase 1, Bangalore - 560100',
 TRUE, FALSE, 1, NOW(), NOW()),

(4, 3, 24,
 'Dry Cargo B2B Logistics (LTL & FTL)',
 'Less-than-truckload and full truckload dry cargo logistics across Karnataka and Tamil Nadu. Includes loading, transit, and door delivery. Real-time shipment tracking on our dashboard. Ideal for FMCG, electronics, and industrial goods.',
 18.00, 'INR', 500, 'kg', 100,
 NULL, 'Logistics Hub — Electronic City, Bangalore',
 'SwiftLogix Cargo', '+91-9800000003', 'cargo@swiftlogix.in', '78, Hosur Road, Electronic City, Bangalore - 560100',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 4 — MediSource India
(5, 4, 17,
 'Stainless Steel Surgical Instruments Set',
 'Professional-grade surgical instruments including scalpels, forceps, scissors, retractors, and clamps. German-grade SS 316L steel. Autoclave-safe. Each set contains 24 instruments in a sterilisation tray. CE marked and ISO 13485 compliant.',
 3200.00, 'INR', 200, 'set', 10,
 NULL, 'Vasanth Nagar Facility, Bangalore',
 'MediSource India Supply Desk', '+91-9800000004', 'supply@medisource.in', '22, Cunningham Road, Vasanth Nagar, Bangalore - 560052',
 TRUE, FALSE, 1, NOW(), NOW()),

(6, 4, 17,
 'Adjustable Hospital Beds with Side Rails',
 'Heavy-duty adjustable hospital beds with manual crank and electric option. ABS plastic side rails, foam mattress included. Max load 200kg. Suitable for ICUs, wards, and long-term care. Delivered assembled. Available in bulk for hospitals and clinics.',
 18500.00, 'INR', 50, 'unit', 5,
 NULL, 'Vasanth Nagar Facility, Bangalore',
 'MediSource India', '+91-9800000004', 'beds@medisource.in', '22, Cunningham Road, Vasanth Nagar, Bangalore - 560052',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 5 — TechParts Hub
(7, 5, 18,
 'Arduino Uno R3 Microcontroller Boards',
 'Genuine Arduino Uno R3 boards for prototyping and embedded development. ATmega328P, 14 digital I/O, 6 analog inputs, USB-B interface. Sold in anti-static ESD bags. Bulk pricing available. Compatible with standard shields. Tested before dispatch.',
 380.00, 'INR', 1000, 'unit', 20,
 NULL, 'Shivaji Nagar Store, Bangalore',
 'TechParts Hub', '+91-9800000005', 'orders@techpartshub.in', '5, Infantry Road, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

(8, 5, 18,
 'Passive Component Kit (Resistors, Capacitors, LEDs)',
 'Assorted passive component kit: 600 resistors (1/4W, E12 series), 200 ceramic capacitors, 100 electrolytic capacitors, 50 mixed LEDs. Ideal for R&D labs, education institutes, and electronics manufacturers. Packed in labelled compartment boxes.',
 1250.00, 'INR', 500, 'kit', 10,
 NULL, 'Shivaji Nagar Store, Bangalore',
 'TechParts Hub Components', '+91-9800000005', 'kits@techpartshub.in', '5, Infantry Road, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 6 — FreshBowl Foods
(9, 6, 13,
 'Ready-to-Eat Vegetable Biryani (Bulk Pack)',
 'Shelf-stable ready-to-eat vegetable biryani in retort pouches. 300g per pack, 12-month shelf life, no preservatives added. Suitable for canteens, airlines, and institutional bulk buyers. Available plain and spiced variants. Co-packing MOQ negotiable.',
 65.00, 'INR', 20000, 'unit', 500,
 '2027-02-28', 'FreshBowl Production Unit — Indiranagar, Bangalore',
 'FreshBowl Foods', '+91-9800000006', 'bulk@freshbowlfoods.in', '33, Indiranagar 100 Feet Road, Bangalore - 560038',
 TRUE, FALSE, 1, NOW(), NOW()),

(10, 6, 13,
 'Packaged Roasted Peanuts (500g)',
 'Lightly salted and plain roasted peanuts, hygienically processed and packed in BOPP laminated pouches. 500g per pack. 9-month shelf life. Suitable for retail distribution, vending, and hospitality. Private labelling available for bulk orders.',
 48.00, 'INR', 15000, 'unit', 200,
 '2026-12-31', 'FreshBowl Production Unit — Indiranagar, Bangalore',
 'FreshBowl Foods', '+91-9800000006', 'sales@freshbowlfoods.in', '33, Indiranagar 100 Feet Road, Bangalore - 560038',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 7 — BuildRight Supplies
(11, 7, 21,
 'Portland Cement OPC 53 Grade (50kg Bags)',
 'Ordinary Portland Cement 53 Grade conforming to IS 12269. High early strength, ideal for RCC structures, precast elements, and high-rise construction. 50kg HDPE bags with moisture barrier. Available in truckload quantities from Yeshwanthpur depot.',
 390.00, 'INR', 5000, 'bag', 100,
 '2026-08-31', 'BuildRight Depot — Yeshwanthpur, Bangalore',
 'BuildRight Supplies', '+91-9800000007', 'cement@buildright.in', '90, Tumkur Road, Yeshwanthpur, Bangalore - 560022',
 TRUE, FALSE, 1, NOW(), NOW()),

(12, 7, 21,
 'M-Sand (Manufactured Sand) for Construction',
 'ISI-graded manufactured sand conforming to IS 383 Zone II. Silt content <2%, ideal for plastering and RCC concrete. Supplied by the tonne in bulk tipper delivery across Bangalore and outskirts. Consistent gradation with quality test reports available.',
 1200.00, 'INR', 500, 'tonne', 5,
 NULL, 'BuildRight Yard — Yeshwanthpur, Bangalore',
 'BuildRight Supplies', '+91-9800000007', 'sand@buildright.in', '90, Tumkur Road, Yeshwanthpur, Bangalore - 560022',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 8 — EcoWrap Packaging
(13, 8, 22,
 'Biodegradable Food Packaging Containers (500ml)',
 'Sugarcane bagasse food containers, microwave-safe and compostable. 500ml capacity with hinged lid. CPCB certified compostable (IS 17088). Suitable for restaurants, cloud kitchens, dairy, and FMCG. Custom branding printing available on MOQ 5000 units.',
 4.50, 'INR', 100000, 'unit', 5000,
 NULL, 'Peenya Industrial Area, Bangalore',
 'EcoWrap Packaging', '+91-9800000008', 'sales@ecowrap.in', '17, Peenya Industrial Area Phase 2, Bangalore - 560058',
 TRUE, FALSE, 1, NOW(), NOW()),

(14, 8, 22,
 'Kraft Paper Carry Bags (Customisable)',
 'Brown kraft paper carry bags with twisted paper handles. 100gsm, various sizes (S/M/L/XL). FSC-certified paper source. Offset or digital printing for branding. Suitable for retail, pharma, and food delivery. MOQ 2000 units per size per design.',
 3.20, 'INR', 200000, 'unit', 2000,
 NULL, 'Peenya Industrial Area, Bangalore',
 'EcoWrap Packaging', '+91-9800000008', 'kraft@ecowrap.in', '17, Peenya Industrial Area Phase 2, Bangalore - 560058',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 9 — PharmaLink India
(15, 9, 16,
 'Paracetamol 500mg Tablets (Bulk Strip)',
 'Paracetamol IP 500mg tablets, CGMP-manufactured, WHO-GMP facility. Available in blister strips of 10 (10×10 = 100 tab carton) or bulk jars of 1000. Schedule H. COA provided with each batch. Pan-India distribution to hospitals, clinics, and wholesalers.',
 1.80, 'INR', 500000, 'tablet', 10000,
 '2027-06-30', 'Rajajinagar Pharma Warehouse, Bangalore',
 'PharmaLink India', '+91-9800000009', 'bulk@pharmalink.in', '8, Rajajinagar Industrial Town, Bangalore - 560044',
 TRUE, FALSE, 1, NOW(), NOW()),

(16, 9, 16,
 'Amoxicillin 500mg Capsules (Bulk)',
 'Amoxicillin Trihydrate IP 500mg capsules, hard gelatin, CGMP manufactured. Available in blister strips or bulk HDPE drums (10,000 capsules). Full regulatory documentation (COA, MSDS, stability data) provided. Suitable for institutional and hospital procurement.',
 4.20, 'INR', 200000, 'capsule', 5000,
 '2027-04-30', 'Rajajinagar Pharma Warehouse, Bangalore',
 'PharmaLink India', '+91-9800000009', 'capsules@pharmalink.in', '8, Rajajinagar Industrial Town, Bangalore - 560044',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 10 — UrbanTextiles
(17, 10, 8,
 'Cotton Sheeting Fabric (White, 60s Count)',
 'Pure cotton sheeting fabric, 60s count, 63-inch width. Combed yarn, pre-shrunk, mercerised finish. 180 GSM. Suitable for garment manufacturing, hospital linen, and institutional bedding. Supplied in rolls of 100m. Minimum order 10 rolls.',
 185.00, 'INR', 50000, 'metre', 1000,
 NULL, 'Commercial Street Warehouse, Shivaji Nagar, Bangalore',
 'UrbanTextiles', '+91-9800000010', 'cotton@urbantextiles.in', '56, Commercial Street, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

(18, 10, 8,
 'High-Visibility Neon Yellow Safety Fabric',
 'EN ISO 20471 Class 2 compliant high-visibility neon yellow polyester-cotton fabric. Retro-reflective tape compatible. 160 GSM, 57-inch width. Ideal for workwear, safety vests, and industrial PPE manufacturing. Supplied in 50m rolls. Custom widths available.',
 320.00, 'INR', 20000, 'metre', 500,
 NULL, 'Commercial Street Warehouse, Shivaji Nagar, Bangalore',
 'UrbanTextiles', '+91-9800000010', 'hivis@urbantextiles.in', '56, Commercial Street, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 11 — SteelForge Industries
(19, 11, 20,
 'TMT Bars Fe 500D (12mm, 16mm, 20mm)',
 'High-strength thermo-mechanically treated (TMT) bars grade Fe 500D conforming to IS 1786. Superior ductility and earthquake resistance. Available in 12mm, 16mm, and 20mm diameters. Supplied in standard 12m lengths or cut to custom sizes. Mill test certificates provided.',
 68000.00, 'INR', 200, 'tonne', 5,
 NULL, 'Bommasandra Industrial Area, Bangalore',
 'SteelForge Industries', '+91-9800000011', 'tmt@steelforge.in', '120, Bommasandra Industrial Area, Bangalore - 560099',
 TRUE, FALSE, 1, NOW(), NOW()),

(20, 11, 20,
 'Stainless Steel Pipes SS 304 (Various Sizes)',
 'Seamless and welded stainless steel pipes grade SS 304. Available OD 1/2" to 4", wall thickness Schedule 10 to 40. Suitable for water treatment, food processing, chemical plants, and HVAC systems. Supplied in 6m lengths with end caps. Mill certificates included.',
 520.00, 'INR', 5000, 'metre', 100,
 NULL, 'Bommasandra Industrial Area, Bangalore',
 'SteelForge Industries', '+91-9800000011', 'pipes@steelforge.in', '120, Bommasandra Industrial Area, Bangalore - 560099',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 12 — ColdChain Express
(21, 12, 23,
 'Temperature-Controlled Cold Room Storage (2°C–8°C)',
 'Dedicated pallet positions in our FSSAI-licensed cold room maintained at 2–8°C. Suitable for dairy, meat, cut vegetables, and pharmaceutical products. 24/7 monitoring with IoT temperature logging. Daily, weekly, and monthly rental plans. Bangalore inbound and outbound handling included.',
 90.00, 'INR', 500, 'pallet-day', 10,
 NULL, 'ColdChain Facility — Whitefield, Bangalore',
 'ColdChain Express Storage', '+91-9800000012', 'storage@coldchainexpress.in', '3, Whitefield Main Road, ITPL, Bangalore - 560066',
 TRUE, FALSE, 1, NOW(), NOW()),

(22, 12, 23,
 'Deep Freeze Storage (–18°C to –25°C)',
 'Deep freeze pallet storage at –18°C to –25°C, ideal for ice cream, frozen meat, seafood, and long-term pharmaceutical cold chain. Blast freezing on arrival also available. FSSAI and pharma cold chain compliant. Full traceability with digital temperature records shared daily.',
 130.00, 'INR', 300, 'pallet-day', 5,
 NULL, 'ColdChain Deep Freeze Unit — Whitefield, Bangalore',
 'ColdChain Express', '+91-9800000012', 'deepfreeze@coldchainexpress.in', '3, Whitefield Main Road, ITPL, Bangalore - 560066',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 13 — Sunrise Dairy Co.
(23, 13, 11,
 'Fresh Full-Cream Milk (Bulk, Tanker)',
 'Fresh full-cream cow milk, 6% fat, 9% SNF. Collected daily from affiliated farms in Yelahanka outskirts. Pasteurised and tested for antibiotics, aflatoxin, and adulteration. Supplied via tanker (5,000–10,000 litre capacity) or 30-litre cans. Available daily with pre-booking.',
 42.00, 'INR', 50000, 'litre', 500,
 NULL, 'Sunrise Dairy Plant — Yelahanka, Bangalore',
 'Sunrise Dairy Co.', '+91-9800000013', 'milk@sunrisedairy.in', '67, Yelahanka New Town, Bangalore - 560064',
 TRUE, FALSE, 1, NOW(), NOW()),

(24, 13, 11,
 'Fresh Paneer (Bulk Blocks, 1kg)',
 'Freshly made cow-milk paneer in 1kg vacuum-sealed blocks. Made daily, shelf life 15 days under refrigeration. Fat 20–25%, moisture <70%. Suitable for restaurant chains, cloud kitchens, and food manufacturers. Available in standard and low-fat variants. MOQ 50kg.',
 280.00, 'INR', 2000, 'kg', 50,
 NULL, 'Sunrise Dairy Plant — Yelahanka, Bangalore',
 'Sunrise Dairy Co.', '+91-9800000013', 'paneer@sunrisedairy.in', '67, Yelahanka New Town, Bangalore - 560064',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 14 — NexGen Electronics
(25, 14, 19,
 'Business Laptops (Intel i5, 8GB RAM, 512GB SSD)',
 'B2B bulk supply of business laptops: Intel Core i5 12th Gen, 8GB DDR4, 512GB NVMe SSD, 15.6" FHD IPS display, Windows 11 Pro. Suitable for corporate, educational, and government procurement. 1-year onsite warranty. Bulk pricing with AMC options. Available for demo before order.',
 52000.00, 'INR', 200, 'unit', 5,
 NULL, 'NexGen Showroom — Koramangala, Bangalore',
 'NexGen Electronics B2B', '+91-9800000014', 'b2b@nexgenelec.in', '14, Koramangala 5th Block, Bangalore - 560095',
 TRUE, FALSE, 1, NOW(), NOW()),

(26, 14, 19,
 'Industrial IoT Sensor Kit (Temperature, Humidity, Gas)',
 'IoT sensor kit with temperature (–40 to 125°C), humidity (0–100% RH), CO2, and VOC sensors. ESP32 based, Wi-Fi + BLE connectivity. Enclosure rated IP54. SDK and cloud dashboard included. Suitable for cold chain monitoring, warehouse management, and smart factory applications.',
 4800.00, 'INR', 500, 'unit', 10,
 NULL, 'NexGen Electronics — Koramangala, Bangalore',
 'NexGen Electronics', '+91-9800000014', 'iot@nexgenelec.in', '14, Koramangala 5th Block, Bangalore - 560095',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 15 — PureGrain Mills
(27, 15, 12,
 'Chakki Atta Whole Wheat Flour (50kg Bags)',
 'Stone-ground whole wheat chakki atta milled from premium HYV wheat. Protein content 11–12%, ash <1.4%. Soft, consistent texture suitable for chapati, paratha, and baking. Available in 50kg HDPE bags. FSSAI licensed facility. Fortification (iron, folic acid) available on request.',
 2100.00, 'INR', 1000, 'bag', 20,
 '2026-10-31', 'PureGrain Mill — Kengeri, Bangalore',
 'PureGrain Mills', '+91-9800000015', 'atta@puregrainmills.in', '29, Kengeri Satellite Town, Bangalore - 560060',
 TRUE, FALSE, 1, NOW(), NOW()),

(28, 15, 12,
 'Fine Rice Flour (25kg Bags)',
 'Finely milled rice flour from broken rice. Gluten-free, moisture <14%. Suitable for idli/dosa batter, rice-based snacks, paper dosa production, and food processing. Supplied in 25kg multi-wall paper bags with PE liner. Custom milling for specific grain sizes available.',
 1450.00, 'INR', 800, 'bag', 10,
 '2026-11-30', 'PureGrain Mill — Kengeri, Bangalore',
 'PureGrain Mills', '+91-9800000015', 'riceflour@puregrainmills.in', '29, Kengeri Satellite Town, Bangalore - 560060',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 16 — AquaFlow Systems
(29, 16, 10,
 'Industrial Centrifugal Water Pumps (1HP–10HP)',
 'Heavy-duty centrifugal pumps for industrial and municipal water supply. CI/SS impeller, 1–10HP motor options, single and three phase. Max flow 120 m³/hr, max head 80m. Suitable for agriculture, construction, and water treatment plants. Tested at factory before dispatch.',
 12500.00, 'INR', 100, 'unit', 2,
 NULL, 'AquaFlow Facility — Domlur, Bangalore',
 'AquaFlow Systems', '+91-9800000016', 'pumps@aquaflow.in', '41, Domlur Layout, Old Airport Road, Bangalore - 560071',
 TRUE, FALSE, 1, NOW(), NOW()),

(30, 16, 10,
 'Commercial RO Water Purification System (1000 LPH)',
 'Reverse osmosis water purification plant, 1000 LPH output. 5-stage filtration (sediment, carbon, RO membrane, UV, UF). TDS reduction >98%. Suitable for factories, hospitals, and commercial kitchens. Full installation and commissioning included in Bangalore. 1-year AMC available.',
 85000.00, 'INR', 20, 'unit', 1,
 NULL, 'AquaFlow Facility — Domlur, Bangalore',
 'AquaFlow Systems', '+91-9800000016', 'ro@aquaflow.in', '41, Domlur Layout, Old Airport Road, Bangalore - 560071',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 17 — SafetyFirst Equipment
(31, 17, 9,
 'Industrial Safety Helmets (IS 2925 Certified)',
 'HDPE hard hats conforming to IS 2925 / EN 397. Ratchet suspension, 6-point harness, ventilation slots. Available in white, yellow, orange, and red. Suitable for construction, mining, and factory use. Bulk pricing from 100 units. Custom branding printing available.',
 280.00, 'INR', 5000, 'unit', 100,
 NULL, 'SafetyFirst Depot — Mysore Road, Bangalore',
 'SafetyFirst Equipment', '+91-9800000017', 'helmets@safetyfirst.in', '6, Mysore Road, RV Road Junction, Bangalore - 560004',
 TRUE, FALSE, 1, NOW(), NOW()),

(32, 17, 9,
 'Fire Safety Starter Kit (Extinguisher + Blanket + Signage)',
 'Complete fire safety kit: 2kg ABC dry powder fire extinguisher (ISI marked), 1.2m × 1.8m fire blanket, 3 photoluminescent fire exit signs. Suitable for offices, warehouses, and industrial units. Compliant with NBC 2016 fire safety codes. Refilling and inspection service available.',
 3800.00, 'INR', 500, 'kit', 10,
 NULL, 'SafetyFirst Depot — Mysore Road, Bangalore',
 'SafetyFirst Equipment', '+91-9800000017', 'firesafety@safetyfirst.in', '6, Mysore Road, RV Road Junction, Bangalore - 560004',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 18 — BioGrow Fertilizers
(33, 18, 15,
 'Organic NPK Granular Fertilizer (5:5:5)',
 'PGPR-enriched organic granular fertilizer, NPK 5:5:5 ratio, derived from composted organic matter and microbial inoculation. Improves soil structure and microbial activity. FSSAI and FCO compliant. Packed in 50kg HDPE bags. Suitable for vegetables, pulses, and cereal crops.',
 850.00, 'INR', 2000, 'bag', 20,
 '2027-01-31', 'BioGrow Plant — Hebbal, Bangalore',
 'BioGrow Fertilizers', '+91-9800000018', 'organic@biogrow.in', '88, Hebbal Kempapura, Near Ring Road, Bangalore - 560024',
 TRUE, FALSE, 1, NOW(), NOW()),

(34, 18, 15,
 'Urea (46% N) Agricultural Grade',
 'Prilled urea, nitrogen content 46% minimum, moisture <0.5%, biuret <1%. FCO compliant, marked with MRP and nutrient content. Suitable for all crops, soil application and fertigation. Packed in 45kg and 50kg HDPE bags. Available in truckload quantities.',
 680.00, 'INR', 5000, 'bag', 50,
 '2027-03-31', 'BioGrow Warehouse — Hebbal, Bangalore',
 'BioGrow Fertilizers', '+91-9800000018', 'urea@biogrow.in', '88, Hebbal Kempapura, Near Ring Road, Bangalore - 560024',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 19 — PrintWave Media
(35, 19, 6,
 'Custom Packaging Print (Offset, 4-Colour)',
 'High-quality 4-colour offset printing on packaging boxes, pouches, and cartons. Accepts client artwork (AI, PDF). Paper weights 150–400 GSM. Spot UV, embossing, and foiling options. MOQ 1000 units. Suitable for FMCG, pharma, and retail brands. 7–10 business day turnaround.',
 8.50, 'INR', 100000, 'unit', 1000,
 NULL, 'PrintWave Studio — Banashankari, Bangalore',
 'PrintWave Media', '+91-9800000019', 'packaging@printwave.in', '52, Banashankari 2nd Stage, Bangalore - 560070',
 TRUE, FALSE, 1, NOW(), NOW()),

(36, 19, 6,
 'Bulk Offset Brochure & Catalogue Printing',
 'Bulk printing of A4/A5 brochures, tri-fold leaflets, and product catalogues. 130–170 GSM coated art paper. 4-colour CMYK offset printing, gloss or matte lamination. MOQ 500 copies. Express 3-day printing slot available. Suitable for trade shows, sales teams, and direct mail.',
 12.00, 'INR', 50000, 'unit', 500,
 NULL, 'PrintWave Studio — Banashankari, Bangalore',
 'PrintWave Media', '+91-9800000019', 'brochure@printwave.in', '52, Banashankari 2nd Stage, Bangalore - 560070',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 20 — CloudStore Warehousing
(37, 20, 24,
 'Shared Dry Warehouse Space (Rack & Floor)',
 'On-demand dry warehouse space in our Marathahalli facility. Rack storage and open floor plans available. 24/7 CCTV, fire suppression, and controlled access. Inventory management software provided (WMS). Suitable for FMCG, electronics, textiles, and e-commerce fulfilment. Weekly billing.',
 45.00, 'INR', 2000, 'pallet-day', 20,
 NULL, 'CloudStore Facility — Marathahalli, Bangalore',
 'CloudStore Warehousing', '+91-9800000020', 'warehouse@cloudstore.in', '11, Marathahalli Bridge, Outer Ring Road, Bangalore - 560037',
 TRUE, FALSE, 1, NOW(), NOW()),

(38, 20, 24,
 'Fulfilment & Last-Mile Dispatch Service',
 'End-to-end order fulfilment: receive, store, pick, pack, and dispatch. Integrated with Shiprocket, Unicommerce, and custom ERPs. SLA: same-day dispatch for orders before 12pm. Suitable for D2C brands and B2B distributors. Per-order pricing model, no minimum commitment.',
 35.00, 'INR', 10000, 'order', 50,
 NULL, 'CloudStore Facility — Marathahalli, Bangalore',
 'CloudStore Warehousing', '+91-9800000020', 'fulfil@cloudstore.in', '11, Marathahalli Bridge, Outer Ring Road, Bangalore - 560037',
 TRUE, FALSE, 1, NOW(), NOW());


-- ================================================================
--  MODULE 3 — SUPPLY HISTORY (one 'created' row per supply)
-- ================================================================

INSERT INTO `org_supply_history` (
  `supply_id`, `version`, `changed_by_org`, `change_type`,
  `item_name`, `item_description`, `price_per_unit`, `currency`,
  `quantity`, `quantity_unit`, `expiry_date`, `category_id`, `is_active`,
  `changed_at`
)
SELECT
  `supply_id`, 1, `org_id`, 'created',
  `item_name`, `item_description`, `price_per_unit`, `currency`,
  `quantity`, `quantity_unit`, `expiry_date`, `category_id`, `is_active`,
  `created_at`
FROM `org_supply`
WHERE `supply_id` BETWEEN 1 AND 38;


-- ================================================================
--  MODULE 4 — DEMAND LISTINGS (org_id 2–20, 2 each = 38 rows)
-- ================================================================

INSERT INTO `org_demand` (
  `demand_id`, `org_id`, `category_id`,
  `item_name`, `item_description`,
  `min_price_per_unit`, `max_price_per_unit`, `currency`,
  `quantity`, `quantity_unit`, `min_order_qty`,
  `required_by_date`, `delivery_location`,
  `is_active`, `is_flagged`, `version`,
  `created_at`, `updated_at`
) VALUES

-- ORG 2 — GreenHarvest Agri
(1, 2, 15,
 'Organic NPK Fertilizer for Vegetable Crops',
 'Looking for bulk organic NPK fertilizer (approx 5:5:5 or equivalent) for supply to our partner farms growing tomatoes, leafy greens, and legumes. Must be FCO compliant, PGPR enriched preferred. 50kg bag packaging. Delivery to Bangalore warehouse required.',
 750.00, 950.00, 'INR', 1000, 'bag', 20,
 '2026-04-30', 'GreenHarvest Warehouse — Bannerghatta Road, JP Nagar, Bangalore - 560078',
 TRUE, FALSE, 1, NOW(), NOW()),

(2, 2, 15,
 'Urea Fertilizer (Agricultural Grade, 46% N)',
 'Require agricultural grade urea, 46% nitrogen content, FCO compliant, prilled form. For distribution to affiliated farms in Karnataka. Preference for suppliers with existing FCO registration and ability to supply in truckload quantities. 45kg or 50kg HDPE bags preferred.',
 600.00, 750.00, 'INR', 2000, 'bag', 100,
 '2026-04-15', 'GreenHarvest Warehouse — JP Nagar, Bangalore',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 3 — SwiftLogix
(3, 3, 24,
 'Dry Warehousing Space — Short Term',
 'Require shared warehouse storage space for overflow FMCG inventory during peak season. Need 100–200 pallet positions, racked or floor storage. Bangalore central or ORR preferred location. WMS integration, 24/7 access, and CCTV security mandatory. Weekly billing model preferred.',
 30.00, 55.00, 'INR', 200, 'pallet-day', 50,
 '2026-03-31', 'Preferred: Marathahalli / Whitefield / Electronic City, Bangalore',
 TRUE, FALSE, 1, NOW(), NOW()),

(4, 3, 22,
 'Corrugated Cardboard Shipping Boxes (Various Sizes)',
 'Need corrugated 3-ply and 5-ply shipping boxes for packaging client consignments. Standard sizes: 12×10×6", 18×12×10", and custom. Minimum 10,000 units. Plain brown or custom print both acceptable. Strong corner crush resistance (CCT >200N). Delivery to our Electronic City hub.',
 18.00, 28.00, 'INR', 25000, 'unit', 2000,
 '2026-03-20', 'SwiftLogix Cargo Hub — Electronic City Phase 1, Bangalore - 560100',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 4 — MediSource India
(5, 4, 16,
 'Pharmaceutical Raw Materials — APIs',
 'Sourcing active pharmaceutical ingredients (APIs) for in-house formulation. Currently requiring: Paracetamol API, Ibuprofen API, and Amoxicillin Trihydrate. WHO-GMP manufacturer preferred. Full DMF documentation, COA, and stability data required. Bulk quantities, quarterly supply contract.',
 NULL, 2500.00, 'INR', 1000, 'kg', 50,
 '2026-05-31', 'MediSource India — Vasanth Nagar, Cunningham Road, Bangalore - 560052',
 TRUE, FALSE, 1, NOW(), NOW()),

(6, 4, 19,
 'Diagnostic IoT Devices — Patient Monitoring',
 'Looking for IoT-enabled patient monitoring devices: SpO2 pulse oximeters, digital BP monitors, and multi-parameter bedside monitors. Must support BLE/Wi-Fi connectivity and cloud data export. CE and BIS certified. For supply to our hospital clients. Quantity: 50–200 units per model.',
 3500.00, 6000.00, 'INR', 150, 'unit', 10,
 '2026-04-30', 'MediSource India — Vasanth Nagar, Bangalore - 560052',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 5 — TechParts Hub
(7, 5, 22,
 'Anti-Static ESD Packaging Bags (Various Sizes)',
 'Require anti-static ESD poly bags for packaging electronic components. Sizes: 5×8cm, 10×15cm, 20×30cm. Minimum 50,000 units. Metallic shielding preferred, zip-lock optional. Pink polyethylene or metallic silver. Manufacturer or importer with CE marking preferred.',
 0.80, 1.50, 'INR', 100000, 'unit', 10000,
 '2026-03-31', 'TechParts Hub — Infantry Road, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

(8, 5, 18,
 'Raspberry Pi 4 Model B (4GB) — Bulk',
 'Looking to source genuine Raspberry Pi 4 Model B, 4GB RAM, in bulk for resale and industrial prototyping clients. Authorised distributor preferred. Min 100 units. Must come with official warranty documentation and ESD packaging. Price inclusive of GST.',
 5500.00, 7000.00, 'INR', 200, 'unit', 20,
 '2026-04-30', 'TechParts Hub — Infantry Road, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 6 — FreshBowl Foods
(9, 6, 12,
 'Whole Wheat Flour (Chakki Atta) for Food Production',
 'Require high-quality chakki atta (whole wheat flour) for use in our ready-to-eat product manufacturing. Protein content 11%+, moisture <14%, ash <1.5%. 50kg bags preferred. FSSAI compliant facility. Fortification (iron, folic acid) desirable. Minimum 200 bags per order.',
 1900.00, 2300.00, 'INR', 500, 'bag', 50,
 '2026-04-01', 'FreshBowl Foods Production Unit — Indiranagar, Bangalore - 560038',
 TRUE, FALSE, 1, NOW(), NOW()),

(10, 6, 11,
 'Fresh Paneer for Food Manufacturing',
 'Looking for bulk fresh paneer (cow milk, 1kg vacuum blocks) for use in our ready-to-eat product line. Fat 20–25%, moisture <70%, shelf life 15 days minimum. Consistent daily supply preferred. Cold delivery to our Indiranagar unit. FSSAI certified supplier mandatory.',
 240.00, 310.00, 'INR', 1000, 'kg', 100,
 NULL, 'FreshBowl Foods — Indiranagar, Bangalore - 560038',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 7 — BuildRight Supplies
(11, 7, 20,
 'TMT Steel Bars for Construction Projects',
 'Require Fe 500D TMT bars in 12mm, 16mm, and 20mm diameters for ongoing RCC residential and commercial construction projects in Bangalore. IS 1786 certified, mill test certificates required. Delivery directly to project sites. 5–10 tonne per delivery slot. Ongoing monthly requirement.',
 60000.00, 72000.00, 'INR', 100, 'tonne', 5,
 '2026-05-31', 'Multiple sites — Yeshwanthpur, Hebbal, and Whitefield, Bangalore',
 TRUE, FALSE, 1, NOW(), NOW()),

(12, 7, 9,
 'Worker Safety PPE Kits for Construction Sites',
 'Require complete PPE kits for construction workers: IS 2925 safety helmet, EN 20471 safety vest, nitrile gloves, safety boots, and dust masks. Approximately 500 kits needed for site mobilisation. Bulk pricing expected. IS/CE certified products mandatory. Delivery to Yeshwanthpur depot.',
 800.00, 1200.00, 'INR', 500, 'kit', 50,
 '2026-03-25', 'BuildRight Supplies Depot — Yeshwanthpur, Tumkur Road, Bangalore - 560022',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 8 — EcoWrap Packaging
(13, 8, 6,
 'Recycled Kraft Paper Pulp for Box Manufacturing',
 'Sourcing recycled/virgin kraft paper pulp for our box manufacturing line. Burst factor 18+, GSM 120–160, moisture content 8–10%. Sustainable sourcing with FSC/PEFC certification preferred. Truckload quantities. Consistent supply contract preferred over spot purchase.',
 38000.00, 50000.00, 'INR', 50, 'tonne', 5,
 '2026-04-30', 'EcoWrap Manufacturing — Peenya Industrial Area Phase 2, Bangalore - 560058',
 TRUE, FALSE, 1, NOW(), NOW()),

(14, 8, 6,
 'Custom Packaging Print Services for Eco Products',
 'Require custom printing services for our eco-packaging range. Need offset printing on kraft and bagasse substrates. Must be done using water-based or soy-based inks (not solvent). 4-colour CMYK, optional spot UV. MOQ 5000 units. Turnaround 7–10 days. Eco print credentials required.',
 6.00, 10.00, 'INR', 50000, 'unit', 5000,
 '2026-04-15', 'EcoWrap Packaging — Peenya Industrial Area, Bangalore - 560058',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 9 — PharmaLink India
(15, 9, 22,
 'Pharmaceutical Blister Packaging (PVC/Aluminium Foil)',
 'Require pharmaceutical-grade blister packaging: PVC/PVDC base film (250 micron) and aluminium foil lidding (20 micron) for tablet and capsule packaging. GMP compliant supplier essential. COA, migration test reports required. Monthly requirement ~50 lakh blister units across our product lines.',
 0.15, 0.30, 'INR', 5000000, 'unit', 100000,
 '2026-04-30', 'PharmaLink India — Rajajinagar Industrial Town, Bangalore - 560044',
 TRUE, FALSE, 1, NOW(), NOW()),

(16, 9, 23,
 'Pharmaceutical Cold Chain Storage (2°C–8°C)',
 'Require dedicated cold room storage at 2–8°C for temperature-sensitive pharmaceuticals including vaccines, biologics, and insulin products. FSSAI and pharma cold chain guidelines compliant. 24/7 temperature monitoring with data loggers. 50–100 pallet positions. Bangalore location essential.',
 80.00, 110.00, 'INR', 100, 'pallet-day', 10,
 NULL, 'Near Rajajinagar / Peenya / Yeshwanthpur, Bangalore',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 10 — UrbanTextiles
(17, 10, 6,
 'Poly Bag Garment Packaging (Various Sizes)',
 'Require LDPE poly bags for garment packaging: sizes 10×14", 12×16", 14×20" with self-seal strip. Min 100,000 units. Transparent preferred. Custom printing (1-colour logo print) acceptable. Price per 1000 units. Supplier should be able to maintain weekly replenishment.',
 180.00, 280.00, 'INR', 500000, 'unit', 10000,
 '2026-04-30', 'UrbanTextiles Warehouse — Commercial Street, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

(18, 10, 8,
 'Sewing Thread (Polyester, Various Colours)',
 'Looking for high-tenacity polyester sewing thread, count 40/2 and 60/3, in assorted colours (minimum 20 shades including basics). 5000m cones. Suitable for industrial lockstitch and overlock machines. Consistent dyeing, no bleeding. MOQ 100 cones per shade.',
 85.00, 130.00, 'INR', 5000, 'cone', 100,
 '2026-04-30', 'UrbanTextiles — Commercial Street, Shivaji Nagar, Bangalore - 560001',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 11 — SteelForge Industries
(19, 11, 9,
 'Industrial PPE — Helmets, Gloves, and Face Shields',
 'Require PPE consumables for our steel plant workers: IS 2925 hard hats (50 units/month), cut-resistant gloves Level D (200 pairs/month), and auto-darkening welding helmets (20 units). ANSI/IS certified products only. Ongoing monthly procurement. Competitive pricing for contract supply.',
 NULL, 1500.00, 'INR', 300, 'unit', 50,
 NULL, 'SteelForge Industries — Bommasandra Industrial Area, Bangalore - 560099',
 TRUE, FALSE, 1, NOW(), NOW()),

(20, 11, 21,
 'Portland Cement for Plant Infrastructure Works',
 'Require OPC 53 grade Portland cement for ongoing plant expansion and flooring works at our Bommasandra facility. IS 12269 compliant. 50kg bags. Approximately 200 bags per month. Supplier must have Bangalore delivery and invoice with GST registration.',
 350.00, 420.00, 'INR', 500, 'bag', 50,
 '2026-05-31', 'SteelForge Plant — Bommasandra Industrial Area, Bangalore - 560099',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 12 — ColdChain Express
(21, 12, 17,
 'Refrigeration Compressor Units (Semi-Hermetic)',
 'Require semi-hermetic or scroll refrigeration compressors for cold room maintenance and expansion. Capacity range 2TR to 10TR. R-404A or R-448A (low GWP) refrigerant compatible. Major brands (Bitzer, Copeland, Carlyle) preferred. 1-year warranty from supplier. Delivery to Whitefield facility.',
 45000.00, 95000.00, 'INR', 10, 'unit', 1,
 '2026-06-30', 'ColdChain Express — Whitefield Main Road, ITPL, Bangalore - 560066',
 TRUE, FALSE, 1, NOW(), NOW()),

(22, 12, 5,
 'PUF Insulation Panels for Cold Room Construction',
 'Sourcing pre-fabricated PUF (polyurethane foam) insulation panels for cold room construction. Thickness 60mm–150mm, density 42kg/m³, thermal conductivity <0.022 W/mK. GI steel facing on both sides. Custom panel sizes. Quantity: 500 m² approx. Delivery to Whitefield, Bangalore.',
 1800.00, 2600.00, 'INR', 500, 'sqm', 50,
 '2026-05-31', 'ColdChain Express — ITPL, Whitefield, Bangalore - 560066',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 13 — Sunrise Dairy Co.
(23, 13, 23,
 'Refrigerated Cold Storage for Dairy Products (2°C–8°C)',
 'Need cold storage facility for daily dairy dispatch buffer — approx 50–80 pallets of milk cans and paneer blocks maintained at 2–8°C. FSSAI licensed facility, daily access required (5am–10pm). Yelahanka or North Bangalore preferred. Monthly contract with flexible scaling.',
 75.00, 105.00, 'INR', 80, 'pallet-day', 20,
 NULL, 'Preferred: Yelahanka / Hebbal / Devanahalli area, Bangalore',
 TRUE, FALSE, 1, NOW(), NOW()),

(24, 13, 22,
 'Dairy Packaging — Milk Pouches and Paneer Wraps',
 'Require food-grade flexible packaging: LLDPE milk pouches (500ml and 1L, 60–70 micron) and stretch-wrap vacuum film for 1kg paneer blocks. Must be FSSAI compliant, food-safe, and approved for direct contact. Custom print (logo, MRP) acceptable. MOQ 100,000 units for pouches.',
 0.85, 1.40, 'INR', 500000, 'unit', 50000,
 '2026-04-15', 'Sunrise Dairy Co. — Yelahanka New Town, Bangalore - 560064',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 14 — NexGen Electronics
(25, 14, 18,
 'Electronic Components — Microcontrollers and Sensors',
 'Looking for bulk supply of microcontrollers (Arduino Uno, ESP32, Raspberry Pi), environmental sensors (temperature, humidity, CO2), and passive kits for resale and system integration projects. Authorised distributor preferred. ESD packaging mandatory. Monthly purchase order arrangement.',
 300.00, 550.00, 'INR', 2000, 'unit', 100,
 NULL, 'NexGen Electronics — Koramangala 5th Block, Bangalore - 560095',
 TRUE, FALSE, 1, NOW(), NOW()),

(26, 14, 17,
 'Digital Medical Diagnostic Devices for Healthcare Clients',
 'Sourcing digital diagnostic devices for resale to hospitals and diagnostic centres: pulse oximeters, digital thermometers, portable ECG monitors, and glucometers. BIS/CE certified. Reputable brands preferred. Warranty documentation required. Demand is ongoing with monthly purchase orders.',
 1800.00, 5500.00, 'INR', 300, 'unit', 20,
 NULL, 'NexGen Electronics — Koramangala, Bangalore - 560095',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 15 — PureGrain Mills
(27, 15, 12,
 'Premium Raw Wheat Grain for Milling',
 'Require high-quality raw wheat grain (HYV varieties — Lok-1, GW-496 or equivalent) for milling into atta and semolina. Moisture content <12%, protein 11%+, test weight >76kg/hl. Clean, free from foreign matter. 50kg jute bags or loose truck delivery both acceptable.',
 20.00, 26.00, 'INR', 20000, 'kg', 1000,
 '2026-04-01', 'PureGrain Mills — Kengeri Satellite Town, Bangalore - 560060',
 TRUE, FALSE, 1, NOW(), NOW()),

(28, 15, 22,
 'Multi-Wall Paper Bags for Flour Packaging (25kg & 50kg)',
 'Require multi-wall kraft paper bags (2-ply and 3-ply) with PE inner lining for flour packaging. Sizes: 25kg and 50kg. Burst strength minimum 500 kPa. Food-grade, moisture-resistant inner. Custom print (brand, nutritional info, FSSAI number) required. MOQ 10,000 bags per size.',
 14.00, 22.00, 'INR', 50000, 'unit', 5000,
 '2026-04-15', 'PureGrain Mills — Kengeri Satellite Town, Bangalore - 560060',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 16 — AquaFlow Systems
(29, 16, 20,
 'SS 304 Pipes and MS Structural Steel for Pipeline Projects',
 'Require SS 304 seamless and welded pipes (OD 1" to 4", various schedules) and mild steel structural sections (angles, channels, beams) for water treatment plant construction projects. IS 1161 and IS 2062 compliant. Bulk requirement for 3 simultaneous project sites in Bangalore.',
 400.00, 600.00, 'INR', 10000, 'metre', 500,
 '2026-05-31', 'AquaFlow Project Sites — Bangalore (multiple locations)',
 TRUE, FALSE, 1, NOW(), NOW()),

(30, 16, 18,
 'Variable Frequency Drives (VFD) for Pump Control',
 'Sourcing single and three-phase variable frequency drives (VFDs) for centrifugal pump speed control. Power range: 0.75kW to 22kW. Brands: ABB, Siemens, Danfoss preferred. IP55 enclosure, Modbus/RS485 communication. Ongoing project requirement — 20–50 units per quarter.',
 8000.00, 35000.00, 'INR', 80, 'unit', 5,
 '2026-05-31', 'AquaFlow Systems — Domlur Layout, Bangalore - 560071',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 17 — SafetyFirst Equipment
(31, 17, 8,
 'High-Visibility Safety Fabric for PPE Manufacturing',
 'Require EN ISO 20471 Class 2 high-visibility neon yellow/orange polyester-cotton fabric for manufacturing safety vests and jackets. Retro-reflective tape attachment compatible. 160–180 GSM, 57-inch width. Consistent dye lot. MOQ 5000 metres. Ongoing quarterly supply preferred.',
 280.00, 360.00, 'INR', 20000, 'metre', 1000,
 NULL, 'SafetyFirst Equipment — Mysore Road, RV Road, Bangalore - 560004',
 TRUE, FALSE, 1, NOW(), NOW()),

(32, 17, 5,
 'ABS Plastic Granules for Helmet Shell Manufacturing',
 'Sourcing ABS (Acrylonitrile Butadiene Styrene) plastic granules for injection moulding of safety helmet shells. MFI 10–20 g/10min, Izod impact strength >200 J/m. Colour: natural/off-white for in-house pigmentation. Food-grade or industrial grade. 500kg per batch, ongoing monthly supply.',
 165.00, 220.00, 'INR', 5000, 'kg', 500,
 NULL, 'SafetyFirst Equipment — Mysore Road, Bangalore - 560004',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 18 — BioGrow Fertilizers
(33, 18, 6,
 'HDPE Woven Bags for Fertilizer Packaging (50kg)',
 'Require HDPE woven sacks (50kg capacity) for packaging fertilizer. 90 GSM fabric, UV stabilised, laminated inner for moisture protection. Custom print (brand, nutrient content, FCO details). MOQ 50,000 bags. Supplier should have prior experience in agri/fertilizer packaging.',
 22.00, 32.00, 'INR', 200000, 'unit', 10000,
 '2026-04-30', 'BioGrow Fertilizers — Hebbal Kempapura, Bangalore - 560024',
 TRUE, FALSE, 1, NOW(), NOW()),

(34, 18, 2,
 'Sulphur (Agricultural Grade) for Fertilizer Blending',
 'Require agricultural grade sulphur (elemental sulphur, 99.5% purity, bentonite pastille or powder form) for blending into our fertilizer products. FCO compliant. Moisture <0.1%, particle size per grade. Truckload quantities monthly. MSDS and COA with each consignment.',
 32000.00, 42000.00, 'INR', 50, 'tonne', 5,
 '2026-04-30', 'BioGrow Fertilizers — Hebbal, Bangalore - 560024',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 19 — PrintWave Media
(35, 19, 6,
 'A4 Copier Paper (75 GSM) — Bulk Reams',
 'Require A4 75 GSM copier paper for office and print operations. Brand: ITC Classique, JK Copier, or equivalent. 500 sheets per ream, 5 reams per box. Brightness 102%+ CIE. Consistent whiteness and smoothness essential. Minimum 500 boxes per order. Monthly procurement.',
 210.00, 270.00, 'INR', 2000, 'box', 100,
 NULL, 'PrintWave Media — Banashankari 2nd Stage, Bangalore - 560070',
 TRUE, FALSE, 1, NOW(), NOW()),

(36, 19, 4,
 'Printing Ink — CMYK Offset Ink Set',
 'Require 4-colour CMYK offset printing ink (Cyan, Magenta, Yellow, Key Black) for our printing presses. Low-odour, fast-drying formula for coated and uncoated paper. 2.5kg cans or 5kg cans. Brands: Huber, Flint, or equivalent quality. Monthly ongoing requirement, 20–40 kg per colour.',
 2800.00, 4500.00, 'INR', 200, 'kg', 20,
 NULL, 'PrintWave Media — Banashankari, Bangalore - 560070',
 TRUE, FALSE, 1, NOW(), NOW()),

-- ORG 20 — CloudStore Warehousing
(37, 20, 9,
 'Warehouse Safety Equipment — Signs, Barriers, and Fire',
 'Require safety equipment for our warehousing facilities: fire extinguishers (ABC 4kg, ISI marked), photoluminescent emergency exit signs, yellow safety bollards, forklift aisle markers, and loading dock barriers. Bundle/kit pricing preferred. IS/CE certified. Delivery to Marathahalli facility.',
 NULL, 4500.00, 'INR', 100, 'kit', 10,
 '2026-03-31', 'CloudStore Warehousing — Marathahalli Bridge, Outer Ring Road, Bangalore - 560037',
 TRUE, FALSE, 1, NOW(), NOW()),

(38, 20, 7,
 '3PL Logistics Partner for Inter-City Dispatches',
 'Looking for a 3PL logistics partner for B2B inter-city dispatch from our Marathahalli fulfilment centre. Routes: Bangalore to Chennai, Hyderabad, Pune, and Mumbai. FTL and LTL both needed. Real-time tracking API integration required. SLA: 72-hour delivery. Ongoing contract arrangement.',
 14.00, 22.00, 'INR', 10000, 'kg', 500,
 NULL, 'CloudStore Fulfilment Centre — Marathahalli, Outer Ring Road, Bangalore - 560037',
 TRUE, FALSE, 1, NOW(), NOW());


-- ================================================================
--  MODULE 5 — DEMAND HISTORY (one 'created' row per demand)
-- ================================================================

INSERT INTO `org_demand_history` (
  `demand_id`, `version`, `changed_by_org`, `change_type`,
  `item_name`, `item_description`,
  `min_price_per_unit`, `max_price_per_unit`, `currency`,
  `quantity`, `quantity_unit`, `required_by_date`, `category_id`, `is_active`,
  `changed_at`
)
SELECT
  `demand_id`, 1, `org_id`, 'created',
  `item_name`, `item_description`,
  `min_price_per_unit`, `max_price_per_unit`, `currency`,
  `quantity`, `quantity_unit`, `required_by_date`, `category_id`, `is_active`,
  `created_at`
FROM `org_demand`
WHERE `demand_id` BETWEEN 1 AND 38;
