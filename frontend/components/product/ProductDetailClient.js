'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ShoppingBag, Heart, ShieldCheck, Award, Lock } from 'lucide-react';
import { cartAPI, wishlistAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import { useCart } from '@/providers/CartProvider';
import toast from 'react-hot-toast';
import { FiTruck } from 'react-icons/fi';
export default function ProductDetailClient({ product }) {
    const { data: session } = useSession();
    const { openCart } = useCart();
    const queryClient = useQueryClient();

    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    // Live query to always fetch the latest real-time stock, bypassing Next.js edge cache
    const { data: liveProduct } = useQuery({
        queryKey: ['product-live', product?.id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}/`, {
                cache: 'no-store'
            });
            const data = await res.json();
            return data.data;
        },
        enabled: !!product?.id,
        staleTime: 0, // always considered stale, fetched immediately or in background on mount
    });

    const activeProduct = liveProduct || product;

    // Default variant to the first one available
    useEffect(() => {
        if (activeProduct?.variants?.length > 0 && !selectedVariantId) {
            setSelectedVariantId(activeProduct.variants[0].id);
        }
    }, [activeProduct, selectedVariantId]);

    const variants = activeProduct?.variants || [];
    const selectedVariant = variants.find(v => v.id === selectedVariantId) || null;

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

    if (!activeProduct) return null;

    const images = activeProduct.images || [];
    const coatingsMap = new Map();
    variants.forEach(v => {
        if (v.coating && !coatingsMap.has(v.coating.name)) {
            coatingsMap.set(v.coating.name, v.coating);
        } else if (!v.coating && v.metal_type && !coatingsMap.has(v.metal_type)) {
            coatingsMap.set(v.metal_type, { name: v.metal_type, color_rgb: 'transparent' });
        }
    });
    const coatings = Array.from(coatingsMap.values());

    // Size based on selected metal type
    const sizes = selectedVariant
        ? [...new Set(variants.filter((v) => 
            (v.coating && selectedVariant.coating && v.coating.name === selectedVariant.coating.name) ||
            (!v.coating && v.metal_type === selectedVariant.metal_type)
          ).map((v) => v.size).filter(Boolean))]
        : [];

    const currentPrice = activeProduct.base_price;
    const currentStock = selectedVariant?.stock || 0;
    const isDiscounted = !!activeProduct.discounted_price && Number(activeProduct.discounted_price) > 0;

    return (
        <div className="min-h-screen bg-[#FCF9F6] text-[#2D2D2D] font-sans selection:bg-[#B76E79] selection:text-white pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
                    
                    {/* 1. Hero & Media Gallery */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4 xl:gap-8 lg:sticky lg:top-12">
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible py-2 lg:py-0 w-full lg:w-24 shrink-0 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square w-20 lg:w-full overflow-hidden transition-all duration-300 ${
                                            activeImage === idx 
                                                ? 'ring-1 ring-[#B76E79] opacity-100 bg-white' 
                                                : 'opacity-60 hover:opacity-100 bg-white border border-[#E8DFD8]'
                                        }`}
                                    >
                                        <Image
                                            src={img.cloudinary_url}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Main Image */}
                        <div className="w-full aspect-[4/5] bg-white relative overflow-hidden border border-[#E8DFD8]">
                            {images[activeImage] ? (
                                <Image
                                    src={images[activeImage].cloudinary_url}
                                    alt={activeProduct.name}
                                    fill
                                    priority
                                    className="object-cover transition-opacity duration-500"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <ShoppingBag size={64} className="text-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Product Identity & Config */}
                    <div className="mt-10 lg:mt-0 flex flex-col pt-2 lg:pt-8">
                        <span className="tracking-widest text-xs uppercase text-[#B76E79] font-medium mb-3">
                            {activeProduct.category_name}
                            {activeProduct.subcategory_name && ` · ${activeProduct.subcategory_name}`}
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-serif text-[#1A1A1A] leading-tight mb-6">
                            {activeProduct.name}
                        </h1>

                        {/* Pricing Display */}
                        <div className="flex items-center gap-4 mb-10 flex-wrap">
                            {isDiscounted ? (
                                <>
                                    <span className="text-3xl font-serif text-[#1A1A1A]">₹{Number(activeProduct.discounted_price).toLocaleString('en-IN')}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{Number(currentPrice).toLocaleString('en-IN')}</span>
                                    {activeProduct.discount_text && (
                                        <span className="bg-[#FF6B35] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ml-2 relative -top-1 shadow-sm">
                                            {activeProduct.discount_text}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-3xl font-serif text-[#1A1A1A]">₹{Number(currentPrice).toLocaleString('en-IN')}</span>
                            )}
                        </div>

                        {/* 3. Configuration */}
                        {coatings.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm uppercase tracking-wide text-gray-900 font-medium">Coating Type</span>
                                    <span className="text-sm text-gray-500">{selectedVariant?.coating?.name || selectedVariant?.metal_type}</span>
                                </div>
                                <div className="flex gap-3 flex-wrap">
  {coatings.map((coating) => {
    const isSelected =
      (selectedVariant?.coating?.name === coating.name) ||
      (!selectedVariant?.coating &&
        selectedVariant?.metal_type === coating.name);

    return (
      <div key={coating.name} className="flex flex-col items-center gap-1">
        <button
          onClick={() => {
            const v = variants.find(
              (v) =>
                (v.coating && v.coating.name === coating.name) ||
                (!v.coating && v.metal_type === coating.name)
            );
            if (v) setSelectedVariantId(v.id);
          }}
          className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
            isSelected
              ? "border-[#B76E79] scale-110"
              : "border-[#E8DFD8] hover:border-[#B76E79]"
          }`}
          title={coating.name}
        >
          {coating.color_rgb !== "transparent" ? (
            <div
              className="w-7 h-7 rounded-full"
              style={{ backgroundColor: coating.color_rgb }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200" />
          )}
        </button>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
          {coating.name.split(' ')[0]}
        </span>
      </div>
    );
  })}
</div>
                            </div>
                        )}

                        {/* {sizes.length > 0 && (
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm uppercase tracking-wide text-gray-900 font-medium">Size</span>
                                    <span className="text-sm text-gray-500">{selectedVariant?.size}</span>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map((size) => {
                                        const matchingVariant = variants.find(
                                            (v) => ((v.coating && selectedVariant?.coating && v.coating.name === selectedVariant.coating.name) || 
                                                    (!v.coating && v.metal_type === selectedVariant?.metal_type)) 
                                                   && v.size === size
                                        );
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    if (matchingVariant) setSelectedVariant(matchingVariant);
                                                }}
                                                className={`min-w-[3rem] h-12 px-4 border text-sm transition-all duration-300 font-medium flex items-center justify-center ${
                                                    selectedVariant?.size === size 
                                                        ? 'border-[#B76E79] bg-[#B76E79] text-white' 
                                                        : 'border-[#E8DFD8] text-[#5A5A5A] hover:border-[#B76E79] hover:text-[#B76E79] bg-white'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )} */}

                        {/* 5. Call to Action */}
                        <div className="flex gap-4 mb-12">
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
                                className="flex-1 bg-[#FF6B35] hover:bg-[#E05A2A] text-white py-4 px-8 flex items-center justify-center gap-3 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                <span className="uppercase tracking-widest text-sm font-medium">
                                    {currentStock === 0 ? 'Out of Stock' : addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                                </span>
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
                                className="w-14 h-14 flex items-center justify-center border border-[#E8DFD8] hover:border-[#B76E79] hover:text-[#B76E79] transition-colors duration-300 bg-white"
                                aria-label="Add to wishlist"
                            >
                                <Heart size={20} className={addToWishlistMutation.isPending ? "animate-pulse" : ""} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* 4. Product Information (Clean, Non-boxy layout) */}
                        <div className="space-y-10 border-t border-[#E8DFD8] pt-10">
                            
                            {activeProduct.description && (
                                <div className="space-y-3">
                                    <h3 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A]">Description</h3>
                                    <p className="text-[#5A5A5A] leading-relaxed text-sm whitespace-pre-line">
                                        {activeProduct.description}
                                    </p>
                                </div>
                            )}
{/* 
                            <div className="space-y-3">
                                <h3 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A]">Details</h3>
                                <ul className="text-[#5A5A5A] space-y-2 text-sm">
                                    <li><span className="font-medium text-gray-800">Material:</span> {selectedVariant?.coating?.name || selectedVariant?.metal_type || 'Selected variant'}</li>
                                    <li><span className="font-medium text-gray-800">Purity:</span> BIS Hallmarked</li>
                                    <li><span className="font-medium text-gray-800">Certification:</span> HUID Certified</li>
                                </ul>
                            </div> */}

                            {activeProduct.styling && (
                                <div className="space-y-3">
                                    <h3 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A]">Styling</h3>
                                    <p className="text-[#5A5A5A] leading-relaxed text-sm whitespace-pre-line">
                                        {activeProduct.styling}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A]">Shipping & Returns</h3>
                                <p className="text-[#5A5A5A] leading-relaxed text-sm">
                                    Free Shipping on all orders. Final Sale: No Returns.
                                </p>
                            </div>

                        </div>

                        {/* Trust Bar */}
                        <div className="mt-12 py-6 border-y border-[#E8DFD8] flex justify-center items-center gap-10">

                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <FiTruck size={22} className="text-[#B76E79]" />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500">
                                    Free Delivery
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <Lock size={22} className="text-[#B76E79]" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500">Secure Checkout</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
