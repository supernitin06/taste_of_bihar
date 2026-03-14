import { baseApi } from "./baseApi";


const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: () => ({
                url: "admin/dashboard/analytics",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
        getRevenueChart: builder.query({
            query: (period) => ({
                url: "admin/dashboard/revenue-chart",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),
        getOrderChart: builder.query({
            query: (period) => ({
                url: "admin/dashboard/orders-chart",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),
        getCategorySales: builder.query({
            query: (period) => ({
                url: "admin/dashboard/category-sales",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),
    })
})
 
export const { useGetAnalyticsQuery, useGetRevenueChartQuery, useGetOrderChartQuery, useGetCategorySalesQuery } = dashboardApi;