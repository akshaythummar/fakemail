import { useState, useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import Lists from '@/components/Lists';

type Status = 'error' | 'expired' | 'solved';

const key = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default ({ siteKey }: {siteKey?: string}) => {
    const [status, setStatus] = useState<Status | null>(null)
    if (status === 'solved' || import.meta.env.DEV) return <Lists />
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