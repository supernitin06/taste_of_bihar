import React from "react";
import { AiFillStar } from "react-icons/ai";
import Button from "../ui/Button";

const trendingItems = [
    { id: 1, name: "Cheese Pizza", price: "₹299", rating: 4.6 },
    { id: 2, name: "Paneer Butter Masala", price: "₹249", rating: 4.5 },
    { id: 3, name: "Veg Burger", price: "₹149", rating: 4.4 },
    { id: 4, name: "White Sauce Pasta", price: "₹219", rating: 4.3 },
    { id: 5, name: "Masala Dosa", price: "₹129", rating: 4.7 },
];

const TrendingMenu = () => {
    return (
        <div className="bg-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-primary">
                    🔥 Trending Menu
                </h3>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                    View all
                </span>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto">
                {trendingItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                    >
                        {/* Left */}
                        <div>
                            <p className="text-sm font-medium text-primary">
                                {item.name}
                            </p>
                            <p className="text-xs text-primary opacity-60">{item.price}</p>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <AiFillStar />
                                <span className="text-primary font-medium">
                                    {item.rating}
                                </span>
                            </div>

                            <Button variant="primary" size="sm" className="rounded-md hover:bg-blue-700 transition">
                                Add
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingMenu;
