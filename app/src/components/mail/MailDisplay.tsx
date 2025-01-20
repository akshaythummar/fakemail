import {
    Archive,
    Forward,
    MoreVertical,
    Reply,
    ReplyAll,
    Trash2,
    Loader2
} from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type { MailsList } from "./data";
import { useState } from 'react';

dayjs.extend(utc);

interface MailDisplayProps {
    mail: MailsList | null
    currentAccount: string
    toDelete: (messageId?: string) => Promise<boolean>;
    handleUnread: (messageId?: string) => Promise<boolean>;
}

export function MailDisplay({ mail, currentAccount, toDelete, handleUnread }: MailDisplayProps) {
    const [openStatus, setOpenStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        const isOk = await toDelete(mail?.message_id);
        setLoading(false);
        if (isOk) {
            setOpenStatus(false);
        }
    }
    return (
        <div className='flex h-full flex-col'>
            <div className='flex items-center p-2'>
                <div className='flex items-center gap-2'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={!mail}
                                onClick={() => toast('Archive is developing~')}
                            >
                                <Archive className='h-4 w-4' />
                                <span className='sr-only'>Archive</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={!mail}
                                onClick={() => setOpenStatus(true)}
                            >
                                <Trash2 className='h-4 w-4' />
                                <span className='sr-only'>Delete mail</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete mail</TooltipContent>
                    </Tooltip>
                    <AlertDialog open={openStatus}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Delete this mail cannot be undone. This will
                                    permanently remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenStatus(false)}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button variant="destructive" disabled={loading} onClick={handleDelete}>{loading ? <Loader2 className="animate-spin" /> : 'Delete'}</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Separator orientation='vertical' className='mx-1 h-6' />
                </div>
                <div className='ml-auto flex items-center gap-2'>
                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={!mail}
                            >
                                <Reply className='h-4 w-4' />
                                <span className='sr-only'>Reply</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={!mail}
                            >
                                <ReplyAll className='h-4 w-4' />
                                <span className='sr-only'>Reply all</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply all</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={!mail}
                            >
                                <Forward className='h-4 w-4' />
                                <span className='sr-only'>Forward</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward</TooltipContent>
                    </Tooltip> */}
                </div>
                <Separator orientation='vertical' className='mx-2 h-6' />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' disabled={!mail}>
                            <MoreVertical className='h-4 w-4' />
                            <span className='sr-only'>More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onSelect={() => handleUnread(mail?.message_id)}>Mark as unread</DropdownMenuItem>
                        {/* <DropdownMenuItem>Add label</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator />
            {mail ? (
                <div className='flex flex-1 flex-col'>
                    <div className='flex items-start p-4'>
                        <div className='flex items-start gap-4 text-sm'>
                            <Avatar>
                                <AvatarImage alt={mail.sender} />
                                <AvatarFallback>
                                    {mail.sender
                                        .split(' ')
                                        .map((chunk) => chunk[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <div className='font-semibold'>{mail.sender}</div>
                                <div className='line-clamp-1 text-xs'>
                                    {mail.subject}
                                </div>
                                <div className='line-clamp-1 text-xs'>
                                    <span className='font-medium'>
                                        Reply-To:
                                    </span>{' '}
                                    {currentAccount}
                                </div>
                            </div>
                        </div>
                        {mail.received_at && (
                            <div className='ml-auto text-xs text-muted-foreground'>
                                {dayjs
                                    .utc(mail.received_at)
                                    .local()
                                    .format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className='flex-1 p-4 text-sm' dangerouslySetInnerHTML={{ __html: mail.content }}></div>
                </div>
            ) : (
                <div className='p-8 text-center text-muted-foreground'>
                    No message selected
                </div>
            )}
        </div>
    );
}