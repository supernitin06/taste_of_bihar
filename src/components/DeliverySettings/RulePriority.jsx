import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaGripLines } from 'react-icons/fa';

const RulePriority = () => {
    const [rules, setRules] = useState([
        { id: 'restaurant', name: 'Restaurant Specific Rules', description: 'Overrides all other logic if set for a restaurant.', active: true },
        { id: 'distance', name: 'Distance Based Pricing', description: 'Calculates fee based on KM distance.', active: true },
        { id: 'orderValue', name: 'Order Value Slabs', description: 'Fee based on cart total (e.g. Free above ₹500).', active: true },
        { id: 'city', name: 'Flat City Fee', description: 'Fixed fee based on user location city.', active: false },
    ]);

    const moveRule = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === rules.length - 1)) return;

        const newRules = [...rules];
        const temp = newRules[index];
        newRules[index] = newRules[index + direction];
        newRules[index + direction] = temp;
        setRules(newRules);
    };

    const toggleRule = (id) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    }

    return (
        <div>

            <div className="space-y-4">
                {rules.map((rule, index) => (
                    <div key={rule.id} className={`flex items-center gap-6 bg-primary p-5 rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.01] ${rule.active
                        ? 'border-indigo-100 dark:border-indigo-900/30 shadow-md dark:shadow-none'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 grayscale'
                        }`}>
                        <div className="text-gray-300 dark:text-gray-600 cursor-move hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            <FaGripLines size={20} />
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-sm border border-indigo-100 dark:border-indigo-800 shadow-sm">
                            {index + 1}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold text-lg ${rule.active ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}>{rule.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{rule.description}</p>
                        </div>

                        <div className="flex items-center gap-2 border-l border-r border-gray-100 dark:border-gray-700 px-4">
                            <button
                                onClick={() => moveRule(index, -1)}
                                disabled={index === 0}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-300 disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            >
                                <FaArrowUp />
                            </button>
                            <button
                                onClick={() => moveRule(index, 1)}
                                disabled={index === rules.length - 1}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-300 disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            >
                                <FaArrowDown />
                            </button>
                        </div>

                        <div className="pl-2">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-lg hover:scale-110 transition-transform"
                                checked={rule.active}
                                onChange={() => toggleRule(rule.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl text-sm text-blue-800 dark:text-blue-200 shadow-sm">
                <strong className="block mb-3 text-base">Wait, how does this work?</strong>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                    {rules.filter(r => r.active).map((rule, idx) => (
                        <li key={rule.id} className="flex gap-2">
                            <span className="font-bold min-w-[60px]">Step {idx + 1}:</span>
                            <span>The system checks if <strong className="text-blue-900 dark:text-blue-100">{rule.name}</strong> applies. If yes, it uses that fee and stops.</span>
                        </li>
                    ))}
                    <li className="flex gap-2 text-blue-500 dark:text-blue-400 italic mt-2">
                        <span className="font-bold min-w-[60px]">Final:</span>
                        <span>If no rules match, the default delivery fee is applied.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default RulePriority;
