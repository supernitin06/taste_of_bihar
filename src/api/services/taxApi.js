// src/api/services/taxApi.js
import { baseApi } from "./baseApi";

export const taxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateTax: builder.mutation({
      query: (payload) => ({
        url: "admin/dashboard/gst-tax", 
        method: "PUT", 
        body: payload,
      }),
    }),
  }),   
});

export const { useUpdateTaxMutation } = taxApi;
