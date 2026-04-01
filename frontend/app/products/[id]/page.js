import ProductDetailClient from '@/components/product/ProductDetailClient';

// Cache all product pages for 1 hour
export const revalidate = 3600;

// Pre-build product routes at deploy time
export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
        if (!res.ok) return [];
        const data = await res.json();
        const products = data.data?.results || data.data || [];
        return products.map((p) => ({
            id: p.slug,
        }));
    } catch (e) {
        return [];
    }
}

async function getProduct(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`, {
            next: { tags: ['products'] }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}

export default async function ProductDetailPage({ params }) {
    // Note: The params.id is actually the product slug based on your Django routing
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <h1 className="font-cormorant text-3xl text-noir">Product not found</h1>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
