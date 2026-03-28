'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Auto-focus first input
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').split('').slice(0, 6);
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < 6) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const res = await authAPI.verifyOTP({ email, otp: otpCode });
            toast.success('Email verified successfully!');

            // Auto sign in with the returned tokens
            const result = await signIn('credentials', {
                redirect: false,
                email: email,
                password: '_otp_verified_',  // special flag
            });

            // Even if auto-login fails, redirect to login page
            if (result?.error) {
                toast.success('Please sign in with your credentials');
                router.push('/auth/login');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Invalid or expired OTP';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await authAPI.resendOTP({ email });
            toast.success('A new verification code has been sent!');
            setCooldown(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch {
            toast.error('Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="font-cormorant text-3xl text-noir mb-4">No Email Provided</h1>
                    <p className="text-mid text-sm mb-6">Please register first to receive a verification code.</p>
                    <Link href="/auth/register" className="text-deep-rose hover:underline text-sm">
                        Go to Register
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                <Image src="/images/logo.png" alt="Lumière Jewels" width={160} height={40} className="h-10 w-auto mx-auto mb-8" />

                {/* Mail icon */}
                <div className="w-16 h-16 bg-petal rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-deep-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h1 className="font-cormorant text-3xl text-noir mb-2">Verify Your Email</h1>
                <p className="text-sm text-mid font-light mb-1">
                    We sent a 6-digit verification code to
                </p>
                <p className="text-sm text-noir font-medium mb-8">{email}</p>

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-xl font-jost font-medium border-2 border-blush bg-white text-noir outline-none focus:border-deep-rose transition-colors"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-deep-rose text-white py-3.5 text-sm font-jost font-medium tracking-wider uppercase hover:bg-deep-rose/90 transition-colors disabled:opacity-50 mb-6"
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <p className="text-sm text-mid font-light">
                    {"Didn't receive the code? "}
                    {cooldown > 0 ? (
                        <span className="text-mid/60">Resend in {cooldown}s</span>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-deep-rose hover:underline font-medium"
                        >
                            {resending ? 'Sending...' : 'Resend Code'}
                        </button>
                    )}
                </p>

                <p className="text-xs text-mid/50 mt-4 font-light">
                    The code expires in 10 minutes
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="skeleton h-96 w-96" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
