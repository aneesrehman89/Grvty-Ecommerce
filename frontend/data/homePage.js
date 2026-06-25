
import review1 from '@/assets/review-1.jpg';
import review2 from '@/assets/review-2.jpg';
import review3 from '@/assets/review-3.jpg';   

export const CATEGORIES = [
  { name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop&q=80' },
  { name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop&q=80' },
  { name: 'Joggers', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=750&fit=crop&q=80' },
  { name: 'Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=750&fit=crop&q=80' },
  { name: 'Athletic Wear', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&fit=crop&q=80' },
  { name: 'Streetwear', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=750&fit=crop&q=80' },
];

export const CORE_PRODUCTS = [
  { id: '1', name: 'GRVTY Core Hoodie', price: 'PKR 4,500', desc: 'Clean fleece layer for gym and street', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=625&fit=crop&q=80' },
  { id: '2', name: 'GRVTY Oversized Tee', price: 'PKR 2,200', desc: 'Heavyweight oversized everyday essential', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=625&fit=crop&q=80' },
  { id: '3', name: 'GRVTY Tapered Joggers', price: 'PKR 3,200', desc: 'Athletic taper with all-day comfort', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&h=625&fit=crop&q=80' },
  { id: '4', name: 'GRVTY Compression Tights', price: 'PKR 2,800', desc: 'Supportive performance base layer', img: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=500&h=625&fit=crop&q=80' },
];

export const BEST_SELLERS = [
  { id: '1', name: 'GRVTY Core Hoodie', price: 'PKR 4,500', desc: 'Clean fleece layer for gym and street', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&q=80' },
  { id: '2', name: 'GRVTY Oversized Tee', price: 'PKR 2,200', desc: 'Heavyweight oversized everyday essential', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80' },
  { id: '3', name: 'GRVTY Tapered Joggers', price: 'PKR 3,200', desc: 'Athletic taper with all-day comfort', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&h=500&fit=crop&q=80' },
];

export const REVIEWS = [
  { img: review1, city: 'Karachi, PK', rate: 5, body: 'Bought the oversized tee and absolutely love it. Heavyweight cotton feels premium, the fit is exactly as described, and the stitching has held up through dozens of washes. Easily the best gym tee I own.', product: 'GRVTY OVERSIZED TEE' },
  { img: review2, city: 'Lahore, PK', rate: 5, body: "The hoodie is unreal. Fabric is thick but breathable, the cut sits perfectly on my shoulders, and the print hasn't faded at all. I get compliments every time I wear it to the gym or out with friends.", product: 'GRVTY CORE HOODIE' },
  { img: review3, city: 'Islamabad, PK', rate: 4, body: 'Super comfortable joggers with a clean taper that actually fits athletic legs. Fabric stretches well during squats and feels premium. Took off one star only because I wish there was a longer length option.', product: 'GRVTY TAPERED JOGGERS' },
];