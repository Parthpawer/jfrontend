import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaPinterest, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    // <footer className="bg-noir text-petal/80">

    //   {/* Main Footer */}
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    //     <div className="w-full text-sm">

    //       {/* Header Row */}
    //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-4 border-b border-petal/20 items-center">
    //         <div>
    //           <Image
    //             src="/images/logo.png"
    //             alt="Tvisaa Jewels"
    //             width={120}
    //             height={30}
    //             className="h-7 w-auto brightness-0 invert"
    //           />
    //         </div>

    //         <h4 className="font-cormorant text-gold">Customer Care</h4>
    //         <h4 className="font-cormorant text-gold">Legal / Policies</h4>
    //         <h4 className="font-cormorant text-gold">Follow Us</h4>
    //       </div>

    //       {/* Row 1 */}
    //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-3 border-b border-petal/10">
    //         <span className="italic text-petal/60">Tvisaa: Waterproof</span>

    //         <Link href="/contact" className="text-petal/60 hover:text-gold transition">
    //           Contact Us
    //         </Link>

    //         <Link href="/privacy" className="text-petal/60 hover:text-gold transition">
    //           Privacy Policy
    //         </Link>

    //         <div className="flex items-center gap-4 text-petal/60">
    //           <a href="https://www.instagram.com/tvisaa_foryou?utm_source=qr&igsh=eHF1Nm0xZ203bXJk" className="hover:text-gold transition transform hover:scale-110">
    //             <FaInstagram size={16} />
    //           </a>
    //           <a href="#" className="hover:text-gold transition transform hover:scale-110">
    //             <FaPinterest size={16} />
    //           </a>
    //           <a href="https://wa.me/c/919686492120" className="hover:text-gold transition transform hover:scale-110">
    //             <FaWhatsapp size={16} />
    //           </a>
    //         </div>
    //       </div>

    //       {/* Row 2 */}
    //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-3 border-b border-petal/10">
    //         <span className="italic text-petal/60">Tarnish-free jewelry</span>

    //         <Link href="/shipping" className="text-petal/60 hover:text-gold transition">
    //           Shipping & Delivery
    //         </Link>

    //         <Link href="/terms" className="text-petal/60 hover:text-gold transition">
    //           Terms & Conditions
    //         </Link>

    //         <span></span>
    //       </div>

    //       {/* Row 3 */}
    //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-3 border-b border-petal/10">
    //         <span className="italic text-petal/60">For everyday elegance</span>

    //         <Link href="/faq" className="text-petal/60 hover:text-gold transition">
    //           FAQ
    //         </Link>

    //         <Link href="/returns" className="text-petal/60 hover:text-gold transition">
    //           Return & Refund Policy
    //         </Link>

    //         <span></span>
    //       </div>

    //       {/* Row 4 */}
    //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-3">
    //         <span></span>

    //         <Link href="/jewelry-care" className="text-petal/60 hover:text-gold transition">
    //           Jewelry Care
    //         </Link>

    //         <span></span>
    //         <span></span>
    //       </div>

    //     </div>
    //   </div>

    //   {/* Bottom Bar */}
    //   <div className="border-t border-petal/10">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
    //       <p className="text-xs text-petal/40">
    //         © {new Date().getFullYear()} Tvisaa Jewels. All rights reserved.
    //       </p>

    //       <div className="flex items-center space-x-4 text-xs text-petal/40">
    //         <span>Free Shipping on All Orders</span>
    //         <span className="text-gold">✦</span>
    //         <span>BIS Hallmarked</span>
    //         <span className="text-gold">✦</span>
    //         <span>Lifetime Exchange</span>
    //       </div>
    //     </div>
    //   </div>

    // </footer>

    <footer className="bg-[#FAF7F2] text-[#2F2A24] border-t border-[#E8DED0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Brand */}
          <div className="max-w-lg">
            <img
              src="/images/logo.jpeg"
              alt="Tvisaa_for You"
              className="mb-6 sm:mb-8 h-14 sm:h-16 lg:h-20 w-auto object-contain"
            />

            <p className="text-sm sm:text-base lg:text-[17px] leading-7 sm:leading-8 text-[#6B6257]">
              Everyday luxury within reach. Premium stainless steel jewellery that is waterproof,
              tarnish-resistant, and made for effortless everyday wear.
            </p>

            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap gap-4 sm:gap-6 text-[12px] sm:text-[13px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#8A7A63]">
              <a href="https://www.instagram.com/tvisaa_foryou?utm_source=qr&igsh=eHF1Nm0xZ203bXJk" className="hover:text-[#B08A47] transition-colors duration-300">Instagram</a>
              <a href="https://wa.me/c/919686492120" className="hover:text-[#B08A47] transition-colors duration-300">WhatsApp</a>
            </div>
          </div>

          {/* Right: Structured Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-8 sm:gap-y-10 lg:gap-y-14">

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#B79E7A]">
                Brand
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#5E554A] flex flex-col">
                <a href="/about-us/" className="hover:text-[#B08A47] transition-colors duration-300">About Us</a>
                <a href="/our-vision" className="hover:text-[#B08A47] transition-colors duration-300">Our Vision</a>
                <a href="/our-mission" className="hover:text-[#B08A47] transition-colors duration-300">Our Mission</a>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#B79E7A]">
                Care
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#5E554A] flex flex-col">
                <a href="/jewellery-care" className="hover:text-[#B08A47] transition-colors duration-300">Jewellery Care</a>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#B79E7A]">
                Shipping
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#5E554A] flex flex-col">
                <a href="/shipping-delivery" className="hover:text-[#B08A47] transition-colors duration-300">Shipping & Delivery</a>
                <a href="/tracker" className="hover:text-[#B08A47] transition-colors duration-300">Tracking</a>
                <a href="/cash-on-delivery" className="hover:text-[#B08A47] transition-colors duration-300">Cash on Delivery</a>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#B79E7A]">
                Legal
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#5E554A] flex flex-col">
                <a href="/privacy-policy" className="hover:text-[#B08A47] transition-colors duration-300">Privacy Policy</a>
                <a href="shipping-policy" className="hover:text-[#B08A47] transition-colors duration-300">Shipping Policy</a>
                <a href="terms-conditions" className="hover:text-[#B08A47] transition-colors duration-300">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 border-t border-[#E8DED0] pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] text-[#7D7265]">
          <span>© 2026 Tvisaa_for You</span>
          <span className="max-w-full lg:text-right">
            Dispatch in 1–2 days · Delivery in 3–7 days · COD ₹99
          </span>
        </div>
      </div>
    </footer>

  );
}