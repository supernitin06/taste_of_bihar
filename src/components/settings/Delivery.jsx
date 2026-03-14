import React from "react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const Delivery = () => {
  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">🚚</div>
        <div>
          <h2 className="highlight text-3xl font-bold">Delivery Settings</h2>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputField label="Minimum Order Amount" placeholder="Enter Order Amount" />
        </div>

        <div>
          <InputField label="Delivery Charge" placeholder="Enter Delivery Charge"/>
        </div>

        <div>
          <InputField label="Delivery Radius (km)" placeholder="Enter Radius"/>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button variant="primary">
          💾 Save Delivery Settings
        </Button>
      </div>
    </div>
  );
};

export default Delivery;
