import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/services/baseApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== "production",
});