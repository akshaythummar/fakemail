import { useState } from 'react';
import { Copy, Check, RotateCw, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useGeneratorMail } from '@/hooks/useGeneratorMail';

export default () => {
    const [address, generatorNewMail] = useGeneratorMail();
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const [copiedText, copy] = useCopyToClipboard();
    const [open, setOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFocus = (event: any) => event.target.select();

    const handleCopy = async (text: string) => {
        if (isCopy) return;
        try {
            await copy(text);
            setIsCopy(true);
            setTimeout(() => {
                setIsCopy(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy!', error);
        }
    };

    const handleGenerateNew = async () => {
        setIsGenerating(true);
        try {
            await generatorNewMail();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="relative">
                    {/* Enhanced Generator Card */}
                    <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border-2 border-green-400/30 hover:border-green-400/50 transition-all duration-500 group">
                        {/* Animated Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-green-400/25 group-hover:shadow-green-400/40 transition-all duration-300 flex-shrink-0">
                                <Mail className="text-white" size={20} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-white text-lg sm:text-xl font-bold gradient-text">Your Temporary Email Address</h3>
                                <p className="text-white/60 text-xs sm:text-sm">Ready to receive emails instantly</p>
                            </div>
                        </div>

                        {/* Enhanced Email Input */}
                        <div className="relative mb-6 sm:mb-8">
                            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 lg:pl-8 flex items-center pointer-events-none">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-300 rounded-full animate-pulse shadow-lg shadow-green-300/50"></div>
                            </div>
                            <Input
                                className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 text-center text-gray-800 bg-white/98 backdrop-blur-sm border-2 border-green-200/50 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-bold shadow-xl focus:ring-4 focus:ring-green-300/30 focus:outline-none focus:border-green-400 transition-all duration-300 hover:shadow-2xl hover:bg-white"
                                readOnly
                                onFocus={handleFocus}
                                value={address}
                                placeholder="🔄 Generating your secure email..."
                            />
                            {/* Decorative elements */}
                            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 bg-green-400/30 rounded-full animate-ping"></div>
                            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center mb-6 sm:mb-8">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => handleCopy(address)}
                                        disabled={!address}
                                        className="w-full sm:flex-1 sm:max-w-[180px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-sm sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isCopy ? (
                                            <>
                                                <Check size={16} className="mr-2 sm:mr-3" />
                                                <span className="hidden sm:inline">✅ Copied!</span>
                                                <span className="sm:hidden">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} className="mr-2 sm:mr-3" />
                                                <span className="hidden sm:inline">📋 Copy</span>
                                                <span className="sm:hidden">Copy</span>
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy email to clipboard</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        disabled={isGenerating}
                                        className="w-full sm:flex-1 sm:max-w-[180px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-sm sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 btn-glow-purple disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3" />
                                                <span className="hidden sm:inline">⚡ Generating...</span>
                                                <span className="sm:hidden">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} className="mr-2 sm:mr-3" />
                                                <span className="hidden sm:inline">✨ New Email</span>
                                                <span className="sm:hidden">New Email</span>
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Generate a new email address</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Enhanced Service Statistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center group/stat">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover/stat:shadow-red-400/25 transition-all duration-300">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <h4 className="text-white font-semibold text-xs sm:text-sm mb-1">Auto-Expiry</h4>
                                <p className="text-white/70 text-xs">2 Hours</p>
                            </div>
                            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center group/stat sm:col-span-2 lg:col-span-1">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover/stat:shadow-blue-400/25 transition-all duration-300">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <h4 className="text-white font-semibold text-xs sm:text-sm mb-1">Encryption</h4>
                                <p className="text-white/70 text-xs">256-bit</p>
                            </div>
                            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center group/stat sm:col-span-2 lg:col-span-1">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover/stat:shadow-green-400/25 transition-all duration-300">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <h4 className="text-white font-semibold text-xs sm:text-sm mb-1">Delivery</h4>
                                <p className="text-white/70 text-xs">Instant</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white flex items-center gap-2">
                                <Sparkles size={20} className="text-green-400" />
                                Generate New Email?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-300">
                                This will permanently delete your current email address and generate a new one.
                                Any unread emails in your current inbox will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    onClick={handleGenerateNew}
                                    disabled={isGenerating}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} className="mr-2" />
                                            Generate New Email
                                        </>
                                    )}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
};
