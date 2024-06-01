/// <reference types="vite/client" />

import { ReactElement } from "react"

export type DataType = {
    _id: string,
    amount: number,
    quantity: number,
    discount: number,
    status: ReactElement,
    action: ReactElement
}