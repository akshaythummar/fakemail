import { useState, useEffect } from 'react';
import { Inbox } from 'lucide-react';

export default () => {
    const [mails, setMails] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
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
    }, []);
    return (
        <div className='border border-dashed border-gray-400 rounded-xl p-4'>
            <div className='text-center text-gray-400'>
                <Inbox className='mx-auto' />
                <p>No email received yet</p>
            </div>
        </div>
    );
};
