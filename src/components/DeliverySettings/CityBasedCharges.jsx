import React, { useState } from 'react';
import { FaCity, FaPlus, FaTrash, FaMapPin } from 'react-icons/fa';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const CityBasedCharges = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [cityRules, setCityRules] = useState([
        { id: 1, city: 'Delhi', fee: 30 },
        { id: 2, city: 'Noida', fee: 40 },
        { id: 3, city: 'Mumbai', fee: 50 },
    ]);
    const [newCity, setNewCity] = useState('');
    const [newFee, setNewFee] = useState('');

    const addCity = (e) => {
        e.preventDefault();
        if (!newCity || !newFee) return;
        setCityRules([...cityRules, { id: Date.now(), city: newCity, fee: parseInt(newFee) }]);
        setNewCity('');
        setNewFee('');
    };

    const removeCity = (id) => {
        setCityRules(cityRules.filter(r => r.id !== id));
    };

    return (
        <div className={`transition-all duration-300 ${!isEnabled ? 'opacity-60 grayscale' : ''}`}>
            <div className="card overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 h-full flex flex-col">
                <div className="card-header flex justify-between items-center bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 shadow-inner">
                            <FaCity className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Flat City Fees</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fixed rate per city</p>
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer flex items-center gap-3">
                            <span className="label-text text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{isEnabled ? 'Active' : 'Inactive'}</span>
                            <input type="checkbox" className="toggle toggle-secondary toggle-sm" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                        </label>
                    </div>
                </div>

                {isEnabled && (
                    <div className="p-8 flex-1 flex flex-col">

                        {/* Add New City Form */}
                        <form onSubmit={addCity} className="flex gap-4 mb-6 items-start">
                            <div className="flex-1">
                                <InputField
                                    type="text"
                                    placeholder="Enter City Name"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    startIcon={<FaMapPin />}
                                />
                            </div>
                            <div className="w-32">
                                <InputField
                                    type="number"
                                    placeholder="Fee"
                                    value={newFee}
                                    onChange={(e) => setNewFee(e.target.value)}
                                    startIcon={<span className="text-xs">₹</span>}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!newCity || !newFee}
                                className="mt-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition-all shadow-sm hover:shadow-md transform active:scale-95 flex items-center justify-center min-w-[50px]"
                            >
                                <FaPlus />
                            </Button>
                        </form>

                        {/* City List */}
                        <div className="overflow-y-auto max-h-[300px] pr-2 space-y-3 custom-scrollbar">
                            {cityRules.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No city specific rules added yet.</p>
                                </div>
                            ) : (
                                cityRules.map((rule) => (
                                    <div key={rule.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 group hover:border-purple-200 dark:hover:border-purple-500/30 transition-all hover:shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-black border border-gray-100 dark:border-gray-600 shadow-sm text-xs tracking-wider">
                                                {rule.city.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-700 dark:text-gray-200">{rule.city}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="font-black text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-600">₹{rule.fee}</span>
                                            <Button
                                                onClick={() => removeCity(rule.id)}
                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 p-0 bg-transparent shadow-none w-auto"
                                            >
                                                <FaTrash size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityBasedCharges;
