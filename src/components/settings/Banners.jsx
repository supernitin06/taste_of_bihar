import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Edit icon
import { MdToggleOn, MdToggleOff } from "react-icons/md"; // Enable/Disable icon
import toast, { Toaster } from "react-hot-toast"; // Toast notifications
import Button from "../../components/ui/Button";
import "./banner.css";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useToggleBannerStatusMutation,
} from "../../api/services/bannerApi";

const Banners = () => {
  const { data, isLoading, isFetching, refetch } = useGetBannersQuery({
    page: 1,
    limit: 10,
    isActive: true,
  });

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [toggleStatus] = useToggleBannerStatusMutation();

  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    link: "",
    order: "",
  });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    if (formData.image) payload.append("image", formData.image);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("link", formData.link);
    payload.append("order", formData.order);

    try {
      if (editId) {
        await updateBanner({ id: editId, formData: payload }).unwrap();
        toast.success("Banner updated successfully!");
        setEditId(null);
      } else {
        await createBanner(payload).unwrap();
        toast.success("Banner created successfully!");
      }

      setFormData({ image: null, title: "", description: "", link: "", order: "" });
      refetch(); // Refresh banner list
    } catch (err) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error creating/updating banner:", err);
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner._id);
    setFormData({
      image: null,
      title: banner.title || "",
      description: banner.description || "",
      link: banner.link || "",
      order: banner.order || "",
    });
  };

  const handleStatusToggle = async (banner) => {
    try {
      await toggleStatus(banner._id).unwrap();
      toast.success(
        `Banner ${banner.isActive ? "disabled" : "enabled"} successfully!`
      );
      refetch();
    } catch (err) {
      toast.error("Failed to toggle banner status!");
      console.error("Error toggling status:", err);
    }
  };

  const banners = data?.data || [];

  return (
    <div className="card p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Banner Management
      </h2>

      {/* FLEX: FORM LEFT, LIST RIGHT */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* FORM */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 bg-gray-50 dark:bg-gray-700/20 p-6 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Banner Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter banner title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                name="description"
                placeholder="Enter banner description"
                required
                value={formData.description}
                onChange={handleChange}
                className="input w-full h-24 resize-none pt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Redirect Link</label>
                <input
                  type="text"
                  name="link"
                  placeholder="/menu/offers"
                  required
                  value={formData.link}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display Order</label>
                <input
                  type="number"
                  name="order"
                  placeholder="e.g. 1"
                  required
                  value={formData.order}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Button type="submit" className="px-8 py-3 rounded-xl shadow-lg font-medium w-full sm:w-auto">
                {editId ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </div>

        {/* BANNER LIST */}
        <div className="flex-1 relative">
          <div
            className="lg:absolute lg:inset-0 h-[500px] lg:h-auto overflow-y-auto border rounded-xl p-3 bg-gray-50 dark:bg-gray-700/30 shadow"
          >
          {isLoading || isFetching ? (
            <p>Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No banners available.
            </p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full md:w-32 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {banner.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {banner.description}
                    </p>
                    <p className="text-xs text-indigo-600">{banner.link}</p>
                    <span className="text-xs font-medium text-gray-500">
                      Order: {banner.order}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Status: {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(banner)}
                      className="px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <FiEdit /> Edit
                    </Button>
                    <Button
                      onClick={() => handleStatusToggle(banner)}
                      className="px-3 py-1 text-sm flex items-center gap-1"
                    >
                      {banner.isActive ? <MdToggleOff /> : <MdToggleOn />}
                      {banner.isActive ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
