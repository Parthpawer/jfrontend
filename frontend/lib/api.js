import axios from 'axios';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Silently reject — let React Query / component handle it
            // Do NOT redirect here, it causes infinite re-render loops
        } else if (status >= 500) {
            toast.error('Something went wrong. Please try again later.');
        }

        return Promise.reject(error);
    }
);

// ─── Auth ────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register/', data),
    verifyOTP: (data) => api.post('/auth/verify-otp/', data),
    resendOTP: (data) => api.post('/auth/resend-otp/', data),
    login: (data) => api.post('/auth/login/', data),
    refreshToken: (refresh) => api.post('/auth/refresh/', { refresh }),
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (data) => api.put('/auth/profile/', data),
    getAddresses: () => api.get('/auth/addresses/'),
    createAddress: (data) => api.post('/auth/addresses/', data),
    updateAddress: (id, data) => api.put(`/auth/addresses/${id}/`, data),
    deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`),
    setDefaultAddress: (id) => api.put(`/auth/addresses/${id}/set-default/`),
};

// ─── Products ────────────────────────────────
export const productsAPI = {
    getProducts: (params) => api.get('/products/', { params }),
    getProduct: (id) => api.get(`/products/${id}/`),
    getHeroSliders: () => api.get('/products/homepage/hero/'),
    getInstagramPosts: () => api.get('/products/homepage/instagram/'),
    getBestSellers: () => api.get('/products/homepage/bestsellers/'),
    getCategories: () => api.get('/categories/'),
    getCategoryProducts: (slug, params) => api.get(`/categories/${slug}/products/`, { params }),
    getCategorySubcategories: (slug) => api.get(`/categories/${slug}/subcategories/`),
    getSubcategoryProducts: (slug, params) => api.get(`/subcategories/${slug}/products/`, { params }),
};

// ─── Cart ────────────────────────────────────
export const cartAPI = {
    getCart: () => api.get('/cart/'),
    addItem: (data) => api.post('/cart/items/', data),
    updateItem: (id, data) => api.put(`/cart/items/${id}/`, data),
    removeItem: (id) => api.delete(`/cart/items/${id}/delete/`),
    clearCart: () => api.delete('/cart/clear/'),
};

// ─── Wishlist ────────────────────────────────
export const wishlistAPI = {
    getWishlist: () => api.get('/wishlist/'),
    addToWishlist: (productId) => api.post('/wishlist/add/', { product: productId }),
    removeFromWishlist: (id) => api.delete(`/wishlist/${id}/`),
};

// ─── Orders ──────────────────────────────────
export const ordersAPI = {
    createOrder: (data) => api.post('/orders/create/', data),
    verifyPayment: (data) => api.post('/orders/verify-payment/', data),
    getOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}/`),
    cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
    getOrderPayments: (id) => api.get(`/orders/${id}/payments/`),
};

export default api;
