import { useEffect, useState } from 'react';
import { getRandomMail } from '@/lib/store';

export const useGeneratorMail = (): [string, () => void] => {
    const [address, setAddress] = useState<string>('');

    const generatorNewMail = () => {
        const mailAddress = getRandomMail(true);
        setAddress(mailAddress);
    }

    useEffect(() => {
        const mailAddress = getRandomMail();
        setAddress(mailAddress);
    }, []);

    return [address, generatorNewMail];
}