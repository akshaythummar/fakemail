import { useState, useEffect, useRef, memo } from 'react';
import { Inbox, Mails, RefreshCw, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MailCard } from '@/components/ui/mail-card';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"

dayjs.extend(utc);

const countDownTime = 30;

const CountdownNumber = memo(({ value }: { value: number }) => (<span className='text-green-600 mx-1'>{value}</span>));
const CountDownComp = (({ value }: { value: number }) => {
    const [countDown, setCountDown] = useState<number>(countDownTime);
    useEffect(() => {
        setCountDown(value);
        const intervalId = setInterval(() => {
            setCountDown((prevCount) => prevCount - 1);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [value]);
    return (
        <CountdownNumber value={countDown} />
    );
});
const MailCardComp = memo(({ mails, toDelete }: { mails: any[], toDelete: (mail: any) => void}) => mails.map((mail: any, index: number) => {
    if (mail) {
        return (
            <MailCard
                key={mail.suffix}
                sender={mail.sender}
                subject={mail.subject}
                name={mail.name}
                date={dayjs.utc(mail.date).local().format('YYYY-MM-DD HH:mm:ss')}
                content={mail['content-plain-formatted'] || mail['content-plain'] || mail['content-html']}
                defaultShow={index === 0}
                toDelete={() => toDelete(mail)}
            />
        )
    }
}));

export default () => {
    const [mails, setMails] = useState([]);
    const [stats, setStats] = useState<{count: number}>({count: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const intervalId = useRef<any>(null);
    const countDownId = useRef<any>(null);
    const intervalStop = useRef<number>(0);
    const countDown = useRef<number>(countDownTime);
    const fetchData = async () => {
        clearInterval(countDownId.current);
        if (intervalStop.current > 15) clearInterval(intervalId.current);
        try {
            const address = localStorage.getItem('receivingEmail');
            if (!address) return;
            setLoading(true);
            const response = await fetch(`/api/get?address=${address}`); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            countDown.current = countDownTime;
            countDownId.current = setInterval(() => {
                countDown.current = countDown.current - 1;
            }, 1000);
            intervalStop.current = intervalStop.current++;
            const data = await response.json();
            if (data.mails && data.mails.length) {
                const arr = data.mails.filter((e: any) => e);
                arr.sort((a: any, b: any) => dayjs(b.date).unix() - dayjs(a.date).unix());
                setMails(arr);
                if (arr.length) clearInterval(intervalId.current);
            } else {
                setMails([]);
            }
            if (Number(data.stats.count)) setStats({count: Number(data.stats.count)});
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    const refresh = () => {
        clearInterval(intervalId.current);
        intervalStop.current = 0;
        fetchData();
        intervalId.current = setInterval(fetchData, countDownTime * 1000);
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
        intervalId.current = setInterval(fetchData, countDownTime * 1000);
        return () => {
            clearInterval(intervalId.current);
        };
    }, []);
    const emptyDom = (
        <div className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center fade-in'>
            <div className='w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <Inbox size={32} className='text-white' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No emails yet</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>Your temporary inbox is empty. Copy your email address and start receiving emails!</p>
            <div className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span className='text-green-700 dark:text-green-400 text-sm font-medium'>Waiting for emails...</span>
            </div>
        </div>
    );
    return (
        <>
            <div className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center'>
                            <Mails size={20} className='text-white' />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mail Inbox</h2>
                            {mails.length > 0 && (
                                <p className='text-sm text-gray-600 dark:text-gray-400'>{mails.length} email{mails.length !== 1 ? 's' : ''} received</p>
                            )}
                        </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        {(intervalStop.current < 15 && !mails.length && !loading) && (
                            <div className='hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-400'>
                                <div className="animate-ping w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                                Auto-refresh in <CountDownComp value={countDown.current} />s
                            </div>
                        )}
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={refresh}
                            disabled={loading}
                            className='bg-white/50 hover:bg-white/70 border-white/30'
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16} className="mr-2" />
                                    Refresh
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            {!mails.length ? emptyDom : <MailCardComp mails={mails} toDelete={toDelete} />}
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                    <div className='w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>✓</span>
                    </div>
                    <span className='text-green-700 dark:text-green-400 font-medium'>Service Statistics</span>
                </div>
                <p className='text-green-600 dark:text-green-400'>
                    We've successfully received <span className='text-2xl font-bold text-green-500 dark:text-green-300'>{stats.count.toLocaleString()}</span> emails so far
                </p>
            </div>
            <Toaster />
        </>
    );
};
