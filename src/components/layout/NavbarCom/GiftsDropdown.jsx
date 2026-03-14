import React, { useState } from "react";
import { X, Gift, Copy, Tag, Plus, Check } from "lucide-react";
import Button from "../../ui/Button";

const GiftsDropdown = ({ isOpen, gifts, onClose, onCreateNew }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 transition-all duration-300 ease-in-out origin-top-right ${
        isOpen ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" : "opacity-0 translate-x-12 scale-95 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" /> Active Offers
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {gifts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No active offers
          </div>
        ) : (
          gifts.map((gift) => (
            <div key={gift.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  gift.type === 'offer' 
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' 
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                }`}>
                  {gift.type === 'offer' ? <Tag className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{gift.title}</h4>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md whitespace-nowrap">
                      {gift.expiry}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2 line-clamp-2">
                    {gift.description}
                  </p>
                  
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1.5 border border-dashed border-gray-200 dark:border-gray-700 relative">
                    <code className="text-xs font-mono font-bold text-primary flex-1 pl-1">{gift.code}</code>
                    <button 
                      onClick={() => handleCopyCode(gift.code, gift.id)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md text-gray-400 hover:text-primary transition-all shadow-sm"
                      title="Copy Code"
                    >
                      {copiedId === gift.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    
                    {copiedId === gift.id && (
                      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200 z-10">
                        Copied!
                        <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full gap-2"
          onClick={onCreateNew}
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </Button>
      </div>
    </div>
  );
};

export default GiftsDropdown;