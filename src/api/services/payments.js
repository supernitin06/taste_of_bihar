import { baseApi } from "./baseApi";

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsstats: builder.query({
      query: () => ({
        url: `admin/dashboard/payments/analytics`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),
    getRecentPayments: builder.query({
      query: () => ({
        url: `admin/dashboard/payments/recent`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),

    getTransactionStats: builder.query({
      query: () => ({
        url: `admin/dashboard/transaction-stats`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),

    getRefundPayments: builder.query({
      query: () => ({
        url: `admin/refunds`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),


    getRefundRequest: builder.query({
      query: () => ({
        url: `admin/refunds/requests`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),

    refundAprroved: builder.mutation({
      query: ({ paymentId, status, orderId }) => ({
        url: `admin/refund/${paymentId}/action`,
        method: "patch",
        data: { action: status,
          orderId: orderId        },
      }),
      invalidatesTags: ["Payments"],
    }),

    // Added to support full transaction list with filters
    getTransactions: builder.query({
      query: (params) => ({
        url: `admin/dashboard/payments`,
        method: "get",
        params,
      }),
      providesTags: ["Payments"],
    }),

    getTransactionById: builder.query({
      query: ({ id, status }) => ({
        url: `admin/dashboard/payments/${id}`,
        method: "get",
        params: { status }
      }),
      providesTags: ["Payments"],
    }),

    SearchPayments: builder.query({
      query: (search) => ({
        url: `admin/dashboard/payments?search=${search}`,
        method: "get",
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetRecentPaymentsQuery,
  useGetPaymentsstatsQuery,
  useGetTransactionStatsQuery,
  useGetRefundPaymentsQuery,
  useSearchPaymentsQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetRefundRequestQuery,
  useRefundAprrovedMutation,
} = paymentsApi;