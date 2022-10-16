import { Dropdown, Spinner } from 'flowbite-react';
import { switchNetwork } from 'gudao-co-core/dist/wallet';
import { useRef, useState } from 'react';
import { Network, Networks } from 'gudao-co-core/dist/network';
import useWallet from '../use/useWallet';
import useWalletReady from '../use/useWalletReady';
import useNetwork from '../use/useNetwork';
import React from 'react';

function NetworkChooses() {
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const [network,] = useNetwork()
    const [loadingType, setLoadingType] = useState("")
    const dropdown = useRef<HTMLDivElement>(null)

    if (!isReady) {
        return (<></>)
    }

    if (!wallet) {
        return (<></>)
    }

    const setHidden = () => {
        if (dropdown.current) {
            dropdown.current.parentElement!.click()
        }
    };

    const onChooses = (item: Network) => {
        setLoadingType(item.chainId)
        switchNetwork(wallet, item).then((rs) => {
            setHidden()
            setLoadingType("")
        }, (reason) => {
            setLoadingType("")
        })
    }

    return (
        <div className='hidden sm:flex'>
            <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                    <span ref={dropdown} className='py-2 cursor-pointer text-gray-700 dark:text-gray-400 dark:hover:text-white md:hover:text-blue-700 md:dark:hover:text-white'>{network ? network.title : 'Network(' + wallet.chainId + ')'}</span>
                }>
                {
                    Networks.map((item) => (
                        <Dropdown.Item key={item.chainId} onClick={() => { onChooses(item); }}>
                            <div className='flex flex-row flex-nowrap items-center'  >
                                <span className='mr-2 text-sm'>{item.title}</span>
                                <Spinner hidden={loadingType !== item.chainId} size="sm" style={{ lineHeight: "100%" }} color="success" light={true}></Spinner>
                            </div>
                        </Dropdown.Item>
                    ))
                }
            </Dropdown>
        </div>
    );
}

export default NetworkChooses;
