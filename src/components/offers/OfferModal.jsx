import React, { useEffect, useState } from "react";
import Button from "../ui/Button";

const EMPTY_FORM = {
  offerId: "",
  title: "",
  description: "",
  image: "",
  discountType: "percentage", // या "flat"
  discountValue: "",
  minOrderValue: "",
  status: "active",
  validity: { startDate: "", endDate: "" },
};

const OfferModal = ({ isOpen, mode, offer, onClose, onSave }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      setFormData(EMPTY_FORM);
    } else {
      setFormData(offer || EMPTY_FORM);
    }
  }, [isOpen, mode, offer]);

  if (!isOpen) return null;

  const isView = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("validity.")) {
      const field = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        validity: { ...p.validity, [field]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="card card-elevated w-full max-w-2xl bg-[var(--bg-card)] p-6 rounded-xl animate-scaleIn">
          <h2 className="text-xl font-bold mb-4 capitalize">{mode} Offer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              disabled={isView}
              className="input col-span-2"
              placeholder="Offer Title"
            />

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              disabled={isView}
              className="input col-span-2 min-h-[80px]"
              placeholder="Description"
            />

            <input
              name="image"
              type="file"
              onChange={handleChange}
              disabled={isView}
              className="input col-span-2"
              placeholder="Image URL"
            />

            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              disabled={isView}
              className="input"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>

            <input
              type="number"
              name="discountValue"
              value={formData.discountValue || ""}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Discount Value"
            />

            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue || ""}
              onChange={handleChange}
              disabled={isView}
              className="input"
              placeholder="Min Order Value"
            />

            <input
              type="date"
              name="validity.startDate"
              value={formData.validity?.startDate || ""}
              onChange={handleChange}
              disabled={isView}
              className="input"
            />

            <input
              type="date"
              name="validity.endDate"
              value={formData.validity?.endDate || ""}
              onChange={handleChange}
              disabled={isView}
              className="input"
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

export default OfferModal;