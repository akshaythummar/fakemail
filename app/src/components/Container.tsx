import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Lists from '@/components/Lists';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'error' | 'expired' | 'solved';

const key = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default ({ siteKey }: {siteKey?: string}) => {
    const [status, setStatus] = useState<Status | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    if (status === 'solved' || import.meta.env.DEV) {
        return (
            <div className="slide-up">
                <Lists />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Verification Section */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl p-8 text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Shield size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify You're Human</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Quick security check to access your inbox</p>
                    </div>
                </div>

                {/* Status Messages */}
                {status === 'error' && (
                    <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-red-700 dark:text-red-400 text-sm">Verification failed. Please try again.</span>
                    </div>
                )}

                {status === 'expired' && (
                    <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <AlertCircle size={20} className="text-yellow-500" />
                        <span className="text-yellow-700 dark:text-yellow-400 text-sm">Verification expired. Please try again.</span>
                    </div>
                )}

                {/* Turnstile Widget */}
                <div className="mb-6">
                    <Turnstile
                        className='mx-auto'
                        siteKey={siteKey || key}
                        onError={() => setStatus('error')}
                        onExpire={() => setStatus('expired')}
                        onSuccess={() => {
                            setIsVerifying(true);
                            setTimeout(() => {
                                setStatus('solved');
                                setIsVerifying(false);
                            }, 1500);
                        }}
                    />
                </div>

                {/* Loading State */}
                {isVerifying && (
                    <div className="flex items-center justify-center gap-3 p-4">
                        <Loader2 size={20} className="text-green-500 animate-spin" />
                        <span className="text-gray-600 dark:text-gray-400">Verifying...</span>
                    </div>
                )}

                {/* Info */}
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        🔒 We use Cloudflare Turnstile to prevent spam and abuse
                    </p>
                </div>
            </div>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center fade-in">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Inbox</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Watch emails arrive instantly in your temporary inbox</p>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center fade-in">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Complete Privacy</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No personal data stored, complete anonymity guaranteed</p>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center fade-in">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Loader2 size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Auto-Cleanup</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Emails automatically deleted after 2 hours</p>
                </div>
            </div>
        </div>
    );
};
