import { Network, NetworkSet } from "gudao-co-core/dist/network";
import { getCurrentWallet, WalletEvent, on, off } from "gudao-co-core/dist/wallet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useNetwork(): [Network | undefined, Dispatch<SetStateAction<Network | undefined>>] {

    let w = getCurrentWallet()
    let network = w ? NetworkSet[w.chainId] : undefined

    let r = useState<Network | undefined>(network)

    useEffect(() => {
        let fn = () => {
            let w = getCurrentWallet()
            let network = w ? NetworkSet[w.chainId] : undefined
            r[1](network)
        };
        on(WalletEvent.CURRENT_CHANGED, fn)
        return () => {
            off(WalletEvent.CURRENT_CHANGED, fn)
        }
    })

    return r;
}