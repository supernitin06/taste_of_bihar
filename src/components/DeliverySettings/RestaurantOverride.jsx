import React, { useState } from 'react';
import { FaStore, FaSearch, FaGlobe, FaCog } from 'react-icons/fa';
import InputField from '../ui/InputField';

const RestaurantOverride = () => {
    // Mock Data
    const [restaurants, setRestaurants] = useState([
        { id: 1, name: 'Spicy Treats', mode: 'global' },
        { id: 2, name: 'Burger King - CP', mode: 'custom' },
        { id: 3, name: 'Pizza Hut', mode: 'global' },
        { id: 4, name: 'Dominos', mode: 'global' },
        { id: 5, name: 'KFC', mode: 'custom' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMode = (id) => {
        setRestaurants(restaurants.map(r =>
            r.id === id ? { ...r, mode: r.mode === 'global' ? 'custom' : 'global' } : r
        ));
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="card-header flex justify-between items-center bg-gradient-to-r from-orange-50 to-white dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400 shadow-inner">
                        <FaStore className="text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Restaurant Overrides</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Set specific rules per outlet</p>
                    </div>
                </div>
            </div>

            <div className="md:p-8 p-2 flex-1 flex flex-col gap-6">
                {/* Search */}
                <div>
                    <InputField
                        type="text"
                        placeholder="Search for a restaurant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startIcon={<FaSearch />}
                    />
                </div>

                {/* List */}
                <div className="overflow-y-auto pr-2 border border-gray-100 dark:border-gray-700 rounded-2xl divide-y divide-gray-100 dark:divide-gray-700 custom-scrollbar bg-gray-50 dark:bg-gray-900/20">
                    {filteredRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="p-4 flex justify-between items-center hover:bg-white dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-gray-700 dark:text-gray-200">{restaurant.name}</span>
                                <span className={`text-xs flex items-center gap-1.5 font-medium ${restaurant.mode === 'global' ? 'text-gray-400 dark:text-gray-500' : 'text-orange-500 dark:text-orange-400'}`}>
                                    {restaurant.mode === 'global' ? (
                                        <><FaGlobe size={10} /> Using Global Rules</>
                                    ) : (
                                        <><FaCog size={10} /> Custom Configuration</>
                                    )}
                                </span>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => toggleMode(restaurant.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all shadow-sm ${restaurant.mode === 'global'
                                    ? 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                                    }`}
                            >
                                {restaurant.mode === 'global' ? 'Customize' : 'Manage Rules'}
                            </button>
                        </div>
                    ))}
                    {filteredRestaurants.length === 0 && (
                        <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">No restaurants found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantOverride;
