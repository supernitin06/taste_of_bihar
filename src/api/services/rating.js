import { baseApi } from "./baseApi";

export const ratingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ================= RATING =================
        getRatings: builder.query({
            query: () => ({
                url: "rating",
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),
    }),
});

export const { useGetRatingsQuery } = ratingApi;