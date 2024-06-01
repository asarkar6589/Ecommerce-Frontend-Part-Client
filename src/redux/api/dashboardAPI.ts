import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StatsResponse } from "../../types/api-types";

export const dashboardAPI = createApi({
    reducerPath: "dashboardAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`
    }),
    endpoints: (builder) => ({
        stats: builder.query<StatsResponse, string>({
            query: (id) => `stats?id=${id}`,
            keepUnusedDataFor: 0 // It mean no chaching of data will be done
        }),
        pie: builder.query<PieResponse, string>({
            query: (id) => `pie?id=${id}`,
            keepUnusedDataFor: 0 // It mean no chaching of data will be done
        }),
        bar: builder.query<BarResponse, string>({
            query: (id) => `bar?id=${id}`,
            keepUnusedDataFor: 0 // It mean no chaching of data will be done
        }),
        line: builder.query<LineResponse, string>({
            query: (id) => `line?id=${id}`,
            keepUnusedDataFor: 0 // It mean no chaching of data will be done
        }),
    })
});

export const {
    useBarQuery,
    useStatsQuery,
    useLineQuery,
    usePieQuery,
} = dashboardAPI;

/*

We have 2 things, useBarQuey and useLazyBarQuery, the difference between them is that, when we call useBarQuery, we get the data there, but with lazyBar, we get one trigger, we it will be triggered, then only the data will be fetched.

*/