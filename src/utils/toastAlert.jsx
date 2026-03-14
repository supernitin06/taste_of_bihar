import toast from 'react-hot-toast';
import React from 'react';

export const showSuccessAlert = (message) => {
    console.log("Toast Triggered:", message);
    toast.success(message);
};

export const showErrorAlert = (message) => {
    toast.error(message);
};

export const showInfoAlert = (message) => {
    toast(message, {
        icon: 'ℹ️',
    });
};

export const showWarningAlert = (message) => {
    toast(message, {
        icon: '⚠️',
    });
};

export const showConfirmAlert = (message, confirmText = 'Yes', cancelText = 'No') => {
    return new Promise((resolve) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            {/* Icon could go here */}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve({ isConfirmed: true });
                        }}
                        className="w-full border-r border-gray-200 dark:border-gray-700 rounded-none p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve({ isConfirmed: false });
                        }}
                        className="w-full rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
        });
    });
};

// Helper for loading promises
export const showPromiseToast = (promise, messages = { loading: 'Loading...', success: 'Success!', error: 'Error' }) => {
    return toast.promise(promise, messages);
}
