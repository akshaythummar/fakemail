import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, CirclePlus, FilePenLine } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { AccountsList } from './data';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


type AccountsProps = {
    list: AccountsList[]
}

export const Accounts = ({ list = [] }: AccountsProps) => {
    const remarkRef = useRef<HTMLTextAreaElement>(null);
    const toGenerate = async () => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ remark: remarkRef.current?.value }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.code === 200) {
                return window.location.reload();
            }
            toast.error(data.msg);
        }
    }
    return (
        <div className='grid gap-1'>
            {list.map((account) => (
                <div className='grid border-b grid-cols-12 px-4 py-2 items-start gap-2 hover:bg-gray-500/10 cursor-pointer text-sm' key={account.id}>
                    <div className='col-span-4 leading-4 py-2 flex items-center gap-1'>
                    <div className='w-5 h-5 rounded-full shrink-0 overflow-hidden text-center leading-5 bg-slate-700 text-white text-xs uppercase'>{account.email_address.substring(0, 1)}</div>
                        <div className='flex-1 w-0 truncate'>{account.email_address}</div>
                    </div>
                    <div className='col-span-2 leading-4 py-2 text-gray-600 dark:text-gray-400 text-xs'>{dayjs.utc(account.created_at).local().format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className='col-span-5 leading-4 py-2'>{account.alias}</div>
                    <div className='col-span-1'>
                        <Button variant='ghost' size='icon' onClick={() => toast('Developing, please wait~')}><FilePenLine className='h-4 w-4' /></Button>
                        <Button variant='ghost' size='icon' onClick={() => toast('Developing, please wait~')}><Trash2 className='h-4 w-4' color='red' /></Button>
                    </div>
                </div>
            ))}
            <div className='p-4 text-center'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='default' size='sm' disabled={list.length > 4}><CirclePlus /> Add a email address</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add a email address</DialogTitle>
                        <DialogDescription asChild>
                            <div className='text-sm'>Generate a random email address <Badge>@fakeact.fun</Badge></div>
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Textarea ref={remarkRef} placeholder="Type the remark here.(Optional)" maxLength={120} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={toGenerate}>Yes, add it</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Toaster />
        </div>
    );
}