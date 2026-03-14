import React, { useState } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const OrderFormModal = ({ order, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer: order?.customer || '',
    type: order?.type || 'Dine-In',
    table: order?.table || '',
    status: order?.status || 'on-process',
    items: order?.items || []
  });

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    price: 0,
    image: '🍽️'
  });

  const foodEmojis = ['🍝', '🍕', '🍔', '🥗', '🍱', '🍗', '🥖', '🍜', '🍛', '🌮', '🍣', '🥙', '🫘', '☕', '🧃'];

  const handleAddItem = () => {
    if (newItem.name && newItem.price > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...newItem, id: Date.now() }]
      });
      setNewItem({ name: '', quantity: 1, price: 0, image: '🍽️' });
    }
  };

  const handleRemoveItem = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const handleUpdateItemQuantity = (itemId, delta) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = () => {
    if (formData.customer && formData.items.length > 0) {
      onSubmit({
        ...order,
        ...formData,
        total: calculateTotal()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-sidebar text-white p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">{order ? 'Edit Order' : 'Create New Order'}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-all">
            <X size={22} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <InputField
              label="Customer Name"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              placeholder="Enter customer name"
            />
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Order Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input w-full"
              >
                <option value="Dine-In">Dine-In</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <InputField
              label="Table Number"
              value={formData.table}
              onChange={(e) => setFormData({ ...formData, table: e.target.value })}
              placeholder="e.g., Table 5"
              disabled={formData.type !== 'Dine-In'}
            />
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input w-full"
              >
                <option value="on-process">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Add Items */}
          <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 uppercase tracking-wide">Add Items</h3>
            <div className="grid grid-cols-12 gap-2 mb-3">
              <div className="col-span-5">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                  className="input w-full text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  placeholder="Qty"
                  min="1"
                  className="input w-full text-sm"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  className="input w-full text-sm"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="input w-full text-lg"
                >
                  {foodEmojis.map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button onClick={handleAddItem} className="w-full" variant="primary">
              <Plus size={18} />
              Add Item to Order
            </Button>
          </div>

          {/* Items List */}
          {formData.items.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Order Items ({formData.items.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateItemQuantity(item.id, -1)}
                          className="p-1 hover:bg-white dark:hover:bg-gray-500 rounded transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateItemQuantity(item.id, 1)}
                          className="p-1 hover:bg-white dark:hover:bg-gray-500 rounded transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-primary w-16 text-right text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Total Amount</span>
              <span className="text-3xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              variant="primary"
              disabled={!formData.customer || formData.items.length === 0}
            >
              {order ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
