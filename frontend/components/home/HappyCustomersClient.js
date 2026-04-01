'use client';

export default function HappyCustomersClient({ posts }) {
    const hasPosts = posts && posts.length > 0;

    let extendedPosts = [];
    if (hasPosts) {
        // Duplicate posts so the marquee slider can loop infinitely across wide screens
        // We make sure there are at least 15 images to prevent the loop from snapping back visibly
        extendedPosts = [...posts];
        while (extendedPosts.length < 15) {
            extendedPosts = [...extendedPosts, ...posts];
        }
        extendedPosts = extendedPosts.slice(0, 20); // Cap at 20
    }

    return (
        <section className="py-24 overflow-hidden bg-petal/40 border-t border-blush/20">
            <div className="text-center mb-16 px-4">
                <h2 className="font-cormorant text-4xl md:text-5xl text-noir mb-4">Happy Customers</h2>
                <p className="font-jost text-mid font-light max-w-lg mx-auto leading-relaxed">
                    Real stories and beautiful moments shared by the beautiful Tvisaa family.
                    Share your love with us @tvisaajewels!
                </p>
            </div>

            {hasPosts ? (
                <div className="relative w-full overflow-hidden flex pb-8 pt-2">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes marquee-scroll {
                            0% { transform: translateX(0%); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee-scroll {
                            animation: marquee-scroll 55s linear infinite;
                            width: max-content;
                        }
                        .animate-marquee-scroll:hover {
                            animation-play-state: paused;
                        }
                    `}} />

                    <div className="flex gap-4 md:gap-8 animate-marquee-scroll px-4 mx-4">
                        {[...extendedPosts, ...extendedPosts].map((post, i) => (
                            <div
                                key={`${post.id}-${i}`}
                                className="relative w-[240px] h-[430px] md:w-[280px] md:h-[500px] flex-shrink-0 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_12px_40px_-15px_rgba(0,0,0,0.15)] bg-white border-[6px] md:border-[10px] border-white transition-transform duration-500 hover:-translate-y-2 group"
                            >
                                <img
                                    src={post.cloudinary_url}
                                    alt="Customer Screenshot"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                                {/* Subtle dark gradient on hover just to make it pop */}
                                <div className="absolute inset-0 bg-gradient-to-t from-noir/30 to-transparent bg-opacity-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center pb-12 text-mid font-light">
                    Follow us on Instagram to see more updates!
                </div>
            )}
        </section>
    );
}
