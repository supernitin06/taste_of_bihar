import { baseApi } from "./baseApi";

export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOffers: builder.query({
            query: () => ({
                url: "admin/offer",
                method: "GET",
            }),
            providesTags: ["Offers"],
        }),

        postOffer: builder.mutation({
            query: (data) => ({
                url: "admin/offer",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Offers"],
        }),

        updateOffer: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `admin/offer/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Offers"],
        }),

        deleteOffer: builder.mutation({
            query: (id) => ({
                url: `admin/offer/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Offers"],
        }),

        getActiveOffers: builder.query({
            query: () => ({
                url: "admin/offer/active",
                method: "GET",
            }),
            providesTags: ["Offers"],
        }),
        updateOfferStatus: builder.mutation({
            query: ({ id, body }) => ({
                url: `admin/offer/${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Offers"],
        }),
    }),
});


export const { useGetOffersQuery, usePostOfferMutation, useUpdateOfferMutation, useDeleteOfferMutation, useGetActiveOffersQuery, useUpdateOfferStatusMutation } = offerApi;
