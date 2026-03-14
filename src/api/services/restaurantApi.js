import { baseApi } from "./baseApi";

export const restaurantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all restaurants
        getAllRestaurants: builder.query({
            query: (params) => ({
                url: "admin/restaurants",
                method: "GET",
                params,
            }),
            providesTags: ["Restaurant"],
        }),

        // Get single restaurant details
        getRestaurantDetails: builder.query({
            query: (id) => `admin/restaurant/${id}`,
            providesTags: (result, error, id) => [{ type: "Restaurant", id }],
        }),

        // Create new restaurant
        createRestaurant: builder.mutation({
            query: (body) => ({
                url: "admin/restaurant/add",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Restaurant"],
        }),

        // Update restaurant
        updateRestaurant: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `admin/restaurant/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Restaurant", id }, "Restaurant"],
        }),

        // Delete restaurant
        deleteRestaurant: builder.mutation({
            query: (id) => ({
                url: `admin/restaurant/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Restaurant"],
        }),

        // Update restaurant status (Approve/Suspend)
        updateRestaurantStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `admin/restaurant/status/${id}`, // Adjust endpoint if needed
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Restaurant", id }, "Restaurant"],
        }),
    }),
});

export const {
    useGetAllRestaurantsQuery,
    useGetRestaurantDetailsQuery,
    useCreateRestaurantMutation,
    useUpdateRestaurantMutation,
    useDeleteRestaurantMutation,
    useUpdateRestaurantStatusMutation,
} = restaurantApi;
