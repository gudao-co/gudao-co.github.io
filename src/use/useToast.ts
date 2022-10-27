import { AlertColors } from "flowbite-react";
import { nextTick } from "process";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface ToastOptions {
    body: ReactNode
    duration?: number
    color?: keyof AlertColors
    icon?: ReactNode
}

let _st: [ToastOptions | undefined, Dispatch<SetStateAction<ToastOptions | undefined>>]

export function showToast(v: ToastOptions | undefined) {
    if (_st) {
        nextTick(() => {
            _st[1](v)
        })
    }
}

export default function useToast(): [ToastOptions | undefined, Dispatch<SetStateAction<ToastOptions | undefined>>] {

    _st = useState()

    return _st;
}