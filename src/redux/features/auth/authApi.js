import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/getBaseUrl'


const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        prepareHeaders: (headers) => {
            // ১. যদি আপনি টোকেন LocalStorage-এ সেভ করে থাকেন, তবে সেটি এখান থেকে নিয়ে হেডারে সেট করুন
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
                url: '/resend-otp', // আপনার ব্যাকএন্ডের রিসেন্ড ওটিপি ইউআরএল
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
            })
        }),
        getAllUsers: build.query({
            query: () => ({
                url: "/users",
                method: 'GET'
            }),
            refetchOnMount: true,
            providesTags: ["Users"], // Eita thakle list ta refresh hobe
        }),
        deleteUser: build.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"], // Delete hole list auto refresh hobe
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