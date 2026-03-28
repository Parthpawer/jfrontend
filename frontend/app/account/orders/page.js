'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryClient';
import Link from 'next/link';
import { FiPackage } from 'react-icons/fi';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: orders, isLoading } = useQuery({
        queryKey: QUERY_KEYS.orders,
        queryFn: async () => {
            const res = await ordersAPI.getOrders();
            return res.data.data;
        },
        enabled: !!session,
    });

    // Auth gate — after all hooks
    if (status === 'unauthenticated') {
        router.push('/auth/login');
        return null;
    }

    const orderList = orders || [];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="font-cormorant text-3xl lg:text-4xl text-noir mb-10">My Orders</h1>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
                </div>
            ) : orderList.length > 0 ? (
                <div className="space-y-4">
                    {orderList.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="block bg-white border border-blush p-5 hover:border-deep-rose/30 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-noir">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-mid">
                                <span>{order.item_count} item{order.item_count > 1 ? 's' : ''}</span>
                                <span className="font-medium text-noir">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-mid/60 mt-2">
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <FiPackage size={48} className="mx-auto text-blush mb-4" />
                    <p className="text-mid text-lg mb-2">No orders yet</p>
                    <Link href="/categories" className="bg-deep-rose text-white px-8 py-3 text-sm hover:bg-deep-rose/90 transition-colors inline-block mt-4">
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
