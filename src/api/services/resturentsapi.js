import { baseApi } from "./baseApi";

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all restaurants
    getRestaurants: builder.query({
      query: () => ({
        url: "admin/restaurant",
        method: "GET",
      }),
      providesTags: ["Restaurants"],
    }),

    // ✅ GET restaurant by ID
    getRestaurantById: builder.query({
      query: (id) => ({
        url: `admin/restaurant/${id}`,
        method: "GET",
      }),
        providesTags: (result, error, id) => [{ type: "Restaurants", id }],
    }),

    // ✅ CREATE restaurant
    createRestaurant: builder.mutation({
      query: (data) => ({
        url: "admin/restaurant", // ✅ FIX URL
        method: "POST",
        data, // ✅ FIX (body → data)
      }),
      invalidatesTags: ["Restaurants"], 
    }),

    // ✅ TOGGLE status (PATCH)
    toggleRestaurantStatus: builder.mutation({
      query: (id) => ({
        url: `admin/restaurant/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // ✅ UPDATE restaurant (PUT)
    updateRestaurant: builder.mutation({
      query: ({ id, body }) => ({
        url: `admin/restaurant/${id}`,
        method: "PUT",
        data: body, // ✅ FIX
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // ✅ DELETE restaurant
    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: `admin/restaurant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurants"],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useToggleRestaurantStatusMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} = restaurantApi;
