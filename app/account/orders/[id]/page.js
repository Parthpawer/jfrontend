'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import Image from 'next/image';
import { FiShoppingBag, FiCheck, FiClock, FiTruck, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusIcons = {
    pending: FiClock,
    confirmed: FiCheck,
    processing: FiPackage,
    shipped: FiTruck,
    delivered: FiCheck,
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: order, isLoading } = useQuery({
        queryKey: QUERY_KEYS.order(id),
        queryFn: async () => {
            const res = await ordersAPI.getOrder(id);
            return res.data.data;
        },
        enabled: !!session,
    });

    const cancelMutation = useMutation({
        mutationFn: () => ordersAPI.cancelOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
            toast.success('Order cancelled');
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Cannot cancel order'),
    });

    if (isLoading) {
        return <div className="max-w-4xl mx-auto px-4 py-12"><div className="skeleton h-96 w-full" /></div>;
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                <h1 className="font-cormorant text-3xl text-noir">Order not found</h1>
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);
    const canCancel = ['pending', 'confirmed'].includes(order.status);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-cormorant text-2xl lg:text-3xl text-noir">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-mid font-light mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
                {canCancel && (
                    <button
                        onClick={() => cancelMutation.mutate()}
                        disabled={cancelMutation.isPending}
                        className="text-sm text-deep-rose border border-deep-rose/30 px-4 py-2 hover:bg-deep-rose hover:text-white transition-all"
                    >
                        Cancel Order
                    </button>
                )}
            </div>

            {/* Status tracker */}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                <div className="bg-white border border-blush p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {statusSteps.map((step, idx) => {
                            const Icon = statusIcons[step];
                            const isComplete = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            return (
                                <div key={step} className="flex-1 flex flex-col items-center relative">
                                    {idx > 0 && (
                                        <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${isComplete ? 'bg-deep-rose' : 'bg-blush'}`} />
                                    )}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isComplete ? 'bg-deep-rose text-white' : 'bg-blush text-mid'
                                        } ${isCurrent ? 'ring-4 ring-deep-rose/20' : ''}`}>
                                        <Icon size={14} />
                                    </div>
                                    <p className={`text-xs mt-2 capitalize ${isComplete ? 'text-noir font-medium' : 'text-mid font-light'}`}>
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 p-4 mb-8 text-center">
                    <p className="text-red-700 text-sm font-medium">This order has been cancelled</p>
                </div>
            )}

            {/* Items */}
            <div className="bg-white border border-blush p-6 mb-8">
                <h2 className="text-sm font-jost font-medium text-noir uppercase tracking-wider mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-blush/30 last:border-0 last:pb-0">
                            <div className="relative w-16 h-16 bg-petal flex-shrink-0">
                                {item.primary_image ? (
                                    <Image src={item.primary_image} alt={item.product_name} fill className="object-cover" sizes="64px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><FiShoppingBag className="text-blush" /></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-noir">{item.product_name}</p>
                                <p className="text-xs text-mid font-light">{item.variant_detail?.metal_type} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-noir">₹{Number(item.line_total).toLocaleString('en-IN')}</p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-blush pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-mid">Subtotal</span>
                        <span>₹{Number(order.subtotal_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-mid">Shipping</span>
                        <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    {Number(order.discount_amount) > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-mid">Discount</span>
                            <span className="text-green-600">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-medium pt-2 border-t border-blush">
                        <span>Total</span>
                        <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* Delivery address */}
            {order.address_detail && (
                <div className="bg-white border border-blush p-6">
                    <h2 className="text-sm font-jost font-medium text-noir uppercase tracking-wider mb-3">Delivery Address</h2>
                    <p className="text-sm text-noir">{order.address_detail.full_name}</p>
                    <p className="text-sm text-mid font-light">{order.address_detail.street}</p>
                    <p className="text-sm text-mid font-light">
                        {order.address_detail.city}, {order.address_detail.state} — {order.address_detail.pincode}
                    </p>
                </div>
            )}
        </div>
    );
}
