import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType = {
    data: MessageResponse;
} | {
    error: FetchBaseQueryError | SerializedError;
}

export const responseToast = (res: ResType, navigate: NavigateFunction | null, url: string) => {
    if ("data" in res) {
        toast.success(res.data.message);

        if (navigate) {
            navigate(url);
        }
    }
    else {
        const error = res.error as FetchBaseQueryError;
        const messageResponse = error.data as MessageResponse;
        toast.error(messageResponse.message)
    }
};

export const getLastMonths = () => {
    const currentDate = moment(); // we took the currenct data

    currentDate.date(1); // here we set date = 1 i.e, current month ki pahili tarik

    const lastSixMonths: string[] = [];
    const lastTwelveMonths: string[] = [];

    for (let i = 0; i < 6; i++) {
        const monthDate = currentDate.clone().subtract(i, "months");
        const monthName = monthDate.format("MMMM");
        lastSixMonths.unshift(monthName); // unshift means we have to add at the first
    }

    for (let i = 0; i < 12; i++) {
        const monthDate = currentDate.clone().subtract(i, "months");
        const monthName = monthDate.format("MMMM");
        lastTwelveMonths.unshift(monthName); // unshift means we have to add at the first
    }

    return {
        lastSixMonths,
        lastTwelveMonths
    }
}