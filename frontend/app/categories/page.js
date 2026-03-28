'use client';

import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';

export default function CategoriesPage() {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: async () => {
            const res = await productsAPI.getCategories();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });

    const categories = data?.results || data || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-14">
                <p className="text-gold text-sm tracking-[0.3em] uppercase font-jost font-light mb-3">Browse</p>
                <h1 className="font-cormorant text-4xl sm:text-5xl text-noir">All Collections</h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="skeleton aspect-[3/4]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group block bg-white border border-blush/50 hover:border-deep-rose/30 hover:shadow-lg transition-all"
                        >
                            <div className="aspect-[3/4] bg-petal flex items-center justify-center">
                                <div className="text-center p-6">
                                    <h2 className="font-cormorant text-2xl text-noir group-hover:text-deep-rose transition-colors mb-2">
                                        {cat.name}
                                    </h2>
                                    <p className="text-xs text-mid font-light mb-3">{cat.product_count} products</p>
                                    {cat.subcategories?.length > 0 && (
                                        <div className="space-y-1 mb-4">
                                            {cat.subcategories.slice(0, 3).map((sub) => (
                                                <p key={sub.id} className="text-xs text-mid/60">{sub.name}</p>
                                            ))}
                                        </div>
                                    )}
                                    <span className="inline-flex items-center text-xs text-deep-rose font-jost tracking-wider uppercase">
                                        Shop Now <FiArrowRight className="ml-1" size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
