const img = (id, w = 900, h = 1125) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const categories = [
  {
    name: 'T-Shirts',
    description: 'Heavyweight tees built for training and the street.',
    image: img('1521572163474-6864f9cf17ab', 600, 750),
    sortOrder: 1,
  },
  {
    name: 'Hoodies',
    description: 'Fleece layers for cold mornings and late nights.',
    image: img('1556821840-3a63f95609a7', 600, 750),
    sortOrder: 2,
  },
  {
    name: 'Joggers',
    description: 'Tapered joggers that move with you.',
    image: img('1552902865-b72c031ac5ea', 600, 750),
    sortOrder: 3,
  },
  {
    name: 'Shorts',
    description: 'Lightweight shorts for leg day and beyond.',
    image: img('1591195853828-11db59a44f6b', 600, 750),
    sortOrder: 4,
  },
  {
    name: 'Athletic Wear',
    description: 'Compression and performance base layers.',
    image: img('1571019613454-1cb2f99b2d8b', 600, 750),
    sortOrder: 5,
  },
  {
    name: 'Streetwear',
    description: 'Oversized fits and statement pieces.',
    image: img('1503341504253-dff4815485f1', 600, 750),
    sortOrder: 6,
  },
];

// Deterministic pseudo-random stock so re-seeding gives the same numbers
const stockFor = (seed) => [14, 3, 8, 12, 0, 20, 25, 6, 18][seed % 9];

export const buildVariants = (colors, sizes = ['S', 'M', 'L', 'XL']) =>
  colors.flatMap((color, ci) =>
    sizes.map((size, si) => ({
      size,
      color,
      stock: stockFor(ci * 7 + si * 3 + color.length),
      sku: `${color.slice(0, 3).toUpperCase()}-${size}`,
    }))
  );

