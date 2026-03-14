import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useGetCouponQuery } from "../../api/services/coupon";

const EMPTY_FORM = {
  id: "",
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  maxDiscountLimit: "",
  minOrderAmount: "",
  startDate: "",
  expiryDate: "",
  usageLimit: "",
  usageLimitPerUser: "",
  status: "active",
  canEdit: true,
};

const CouponModal = ({ isOpen, mode, coupon, onClose, onSave }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data: fetchedCouponData, isLoading: isFetching } = useGetCouponQuery(coupon?._id || coupon?.id, {
    skip: !isOpen || mode === 'add' || (!coupon?._id && !coupon?.id),
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      setFormData(EMPTY_FORM);
    } else if (fetchedCouponData) {
      // Handle unwrapping if response is like { data: { ... } } or just { ... }
      // Based on typical patterns, let's assume direct or data property. 
      // If the API returns { data: coupon }, use fetchedCouponData.data.
      // We'll try to support both tentatively or assume standard structure.
      // Let's assume the API returns the object directly or we'll assume fetchedCouponData contains the fields we need.
      // However, often APIs wrap in 'data'. Let's check userapi response? No sample. 
      // I'll assume fetchedCouponData or fetchedCouponData.data
      const data = fetchedCouponData.data || fetchedCouponData;
      setFormData({
        ...EMPTY_FORM,
        ...data,
        // Ensure dates/compatible fields if needed
      });
    } else if (coupon) {
      setFormData(coupon);
    }
  }, [isOpen, mode, coupon, fetchedCouponData]);

  if (!isOpen) return null;

  const isView = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="card card-elevated w-full max-w-2xl bg-[var(--bg-card)] p-6 rounded-xl animate-scaleIn">
          <h2 className="text-xl font-bold mb-4 capitalize">
            {mode} Coupon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Coupon Code"
            />

            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              disabled={isView}
              className="input"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>

            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Discount Value"
            />

            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Min Order Amount"
            />

            <div className="col-span-1 md:col-span-2">
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isView}
                className="input w-full"
                placeholder="Description"
              />
            </div>

            <input
              type="number"
              name="maxDiscountLimit"
              value={formData.maxDiscountLimit}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Max Discount Limit"
            />

            <input
              type="date"
              name="startDate"
              value={formData.startDate ? formData.startDate.split('T')[0] : ''}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Start Date"
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Expiry Date"
            />

            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Total Usage Limit"
            />

            <input
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Usage Limit Per User"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isView}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="inactive" onClick={onClose}>
              Cancel
            </Button>

            {!isView && (
              <Button variant="primary" onClick={() => onSave(formData)}>
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponModal;
