
import React, { useState, useMemo } from 'react';
import { X, Send, Calendar, Clock, MessageSquare, Tag, Utensils } from 'lucide-react';
import Button from '../ui/Button';
import { useDailyMenuSendToUserMutation } from '../../api/services/menuApi';
import { toast } from 'react-hot-toast';

const DailyMenuModal = ({ isOpen, onClose, menus }) => {
    const [sendDailyMenu, { isLoading }] = useDailyMenuSendToUserMutation();

    const [formData, setFormData] = useState({
        menuItemId: '',
        time: '12:00',
        message: '',
        title: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Extract all items from the structured menu data
    const allItems = useMemo(() => {
        if (!menus || !menus.length) return [];

        const items = [];
        const categories = menus[0]?.categories || [];

        categories.forEach(cat => {
            // Check subCategories
            if (cat.subCategories && cat.subCategories.length) {
                cat.subCategories.forEach(sub => {
                    if (sub.items && sub.items.length) {
                        sub.items.forEach(item => {
                            items.push({
                                _id: item.itemId, // mapped as itemId in transformItemsData
                                name: item.name,
                                categoryName: cat.name
                            });
                        });
                    }
                });
            }
        });

        return items;
    }, [menus]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.menuItemId) {
            toast.error('Please select a menu item');
            return;
        }

        try {
            await sendDailyMenu({ payload: formData }).unwrap();
            toast.success('Daily menu notification scheduled!');
            onClose();
            // Reset form or keep values? Resetting seems safer.
            setFormData({
                menuItemId: '',
                time: '12:00',
                message: '',
                title: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Failed to send daily menu:", error);
            toast.error(error?.data?.message || 'Failed to schedule notification');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Send size={20} className="text-primary" />
                            Send Daily Menu
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Notify users about today's special
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Menu Item Selection */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Menu Item
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Utensils size={18} className="text-gray-400" />
                            </div>
                            <select
                                name="menuItemId"
                                value={formData.menuItemId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
                                required
                            >
                                <option value="">-- Choose an Item --</option>
                                {allItems.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.name} ({item.categoryName})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Special Offer"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Time */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Time
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Message
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <MessageSquare size={18} className="text-gray-400" />
                            </div>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="e.g. Taste the best!"
                                rows="3"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Notification'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default DailyMenuModal;
