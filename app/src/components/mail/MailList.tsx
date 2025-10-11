import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Inbox } from 'lucide-react';
import type { MailsList } from './data';
import { useMail } from './useMail';

dayjs.extend(utc);
dayjs.extend(relativeTime);

interface MailListProps {
    items: MailsList[];
    updateStatus?: (messageId: string) => void;
}

export function MailList({ items, updateStatus = () => {} }: MailListProps) {
    const [mail, setMail] = useMail();
    const handleSelect = (messageId: string) => {
        setMail({
            ...mail,
            selected: messageId,
        });

        fetch('/api/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message_id: messageId, is_read: 1 }),
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    updateStatus(messageId);
                }
            }
        })
    }
    if (items.length === 0) return <div className='p-4 text-center text-xs text-gray-500 [&_p]:mt-2'><Inbox className='mx-auto' /><p>No email received yet</p></div>
    return (
        <ScrollArea className='h-screen'>
            <div className='flex flex-col gap-2 p-4 pt-0'>
                {items.map((item) => (
                    <button
                        key={item.message_id}
                        className={cn(
                            'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                            mail.selected === item.message_id && 'bg-muted'
                        )}
                        onClick={() => handleSelect(item.message_id)}
                    >
                        <div className='flex w-full flex-col gap-1'>
                            <div className='flex items-center'>
                                <div className='flex items-center gap-2'>
                                    <div className='font-semibold'>
                                        {item.senderName || item.sender}
                                    </div>
                                    {!item.is_read && (
                                        <span className='flex h-2 w-2 rounded-full bg-blue-600' />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        'ml-auto text-xs',
                                        mail.selected === item.message_id
                                            ? 'text-foreground'
                                            : 'text-gray-400'
                                    )}
                                >
                                    {dayjs(item.received_at).fromNow()}
                                </div>
                            </div>
                            <div className='text-xs font-medium'>
                                {item.subject}
                            </div>
                        </div>
                        <div className='line-clamp-2 text-xs text-muted-foreground'>
                            {item.content && item.content.substring(0, 300)}
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}
