import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'

const authApi = createApi({
    reducerPath: 'authApi',
    // ট্যাগ টাইপস যোগ করা হলো যাতে ডেটা অটো-রিফ্রেশ হয়
    tagTypes: ["Users", "User"], 
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include'
    }),
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (newUser) => ({
                url: "/register",
                method: 'POST',
                body: newUser
            })
        }),
        loginUser: build.mutation({
            query: (credentials) => ({
                url: "/login",
                method: 'POST',
                body: credentials
            })
        }),
        verifyOTP: build.mutation({
            query: (data) => ({
                url: "/verify-otp",
                method: "POST",
                body: data,
            }),
        }),
        resendOTP: build.mutation({
            query: (data) => ({
                url: '/resend-otp',
                method: 'POST',
                body: data,
            }),
        }),
        forgotPassword: build.mutation({
            query: (data) => ({
                url: "/forget-password",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: build.mutation({
            query: (data) => ({
                url: "/reset-password",
                method: "POST",
                body: data,
            }),
        }),
        logoutUser: build.mutation({
            query: () => ({
                url: "/logout",
                method: 'POST'
            })
        }),
        editProfile: build.mutation({
            query: ({ id, profileData }) => ({
                url: `/edit-profile/${id}`,
                method: "PATCH",
                body: profileData
            }),
            // প্রোফাইল এডিট হলে ইউজারের ইনফো রিফ্রেশ হবে
            invalidatesTags: ["User"]
        }),
        getAllUsers: build.query({
            query: () => ({
                url: "/users",
                method: 'GET'
            }),
            providesTags: ["Users"], 
        }),
        deleteUser: build.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"], 
        }),
        updateUserRole: build.mutation({
            query: ({ userId, role }) => ({
                url: `/user/${userId}`,
                method: "PUT",
                body: { role }
            }),
            invalidatesTags: ["Users"],
        })
    })
})

export const {
    useLoginUserMutation,
    useLogoutUserMutation,
    useRegisterUserMutation,
    useEditProfileMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useVerifyOTPMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useResendOTPMutation
} = authApi;

export default authApi;