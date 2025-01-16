import { useState } from 'react';
import {
    Archive,
    File,
    Inbox,
    Search,
    Send,
    Trash2,
    Copy,
    Settings
} from "lucide-react";
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { cn } from '@/lib/utils';
import { AccountSwitcher } from './AccountSwitcher';
import { Nav } from './Nav';
import { MailList } from './MailList';
import { MailDisplay } from './MailDisplay';
import { useMail } from './useMail';
import { Button, buttonVariants } from '../ui/button';
import type { MailsList } from './data';


interface MailProps {
    accounts: {
        id: number
        email_address: string
    }[]
    mails: MailsList[]
    defaultLayout: number[] | undefined
    defaultCollapsed?: boolean
    navCollapsedSize: number
}

export default ({
    accounts,
    mails,
    defaultLayout = [20, 32, 48],
    defaultCollapsed = false,
    navCollapsedSize,
}: MailProps) => {
    const abortController = new AbortController();
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [loading, setLoading] = useState<boolean>(false);
    const [mailsList, setMailsList] = useState<MailsList[]>(mails);
    const [mail] = useMail();
    const fetchData = async (id?: number) => {
        if (!id) return;
        try {
            setLoading(true);
            // if (abortController.abort) abortController.abort();
            const response = await fetch(`/api/getMails?id=${id}`, { signal: abortController.signal });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setMailsList(data?.mails || []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }
    const handleAccountChange = (email: string) => {
        const currentAccount = accounts.find((account) => account.email_address === email);
        fetchData(currentAccount?.id);
    }
    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                        sizes
                    )}`
                }}
                className="h-full flex-1 items-stretch"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsedSize={navCollapsedSize}
                    collapsible={true}
                    minSize={15}
                    maxSize={20}
                    onCollapse={() => {
                        setIsCollapsed(true)
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
                    }}
                    onResize={() => {
                        setIsCollapsed(false)
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                            false
                        )}`
                    }}
                    className={cn("flex flex-col", isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
                >
                    <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
                        <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} onAccountChange={handleAccountChange} />
                    </div>
                    <Separator />
                    <Nav
                        isCollapsed={isCollapsed}
                        links={[
                            {
                                title: "Inbox",
                                label: "128",
                                icon: Inbox,
                                variant: "default",
                            },
                            {
                                title: "Drafts",
                                label: "",
                                icon: File,
                                variant: "ghost",
                            },
                            {
                                title: "Sent",
                                label: "",
                                icon: Send,
                                variant: "ghost",
                            },
                            {
                                title: "Trash",
                                label: "",
                                icon: Trash2,
                                variant: "ghost",
                            },
                            {
                                title: "Archive",
                                label: "",
                                icon: Archive,
                                variant: "ghost",
                            },
                        ]}
                    />
                    <Separator />
                    <div className='flex-1'></div>
                    <div className='py-4 px-2'>
                        <a href='./settings' className={cn('w-full', buttonVariants({ variant: 'outline'}))}>
                            <Settings />
                            {isCollapsed ? '' : `My Email Address(${accounts.length})`}
                        </a>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <div className="flex items-center px-4 py-2">
                        <h1 className="text-xl font-bold">Inbox</h1>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='ml-auto'
                                >
                                    <Copy className='h-4 w-4' />
                                    <span className='sr-only'>Copy</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy current mail address</TooltipContent>
                        </Tooltip>
                    </div>
                    <Separator />
                    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <form>
                            <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                            </div>
                        </form>
                    </div>
                    {loading ? <div className='px-4'>
                        <div className='flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all'>
                            <Skeleton className='w-3/4 h-3' />
                            <Skeleton className='w-1/4 h-3' />
                            <Skeleton className='w-3/4 h-2' />
                        </div>
                    </div> : <MailList items={mailsList} />}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                    <MailDisplay
                        mail={mailsList.find((item) => item.message_id === mail.selected) || null}
                        currentAccount={accounts[0].email_address}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
            <Toaster />
        </TooltipProvider>
    );
};