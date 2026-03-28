import HeroSection from '@/components/home/HeroSection';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OccasionBanner from '@/components/home/OccasionBanner';
import TrustStrip from '@/components/home/TrustStrip';

export const revalidate = 86400; // 24 hours

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <MarqueeStrip />
            <CategoryGrid />
            <FeaturedProducts />
            <OccasionBanner />
            <TrustStrip />
        </>
    );
}
