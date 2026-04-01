'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import ProductCard from '@/components/product/ProductCard';

export default function ProductsClient() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('');
    const observerRef = useRef(null);

    // Read category/search from URL if present
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    // Fetch Categories for the top filter bar
    const { data: categoriesData } = useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: async () => {
            const res = await productsAPI.getCategories();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });
    const categories = categoriesData?.results || categoriesData || [];

    // Fetch Products with Infinite Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['products', selectedCategory, searchParams.get('search')],
        queryFn: async ({ pageParam = 1 }) => {
            let params = { page: pageParam };
            let res;

            if (selectedCategory) {
                res = await productsAPI.getCategoryProducts(selectedCategory, params);
            } else {
                if (searchParams.get('search')) {
                    params.search = searchParams.get('search');
                }
                res = await productsAPI.getProducts(params);
            }

            return res.data.data; // { count, next, previous, results }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.next) {
                // Parse the ?page=X from Django's pagination next URL
                const url = new URL(lastPage.next);
                return url.searchParams.get('page');
            }
            return undefined;
        },
    });

    // Intersection Observer for endless scroll on mobile only
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    // Trigger scroll load only if screen is mobile (<768px for Tailwind md)
                    if (window.innerWidth < 768) {
                        fetchNextPage();
                    }
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten pages into a single array
    const products = data ? data.pages.flatMap(page => page.results || page) : [];

    return (
        <div className="bg-white min-h-screen pt-16 lg:pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-cormorant text-4xl lg:text-5xl text-noir mb-4">
                        Discover The Collection
                    </h1>
                    <p className="font-jost text-mid font-light max-w-2xl mx-auto">
                        Explore our full range of exquisitely handcrafted jewelry, designed for everyday elegance and milestone moments.
                    </p>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex overflow-x-auto gap-3 pb-4 mb-10 scrollbar-hide justify-start md:justify-center">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all whitespace-nowrap rounded-sm border ${selectedCategory === ''
                                ? 'bg-deep-rose text-white border-deep-rose shadow-md'
                                : 'bg-transparent text-mid border-blush hover:border-deep-rose hover:text-noir'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all whitespace-nowrap rounded-sm border ${selectedCategory === cat.slug
                                    ? 'bg-deep-rose text-white border-deep-rose shadow-md'
                                    : 'bg-transparent text-mid border-blush hover:border-deep-rose hover:text-noir'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {isLoading && products.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="bg-petal aspect-square w-full" />
                                <div className="h-4 bg-blush/30 w-1/3" />
                                <div className="h-6 bg-blush/50 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-mid font-jost font-light text-lg">
                        No products found. Allow us to curate something special soon.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {products.map((product, i) => (
                            <ProductCard key={`${product.id}-${i}`} product={product} />
                        ))}
                    </div>
                )}

                {/* Loading indicator for Endless Scroll */}
                {isFetchingNextPage && (
                    <div className="py-8 text-center text-sm font-light text-mid animate-pulse md:hidden">
                        Unveiling more brilliant pieces...
                    </div>
                )}

                {/* Desktop Pagination / Mobile Intersection Target */}
                <div ref={observerRef} className="mt-16 flex justify-center w-full">
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            className="hidden md:inline-flex border border-noir text-noir px-10 py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-noir hover:text-white transition-all shadow-sm hover:shadow-md"
                        >
                            {isFetchingNextPage ? 'Loading...' : 'Load Mode Items'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
