import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'


const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/products`,
        prepareHeaders: (headers, { getState }) => {
            // আপনার রিডাক্স স্টোর থেকে টোকেনটি নিন (auth স্লাইস অনুযায়ী নাম পরিবর্তন হতে পারে)
            const token = getState().auth.token; 
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include'
     }),
     tagTypes: ["Products"],
     endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: ({category, color, minPrice, maxPrice, page=1, limit=10})=> {
                const queryParams = new URLSearchParams({
                    category: category || '',
                    color: color || '',
                    minPrice: minPrice || 0,
                    maxPrice: maxPrice || '',
                    page: page.toString(),
                    limit: limit.toString()
                })
                return `/?${queryParams}`
            },
            providesTags: ["Products"]
        }),
        fetchProductByid: builder.query({
            query: (id)=> `/${id}`,
            providesTags: (result, error, id) => [{type: "Products", id}]
        }),
        addProduct: builder.mutation({
            query: (newProduct)=> ({
                url: "/create-product",
                method: 'POST',
                body: newProduct,
                credentials: 'include'
            }),
            invalidatesTags: ["Products"]
        }),
        updateProduct: builder.mutation({
            query: ({id, ...rest})=> ({
                url: `/update-product/${id}`,
                method: 'PATCH',
                body: rest
            }),
            invalidatesTags: ["Products"]
        }),
        deleteProduct: builder.mutation({
            query: (id)=> ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id)=> [{type: "Products", id}]
        })
     })
})

export const {useFetchAllProductsQuery, useFetchProductByidQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation} = productApi;
export default productApi;