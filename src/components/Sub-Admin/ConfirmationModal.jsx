// components/ui/ConfirmationModal.jsx
import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/GlassCard';
import { ShieldCheck } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <div className="p-6 bg-gray-400">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12  dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
              <p className="text-muted mt-2">{message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;