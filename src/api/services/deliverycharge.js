import { baseApi } from "../services/baseApi";


const deliveryChargeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDeliveryCharge: builder.query({
            query: (restaurantId) => ({
                url: `admin/restaurant/${restaurantId}/delivery-settings`,
                method: "GET",
            }),
            providesTags: ["DeliveryCharge"]
        }), 

        updateDeliveryCharge: builder.mutation({
            query: ({ data, id }) => ({
                url: `admin/restaurant/${id}`,
                method: "PUT",
                data,
            }),
            providesTags: ["DeliveryCharge"]
        }),

        freeDelivery: builder.mutation({
            query: ({ data, id }) => ({
                url: `admin/restaurant/${id}`,
                method: "PUT",
                data,
            }),
            providesTags: ["DeliveryCharge"]
        })
    })
})

export const { useGetDeliveryChargeQuery, useUpdateDeliveryChargeMutation, useFreeDeliveryMutation } = deliveryChargeApi