import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isDangerous = false }) => {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} title="">
            <div className="flex flex-col items-center text-center p-4">
                <div className={`p-3 rounded-full mb-4 ${isDangerous ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-blue-100 text-blue-500'}`}>
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    {message}
                </p>

                <div className="flex gap-3 w-full justify-center">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDangerous ? "danger" : "primary"}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
