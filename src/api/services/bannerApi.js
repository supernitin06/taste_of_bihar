// src/api/services/bannerApi.js
import { baseApi } from "./baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 GET ALL BANNERS
    getBanners: builder.query({
      query: ({ page = 1, limit = 10, isActive = true } = {}) => ({
        url: "admin/banners",
        method: "GET",
        params: { page, limit, isActive },
      }),
      providesTags: ["Banner"],
    }),

    // 🔹 GET SINGLE BANNER
    getBannerById: builder.query({
      query: (id) => ({
        url: `admin/banners/${id}`,
        method: "GET",
      }),
    }),

    // 🔹 CREATE BANNER
    createBanner: builder.mutation({
      query: (formData) => ({
        url: "admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),

    // 🔹 UPDATE BANNER
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/banners/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),

    // 🔹 TOGGLE STATUS
    toggleBannerStatus: builder.mutation({
      query: (id) => ({
        url: `admin/banners/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Banner"],
    }),

    // 🔹 REORDER BANNERS
    reorderBanners: builder.mutation({
      query: (banners) => ({
        url: "admin/banners/reorder",
        method: "POST",
        body: { banners },
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useToggleBannerStatusMutation,
  useReorderBannersMutation,
} = bannerApi;
