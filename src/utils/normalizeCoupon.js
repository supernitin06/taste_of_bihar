// utils/normalize.js  (या normalizeCoupon.js अगर पहले से है तो उसी में जोड़ दो)

export const normalizeCoupon = (coupon) => {
    return {
        id: coupon.couponId, // unique ID for table row key
        code: coupon.columns.code, // display code like "WELCOME50"
        discountType: coupon.columns.discountType === "%" ? "percentage" : "fixed", // "percentage" or "fixed"
        discountValue: coupon.columns.discountValue, // number value
        minOrderAmount: coupon.couponDetail.minimumOrderValue || "",
        status: coupon.columns.status.toLowerCase(), // "active", "inactive", "expired"
        usedCount: 0, // अगर backend से आए तो use करो, अभी static
        usageLimit: coupon.couponDetail.usageLimit || null,
        validity: coupon.couponDetail.validity || { startDate: "", endDate: "" },
        canEdit: coupon.actions.canEdit,
        canDeactivate: coupon.actions.canDeactivate,
        raw: coupon // original data if needed later
    };
};

export const normalizeOffer = (offer) => {
    return {
        offerId: offer.offerId, // unique ID
        title: offer.columns.title, // display title like "Mega Sale"
        discountType: offer.columns.discountType === "%" ? "percentage" : "flat", // "percentage" or "flat"
        discountValue: offer.columns.discountValue, // number value
        minOrderValue: offer.offerDetail.minimumOrderValue || "",
        status: offer.columns.status.toLowerCase(), // "active", "inactive", "expired"
        usageLimit: offer.offerDetail.usageLimit || null,
        validity: offer.offerDetail.validity || { startDate: "", endDate: "" },
        actions: offer.actions, // { canEdit, canDeactivate }
        raw: offer
    };
};