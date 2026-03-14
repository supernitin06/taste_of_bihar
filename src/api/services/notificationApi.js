import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/admin/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // 🔥 ADD THIS
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/admin/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation, 
} = notificationApi;
