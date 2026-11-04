export const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 5000;
export const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE) || 250;

export const formatPrice = (value = 0) => `PKR ${Number(value).toLocaleString('en-PK')}`;

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

export const discountPercent = (price, compareAtPrice) =>
  compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;

export const cn = (...classes) => classes.filter(Boolean).join(' ');
