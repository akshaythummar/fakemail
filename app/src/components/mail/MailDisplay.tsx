import {
    Archive,
    Forward,
    MoreVertical,
    Reply,
    ReplyAll,
    Trash2,
    Loader2,
    ExternalLink
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

// Function to clean email content before processing
const cleanEmailContent = (content: string): string => {
    if (!content) return '';

    // Decode HTML entities
    let cleaned = content.replace(/</g, '<')
                       .replace(/>/g, '>')
                       .replace(/&/g, '&')
                       .replace(/"/g, '"')
                       .replace(/&#39;/g, "'");

    // Fix common email encoding issues
    cleaned = cleaned.replace(/=\n/g, '');
    cleaned = cleaned.replace(/=3D/g, '=');
    cleaned = cleaned.replace(/=20/g, ' ');

    // Remove null bytes and control characters
    cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return cleaned.trim();
};

// Function to get the best available email content
const getBestEmailContent = (mail: any): string => {
    // Priority order: HTML > Plain Formatted > Plain > Raw Content
    const content = mail['content-html'] ||
                   mail['content-plain-formatted'] ||
                   mail['content-plain'] ||
                   mail.content ||
                   '';

    if (!content) return '';

    // If we have HTML content, return it as-is for proper rendering
    if (mail['content-html']) {
        return mail['content-html'];
    }

    // For plain text content, clean it up
    return cleanEmailContent(content);
};

interface MailDisplayProps {
    mail: MailsList | null
    currentAccount: string
    toDelete: (messageId?: string) => Promise<boolean>;
    handleUnread: (messageId?: string) => Promise<boolean>;
}

export function MailDisplay({ mail, currentAccount, toDelete, handleUnread }: MailDisplayProps) {
    const [openStatus, setOpenStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    // Function to convert URLs to clickable links
    const convertUrlsToLinks = (text: string) => {
        // More comprehensive URL regex that handles query parameters and fragments
        const urlRegex = /(https?:\/\/(?:www\.)?[^\s<>"{}|\\^`[\]]+(?:\/[^\s<>"{}|\\^`[\]]*)?(?:\?[^\s<>"{}|\\^`[\]]*)?(?:#[^\s<>"{}|\\^`[\]]*)?)/g;

        // Debug logging to see what content we're processing
        console.log('MailDisplay - Processing content for URL conversion:', text.substring(0, 200) + '...');

        let processedText = text.replace(urlRegex, (url) => {
            // Clean up the URL by removing any trailing punctuation that might have been captured
            const cleanUrl = url.replace(/[.,;:!?]+$/, '');
            console.log('MailDisplay - Found URL:', cleanUrl);
            return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all cursor-pointer inline-flex items-center gap-1">
                <span>${cleanUrl}</span>
                <ExternalLink size={12} />
            </a>`;
        });

        console.log('MailDisplay - Processed content:', processedText.substring(0, 200) + '...');
        return processedText;
    };

    // Function to process content (handle both plain text and HTML)
    const processContent = (rawContent: string) => {
        if (!rawContent) return '';

        // If content already contains HTML tags, clean and process it
        if (rawContent.includes('<') && rawContent.includes('>')) {
            let processedContent = rawContent;

            // Remove script and style tags for security
            processedContent = processedContent.replace(/<script[^>]*>.*?<\/script>/gis, '');
            processedContent = processedContent.replace(/<style[^>]*>.*?<\/style>/gis, '');

            // Process existing anchor tags to ensure they have proper attributes
            processedContent = processedContent.replace(
                /<a([^>]+)>/g,
                (match, attrs) => {
                    // Check if target="_blank" already exists
                    if (attrs.includes('target="_blank"') || attrs.includes("target='_blank'")) {
                        return `<a${attrs} class="text-blue-600 hover:text-blue-800 underline cursor-pointer">`;
                    }
                    // Add target="_blank" and other attributes
                    return `<a${attrs} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">`;
                }
            );

            // Convert plain text URLs to links if not already in HTML
            if (!processedContent.includes('<a')) {
                processedContent = convertUrlsToLinks(processedContent);
            }

            // Clean up some common email HTML artifacts
            processedContent = processedContent.replace(/=\n/g, '');
            processedContent = processedContent.replace(/=3D/g, '=');
            processedContent = processedContent.replace(/&/g, '&');

            return processedContent;
        } else {
            // For plain text content, just convert URLs to links
            return convertUrlsToLinks(rawContent);
        }
    };

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
                    <div className='flex flex-col sm:flex-row items-start p-3 sm:p-4 gap-3 sm:gap-4'>
                        <div className='flex items-start gap-3 sm:gap-4 text-sm w-full sm:w-auto'>
                            <Avatar className='w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'>
                                <AvatarImage alt={mail.senderName || mail.sender} />
                                <AvatarFallback className='text-xs sm:text-sm'>
                                    {(mail.senderName || mail.sender).split(' ').map((chunk) => chunk[0]).join('').substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1 sm:gap-2 min-w-0 flex-1'>
                                <div className='flex flex-col sm:flex-row sm:gap-1 items-start sm:items-center text-xs sm:text-sm'>
                                    <span className='font-semibold text-gray-500 dark:text-gray-400 truncate'>{mail.senderName || mail.sender}</span>
                                    {mail.senderName && <span className='text-gray-400 truncate sm:text-ellipsis'>({mail.sender})</span>}
                                </div>
                                <div className='line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white'>
                                    {mail.subject}
                                </div>
                                <div className='flex flex-col sm:flex-row sm:gap-1 text-xs text-gray-400'>
                                    <span className='font-medium text-gray-600 dark:text-gray-300'>
                                        To:
                                    </span>
                                    <span className='truncate'>{currentAccount}</span>
                                    {mail.cc && (
                                        <>
                                            <span className='font-medium text-gray-600 dark:text-gray-300 sm:ml-2'>CC:</span>
                                            <span className='truncate'>{mail.cc}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {mail.received_at && (
                            <div className='text-xs text-gray-400 whitespace-nowrap flex-shrink-0'>
                                {dayjs
                                    .utc(mail.received_at)
                                    .local()
                                    .format('MMM DD, YYYY HH:mm')}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className='flex-1 p-3 sm:p-4 overflow-y-auto'>
                        <div
                            className='text-sm sm:text-base leading-relaxed break-words overflow-wrap-anywhere max-w-full'
                            style={{
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: processContent(getBestEmailContent(mail))
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className='p-8 text-center text-muted-foreground'>
                    No message selected
                </div>
            )}
        </div>
    );
}
