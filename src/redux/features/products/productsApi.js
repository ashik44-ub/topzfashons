import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'

const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/products`,
        prepareHeaders: (headers) => {
            // ১. সরাসরি localStorage থেকে টোকেন নিন, যাতে রিফ্রেশ করলে সমস্যা না হয়
            const token = localStorage.getItem('token'); 
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
            query: ({category, color, minPrice, maxPrice, page=1, limit=10}) => {
                const queryParams = new URLSearchParams({
                    category: category || '',
                    color: color || '',
                    minPrice: minPrice || 0,
                    maxPrice: maxPrice || '',
                    page: page.toString(),
                    limit: limit.toString()
                });
                // স্ল্যাশ (/) এর পজিশন ঠিক করা হয়েছে
                return `?${queryParams}`; 
            },
            providesTags: ["Products"]
        }),
        
        fetchProductByid: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{type: "Products", id}]
        }),

        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: "/create-product",
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ["Products"]
        }),

        updateProduct: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/update-product/${id}`,
                method: 'PATCH',
                body: rest
            }),
            invalidatesTags: ["Products"]
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            // ডিলিট হলে পুরো লিস্ট রিফ্রেশ করার জন্য সিম্পল ট্যাগ ব্যবহার করাই ভালো
            invalidatesTags: ["Products"]
        })
    })
})

export const {
    useFetchAllProductsQuery, 
    useFetchProductByidQuery, 
    useAddProductMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation
} = productApi;

export default productApi;