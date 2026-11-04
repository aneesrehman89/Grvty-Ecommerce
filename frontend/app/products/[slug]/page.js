import ProductDetail from '@/components/product/ProductDetail';
import { API_URL } from '@/lib/api';

// Server-side fetch for SEO metadata only — the page itself loads through React Query
async function getProductMeta(slug) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProductMeta(params.slug);
  if (!product) return { title: 'Product' };

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.slice(0, 1),
    },
  };
}

export default function ProductPage({ params }) {
  return <ProductDetail slug={params.slug} />;
}
