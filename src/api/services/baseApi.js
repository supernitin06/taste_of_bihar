import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { logout } from "../services/authSlice";

/* ---------------- AXIOS INSTANCE ---------------- */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "https://resto-grandma.onrender.com/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});
/* ---------------- AXIOS BASE QUERY ---------------- */
const axiosBaseQuery =
  () =>
    async ({ url, method, data, body, params, headers, admin, SubAdmin,Notification }, api) => {
      try {
        const state = api.getState();
        const token = state?.auth?.authToken;
        const payload = data || body;
        const isFormData = payload instanceof FormData;

        const result = await axiosInstance({
          url,
          method,
          data: payload,
          params,
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : undefined,
            ...(isFormData && { "Content-Type": undefined }),
          },
        });

        return { data: result.data };
      } catch (error) {
        const err = error;

        // 🔐 Auto logout on unauthorized
        if (err?.response?.status === 401) {
          api.dispatch(logout());
        }

        return {
          error: {
            status: err?.response?.status,
            data: err?.response?.data || err.message,
          },
        };
      }
    };

/* ---------------- RTK QUERY BASE API ---------------- */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "User", "Order", "Menu", "Category", "Dashboard", "Restaurant", "DeliveryPartner", "Banner", "trackDeliveryPartner"],
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
});
