'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { cartAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen }) {
    const { closeCart } = useCart();
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: cart, isLoading } = useQuery({
        queryKey: QUERY_KEYS.cart,
        queryFn: async () => {
            const res = await cartAPI.getCart();
            return res.data.data;
        },
        enabled: !!session && isOpen,
        staleTime: 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, quantity }) => cartAPI.updateItem(id, { quantity }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart }),
        onError: (err) => toast.error(err.response?.data?.error || 'Failed to update'),
    });

    const removeMutation = useMutation({
        mutationFn: (id) => cartAPI.removeItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
            toast.success('Item removed');
        },
    });

    const items = cart?.items || [];
    const subtotal = cart?.subtotal || 0;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-noir/50 z-50 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-blush/50">
                    <h2 className="font-cormorant text-2xl text-noir">Your Cart</h2>
                    <button onClick={closeCart} className="p-2 text-mid hover:text-noir transition-colors">
                        <FiX size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5">
                    {!session ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <FiShoppingBag size={48} className="text-blush mb-4" />
                            <p className="text-mid mb-4">Sign in to view your cart</p>
                            <Link
                                href="/auth/login"
                                onClick={closeCart}
                                className="bg-deep-rose text-white px-6 py-2.5 text-sm hover:bg-deep-rose/90 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="skeleton w-20 h-20" />
                                    <div className="flex-1 space-y-2">
                                        <div className="skeleton h-4 w-3/4" />
                                        <div className="skeleton h-3 w-1/2" />
                                        <div className="skeleton h-4 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <FiShoppingBag size={48} className="text-blush mb-4" />
                            <p className="text-mid mb-2">Your cart is empty</p>
                            <p className="text-sm text-mid/60 mb-6">Explore our collections and find something special</p>
                            <Link
                                href="/categories"
                                onClick={closeCart}
                                className="bg-deep-rose text-white px-6 py-2.5 text-sm hover:bg-deep-rose/90 transition-colors"
                            >
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-5 border-b border-blush/30">
                                    {/* Thumbnail */}
                                    <div className="relative w-20 h-20 bg-petal flex-shrink-0">
                                        {item.primary_image ? (
                                            <Image
                                                src={item.primary_image}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blush">
                                                <FiShoppingBag size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-noir truncate">{item.product_name}</h3>
                                        <p className="text-xs text-mid mt-0.5">
                                            {item.variant_detail?.metal_type}
                                            {item.variant_detail?.size && ` · Size ${item.variant_detail.size}`}
                                        </p>

                                        {/* Quantity stepper */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-blush">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 });
                                                        }
                                                    }}
                                                    className="p-1.5 text-mid hover:text-noir transition-colors"
                                                    disabled={updateMutation.isPending}
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                                                    className="p-1.5 text-mid hover:text-noir transition-colors"
                                                    disabled={updateMutation.isPending}
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-noir">₹{Number(item.line_total).toLocaleString('en-IN')}</span>
                                                <button
                                                    onClick={() => removeMutation.mutate(item.id)}
                                                    className="p-1 text-mid hover:text-deep-rose transition-colors"
                                                    disabled={removeMutation.isPending}
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {session && items.length > 0 && (
                    <div className="border-t border-blush/50 p-5 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-mid">Subtotal</span>
                            <span className="font-medium text-noir">₹{Number(subtotal).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-mid">Shipping</span>
                            <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full bg-deep-rose text-white text-center py-3.5 text-sm font-medium hover:bg-deep-rose/90 transition-colors"
                        >
                            Proceed to Checkout
                        </Link>
                        <button
                            onClick={closeCart}
                            className="block w-full text-center text-sm text-mid hover:text-noir transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
