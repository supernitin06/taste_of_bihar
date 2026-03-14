import React from "react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const General = () => {
  return (
    <div className="bg-primary  space-y-6">
      
      <div className="p-6">
        <h2 className="highlight text-3xl mb-2 font-bold">General Settings</h2>
        <p className="text-muted">
          Basic restaurant and website configuration
        </p>
      </div>
      
      {/* Form */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        <InputField
          label="Restaurant Name"
          name="restaurantName"
          placeholder="Enter restaurant name"
          required
        />
        
        <InputField
          label="Website Title"
          name="websiteTitle"
          placeholder="Enter website title"
        />

        <InputField
          label="Support Email"
          name="supportEmail"
          type="email"
          placeholder="support@example.com"
        />

        <InputField
          label="Support Phone"
          name="supportPhone"
          placeholder="+91 98765 43210"
        />

        <InputField
          label="Currency"
          name="currency"
          placeholder="INR"
        />

        <InputField
          label="Time Zone"
          name="timezone"
          placeholder="Asia/Kolkata"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default General;
