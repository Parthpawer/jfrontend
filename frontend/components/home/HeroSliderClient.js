'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSliderClient({ slides }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!slides || slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [slides]);

    if (!slides || slides.length === 0) {
        return (
            <div className="w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] xl:h-[85vh] bg-petal flex items-center justify-center">
                <h1 className="font-cormorant text-4xl text-noir">Welcome to Tvisaa</h1>
            </div>
        );
    }

    return (
        <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] xl:h-[85vh] overflow-hidden bg-noir">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <Image
                        src={slide.cloudinary_url}
                        alt={slide.title || 'Hero Image'}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        {slide.title && (
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-cormorant text-white mb-4 transform translate-y-0 opacity-100 transition-all duration-1000 delay-300">
                                {slide.title}
                            </h2>
                        )}
                        {slide.subtitle && (
                            <p className="text-lg md:text-xl font-jost font-light text-white/90 mb-8 max-w-2xl transform translate-y-0 opacity-100 transition-all duration-1000 delay-500">
                                {slide.subtitle}
                            </p>
                        )}
                        {slide.link_url && (
                            <Link
                                href={slide.link_url}
                                className="inline-block border border-white text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-noir transition-colors duration-300"
                            >
                                Discover More
                            </Link>
                        )}
                    </div>
                </div>
            ))}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
