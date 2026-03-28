'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default function CategoryPage() {
    const { slug } = useParams();
    const searchParams = useSearchParams();

    const { data: categoryProducts, isLoading } = useQuery({
        queryKey: ['categoryProducts', slug],
        queryFn: async () => {
            const res = await productsAPI.getCategoryProducts(slug);
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });

    const { data: subcategories } = useQuery({
        queryKey: ['subcategories', slug],
        queryFn: async () => {
            const res = await productsAPI.getCategorySubcategories(slug);
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });

    const products = categoryProducts?.results || categoryProducts || [];
    const subs = subcategories || [];
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <p className="text-gold text-sm tracking-[0.3em] uppercase font-jost font-light mb-3">Collection</p>
                <h1 className="font-cormorant text-4xl sm:text-5xl text-noir">{categoryName}</h1>
            </div>

            {/* Subcategories */}
            {subs.length > 0 && (
                <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                    <Link
                        href={`/categories/${slug}`}
                        className="px-5 py-2 text-sm bg-deep-rose text-white font-jost tracking-wide"
                    >
                        All
                    </Link>
                    {subs.map((sub) => (
                        <Link
                            key={sub.id}
                            href={`/categories/${slug}?sub=${sub.slug}`}
                            className="px-5 py-2 text-sm border border-blush text-mid hover:text-noir hover:border-deep-rose/30 font-jost tracking-wide transition-colors"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Products grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="skeleton aspect-square" />
                            <div className="skeleton h-4 w-3/4" />
                            <div className="skeleton h-4 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
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
