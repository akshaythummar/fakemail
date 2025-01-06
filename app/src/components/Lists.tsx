import { useState, useEffect, useRef } from 'react';
import { Inbox, Mails, RefreshCw, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MailCard } from '@/components/ui/mail-card';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"

dayjs.extend(utc);
dayjs.extend(relativeTime);

export default () => {
    const [mails, setMails] = useState([]);
    const [stats, setStats] = useState<any>({});
    const [getTime, setGetTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const intervalId = useRef<any>(null);
    const intervalStop = useRef<number>(0);
    const fetchData = async () => {
        if (intervalStop.current > 15) clearInterval(intervalId.current);
        try {
            const address = localStorage.getItem('receivingEmail');
            if (!address) return;
            const response = await fetch(`/api/get?address=${address}`); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            setGetTime(new Date());
            intervalStop.current = intervalStop.current++;
            const data = await response.json();
            if (data.mails && data.mails.length) {
                const arr = data.mails.filter((e: any) => e);
                arr.sort((a: any, b: any) => dayjs(b.date).unix() - dayjs(a.date).unix());
                setMails(arr);
            } else {
                setMails([]);
            }
            setStats(data.stats);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    const refresh = () => {
        clearInterval(intervalId.current);
        intervalStop.current = 0;
        fetchData();
        intervalId.current = setInterval(fetchData, 30 * 1000);
    }
    const toDelete = async (mail: any) => {
        const response = await fetch('/api/delete', {
            method: 'POST',
            body: JSON.stringify({
                key: `${mail.recipient}-${mail.suffix}`
            })
        }); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        setMails(mails.filter((e: any) => e.suffix !== mail.suffix));
        toast("The mail has been deleted!");
    }

    useEffect(() => {
        fetchData();
        intervalId.current = setInterval(fetchData, 30 * 1000);
        return () => {
            clearInterval(intervalId.current);
        };
    }, []);
    let dom: any = (<div className='border border-dashed border-gray-400 rounded-xl p-4'>
        <div className='text-center text-gray-400'>
            <Inbox className='mx-auto' />
            <p>No email received yet</p>
        </div>
    </div>);
    if (mails.length) {
        dom = mails.map((mail: any, index: number) => {
            if (mail) {
                return (
                    <MailCard
                        key={mail.suffix}
                        sender={mail.sender}
                        subject={mail.subject}
                        date={dayjs.utc(mail.date).format('YYYY-MM-DD HH:mm:ss')}
                        content={mail['content-plain-formatted'] || mail['content-plain'] || mail['content-html']}
                        defaultShow={index === 0}
                        toDelete={() => toDelete(mail)}
                    />
                )
            }
        });
    }
    return (
        <>
            <div className='flex justify-between items-center py-2'>
                <h2 className="text-center font-semibold flex gap-1 items-center"><Mails size={18} />Mail Inbox{mails.length?`(${mails.length})`:''}</h2>
                <div className='flex gap-2 items-center'>
                    <div className='text-xs text-gray-400'>{dayjs(getTime).fromNow()}</div>
                    <Button size='xs' variant='outline' onClick={refresh} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    </Button>
                </div>
            </div>
            {dom}
            <div className='py-4 text-xs text-gray-400'>
                -- We've received<span className='mx-1 text-green-600'>{stats.count}</span>emails so far.
            </div>
            <Toaster />
        </>
    );
};
