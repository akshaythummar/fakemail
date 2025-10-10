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
            <div className="w-full max-w-2xl mx-auto">
                <div className="relative">
                    {/* Service Statistics Exact Theme */}
                    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-400/40">
                        {/* Header */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Mail className="text-white" size={18} />
                            </div>
                            <span className="text-white text-base font-semibold">Your Temporary Email Address</span>
                        </div>

                        {/* Email Input */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
                            </div>
                            <Input
                                className="w-full pl-12 pr-6 py-5 text-center text-gray-800 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-lg font-semibold shadow-lg focus:ring-2 focus:ring-green-300 focus:outline-none transition-all duration-200"
                                readOnly
                                onFocus={handleFocus}
                                value={address}
                                placeholder="Generating your email..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center mb-6">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => handleCopy(address)}
                                        disabled={!address}
                                        className="flex-1 max-w-[160px] bg-white/90 hover:bg-white text-green-700 py-4 px-6 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {isCopy ? (
                                            <>
                                                <Check size={18} className="mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} className="mr-2" />
                                                Copy Email
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
                                        className="flex-1 max-w-[160px] bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800 text-white py-4 px-6 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} className="mr-2" />
                                                New Email
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Generate a new email address</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Service Statistics Info */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                    <span>Auto-expires in 2 hours</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                    <span>End-to-end encrypted</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                    <span>Instant delivery</span>
                                </span>
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
