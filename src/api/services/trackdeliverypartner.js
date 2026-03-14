import {baseApi} from "./baseApi";

const trackDeliveryPartnerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        trackDeliveryPartner: builder.query({
            query: (orderId) => ({
                url: `admin/orders/${orderId}/track`,
                method: "GET",
            }),
            providesTags: ["trackDeliveryPartner"],
        }),
    }),
});

export const { useTrackDeliveryPartnerQuery } = trackDeliveryPartnerApi;