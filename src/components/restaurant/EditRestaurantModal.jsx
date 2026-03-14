import React from "react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

const EditRestaurantModal = ({
  editRestaurant,
  setEditRestaurant,
  onSave,
  onCancel,
}) => {
  if (!editRestaurant) return null;

  return (
    /* OVERLAY (white + blur) */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* MODAL */}
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden animate-fadeIn border border-gray-200 dark:border-gray-700">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">Edit Restaurant</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900">

          <InputField
            label="Restaurant Name"
            value={editRestaurant.name || ""}
            onChange={(e) =>
              setEditRestaurant({ ...editRestaurant, name: e.target.value })
            }
            
          />

          <InputField
            label="Brand Name"
            value={editRestaurant.brandName || ""}
            onChange={(e) =>
              setEditRestaurant({
                ...editRestaurant,
                brandName: e.target.value,
              })
            }
          />

          <InputField
            label="Logo URL"
            value={editRestaurant.logo || ""}
            onChange={(e) =>
              setEditRestaurant({ ...editRestaurant, logo: e.target.value })
            }
          />

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button className="flex-1" onClick={onSave}>
              Save Changes
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
