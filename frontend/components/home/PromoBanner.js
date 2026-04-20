import Image from 'next/image';
import Link from 'next/link';

export default function PromoBanner() {
    return (
        <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden my-10 lg:my-20">
            <Image
                src="/promo_banner.png"
                alt="New Season, New Gold Promotional Banner"
                fill
                className="object-cover object-center"
                sizes="100vw"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-noir/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <p className="text-gold tracking-[0.3em] uppercase text-sm font-light font-jost mb-4">
                    Exclusive Collection
                </p>
                <h2 className="font-cormorant text-4xl md:text-6xl text-white mb-6">
                    New Season.<br />New Gold.
                </h2>
                <Link
                    href="/products"
                    className="inline-block border border-white text-white w-fit px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-noir transition-colors duration-300"
                >
                    Discover the Collection
                </Link>
            </div>
        </section>
    );
}
