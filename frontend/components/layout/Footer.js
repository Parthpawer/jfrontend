import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-noir text-petal/80">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <Image
                            src="/images/logo.png"
                            alt="Lumière Jewels"
                            width={140}
                            height={36}
                            className="h-9 w-auto mb-5 brightness-0 invert"
                        />
                        <p className="text-sm font-light leading-relaxed text-petal/60">
                            Exquisite handcrafted jewelry for life&apos;s finest moments. BIS hallmarked,
                            ethically sourced, and designed to last forever.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-cormorant text-lg text-gold mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/categories/${item.toLowerCase()}`}
                                        className="text-sm font-light text-petal/60 hover:text-gold transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-cormorant text-lg text-gold mb-4">Customer Care</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'My Account', href: '/account' },
                                { label: 'Track Order', href: '/account/orders' },
                                { label: 'Store Policies', href: '/policies' },
                                { label: 'Terms & Conditions', href: '/terms' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-sm font-light text-petal/60 hover:text-gold transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-cormorant text-lg text-gold mb-4">Get in Touch</h4>
                        <ul className="space-y-2.5 text-sm font-light text-petal/60">
                            <li>✉ hello@lumierejewels.com</li>
                            <li>☎ +91 98765 43210</li>
                            <li>Mon – Sat, 10AM – 7PM IST</li>
                        </ul>
                        <div className="flex space-x-4 mt-5">
                            {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-xs uppercase tracking-wider text-petal/40 hover:text-gold transition-colors"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-petal/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-petal/40">
                        © {new Date().getFullYear()} Tvisaa Jewels. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-petal/40">
                        <span>Free Shipping on All Orders</span>
                        <span className="text-gold">✦</span>
                        <span>BIS Hallmarked</span>
                        <span className="text-gold">✦</span>
                        <span>Lifetime Exchange</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
