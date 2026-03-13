import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/getBaseUrl';

export const couponApi = createApi({
    reducerPath: 'couponApi',
    // ব্যাকএন্ডে যদি app.use('/api/coupon', ...) থাকে, তবে এখানেও 'coupon' হবে
    baseQuery: fetchBaseQuery({ baseUrl: `${getBaseUrl()}/api/coupon` }), 
    endpoints: (builder) => ({
        applyCoupon: builder.mutation({
            query: (data) => ({
                url: '/apply-coupon',
                method: 'POST',
                body: data, // সরাসরি ডাটা (যেমন: {code: "SAVE20"}) পাঠাবে
            }),
        }),
    }),
});

export const { useApplyCouponMutation } = couponApi;