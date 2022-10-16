import { nextTick } from "process";
import { Dispatch, SetStateAction, useState } from "react";

export interface WalletChoosesOptions {
    allowClosed?: boolean
}

let _st: [WalletChoosesOptions | undefined, Dispatch<SetStateAction<WalletChoosesOptions | undefined>>]

export function setWalletChooses(v: WalletChoosesOptions | undefined) {
    if (_st && _st[0] !== v) {
        nextTick(() => {
            _st[1](v)
        })
    }
}

export default function useWalletChooses(): [WalletChoosesOptions | undefined, Dispatch<SetStateAction<WalletChoosesOptions | undefined>>] {

    _st = useState()

    return _st;
}