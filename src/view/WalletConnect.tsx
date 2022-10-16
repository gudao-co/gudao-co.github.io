import { Dropdown, Spinner } from 'flowbite-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "../i18n";
import Logo from './Logo';
import useWallet from '../use/useWallet';
import { setWalletChooses } from '../use/useWalletChooses';
import useWalletReady from '../use/useWalletReady';
import { disconnect } from 'gudao-co-core/dist/wallet';
import NetworkChooses from './NetworkChooses';

function WalletConnect() {
    const { t } = useTranslation()
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const dropdown = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const setHidden = () => {
        if (dropdown.current) {
            dropdown.current.parentElement!.click()
        }
    };

    const onLogout = () => {
        if (wallet) {
            disconnect(wallet)
        }
    };

    const items: { title: string, href: string }[] = [

    ];

    if (!isReady) {
        return <div className='rounded-full flex flex-row items-center text-sm py-px pr-px'>
            <Spinner size="md" color="success" />
        </div>
    }

    if (!wallet) {
        return <div className='rounded-full flex flex-row border border-slate-300 dark:border-slate-500 items-center text-sm py-1 px-1' onClick={() => setWalletChooses({ allowClosed: true })}>
            <span className='px-3 py-1 cursor-pointer text-gray-700 dark:text-gray-400 dark:hover:text-white md:hover:text-blue-700 md:dark:hover:text-white'>{t('Connect Wallet')}</span>
        </div>
    }

    return (
        <div className='flex flex-row flex-nowrap'>
            <NetworkChooses></NetworkChooses>
            <div className="px-2"></div>
            <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                    <div ref={dropdown} className='rounded-full flex flex-row border border-slate-300 dark:border-slate-500 items-center text-sm pl-0 pr-px min-w-fit sm:pl-2'>
                        <span className='pr-3 py-2 cursor-pointer text-gray-700 dark:text-gray-400 dark:hover:text-white md:hover:text-blue-700 md:dark:hover:text-white hidden sm:flex'>{wallet.addr.substring(0, 6) + '...' + wallet.addr.substring(wallet.addr.length - 4)}</span>
                        <Logo addr={wallet.addr} />
                    </div>
                }
                style={{ minWidth: "fit-content" }}
            >
                {
                    items.map((item) => (
                        <Dropdown.Item key={item.href} onClick={() => { setHidden(); navigate(item.href); }}>
                            {item.title}
                        </Dropdown.Item>
                    ))
                }

                <Dropdown.Item onClick={() => { setHidden(); onLogout() }}>
                    {t('Log Out')}
                </Dropdown.Item>

            </Dropdown>
        </div>
    );
}

export default WalletConnect;
