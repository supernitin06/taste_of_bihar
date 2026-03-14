import React, { useState } from 'react';
import { FaPlus, FaTrash, FaMapMarkedAlt, FaRoad } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { showSuccessAlert, showErrorAlert } from '../../utils/toastAlert';
import InputField from '../ui/InputField';
import { useUpdateDeliveryChargeMutation, useFreeDeliveryMutation, useGetDeliveryChargeQuery } from '../../api/services/deliverycharge';

const DistanceRules = () => {
    const user = useSelector((state) => state.auth.user);
    const { data: deliveryData, isLoading: isFetching } = useGetDeliveryChargeQuery(user?.restaurantId, {
        skip: !user?.restaurantId,
    });
    const [updateDeliveryCharge, { isLoading }] = useUpdateDeliveryChargeMutation();

    const [isEnabled, setIsEnabled] = useState(false);
    const [maxDistance, setMaxDistance] = useState(20);
    const [freeDeliveryAbove, setFreeDeliveryAbove] = useState("");
    const [slabs, setSlabs] = useState([
        { id: 1, min: 0, max: 5, fee: 0 },
        { id: 2, min: 5, max: 10, fee: 20 },
        { id: 3, min: 10, max: 15, fee: 40 },
        { id: 4, min: 15, max: 20, fee: 60 },
    ]);

    React.useEffect(() => {
        if (deliveryData && deliveryData.success) {
            const { distanceSlabs, maxDeliveryDistanceKm, isActive, freeDeliveryAbove } = deliveryData.data;
            setIsEnabled(isActive);
            setMaxDistance(maxDeliveryDistanceKm);
            if (freeDeliveryAbove) setFreeDeliveryAbove(freeDeliveryAbove);

            if (distanceSlabs && distanceSlabs.length > 0) {
                const mappedSlabs = distanceSlabs.map((s, index) => ({
                    id: Date.now() + index,
                    min: s.minKm,
                    max: s.maxKm,
                    fee: s.charge
                }));
                setSlabs(mappedSlabs);
            }
        }
    }, [deliveryData]);

    const addSlab = () => {
        const lastSlab = slabs[slabs.length - 1];
        const newMin = lastSlab ? lastSlab.max : 0;
        const newMax = newMin + 5;
        setSlabs([...slabs, { id: Date.now(), min: newMin, max: newMax, fee: 30 }]);
    };

    const removeSlab = (id) => {
        setSlabs(slabs.filter(s => s.id !== id));
    };

    const updateSlab = (id, field, value) => {
        setSlabs(slabs.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = async () => {
        if (!user?.restaurantId) {
            showErrorAlert("Restaurant ID not found");
            return;
        }

        const payload = {
            distanceSlabs: slabs.map(s => ({
                minKm: s.min,
                maxKm: s.max,
                charge: s.fee
            })),
            maxDeliveryDistanceKm: maxDistance,
            isActive: isEnabled,
            freeDeliveryAbove: freeDeliveryAbove ? parseFloat(freeDeliveryAbove) : null
        };

        try {
            await updateDeliveryCharge({
                id: user.restaurantId,
                data: payload
            }).unwrap();
            showSuccessAlert("Delivery rules updated successfully");
        } catch (error) {
            console.error("Failed to update delivery rules", error);
            showErrorAlert(error?.data?.message || "Failed to update delivery rules");
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500">Loading delivery settings...</div>;
    }

    return (
        <div className={`transition-all duration-300 ${!isEnabled ? 'opacity-80' : ''}`}>
            <div className="card overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                <div className="card-header flex justify-between items-center bg-gradient-to-r from-teal-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl text-teal-600 dark:text-teal-400 shadow-inner">
                            <FaMapMarkedAlt className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Distance Based Rules</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate fee based on KM</p>
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer flex items-center gap-3">
                            <span className="label-text text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{isEnabled ? 'Active' : 'Inactive'}</span>
                            <input type="checkbox" className="toggle toggle-accent toggle-sm" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                        </label>
                    </div>
                </div>

                <div className="p-8 space-y-8">

                    {/* Max Distance Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 border border-teal-100 dark:border-teal-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm text-teal-500 dark:text-teal-400">
                                    <FaRoad className="text-lg" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">Max Distance</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Serviceable Radius</p>
                                </div>
                            </div>
                            <div className="w-32">
                                <InputField
                                    type="number"
                                    value={maxDistance}
                                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                                    endIcon={<span className="text-xs font-bold text-gray-400">KM</span>}
                                    className="text-center font-bold"
                                />
                            </div>
                        </div>

                        {/* Free Delivery Above Config */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm text-emerald-500 dark:text-emerald-400">
                                    <span className="text-lg font-bold">₹</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">Free Delivery</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Above Order Value</p>
                                </div>
                            </div>
                            <div className="w-32 relative">
                                <InputField
                                    type="number"
                                    value={freeDeliveryAbove}
                                    onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                                    startIcon={<span className="text-xs">₹</span>}
                                    className="text-right font-bold text-emerald-600"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slabs */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                            <thead className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-2 pb-2">Distance Range (KM)</th>
                                    <th className="px-2 pb-2">Delivery Fee (₹)</th>
                                    <th className="px-2 pb-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {slabs.map((slab) => (
                                    <tr key={slab.id} className="group">
                                        <td className="px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24">
                                                    <InputField
                                                        type="number"
                                                        value={slab.min}
                                                        onChange={(e) => updateSlab(slab.id, 'min', parseInt(e.target.value))}
                                                        className="text-center"
                                                    />
                                                </div>
                                                <span className="text-gray-400 font-medium">-</span>
                                                <div className="w-24">
                                                    <InputField
                                                        type="number"
                                                        value={slab.max}
                                                        onChange={(e) => updateSlab(slab.id, 'max', parseInt(e.target.value))}
                                                        className="text-center"
                                                    />
                                                </div>
                                                <span className="text-gray-400 font-bold text-xs uppercase ml-1">km</span>
                                            </div>
                                        </td>
                                        <td className="px-2">
                                            <div className="w-32 relative">
                                                <InputField
                                                    type="number"
                                                    value={slab.fee}
                                                    onChange={(e) => updateSlab(slab.id, 'fee', parseInt(e.target.value))}
                                                    startIcon={<span className="text-xs">₹</span>}
                                                    className={`text-right ${slab.fee === 0 ? 'text-emerald-600' : ''}`}
                                                />
                                                {slab.fee === 0 && <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Free</span>}
                                            </div>
                                        </td>
                                        <td className="px-2 text-right align-middle">
                                            <button
                                                onClick={() => removeSlab(slab.id)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={addSlab}
                            className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-500 dark:hover:border-teal-400 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all font-bold text-sm gap-2"
                        >
                            <FaPlus size={14} /> Add Distance Slab
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full py-3 btn-primary  font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistanceRules;
