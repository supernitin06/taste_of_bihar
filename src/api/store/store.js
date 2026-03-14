import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "../services/authSlice";
import { orderApi } from "../services/orderApi";
import { menuApi } from "../services/menuApi";
import { userApi } from "../services/userapi";
import { restaurantApi } from "../services/resturentsapi";
import { deliveryPartnerApi } from "../services/deliveryPartnerApi";
import { bannerApi } from "../services/bannerApi";
import { invoiceApi } from "../services/invoice"
import { taxApi } from "../services/taxApi";
import { adminApi } from "../services/adminApi";
import { notificationApi } from "../services/notificationApi";
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [deliveryPartnerApi.reducerPath]: deliveryPartnerApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [taxApi.reducerPath]: taxApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, orderApi.middleware, userApi.middleware, restaurantApi.middleware, deliveryPartnerApi.middleware,  bannerApi.middleware, invoiceApi.middleware, adminApi.middleware, notificationApi.middleware,
),
    devTools: import.meta.env.MODE !== "production",
});