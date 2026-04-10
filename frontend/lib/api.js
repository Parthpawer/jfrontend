import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
    constructor(response, data) {
        super(data?.message || 'API Error');
        this.response = response;
        this.data = data;
    }
}

async function fetchWrapper(endpoint, options = {}) {
    let url = `${baseURL}${endpoint}`;

    if (options.params) {
        // Clean undefined or null params
        const validParams = Object.entries(options.params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});
        if (Object.keys(validParams).length > 0) {
            const query = new URLSearchParams(validParams).toString();
            url += (url.includes('?') ? '&' : '?') + query;
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (typeof window !== 'undefined') {
        const session = await getSession();
        if (session?.accessToken) {
            headers.Authorization = `Bearer ${session.accessToken}`;
        }
    }

    const config = {
        method: options.method || 'GET',
        headers,
    };

    if (options.data) {
        config.body = JSON.stringify(options.data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    config.signal = controller.signal;

    try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (e) {
                // Ignore parsing errors
            }
        }

        const axiosLikeResponse = {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: options
        };

        if (!response.ok) {
            const error = new ApiError(axiosLikeResponse, data);
            
            if (response.status === 401) {
                // Silently reject
            } else if (response.status >= 500) {
                toast.error('Something went wrong. Please try again later.');
            }
            throw error;
        }

        return axiosLikeResponse;
    } catch (error) {
        if (error.name === 'AbortError') {
             throw new Error('Request timed out');
        }
        throw error;
    }
}

const api = {
    get: (url, config = {}) => fetchWrapper(url, { ...config, method: 'GET' }),
    post: (url, data, config = {}) => fetchWrapper(url, { ...config, method: 'POST', data }),
    put: (url, data, config = {}) => fetchWrapper(url, { ...config, method: 'PUT', data }),
    delete: (url, config = {}) => fetchWrapper(url, { ...config, method: 'DELETE' }),
};


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
