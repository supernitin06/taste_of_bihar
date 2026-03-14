// src/api/services/adminApi.js
import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 1. GET ALL SUB ADMINS
    getSubAdmins: builder.query({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // 2. CREATE SUB ADMIN (FORM DATA)
    createSubAdmin: builder.mutation({
      query: (formData) => ({
        url: "/admin/create",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: ["Admin"],
    }),

    //  3. UPDATE ADMIN PERMISSIONS
    updateAdminPermissions: builder.mutation({
      query: ({ id, permissions }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        body: { permissions },
      }),
      invalidatesTags: ["Admin"],
    }),

    // 4. GET ADMIN BY ID
    getAdminById: builder.query({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // 5. DELETE ADMIN
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),

    // 6. TOGGLE ADMIN STATUS
    toggleAdminStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin"],
    }),

  }),
});

export const {
  useGetSubAdminsQuery,
  useCreateSubAdminMutation,
  useUpdateAdminPermissionsMutation,
  useGetAdminByIdQuery,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
} = adminApi;
