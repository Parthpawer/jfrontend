import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

// Cache all category pages for 1 hour
export const revalidate = 3600;

// Pre-build all category routes at deploy time for instant load
export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
        if (!res.ok) return [];
        const data = await res.json();
        const categories = data.data?.results || data.data || [];
        return categories.map((cat) => ({
            slug: cat.slug,
        }));
    } catch (e) {
        return [];
    }
}

async function getCategoryProducts(slug, sub) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}/products/`);
    if (sub) url.searchParams.append('sub', sub);

    const res = await fetch(url.toString(), {
        next: { tags: ['products'] }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.results || data.data || [];
}

async function getSubcategories(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}/subcategories/`, {
        next: { tags: ['categories'] }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
}

export default async function CategoryPage({ params, searchParams }) {
    const { slug } = params;

    // Server-side fetching — runs strictly on the Edge/Server!
    const [products, subs] = await Promise.all([
        getCategoryProducts(slug, searchParams?.sub),
        getSubcategories(slug)
    ]);

    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-gold text-sm tracking-[0.3em] uppercase font-jost font-light mb-3">Collection</p>
                <h1 className="font-cormorant text-4xl sm:text-5xl text-noir">{categoryName}</h1>
            </div>

            {/* Subcategories Filters */}
            {subs.length > 0 && (
                <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                    <Link
                        href={`/categories/${slug}`}
                        className={`px-5 py-2 text-sm font-jost tracking-wide transition-colors ${!searchParams?.sub
                                ? 'bg-deep-rose text-white'
                                : 'border border-blush text-mid hover:text-noir hover:border-deep-rose/30'
                            }`}
                    >
                        All
                    </Link>
                    {subs.map((sub) => (
                        <Link
                            key={sub.id}
                            href={`/categories/${slug}?sub=${sub.slug}`}
                            className={`px-5 py-2 text-sm font-jost tracking-wide transition-colors ${searchParams?.sub === sub.slug
                                    ? 'bg-deep-rose text-white'
                                    : 'border border-blush text-mid hover:text-noir hover:border-deep-rose/30'
                                }`}
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Products grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-mid font-light text-lg">No products found in this collection</p>
                    <Link href="/categories" className="inline-block mt-4 text-deep-rose text-sm hover:underline">
                        Browse all collections
                    </Link>
                </div>
            )}
        </div>
    );
}
