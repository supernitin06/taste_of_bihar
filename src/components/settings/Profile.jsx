import React, { useState, useEffect } from "react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { useUpdateRestaurantMutation, useGetRestaurantByIdQuery } from '../../api/services/resturentsapi'
import { showSuccessAlert, showErrorAlert } from "../../utils/toastAlert";

const Profile = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    logo: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get restaurant details
  const { data: restaurantData } = useGetRestaurantByIdQuery(restaurantId, {
    skip: !restaurantId,
  });

  const [updateRestaurant] = useUpdateRestaurantMutation();

  // Initialize with existing data
  useEffect(() => {
    if (restaurantData?.data) {
      setFormData({
        name: restaurantData.data.name || "",
        brandName: restaurantData.data.brandName || "",
        logo: restaurantData.data.logo || "",
        ownerName: restaurantData.data.ownerName || "",
        email: restaurantData.data.email || "",
        phone: restaurantData.data.phone || "",
        address: restaurantData.data.address || "",
      });
    }
  }, [restaurantData]);

  // Get restaurant ID from localStorage or context
  useEffect(() => {
    const id = localStorage.getItem("restaurantId");
    if (id) setRestaurantId(id);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await updateRestaurant({
        id: restaurantId,
        body: {
          name: formData.name,
          brandName: formData.brandName,
          logo: formData.logo,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }
      }).unwrap();

      if (response.success) {
        showSuccessAlert(response.message || "Restaurant updated successfully");
      }
    } catch (error) {
      showErrorAlert(error?.data?.message || "Failed to update restaurant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="highlight text-3xl font-bold">Restaurant Profile</h2>
        <p className="text-muted mt-1">Public restaurant information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Restaurant Name" 
          placeholder="Enter restaurant name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField 
          label="Brand Name" 
          placeholder="Enter brand name"
          name="brandName"
          value={formData.brandName}
          onChange={handleChange}
        />
        <InputField 
          label="Owner Name" 
          placeholder="Enter owner name"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
        />
        <InputField 
          label="Restaurant Email" 
          type="email" 
          placeholder="Enter your Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField 
          label="Phone Number" 
          placeholder="Enter your Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputField 
          label="Restaurant Address" 
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <InputField 
          label="Logo URL" 
          placeholder="Enter logo URL"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
