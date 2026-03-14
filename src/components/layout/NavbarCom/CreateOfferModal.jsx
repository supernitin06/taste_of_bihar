import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar } from "lucide-react";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";

const CreateOfferModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    expiry: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", code: "", description: "", expiry: "" });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.title && formData.code && formData.description && formData.expiry;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Create New Offer</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Title</label>
            <InputField 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g., Summer Sale" 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Code</label>
              <InputField 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                placeholder="e.g., SUMMER2024" 
                className="w-full uppercase bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-700 dark:text-gray-200"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              rows="3"
              placeholder="Enter offer details..."
            ></textarea>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onClose} disabled={!isFormValid}>Create Offer</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateOfferModal;