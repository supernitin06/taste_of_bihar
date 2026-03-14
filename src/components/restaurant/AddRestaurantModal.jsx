import React, { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const AddRestaurantModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      setFormData({
        ...formData,
        logo: file
      });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we'll use a placeholder URL since we can't upload files directly
    // In a real implementation, you'd upload the file to a server first
    const submitData = {
      ...formData,
      logo: logoPreview || 'https://example.com/placeholder-logo.png'
    };
    onSave(submitData);
    setFormData({ name: '', brandName: '', logo: null });
    setLogoPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-sidebar p-6 text-white">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Add New Restaurant</h2>
            <Button
              className="text-white hover:text-red-200 text-2xl p-0 bg-transparent shadow-none w-8 h-8 flex items-center justify-center"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <InputField
              label="Restaurant Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Brand Name"
              name="brandName"
              type="text"
              value={formData.brandName}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Logo
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
            <Button type="submit" variant="primary" className="flex-1">
              Add Restaurant
            </Button>
            <Button type="button" variant="danger" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
