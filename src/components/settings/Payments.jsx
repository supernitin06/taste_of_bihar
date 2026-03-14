import React from "react";
import Button from "../../components/ui/Button";
import cashIcon from "../../assets/cash.png"; 
import upiIcon from "../../assets/upi.png";
import cardIcon from "../../assets/card.png";
import { useState } from "react";
import "./Payments.css";

const paymentMethods = [
  {
    id: 1,
    name: "Cash",
    description: "Pay with cash on delivery.",
    icon: cashIcon,
  },
  {
    id: 2,
    name: "UPI",
    description: "Pay using UPI apps like Google Pay, PhonePe.",
    icon: upiIcon,
  },
  {
    id: 3,
    name: "Card",
    description: "Pay using credit or debit card.",
    icon: cardIcon,
  },
];

const Payments = () => {
  const [selectedPayment, setSelectedPayment] = useState(1); // default Cash

  return (
    <div className="payments-card card p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="highlight text-3xl font-bold text-gray-900 dark:text-white">
        Payment Methods
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const isSelected = selectedPayment === method.id;
          return (
            <div
              key={method.id}
              className={`payment-card py-4 px-2 rounded-xl flex items-start gap-6 border transition cursor-pointer 
                ${isSelected
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg scale-105"
                  : "border-gray-200 bg-gray-50 dark:bg-gray-700/20 hover:shadow-md hover:scale-105"
                }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <img
                src={method.icon}
                alt={method.name}
                className="w-14 h-14 object-contain"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button className="save-btn px-6 py-2 rounded-lg font-semibold shadow-md">
          Save Payment Settings
        </Button>
      </div>
    </div>
  );
};

export default Payments;
