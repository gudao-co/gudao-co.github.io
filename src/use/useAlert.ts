import { AlertColors } from "flowbite-react";
import { nextTick } from "process";
import { ComponentProps, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

export interface AlertOptions {
    title: ReactNode
    duration?: number
    color?: keyof AlertColors;
    icon?: FC<ComponentProps<'svg'>>;
}

let _st: [AlertOptions | undefined, Dispatch<SetStateAction<AlertOptions | undefined>>]

export function setAlert(v: AlertOptions | undefined) {
    if (_st && _st[0] !== v) {
        nextTick(() => {
            _st[1](v)
        })
    }
}

export default function useAlert(): [AlertOptions | undefined, Dispatch<SetStateAction<AlertOptions | undefined>>] {

    _st = useState()

    return _st;
}