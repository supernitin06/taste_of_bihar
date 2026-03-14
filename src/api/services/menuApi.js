// src/api/services/menuApi.js
import { baseApi } from "./baseApi";

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= MENU =================
    getMenus: builder.query({
      query: () => ({
        url: `admin/menu`,
        method: "GET",
      }),
      providesTags: ["Menu"],
    }),

    addMenu: builder.mutation({
      query: (formData) => ({
        url: "admin/menu",
        method: "POST",
        data: formData,
        params: {}, // Ensure no query params are appended
      }),
      invalidatesTags: ["Menu"],
    }),

    updateMenu: builder.mutation({
      query: ({ id, payload }) => ({
        url: `admin/menu/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Menu"],
    }),

    updateMenuStockStatus: builder.mutation({
      query: ({ id, inStock }) => ({
        url: `admin/menu/${id}/inStock`,
        method: "PATCH",
        data: { inStock },
      }),
      invalidatesTags: ["Menu"],
    }),

    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `admin/menu/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menu"],
    }),

    // ================= CATEGORY =================
    getCategories: builder.query({
      query: () => ({
        url: `admin/cat`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    addCategory: builder.mutation({
      query: (payload) => ({
        url: "admin/cat",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, payload }) => ({
        url: `admin/cat/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Category"],
    }),

    // ENABLE / DISABLE CATEGORY (TOGGLE)
    toggleCategoryStatus: builder.mutation({
      query: ({ categoryId }) => ({
        url: `admin/cat/${categoryId}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),


    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `admin/cat/${id}`,
        method: "DELETE",
        data: { isActive: false },
      }),
      invalidatesTags: ["Category"],
    }),

    // ================= SUB-CATEGORY =================
    getSubCategories: builder.query({
      query: () => ({
        url: `admin/subcat`,
        method: "GET",
      }),
      providesTags: ["SubCategory"],
    }),

    addSubCategory: builder.mutation({
      query: (formData) => ({
        url: "admin/subcat",
        method: "POST",
        data: formData,
        params: {}, // Ensure no query params
      }),
      invalidatesTags: ["SubCategory"],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/subcat/${id}`,
        method: "PUT",
        data: formData,
        params: {}, // Ensure no query params
      }),
      invalidatesTags: ["SubCategory"],
    }),

    toggleSubCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `admin/subcat/${id}/toggle-status`,
        method: "PATCH",
        params: {}, // Ensure no query params
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `admin/subcat/${id}`,
        method: "DELETE",
        params: {}, // Ensure no query params
      }),
      invalidatesTags: ["SubCategory"],
    }),

    dailyMenuSendToUser: builder.mutation({
      query: ({ payload }) => ({
        url: "admin/notifications/schedule-daily",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useAddMenuMutation,
  useUpdateMenuMutation,
  useUpdateMenuStockStatusMutation,
  useDeleteMenuMutation,
  useDailyMenuSendToUserMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryStatusMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useToggleSubCategoryStatusMutation,
  useDeleteSubCategoryMutation,
} = menuApi;
