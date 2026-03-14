import { useState } from "react";
import Button from "../../components/ui/Button";
import emailIcon from "../../assets/email.png";
import smsIcon from "../../assets/sms.png";
import whatsappIcon from "../../assets/whatsapp.png";

const Notifications = () => {
  const [selectedMethods, setSelectedMethods] = useState(["Email"]);

  const toggleMethod = (method) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== method));
    } else {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  const notificationMethods = [
    {
      name: "Email",
      label: "Email Notifications",
      icon: emailIcon,
      description: "Receive notifications via email.",
    },
    {
      name: "SMS",
      label: "SMS Notifications",
      icon: smsIcon,
      description: "Receive notifications via SMS messages.",
    },
    {
      name: "WhatsApp",
      label: "WhatsApp Notifications",
      icon: whatsappIcon,
      description: "Receive notifications on WhatsApp.",
    },
  ];

  return (
    <div className="card space-y-6 py-6 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <h2 className="highlight text-3xl font-bold text-gray-900 dark:text-white">Notifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notificationMethods.map((method) => {
          const isSelected = selectedMethods.includes(method.name);
          return (
          <div
            key={method.name}
            className={`relative flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md
              ${isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500/50"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            onClick={() => toggleMethod(method.name)}
          >
            <div className="w-12 h-12 mb-4 p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm flex items-center justify-center">
              <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{method.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{method.description}</p>
            </div>
            {isSelected && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
            )}
          </div>
        )})}
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="primary" onClick={() => console.log(selectedMethods)}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
