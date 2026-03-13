import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'

const orderApi = createApi({
    reducerPath: 'orderApi',
     baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/order`,
        credentials: 'include'
     }),
    tagTypes: ["Order"],
    endpoints: (builder)=> ({
        // get order by emailc
        getOrdersByEmail: builder.query({
            query: (email)=> ({
                url: `/${email}`,
                method: 'GET'
            }),
            providesTags: ["Order"]
        }),

        // get orders by id
        getOrderById: builder.query({
            query: (orderId)=> ({
                url: `../api/order/order/${orderId}`,
                method: 'GET'
            }),
            providesTags: ["Order"]
        }),

        // get all orders
        getAllOrder: builder.query({
            query: ()=> ({
                url: '/',
                method: 'GET'
            }),
            providesTags: ["Order"]
        }),

        // update order status
        updateOrderStatus: builder.mutation({
            query: ({id, status}) => ({
                url: `/update-order-status/${id}`,
                method: "PATCH",
                body: {status},
            }),
            invalidatesTags: ["Order"]
        }),

        // delete order
        deleteOrderbyId:builder.mutation({
            query: (id) => ({
                url: `/delete-order/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{type:"Order", id }]
        })

     })
})

export const {useGetOrdersByEmailQuery, useGetOrderByIdQuery, useGetAllOrderQuery, useUpdateOrderStatusMutation, useDeleteOrderbyIdMutation} = orderApi;
export default orderApi;