// `category` holds the category *name*; seed.js swaps it for the ObjectId.
export const products = [
  {
    name: 'GRVTY Core Hoodie',
    category: 'Hoodies',
    price: 4500,
    compareAtPrice: 5200,
    description:
      'Our signature fleece hoodie. A 400gsm brushed-back cotton blend with a relaxed fit, double-lined hood and kangaroo pocket — clean enough for the street, warm enough for a 6am session.',
    details: ['400gsm cotton/poly fleece', 'Relaxed fit — size down for a closer fit', 'Double-lined hood', 'Machine wash cold'],
    images: [img('1556821840-3a63f95609a7'), img('1620799140408-edc6dcb6d633'), img('1578587018452-892bacefd3f2')],
    variants: buildVariants(['Black', 'Grey'], ['S', 'M', 'L', 'XL', 'XXL']),
    tags: ['best-seller', 'featured'],
    soldCount: 142,
  },
  {
    name: 'GRVTY Oversized Tee',
    category: 'T-Shirts',
    price: 2200,
    description:
      'A heavyweight 260gsm oversized tee with dropped shoulders and a boxy cut. Pre-shrunk so the fit you buy is the fit you keep.',
    details: ['260gsm 100% combed cotton', 'Oversized boxy fit', 'Dropped shoulders', 'Pre-shrunk'],
    images: [img('1521572163474-6864f9cf17ab'), img('1576566588028-4147f3842f27'), img('1618354691373-d851c5c3a990')],
    variants: buildVariants(['White', 'Black', 'Sand']),
    tags: ['best-seller', 'featured'],
    soldCount: 210,
  },
  {
    name: 'GRVTY Tapered Joggers',
    category: 'Joggers',
    price: 3200,
    description:
      'Athletic-tapered joggers with four-way stretch, zip pockets and ribbed cuffs. Built to handle squats and still look sharp after.',
    details: ['Four-way stretch fabric', 'Zip side pockets', 'Elastic waist with drawcord', 'Tapered leg'],
    images: [img('1552902865-b72c031ac5ea'), img('1506629082955-511b1aa562c8')],
    variants: buildVariants(['Black', 'Olive']),
    tags: ['best-seller', 'new-drop'],
    soldCount: 98,
  },
  {
    name: 'GRVTY Compression Tights',
    category: 'Athletic Wear',
    price: 2800,
    description:
      'Supportive compression base layer that reduces muscle vibration and keeps you locked in through every rep.',
    details: ['Moisture-wicking', 'Flatlock seams', 'Compression fit', 'Squat-proof'],
    images: [img('1517344884509-a0c97ec11bcc'), img('1571019613454-1cb2f99b2d8b')],
    variants: buildVariants(['Black']),
    tags: ['new-drop', 'featured'],
    soldCount: 64,
  },
  {
    name: 'GRVTY Training Shorts',
    category: 'Shorts',
    price: 1900,
    description:
      'Lightweight 7" training shorts with a built-in liner and a hidden phone pocket. Quick-dry fabric for summer sessions.',
    details: ['7" inseam', 'Built-in liner', 'Quick-dry fabric', 'Hidden phone pocket'],
    images: [img('1591195853828-11db59a44f6b'), img('1534438327276-14e5300c3a48')],
    variants: buildVariants(['Black', 'Navy']),
    tags: ['summer-edit', 'new-drop'],
    soldCount: 77,
  },
  {
    name: 'GRVTY Street Crew',
    category: 'Streetwear',
    price: 3800,
    description:
      'A boxy crewneck sweatshirt with a tonal GRVTY chest print. Heavy fabric, clean lines, made for layering.',
    details: ['350gsm loopback cotton', 'Boxy cropped fit', 'Tonal chest print', 'Ribbed cuffs and hem'],
    images: [img('1503341504253-dff4815485f1'), img('1529374255404-311a2a4f1fd9')],
    variants: buildVariants(['Black', 'Off White']),
    tags: ['new-drop'],
    soldCount: 41,
  },
  {
    name: 'GRVTY Performance Tank',
    category: 'Athletic Wear',
    price: 1600,
    description:
      'A breathable muscle tank with deep armholes for full range of motion. Your go-to for push day.',
    details: ['Mesh-knit breathable fabric', 'Deep-cut armholes', 'Slim fit', 'Anti-odour finish'],
    images: [img('1581009146145-b5ef050c2e1e'), img('1517836357463-d25dfeac3438')],
    variants: buildVariants(['Black', 'White', 'Grey']),
    tags: ['summer-edit'],
    soldCount: 56,
  },
  {
    name: 'GRVTY Essential Tee',
    category: 'T-Shirts',
    price: 1800,
    description:
      'A regular-fit everyday tee in soft 200gsm cotton. The foundation piece for any GRVTY fit.',
    details: ['200gsm cotton jersey', 'Regular fit', 'Ribbed crew neck', 'Machine wash'],
    images: [img('1576566588028-4147f3842f27'), img('1521572163474-6864f9cf17ab')],
    variants: buildVariants(['White', 'Black', 'Navy'], ['XS', 'S', 'M', 'L', 'XL']),
    tags: ['summer-edit'],
    soldCount: 120,
  },
  {
    name: 'GRVTY Zip Hoodie',
    category: 'Hoodies',
    price: 4900,
    description:
      'Full-zip hoodie with a structured hood and metal hardware. Throw it over a tank after training or wear it out.',
    details: ['380gsm fleece', 'Metal two-way zip', 'Regular fit', 'Side pockets'],
    images: [img('1620799140408-edc6dcb6d633'), img('1556821840-3a63f95609a7')],
    variants: buildVariants(['Charcoal', 'Black']),
    tags: ['new-drop'],
    soldCount: 33,
  },
  {
    name: 'GRVTY Cargo Joggers',
    category: 'Joggers',
    price: 3600,
    description:
      'Utility cargo joggers with snap pockets and an adjustable cuff. Street-ready, gym-tested.',
    details: ['Ripstop cotton blend', 'Snap cargo pockets', 'Adjustable toggle cuffs', 'Relaxed taper'],
    images: [img('1506629082955-511b1aa562c8'), img('1552902865-b72c031ac5ea')],
    variants: buildVariants(['Olive', 'Black', 'Sand']),
    tags: ['featured'],
    soldCount: 47,
  },
  {
    name: 'GRVTY Mesh Shorts',
    category: 'Shorts',
    price: 1700,
    description:
      'Classic double-layer mesh shorts with a 9" inseam. Breathable and loose for basketball or the street.',
    details: ['Double-layer mesh', '9" inseam', 'Elastic waistband', 'Side pockets'],
    images: [img('1534438327276-14e5300c3a48'), img('1591195853828-11db59a44f6b')],
    variants: buildVariants(['Black', 'White']),
    tags: ['summer-edit'],
    soldCount: 29,
  },
  {
    name: 'GRVTY Graphic Oversized Tee',
    category: 'Streetwear',
    price: 2600,
    description:
      'Oversized heavyweight tee with a back graphic print. Limited run — once it is gone, it is gone.',
    details: ['260gsm cotton', 'Oversized fit', 'Screen-printed back graphic', 'Limited edition'],
    images: [img('1618354691373-d851c5c3a990'), img('1529374255404-311a2a4f1fd9')],
    variants: buildVariants(['Black', 'White'], ['M', 'L', 'XL']),
    tags: ['new-drop', 'best-seller'],
    soldCount: 88,
  },
];
