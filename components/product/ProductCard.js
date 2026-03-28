'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const price = product.min_price || product.base_price;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group"
        >
            <Link href={`/products/${product.id}`} className="block">
                {/* Image */}
                <div className="relative aspect-square bg-petal overflow-hidden mb-4">
                    {product.primary_image ? (
                        <Image
                            src={product.primary_image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiShoppingBag size={40} className="text-blush" />
                        </div>
                    )}

                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/10 transition-colors duration-300" />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-deep-rose hover:text-white text-noir"
                        aria-label="Add to wishlist"
                    >
                        <FiHeart size={16} />
                    </button>
                </div>

                {/* Info */}
                <div>
                    <p className="text-xs text-mid font-light uppercase tracking-wider mb-1">
                        {product.category_name}
                    </p>
                    <h3 className="font-cormorant text-lg text-noir group-hover:text-deep-rose transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="mt-1.5 font-jost text-sm font-medium text-noir">
                        ₹{Number(price).toLocaleString('en-IN')}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
