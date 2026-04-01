'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { cartAPI, productsAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
    const { data: session } = useSession();
    const { isCartOpen, toggleCart } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: cartData } = useQuery({
        queryKey: QUERY_KEYS.cart,
        queryFn: async () => {
            const res = await cartAPI.getCart();
            return res.data.data;
        },
        enabled: !!session?.accessToken,
        staleTime: 0, // Always fetch fresh to check stock availability
        refetchOnWindowFocus: true, // Refetch when user switches tabs back
        retry: false,
    });

    // Dynamically fetch categories from the backend
    const { data: categoriesData } = useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: async () => {
            const res = await productsAPI.getCategories();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });

    const cartCount = cartData?.total_items || 0;

    // Build nav links dynamically from the backend categories
    const categories = categoriesData?.results || categoriesData || [];
    const categoryLinks = categories.slice(0, 4).map((cat) => ({
        label: cat.name,
        href: `/categories/${cat.slug}`,
    }));
    const navLinks = [
        { label: 'Collections', href: '/categories' },
        ...categoryLinks,
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blush/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-noir hover:text-deep-rose transition-colors"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="Lumière Jewels"
                                width={160}
                                height={40}
                                className="h-10 w-auto"
                                priority={true}
                            />
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-jost font-light tracking-wide text-noir hover:text-deep-rose transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-deep-rose transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 text-noir hover:text-deep-rose transition-colors"
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>

                            {session && (
                                <Link
                                    href="/wishlist"
                                    className="p-2 text-noir hover:text-deep-rose transition-colors hidden sm:block"
                                    aria-label="Wishlist"
                                >
                                    <FiHeart size={20} />
                                </Link>
                            )}

                            <button
                                onClick={toggleCart}
                                className="p-2 text-noir hover:text-deep-rose transition-colors relative"
                                aria-label="Cart"
                            >
                                <FiShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-deep-rose text-white text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {session ? (
                                <div className="relative group">
                                    <Link href="/account" className="p-2 text-noir hover:text-deep-rose transition-colors">
                                        <FiUser size={20} />
                                    </Link>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-blush rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="p-3 border-b border-blush">
                                            <p className="text-sm font-medium text-noir truncate">{session.user.name}</p>
                                            <p className="text-xs text-mid truncate">{session.user.email}</p>
                                        </div>
                                        <Link href="/account" className="block px-3 py-2 text-sm text-noir hover:bg-petal transition-colors">
                                            My Account
                                        </Link>
                                        <Link href="/account/orders" className="block px-3 py-2 text-sm text-noir hover:bg-petal transition-colors">
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="w-full text-left px-3 py-2 text-sm text-deep-rose hover:bg-petal transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="hidden sm:inline-flex items-center text-sm font-jost text-noir hover:text-deep-rose transition-colors"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="border-t border-blush/50 bg-white animate-fade-in">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <form onSubmit={handleSearch} className="flex items-center gap-3">
                                <FiSearch className="text-mid" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for rings, necklaces, earrings..."
                                    className="flex-1 bg-transparent text-noir placeholder:text-mid/50 outline-none font-jost font-light"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-mid hover:text-noir transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-blush/50 bg-white animate-fade-in">
                        <nav className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 text-sm font-jost text-noir hover:text-deep-rose transition-colors border-b border-blush/30"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!session && (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 text-sm font-jost text-deep-rose font-medium"
                                >
                                    Sign In
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} />
        </>
    );
}
