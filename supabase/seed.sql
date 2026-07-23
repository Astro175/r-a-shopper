INSERT INTO suppliers (user_id, id, name, location, logo_url)
VALUES
    (
        '4ffaae7c-d674-4178-a0c4-b6de81d528ba',
        '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
        'TechHub Electronics',
        'Lagos, Nigeria',
        'https://picsum.photos/seed/techhub/200/200'
    ),
    (
        '4ffaae7c-d674-4178-a0c4-b6de81d528ba',
        '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
        'PowerTech Solutions',
        'Ibadan, Nigeria',
        'https://picsum.photos/seed/greenvalley/200/200'
    ),
    (
        '4ffaae7c-d674-4178-a0c4-b6de81d528ba',
        'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
        'AutoMech Industries',
        'Abuja, Nigeria',
        'https://picsum.photos/seed/urbanfashion/200/200'
    );

INSERT INTO products (
    seller_id,
    name,
    price,
    quantity,
    description,
    category,
    rating,
    image_url
)
VALUES
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Industrial Digital Multimeter',
    125000.50,
    40,
    'Professional-grade digital multimeter for electrical diagnostics and industrial measurements.',
    'Measurement Instruments',
    4.8,
    'https://picsum.photos/seed/product1/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'CAT6 Network Cable Tester',
    89500.00,
    30,
    'Network cable continuity and fault tester for installation and troubleshooting.',
    'Networking Equipment',
    4.6,
    'https://picsum.photos/seed/product2/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Precision Screwdriver Set',
    58750.99,
    120,
    '32-piece precision screwdriver kit for electronics and mechanical repairs.',
    'Hand Tool',
    4.7,
    'https://picsum.photos/seed/product3/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Programmable Logic Controller',
    1250000.00,
    15,
    'Industrial PLC controller for automation and manufacturing applications.',
    'Control Systems',
    4.9,
    'https://picsum.photos/seed/product4/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Bench Power Supply 30V',
    385000.75,
    20,
    'Adjustable DC bench power supply for electronics testing and development.',
    'Power System',
    4.8,
    'https://picsum.photos/seed/product5/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Industrial Ethernet Switch',
    215999.99,
    18,
    'Rugged industrial Ethernet switch for reliable network connections.',
    'Networking Equipment',
    4.5,
    'https://picsum.photos/seed/product6/600/600'
),
(
    '8d8b7f1d-3e8a-47d8-8c5f-4b3d6c1a9f01',
    'Digital Clamp Meter',
    145500.00,
    28,
    'High accuracy clamp meter for electrical current measurement.',
    'Testing Equipment',
    4.7,
    'https://picsum.photos/seed/product7/600/600'
),

(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Heavy Duty Work Gloves',
    65000.50,
    150,
    'Durable protective gloves designed for industrial and construction work.',
    'Safety Equipment',
    4.4,
    'https://picsum.photos/seed/product8/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Protective Safety Helmet',
    87500.00,
    90,
    'Impact-resistant industrial safety helmet for workplace protection.',
    'Safety Equipment',
    4.6,
    'https://picsum.photos/seed/product9/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Adjustable Pipe Wrench',
    112500.25,
    55,
    'Heavy-duty adjustable pipe wrench for plumbing and mechanical work.',
    'General Tools',
    4.5,
    'https://picsum.photos/seed/product10/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Laser Distance Meter',
    98500.00,
    35,
    'Compact laser measuring device for accurate distance calculations.',
    'Measurement Instruments',
    4.7,
    'https://picsum.photos/seed/product11/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Cordless Impact Drill',
    425000.99,
    25,
    'Brushless cordless impact drill for professional construction tasks.',
    'General Tools',
    4.8,
    'https://picsum.photos/seed/product12/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Insulated Pliers Set',
    78500.75,
    65,
    'VDE insulated pliers set for electrical maintenance work.',
    'Hand Tool',
    4.6,
    'https://picsum.photos/seed/product13/600/600'
),
(
    '2c4a5e8f-91b0-4f7c-9d32-7b9f1a6e3d42',
    'Voltage Detector Pen',
    54500.00,
    110,
    'Non-contact AC voltage detector for electrical safety checks.',
    'Testing Equipment',
    4.5,
    'https://picsum.photos/seed/product14/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    '6-Axis Robotic Arm Kit',
    1500000.00,
    8,
    'Educational robotic arm kit for automation and robotics projects.',
    'Robotics and Automation',
    4.9,
    'https://picsum.photos/seed/product15/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    'Industrial Servo Motor',
    695000.50,
    16,
    'High torque servo motor for precision automation systems.',
    'Robotics and Automation',
    4.8,
    'https://picsum.photos/seed/product16/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    'Hydraulic Crimping Tool',
    275000.00,
    24,
    'Hydraulic cable lug crimping tool for electrical installations.',
    'Specialized Equipment',
    4.7,
    'https://picsum.photos/seed/product17/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    'Digital Oscilloscope',
    895000.99,
    10,
    'Professional digital storage oscilloscope for electronic testing.',
    'Testing Equipment',
    4.9,
    'https://picsum.photos/seed/product18/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    'Industrial Control Relay',
    62500.25,
    80,
    'DIN rail control relay for industrial automation systems.',
    'Control Systems',
    4.4,
    'https://picsum.photos/seed/product19/600/600'
),
(
    'f7a1d6c3-5b2e-4a98-8f10-9e4c7d2b5a63',
    'Portable Generator 3.5kW',
    485000.50,
    12,
    'Fuel-efficient portable generator for backup power supply.',
    'Power System',
    4.8,
    'https://picsum.photos/seed/product20/600/600'
);