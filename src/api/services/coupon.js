import { baseApi } from "./baseApi";

export const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: (page = 1, limit = 10) => ({ url: `admin/coupons?page=${page}&limit=${limit}&isExpired=false`, method: "get" }),
            providesTags: ["Coupon"],
        }),
        getCoupon: builder.query({
            query: (id) => ({ url: `admin/coupons/${id}`, method: "get" }),
            providesTags: ["Coupon"],
        }),
        addCoupon: builder.mutation({
            query: (body) => ({ url: "admin/coupons", method: "post", data: body }),
            invalidatesTags: ["Coupon"],
        }),
        updateCouponStatus: builder.mutation({
            query: ({ id, body }) => ({ url: `admin/coupons/${id}/status`, method: "patch" }),
            invalidatesTags: ["Coupon"],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, body }) => ({ url: `admin/coupons/${id}`, method: "put", data: body }),
            invalidatesTags: ["Coupon"],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({ url: `admin/coupons/${id}`, method: "delete" }),
            invalidatesTags: ["Coupon"],
        }),
    }),
});

export const { useGetCouponsQuery, useGetCouponQuery, useAddCouponMutation, useUpdateCouponMutation, useUpdateCouponStatusMutation, useDeleteCouponMutation } = couponApi;