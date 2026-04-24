'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', password_confirm: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        if (form.password !== form.password_confirm) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register(form);
            toast.success('Verification code sent to your email!');

            // Redirect to OTP verification page
            router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
        } catch (err) {
            const details = err.response?.data?.details;
            if (details?.email) toast.error('Email already registered');
            else toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Image src="/images/logo.jpeg" alt="Lumière Jewels" width={160} height={40} className="h-10 w-auto mx-auto mb-6" />
                    <h1 className="font-cormorant text-3xl text-noir">Create Account</h1>
                    <p className="text-sm text-mid font-light mt-2">Join the Lumière Jewels family</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Phone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="+91"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            minLength={8}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={form.password_confirm}
                            onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-deep-rose text-white py-3.5 text-sm font-jost font-medium tracking-wider uppercase hover:bg-deep-rose/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-mid mt-8">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-deep-rose hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
