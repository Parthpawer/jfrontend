'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FiHeart, FiShoppingBag, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import { cartAPI, wishlistAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import { useCart } from '@/providers/CartProvider';
import toast from 'react-hot-toast';

export default function ProductDetailClient({ product }) {
    const { data: session } = useSession();
    const { openCart } = useCart();
    const queryClient = useQueryClient();

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState('description');

    useEffect(() => {
        if (product?.variants?.length > 0 && !selectedVariant) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product, selectedVariant]);

    const addToCartMutation = useMutation({
        mutationFn: () => cartAPI.addItem({ variant_id: selectedVariant.id, quantity: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
            toast.success('Added to cart');
            openCart();
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Failed to add to cart'),
    });

    const addToWishlistMutation = useMutation({
        mutationFn: () => wishlistAPI.addToWishlist(product.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
            toast.success('Added to wishlist');
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Already in wishlist'),
    });

    if (!product) return null;

    const images = product.images || [];
    const variants = product.variants || [];
    const metalTypes = [...new Set(variants.map((v) => v.metal_type))];
    const sizes = selectedVariant
        ? [...new Set(variants.filter((v) => v.metal_type === selectedVariant.metal_type).map((v) => v.size).filter(Boolean))]
        : [];

    const currentPrice = selectedVariant?.price || product.base_price;
    const currentStock = selectedVariant?.stock || 0;

    const accordions = [
        { key: 'description', title: 'Description', content: product.description },
        { key: 'metal', title: 'Metal Details', content: `Material: ${selectedVariant?.metal_type || 'Select a variant'}\nPurity: BIS Hallmarked\nCertification: HUID Certified` },
        { key: 'size', title: 'Size Guide', content: 'Please refer to our size chart. For rings, measure the inner diameter of a ring that fits well. For bangles, measure your wrist circumference.' },
        { key: 'shipping', title: 'Shipping & Returns', content: 'Free shipping on all orders. Delivered within 3-5 business days. 30-day hassle-free returns and lifetime exchange policy.' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left — Image Gallery */}
                <div>
                    <div className="relative aspect-square bg-petal mb-4 overflow-hidden">
                        {images[selectedImage] ? (
                            <Image
                                src={images[selectedImage].cloudinary_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FiShoppingBag size={64} className="text-blush" />
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-20 flex-shrink-0 border-2 transition-colors ${selectedImage === idx ? 'border-deep-rose' : 'border-transparent hover:border-blush'
                                        }`}
                                >
                                    <Image
                                        src={img.cloudinary_url}
                                        alt={`${product.name} ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — Product Info */}
                <div>
                    <p className="text-xs text-mid uppercase tracking-[0.2em] font-jost mb-2">
                        {product.category_name}
                        {product.subcategory_name && ` · ${product.subcategory_name}`}
                    </p>
                    <h1 className="font-cormorant text-3xl lg:text-4xl text-noir mb-2">
                        {product.name}
                    </h1>
                    {selectedVariant && (
                        <p className="text-sm text-mid font-light mb-4">{selectedVariant.metal_type}</p>
                    )}

                    {/* Price */}
                    <p className="font-jost text-2xl font-medium text-noir mb-6">
                        ₹{Number(currentPrice).toLocaleString('en-IN')}
                    </p>

                    {/* Metal Type selector */}
                    {metalTypes.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs text-mid uppercase tracking-wider mb-3">Metal Type</p>
                            <div className="flex gap-2 flex-wrap">
                                {metalTypes.map((metal) => (
                                    <button
                                        key={metal}
                                        onClick={() => {
                                            const v = variants.find((v) => v.metal_type === metal);
                                            if (v) setSelectedVariant(v);
                                        }}
                                        className={`px-4 py-2 text-sm border transition-all ${selectedVariant?.metal_type === metal
                                            ? 'border-deep-rose bg-deep-rose text-white'
                                            : 'border-blush text-noir hover:border-deep-rose/50'
                                            }`}
                                    >
                                        {metal}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size selector */}
                    {sizes.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs text-mid uppercase tracking-wider mb-3">Size</p>
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((size) => {
                                    const matchingVariant = variants.find(
                                        (v) => v.metal_type === selectedVariant?.metal_type && v.size === size
                                    );
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                if (matchingVariant) setSelectedVariant(matchingVariant);
                                            }}
                                            className={`w-12 h-12 text-sm border transition-all flex items-center justify-center ${selectedVariant?.size === size
                                                ? 'border-deep-rose bg-deep-rose text-white'
                                                : 'border-blush text-noir hover:border-deep-rose/50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Stock indicator */}
                    {selectedVariant && currentStock > 0 && currentStock < 5 && (
                        <p className="text-sm text-deep-rose font-medium mb-4 flex items-center gap-1">
                            <span className="w-2 h-2 bg-deep-rose rounded-full animate-pulse" />
                            Only {currentStock} left in stock
                        </p>
                    )}

                    {/* Add to cart & Wishlist */}
                    <div className="flex gap-3 mb-8 mt-6">
                        <button
                            onClick={() => {
                                if (!session) {
                                    toast.error('Please sign in to add to cart');
                                    return;
                                }
                                if (!selectedVariant) {
                                    toast.error('Please select a variant');
                                    return;
                                }
                                addToCartMutation.mutate();
                            }}
                            disabled={addToCartMutation.isPending || currentStock === 0}
                            className="flex-1 bg-deep-rose text-white py-4 text-sm font-jost font-medium tracking-wider uppercase hover:bg-deep-rose/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {currentStock === 0 ? 'Out of Stock' : addToCartMutation.isPending ? 'Adding...' : (
                                <><FiShoppingBag size={18} /> Add to Cart</>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                if (!session) {
                                    toast.error('Please sign in');
                                    return;
                                }
                                addToWishlistMutation.mutate();
                            }}
                            disabled={addToWishlistMutation.isPending}
                            className="w-14 border border-blush flex items-center justify-center text-mid hover:text-deep-rose hover:border-deep-rose/50 transition-colors"
                            aria-label="Add to wishlist"
                        >
                            <FiHeart size={20} />
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center gap-4 text-xs text-mid mb-8 pb-8 border-b border-blush/50">
                        {['BIS Hallmarked', 'Free Shipping', '30-Day Returns'].map((badge) => (
                            <span key={badge} className="flex items-center gap-1">
                                <FiCheck size={12} className="text-green-600" /> {badge}
                            </span>
                        ))}
                    </div>

                    {/* Accordions */}
                    <div className="space-y-0">
                        {accordions.map((acc) => (
                            <div key={acc.key} className="border-b border-blush/50">
                                <button
                                    onClick={() => setOpenAccordion(openAccordion === acc.key ? '' : acc.key)}
                                    className="w-full flex items-center justify-between py-4 text-left"
                                >
                                    <span className="text-sm font-jost font-medium text-noir">{acc.title}</span>
                                    {openAccordion === acc.key ? (
                                        <FiChevronUp size={16} className="text-mid" />
                                    ) : (
                                        <FiChevronDown size={16} className="text-mid" />
                                    )}
                                </button>
                                {openAccordion === acc.key && (
                                    <div className="pb-4 text-sm text-mid font-light leading-relaxed whitespace-pre-line animate-fade-in">
                                        {acc.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
