import React, { useState } from "react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { useUpdateTaxMutation } from "../../api/services/taxApi";
import toast from "react-hot-toast";

const Tax = () => {
  const [gst, setGst] = useState("");

  const [updateTax, { isLoading }] = useUpdateTaxMutation();

  const handleSave = async () => {
    if (!gst) {
      toast.error("Please enter GST percentage");
      return;
    }

    try {
      const payload = {
        gstPercentage: Number(gst),
      };

      const res = await updateTax(payload).unwrap();

      toast.success(res.message || "GST updated successfully");
    } catch (error) {
      console.error("ERROR:", error);
      toast.error(
        error?.data?.message || "Failed to update GST"
      );
    }
  };

  return (
    <div className="card space-y-6">
      <h2 className="highlight text-3xl font-bold">Tax & Charges</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="GST (%)"
          placeholder="Enter GST Percentage"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save GST"}
        </Button>
      </div>
    </div>
  );
};

export default Tax;
