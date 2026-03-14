import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PRESET_COLORS = [
    { name: 'Red', value: '#f91616' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Pink', value: '#db2777' },
];

const ThemeCustomizer = () => {
    const { primaryColor, setPrimaryColor } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                title="Customize Theme"
            >
                <Palette className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Theme Colors</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wider">
                                Presets
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setPrimaryColor(color.value)}
                                        className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110
                      ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-900' : ''}
                    `}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {primaryColor === color.value && (
                                            <Check className="w-5 h-5 text-white drop-shadow-md" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wider">
                                Custom Color
                            </label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                                />
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                                    {primaryColor}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeCustomizer;
