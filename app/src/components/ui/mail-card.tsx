import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Mail, ChevronDown, ChevronUp, Trash2, ExternalLink } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
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

interface MailData {
    className?: string;
    sender: string;
    subject: string;
    date: string;
    name?: string;
    content: string;
    defaultShow: boolean;
    toDelete?: () => void;
}

export const MailCard = ({
    className,
    sender,
    subject,
    date,
    name,
    content,
    defaultShow,
    toDelete
}: MailData) => {
    const [show, setShow] = useState<boolean>(defaultShow);

    // Debug logging to see what content we're receiving
    console.log('MailCard - Received content:', {
        sender,
        subject,
        contentLength: content?.length || 0,
        contentPreview: content?.substring(0, 300) + '...' || 'No content',
        hasHtml: content?.includes('<') && content?.includes('>'),
        hasUrl: content?.includes('http')
    });

    // Function to convert URLs to clickable links
    const convertUrlsToLinks = (text: string) => {
        // More comprehensive URL regex that handles query parameters and fragments
        const urlRegex = /(https?:\/\/(?:www\.)?[^\s<>"{}|\\^`[\]]+(?:\/[^\s<>"{}|\\^`[\]]*)?(?:\?[^\s<>"{}|\\^`[\]]*)?(?:#[^\s<>"{}|\\^`[\]]*)?)/g;

        // Debug logging to see what content we're processing
        console.log('Processing content for URL conversion:', text.substring(0, 200) + '...');

        let processedText = text.replace(urlRegex, (url) => {
            // Clean up the URL by removing any trailing punctuation that might have been captured
            const cleanUrl = url.replace(/[.,;:!?]+$/, '');
            console.log('Found URL:', cleanUrl);
            return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all cursor-pointer inline-flex items-center gap-1">
                <span>${cleanUrl}</span>
                <ExternalLink size={12} />
            </a>`;
        });

        console.log('Processed content:', processedText.substring(0, 200) + '...');
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
    return (
        <div
            className={cn(
                'group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-4 card-hover fade-in',
                show && 'ring-2 ring-green-400/20 border-green-400/30',
                className
            )}
        >
            <div className='flex gap-2 sm:flex-row sm:items-center flex-col'>
                <div className='flex-1 grid gap-1'>
                    <div
                        className={cn(
                            'flex gap-1 items-center text-xs text-gray-500 dark:text-gray-400 flex-1 pr-4',
                            show && 'text-gray-700'
                        )}
                    >
                        <Mail size={16} />
                        {name ? `${name} <${sender}>` : sender}
                    </div>
                    <div className='text-sm font-semibold'>{subject}</div>
                </div>
                <div className='flex gap-1.5 justify-between border-t pt-1 sm:border-none sm:pt-0 items-center shrink-0'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                        {date}
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        className='shrink-0'
                        onClick={() => setShow(!show)}
                    >
                        {show ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </div>
            </div>
            {show && (
                <div className='pt-4 border-t leading-4 text-sm'>
                    <div
                        className='prose prose-sm max-w-none break-words overflow-wrap-anywhere'
                        style={{
                            wordBreak: 'break-word',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                        }}
                        dangerouslySetInnerHTML={{
                            __html: processContent(getBestEmailContent({ 'content-html': content }))
                        }}
                    ></div>
                    <div className='border-t pt-2 text-right'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size='xs' variant='ghost'>
                                    <Trash2 size={14} color='red' />
                                </Button>
                            </AlertDialogTrigger>
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
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button variant="destructive" onClick={toDelete}>Delete</Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}
        </div>
    );
};
