
import React from 'react';
import { CheckCircle, Clock, ChefHat, Bike, Package } from 'lucide-react';

const steps = [
    { status: 'PLACED', label: 'Placed', icon: Clock },
    { status: 'ACCEPTED', label: 'Accepted', icon: CheckCircle },
    { status: 'READY', label: 'Ready', icon: ChefHat },
    { status: 'OUT_FOR_DELIVERY', label: 'On Way', icon: Bike },
    { status: 'DELIVERED', label: 'Delivered', icon: Package },
];

const getStepIndex = (status) => {
    switch (status) {
        case 'PLACED': return 0;
        case 'ACCEPTED':
        case 'PREPARING': return 1;
        case 'READY':
        case 'ASSIGNED': return 2;
        case 'OUT_FOR_DELIVERY':
        case 'PICKED': return 3;
        case 'DELIVERED':
        case 'COMPLETED': return 4;
        default: return -1;
    }
};

const OrderTimeline = ({ currentStatus, timeline = [] }) => {
    // Find current step index using the helper
    const currentIndex = getStepIndex(currentStatus);

    // Helper to get time for a specific status (or its aliases) from timeline
    const getTimeForStatus = (stepStatus) => {
        // Define aliases for each step to look up in timeline
        const statusAliases = {
            'PLACED': ['PLACED'],
            'ACCEPTED': ['ACCEPTED', 'PREPARING'],
            'READY': ['READY', 'ASSIGNED'],
            'OUT_FOR_DELIVERY': ['OUT_FOR_DELIVERY', 'PICKED'],
            'DELIVERED': ['DELIVERED', 'COMPLETED']
        };

        const targetStatuses = statusAliases[stepStatus] || [stepStatus];

        // Find the first matching entry in the timeline
        const entry = timeline.find(t => targetStatuses.includes(t.status));

        if (!entry) return null;
        return new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full py-4 px-2">
            <div className="relative flex justify-between items-center w-full">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -z-10 rounded-full" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 rounded-full transition-all duration-500 -z-0"
                    style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const time = getTimeForStatus(step.status);
                    const Icon = step.icon;

                    return (
                        <div key={step.status} className="flex flex-col items-center gap-2 relative group flex-1">
                            {/* Step Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white dark:bg-gray-800
                  ${isCompleted
                                        ? 'border-green-500 text-green-600 dark:bg-green-500 dark:text-white shadow-lg shadow-green-500/20'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                                    }
                  ${isCurrent ? 'scale-110 ring-4 ring-green-500/20' : ''}
                `}
                            >
                                <Icon size={14} className={isCompleted ? 'dark:text-white' : ''} />
                            </div>

                            {/* Label & Time */}
                            <div className="absolute top-10 flex flex-col items-center w-24">
                                <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                  ${isCompleted ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}
                `}>
                                    {step.label}
                                </span>
                                {time && (
                                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                                        {time}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;
