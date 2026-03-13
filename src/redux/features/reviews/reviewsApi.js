import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'

const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/reviews`,
        credentials: 'include'
    }),
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        postAReview: builder.mutation({
            query: (reviewData)=> ({
                url: '/post-review',
                method: 'POST',
                body: reviewData
            }),
            invalidatesTags: (result, error, {postId})=> [{type: "Reviews", id: postId}]
        }),
        getReviewsCount: builder.query({
            query: ()=> ({
                url: "/total-reviews"
            })
        }),
        getReviewsByUserId: builder.query({
            query: (userId)=> ({
                url: `/${userId}`
            }),
            providesTags: (result)=> result ? [{type: "Reviews", id: result[0]?.email}] : []
        })
    })
})

export const {useGetReviewsByUserIdQuery, useGetReviewsCountQuery, usePostAReviewMutation} = reviewsApi;

export default reviewsApi;