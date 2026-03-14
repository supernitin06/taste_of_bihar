import { baseApi } from "./baseApi";

export const deliveryPartnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryPartners: builder.query({
      query: () => ({
        url: "admin/delivery-partners",
        method: "GET",
      }),
      providesTags: ["DeliveryPartner"],
    }),
    getNewDeliveryPartners: builder.query({
      query: () => ({
        url: "admin/delivery-partners/new",
        method: "GET",
      }),
      providesTags: ["DeliveryPartner"],
    }),
    createDeliveryPartner: builder.mutation({
      query: (payload) => ({
        url: "admin/delivery-partners/create",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["DeliveryPartner"],
    }),
    EditDeliveryPartner: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `admin/delivery-partners/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["DeliveryPartner"],
    }),
    getdeliveryPartnerOrders: builder.query({
      query: (id) => ({
        url: `admin/delivery-partners/${id}/orders`,
        method: "GET",
      }),
      providesTags: ["DeliveryPartner"],
    }),

    updateDeliveryPartner: builder.mutation({
      query: ({ id }) => ({
        url: `admin/delivery-partners/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["DeliveryPartner"],
    }),

    approveDeliveryPartner: builder.mutation({
      query: (id) => ({
        url: `admin/delivery-partners/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DeliveryPartner"],
    }),

    rejectDeliveryPartner: builder.mutation({
      query: (id) => ({
        url: `admin/delivery-partners/partnerid/reject/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["DeliveryPartner"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetDeliveryPartnersQuery,
  useCreateDeliveryPartnerMutation,
  useEditDeliveryPartnerMutation,
  useGetdeliveryPartnerOrdersQuery,
  useUpdateDeliveryPartnerMutation,
  useApproveDeliveryPartnerMutation,
  useRejectDeliveryPartnerMutation,
  useGetNewDeliveryPartnersQuery,
} = deliveryPartnerApi;