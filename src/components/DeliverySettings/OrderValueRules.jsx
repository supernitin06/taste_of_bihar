import React, { useState } from 'react';
import { FaPlus, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import InputField from '../ui/InputField';

const OrderValueRules = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [slabs, setSlabs] = useState([
        { id: 1, min: 0, max: 299, fee: 40 },
        { id: 2, min: 300, max: 599, fee: 20 },
        { id: 3, min: 600, max: Infinity, fee: 0 },
    ]);

    const addSlab = () => {
        const lastSlab = slabs[slabs.length - 1];
        const newMin = lastSlab ? (lastSlab.max === Infinity ? lastSlab.min + 100 : lastSlab.max + 1) : 0;
        setSlabs([...slabs, { id: Date.now(), min: newMin, max: Infinity, fee: 20 }]);
    };

    const removeSlab = (id) => {
        setSlabs(slabs.filter(s => s.id !== id));
    };

    const updateSlab = (id, field, value) => {
        setSlabs(slabs.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className={`transition-all duration-300 ${!isEnabled ? 'opacity-60 grayscale' : ''}`}>
            <div className="card overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                <div className="card-header flex justify-between items-center bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
                            <FaMoneyBillWave className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Order Value Rules</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Charge based on total cart amount</p>
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer flex items-center gap-3">
                            <span className="label-text text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{isEnabled ? 'Active' : 'Inactive'}</span>
                            <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                        </label>
                    </div>
                </div>

                {isEnabled && (
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                                <thead className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="px-2 pb-2">Cart Value Range (₹)</th>
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
                                                            placeholder="0"
                                                            className="text-center"
                                                        />
                                                    </div>
                                                    <span className="text-gray-400 font-medium">to</span>
                                                    {slab.max === Infinity ? (
                                                        <span className="flex-1 w-24 text-center font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 block">Above</span>
                                                    ) : (
                                                        <div className="w-24">
                                                            <InputField
                                                                type="number"
                                                                value={slab.max}
                                                                onChange={(e) => updateSlab(slab.id, 'max', parseInt(e.target.value))}
                                                                placeholder="Max"
                                                                className="text-center"
                                                            />
                                                        </div>
                                                    )}
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
                                                    title="Remove Slab"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={addSlab}
                            className="mt-6 flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-bold text-sm gap-2"
                        >
                            <FaPlus size={14} /> Add New Pricing Slab
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderValueRules;
