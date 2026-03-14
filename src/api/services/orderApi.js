import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ORDERS
    getOrders: builder.query({
      query: (params = {}) => ({
        url: "admin/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // ✅ Add this mutation
    assignDelivery: builder.mutation({
      query: ({ orderId, partnerId }) => ({
        url: `admin/delivery-partners/order/${orderId}/assign`,
        method: "PATCH",
        body: { partnerId: partnerId },
      }),
      invalidatesTags: ["Order", "DeliveryPartner"], // optional
    }),


    updateOrderStatus: builder.mutation({
      query: ({ id, status, message }) => ({
        url: `admin/orders/${id}/admin-status`,
        method: "PATCH",
        body: { status },

      }),
      invalidatesTags: ["Order"],
    }),


    updateKitchenStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `admin/orders/${orderId}/kitchen-status`,
        method: "PATCH",
        body: { status },

      }),
      invalidatesTags: ["Order"],
    }),

    // 🔹 ASSIGN DELIVERY PARTNER

  }),

  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateKitchenStatusMutation,
  useAssignDeliveryMutation,
} = orderApi;
