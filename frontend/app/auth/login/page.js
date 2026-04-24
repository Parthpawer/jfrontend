'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            // First, try to login via the Django API directly to get proper error messages
            await authAPI.login(form);

            // If API login succeeds, use NextAuth to create the session
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                toast.error('Login failed. Please try again.');
                setLoading(false);
            } else {
                toast.success('Welcome back!');
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            const details = err.response?.data?.details;
            if (details?.email_not_verified) {
                // Redirect to OTP verification page
                toast.error('Please verify your email first');
                router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
            } else {
                toast.error(err.response?.data?.error || 'Invalid email or password');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Image src="/images/logo.jpeg" alt="Lumière Jewels" width={160} height={40} className="h-10 w-auto mx-auto mb-6" />
                    <h1 className="font-cormorant text-3xl text-noir">Welcome Back</h1>
                    <p className="text-sm text-mid font-light mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-deep-rose text-white py-3.5 text-sm font-jost font-medium tracking-wider uppercase hover:bg-deep-rose/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-mid mt-8">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-deep-rose hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
