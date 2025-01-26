import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

type Status = 'error' | 'expired' | 'solved';

const key = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default ({ siteKey }: {siteKey?: string}) => {
    const [status, setStatus] = useState<Status | null>(null)
    if (status === 'solved' || import.meta.env.DEV) return (
        <>
        <h2 className='text-xl font-bold text-center p-6 text-green-500 border border-dashed border-green-300 mt-4 bg-green-300/10'>Sorry, the system is being upgraded...</h2>
        </>
    )
    return <Turnstile
        className='mx-auto text-center py-6'
        siteKey={siteKey || key}
        onError={() => setStatus('error')}
        onExpire={() => setStatus('expired')}
        onSuccess={() => {
            setTimeout(() => {
                setStatus('solved');
            }, 1000)
        }}
    />
};