import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AccountSwitcherProps {
    isCollapsed: boolean;
    accounts: {
        id: number;
        email_address: string;
    }[];
}

export function AccountSwitcher({
    isCollapsed,
    accounts,
}: AccountSwitcherProps) {
    const [selectedAccount, setSelectedAccount] = useState<string>(
        accounts[0].email_address
    );

    return (
        <Select
            defaultValue={selectedAccount}
            onValueChange={setSelectedAccount}
        >
            <SelectTrigger
                className={cn(
                    'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
                    isCollapsed &&
                        'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
                )}
                aria-label='Select account'
            >
                <SelectValue placeholder='Select an account'>
                    <div className='w-5 h-5 rounded-full shrink-0 overflow-hidden text-center leading-5 bg-slate-700 text-white text-xs uppercase'>{selectedAccount.substring(0, 1)}</div>
                    <span className={cn('', isCollapsed && 'hidden')}>
                        {selectedAccount}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account.email_address} value={account.email_address}>
                        <div className='flex items-center gap-1.5 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground'>
                        <div className='w-5 h-5 rounded-full shrink-0 overflow-hidden text-center leading-5 bg-slate-700 text-white text-xs uppercase'>{account.email_address.substring(0, 1)}</div>
                            {account.email_address}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
