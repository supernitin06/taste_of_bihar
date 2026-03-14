// src/api/services/userApi.js
import { baseApi } from "../../api/services/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: `admin/users?page=${page}&limit=${limit}`,
        method: "get",
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) =>
        ({ url: `admin/users/${id}`, method: "get" }),
      providesTags: ["User"],
    }),
    

    getUserDetails: builder.query({
      query: (id) => ({ url: `admin/users/${id}`, method: "get" }),
      providesTags: ["User"],
    }),

    getUserOrders: builder.query({
      query: (id) => ({ url: `admin/users/${id}/orders`, method: "get" }),
      providesTags: ["Order"],
    }),


    getUserOrderHistory: builder.query({
      query: (id) => ({ url: `admin/users/${id}/orders`, method: "get" }),
      providesTags: ["Order"],
    }),

    updateUserBlock: builder.mutation({
      query: ({ id, body }) => ({
        url: `admin/users/${id}/block`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserDetailsQuery,
  useGetUserOrdersQuery,
  useGetUserOrderHistoryQuery,
  useUpdateUserBlockMutation,
} = userApi;
