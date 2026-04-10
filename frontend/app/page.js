import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import HeroSliderClient from '@/components/home/HeroSliderClient';
import HappyCustomersClient from '@/components/home/HappyCustomersClient';
import ProductCard from '@/components/product/ProductCard';

// Primary strategy: on-demand tag revalidation from backend.
// Safety fallback: auto-refresh every 60s if webhook revalidation fails.
export const revalidate = 60;

async function getHeroSliders() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/hero/`, {
            next: { tags: ['hero'] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data?.results || json.data || [];
    } catch (e) { return []; }
}

async function getBestsellers() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/bestsellers/`, {
            next: { tags: ['products'] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data?.results || json.data || [];
    } catch (e) { return []; }
}

async function getQuickPicks() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/quick-picks/`, {
            next: { tags: ['products'] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data?.results || json.data || [];
    } catch (e) { return []; }
}

async function getNewArrivals() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/new-arrivals/`, {
            next: { tags: ['products'] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data?.results || json.data || [];
    } catch (e) { return []; }
}

async function getInstagramPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/homepage/instagram/`, {
            next: { tags: ['instagram'] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data?.results || json.data || [];
    } catch (e) { return []; }
}

export default async function HomePage() {
    const [heroSlides, bestSellers, quickPicks, newArrivals, instaPosts] = await Promise.all([
        getHeroSliders(),
        getBestsellers(),
        getQuickPicks(),
        getNewArrivals(),
        getInstagramPosts()
    ]);

    const features = [
        {
            title: "Waterproof",
            desc: "Designed to be worn every day, everywhere. Never take it off.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3s-4.5 4.97-4.5 9 2.015 9 4.5 9z" /></svg>
        },
        {
            title: "Tarnish Resistant",
            desc: "Crafted with premium materials that retain their brilliant shine forever.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
        },
        {
            title: "Hypoallergenic",
            desc: "Gentle on sensitive skin. Zero nickel, zero lead, zero irritation.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            title: "Free Delivery",
            desc: "Enjoy complimentary express shipping on all orders across the country.",
            svg: <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
        }
    ];

    return (
        <div className="bg-white">
            {/* 1. Hero */}
            <HeroSliderClient slides={heroSlides} />

            {/* 2. Top Picks */}
            <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-cormorant text-3xl md:text-5xl text-noir mb-3">Top Picks</h2>
                        <p className="text-mid font-light font-jost text-sm md:text-base">Our best-selling masterpieces, curated just for you.</p>
                    </div>
                    <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir hover:text-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {bestSellers.length > 0 ? bestSellers.map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-mid font-light">More products arriving soon...</div>
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir border-b border-noir pb-1 hover:text-deep-rose hover:border-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* Quick Picks */}
            <section className="pb-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-cormorant text-3xl md:text-5xl text-noir mb-3">Quick Picks</h2>
                        <p className="text-mid font-light font-jost text-sm md:text-base">Handpicked favorites selected by our experts.</p>
                    </div>
                    <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir hover:text-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {quickPicks.length > 0 ? quickPicks.map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-mid font-light">More quick picks arriving soon...</div>
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir border-b border-noir pb-1 hover:text-deep-rose hover:border-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* 3. New Arrivals */}
            <section className="pb-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-cormorant text-3xl md:text-5xl text-noir mb-3">New Arrivals</h2>
                        <p className="text-mid font-light font-jost text-sm md:text-base">Discover our latest handcrafted masterpieces.</p>
                    </div>
                    <Link href="/products?sort=new" className="hidden sm:flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir hover:text-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {newArrivals.length > 0 ? newArrivals.map((product) => (
                        <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-mid font-light">More fresh designs arriving soon...</div>
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/products?sort=new" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-noir border-b border-noir pb-1 hover:text-deep-rose hover:border-deep-rose transition-colors">
                        View All <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* 4. Why Choose Tvisaa */}
            <section className="py-20 bg-petal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-cormorant text-3xl md:text-5xl text-noir">Why Choose Tvisaa</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {features.map((feature, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-deep-rose mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                    {feature.svg}
                                </div>
                                <h3 className="font-cormorant text-xl text-noir mb-3 font-medium">{feature.title}</h3>
                                <p className="font-jost text-sm text-mid font-light leading-relaxed max-w-[250px]">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Happy Customers */}
            <HappyCustomersClient posts={instaPosts} />
        </div>
    );
}
