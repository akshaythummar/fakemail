import {
    Archive,
    Forward,
    MoreVertical,
    Reply,
    ReplyAll,
    Trash2,
} from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import type { Mail } from "./data";

dayjs.extend(utc);

interface MailDisplayProps {
    mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
    const today = new Date();
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
                            >
                                <Trash2 className='h-4 w-4' />
                                <span className='sr-only'>Move to trash</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to trash</TooltipContent>
                    </Tooltip>
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
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
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
                                <AvatarImage alt={mail.name} />
                                <AvatarFallback>
                                    {mail.name
                                        .split(' ')
                                        .map((chunk) => chunk[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <div className='font-semibold'>{mail.name}</div>
                                <div className='line-clamp-1 text-xs'>
                                    {mail.subject}
                                </div>
                                <div className='line-clamp-1 text-xs'>
                                    <span className='font-medium'>
                                        Reply-To:
                                    </span>{' '}
                                    {mail.email}
                                </div>
                            </div>
                        </div>
                        {mail.date && (
                            <div className='ml-auto text-xs text-muted-foreground'>
                                {dayjs
                                    .utc(mail.date)
                                    .local()
                                    .format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className='flex-1 p-4 text-sm' dangerouslySetInnerHTML={{ __html: mail.html || mail.text }}></div>
                </div>
            ) : (
                <div className='p-8 text-center text-muted-foreground'>
                    No message selected
                </div>
            )}
        </div>
    );
}