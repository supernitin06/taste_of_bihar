import React, { useState } from 'react';
import { FaTruck, FaSortAmountDown } from 'react-icons/fa';
import OrderValueRules from '../components/DeliverySettings/OrderValueRules';
import DistanceRules from '../components/DeliverySettings/DistanceRules';
import CityBasedCharges from '../components/DeliverySettings/CityBasedCharges';
import RestaurantOverride from '../components/DeliverySettings/RestaurantOverride';
import RulePriority from '../components/DeliverySettings/RulePriority';
import Button from '../components/ui/Button';

const DeliverySettings = () => {
    const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState('rules'); // rules | priority
    return (
        <div className="page ">
            <div className=" space-y-8">
                {/* Header Section */}
                {/* Header Section */}
                <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                    <div>
                        <h1 className="highlight text-4xl font-extrabold tracking-tight">
                            Delivery Charge
                        </h1>
                        <p className="text-primary opacity-70 mt-2 text-lg font-medium">
                            Manage delivery pricing, rules, and priorities across your platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600">
                            <span className={`text-sm font-bold ${isDeliveryEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {isDeliveryEnabled ? 'Delivery Charges Active' : 'Delivery Charges Disabled'}
                            </span>
                            <Button
                                onClick={() => setIsDeliveryEnabled(!isDeliveryEnabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${isDeliveryEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${isDeliveryEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-primary p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
                    <Button
                        onClick={() => setActiveTab('rules')}
                        variant={activeTab === 'rules' ? 'primary' : 'ghost'}
                    >
                        <FaTruck className={activeTab === 'rules' ? 'animate-pulse' : ''} />
                        Pricing Rules
                    </Button>
                    <Button
                        onClick={() => setActiveTab('priority')}
                        variant={activeTab === 'priority' ? 'primary' : 'ghost'}
                    >
                        <FaSortAmountDown />
                        Priority & Logic
                    </Button>
                </div>

                <div className="transition-all duration-500 ease-in-out">
                    {activeTab === 'rules' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                                {/* <OrderValueRules /> */}
                                <DistanceRules />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                {/* <CityBasedCharges /> */}
                                {/* <RestaurantOverride /> */}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-primary rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-primary mb-6">Execution Priority</h2>
                            <p className="text-primary opacity-70 mb-8 max-w-2xl">
                                Determine which rule takes precedence when multiple rules apply to a single order. Drag and drop to reorder.
                            </p>
                            <RulePriority />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliverySettings;
