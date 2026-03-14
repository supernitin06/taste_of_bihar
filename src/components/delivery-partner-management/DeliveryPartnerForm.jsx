// DeliveryPartnerForm.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { X } from "lucide-react";
import { useCreateDeliveryPartnerMutation, useUpdateDeliveryPartnerMutation } from "../../api/services/deliveryPartnerApi";

const DeliveryPartnerForm = ({ onClose, partner }) => {
  const [createPartner, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError }] = useCreateDeliveryPartnerMutation();
  const [updatePartner, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateDeliveryPartnerMutation();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  const [serverError, setServerError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    restaurantId: "695b5ae21b755e7a004ca320", // Hardcoded for now
    vehicleType: "BIKE",
    image: null,
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.registrationData.name || "",
        phone: partner.registrationData.mobileNumber || "",
        email: partner.registrationData.email || "",
        password: "",
        restaurantId: "695b5ae21b755e7a004ca320",
        vehicleType: partner.registrationData.vehicleType || "BIKE",
        image: null,
      });
    }
  }, [partner]);

  // Removed useEffect for error/success handling as toast handles it now

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "vehicleType") {
      setFormData((prev) => ({ ...prev, vehicleType: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null); // Reset error on new submission
    const { image, ...payload } = formData;

    try {
      if (partner) {
        const updatePayload = { id: partner.partnerId, ...payload };
        if (!updatePayload.password) delete updatePayload.password;

        await toast.promise(
          updatePartner(updatePayload).unwrap(),
          {
            loading: 'Updating partner...',
            success: 'Partner updated successfully!',
            error: (err) => err?.data?.message || "Failed to update partner"
          }
        );
      } else {
        await toast.promise(
          createPartner(payload).unwrap(),
          {
            loading: 'Creating partner...',
            success: 'Partner created successfully!',
            error: (err) => err?.data?.message || "Failed to create partner"
          }
        );
      }
      onClose();
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{partner ? "Edit Delivery Partner" : "Add Delivery Partner"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Server Error Display */}
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{serverError}</span>
            </div>
          )}

          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary transition">
              {formData.image ? (
                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Upload Photo</span>
              )}
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
            </label>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <InputField name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} required />
            <InputField name="email" placeholder="Email" value={formData.email} onChange={handleChange} required type="email" />
            <InputField name="password" placeholder={partner ? "Password (leave blank to keep)" : "Password"} value={formData.password} onChange={handleChange} required={!partner} type="password" />
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary">
              <option value="BIKE">Bike</option>
              <option value="SCOOTER">Scooter</option>
            </select>
            <InputField name="restaurantId" placeholder="Restaurant ID" value={formData.restaurantId} onChange={handleChange} required disabled />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading}>
              {isLoading ? "Saving..." : (partner ? "Update Partner" : "Create Partner")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default DeliveryPartnerForm;
