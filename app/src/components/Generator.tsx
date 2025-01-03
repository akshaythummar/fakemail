import { useState } from 'react';
import { Copy, Check, RotateCw } from 'lucide-react';
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useGeneratorMail } from '@/hooks/useGeneratorMail';

export default () => {
    const [address, generatorNewMail] = useGeneratorMail();
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const [copiedText, copy] = useCopyToClipboard();
    const [open, setOpen] = useState(false);
    const handleFocus = (event: any) => event.target.select();
    const handleCopy = (text: string) => {
        if (isCopy) return;
        copy(text)
            .then(() => {
                setIsCopy(true);
                setTimeout(() => {
                    setIsCopy(false);
                }, 1500);
            })
            .catch((error) => {
                console.error('Failed to copy!', error);
            });
    };
    return (
        <div className='flex items-center gap-3'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Input
                            className='flex-1 rounded-full border-none bg-slate-800/40 px-8 py-6 text-sm md:text-xl text-white'
                            readOnly
                            onFocus={handleFocus}
                            value={address}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Your temporary email address</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            className='rounded-full py-6 shrink-0'
                            onClick={() => handleCopy(address)}
                        >
                            {isCopy ? <Check /> : <Copy />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copy to clipboard</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='destructive'
                            className='rounded-full py-6 shrink-0'
                            onClick={() => setOpen(true)}
                        >
                            <RotateCw /> Change
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Generator a new email address</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and generate a new email address.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button onClick={generatorNewMail}>Yes, Generator a new email address</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
