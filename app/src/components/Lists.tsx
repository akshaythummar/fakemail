import { useState, useEffect, useRef } from 'react';
import { Inbox, Mail } from 'lucide-react';

export default () => {
    const [mails, setMails] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState<boolean>(false);
    const intervalId = useRef<any>(null);
    const fetchData = async () => {
        try {
            const address = localStorage.getItem('receivingEmail');
            if (!address) return;
            const response = await fetch(`/api/get?address=${address}`); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setMails(data.mails);
            setStats(data.stats);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
        intervalId.current = setInterval(fetchData, 20 * 1000);
        return () => {
            clearInterval(intervalId.current);
        };
    }, []);
    if (mails.length) {
        return mails.map((mail: any) => (
            <div key={mail.suffix} className='border border-gray-400 rounded-xl p-4 grid gap-1'>
                <div className='flex gap-1 items-center text-xs'><Mail size={16} />{mail.sender}</div>
                <div className='text-sm font-semibold'>{mail.subject}</div>
                <div className='text-xs text-gray-600'>{mail.date}</div>
                <div className='pt-4 border-t leading-4 text-sm'>
                    <div dangerouslySetInnerHTML={{ __html: mail['content-plain-formatted'] }}></div>
                </div>
            </div>
        ));
    }
    return (
        <div className='border border-dashed border-gray-400 rounded-xl p-4'>
            <div className='text-center text-gray-400'>
                <Inbox className='mx-auto' />
                <p>No email received yet</p>
            </div>
        </div>
    );
};
