

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl';

const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/stats`,
        credentials: 'include'
    }),
    tagTypes: ["Stats"],
    endpoints: (builder) => ({
        // user stats
        getUserStats: builder.query({
            query: (email)=> ({
                url: `/user-stats/${email}`,
                method: 'GET'
            }),
            providesTags: ["Stats"]
        }),
        // admin stats
        getAdminStats: builder.query({
            query: ()=> ({
                url: `/admin-stats`,
                method: 'GET'
            }),
            providesTags: ["Stats"]
        })
    })
})


export const { useGetUserStatsQuery, useGetAdminStatsQuery } = statsApi;

export default statsApi;