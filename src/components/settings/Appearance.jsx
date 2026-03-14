import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Check } from "lucide-react";

import { SOUNDS } from "../../constants/sounds";

// Fonts
const FONTS = [
    "Segoe UI",
    "Poppins",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Oswald",
    "Raleway",
    "Nunito",
    "Playfair Display",
];

// Preset Colors
const PRESET_COLORS = [
    { name: 'Red', value: '#f91616' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Yellow', value: '#ca8a04' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Cyan', value: '#0891b2' },
    { name: 'Lime', value: '#65a30d' },
    { name: 'Rose', value: '#e11d48' },
];

const Appearance = () => {
    const {
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        fontWeight,
        setFontWeight,
        notificationSound,
        setNotificationSound,
        primaryColor,
        setPrimaryColor,
        sidebarBackgroundColor, // New
        setSidebarBackgroundColor // New
    } = useTheme();

    const playPreview = (soundUrl) => {
        if (!soundUrl) return;
        const audio = new Audio(soundUrl);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play error", e));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Primary Color Section */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Theme Color</h2>
                <div className="flex flex-wrap gap-4">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setPrimaryColor(color.value)}
                            className={`
                                w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-gray-100 dark:border-gray-700
                                ${primaryColor === color.value ? 'ring-4 ring-offset-2 ring-primary dark:ring-offset-gray-900' : ''}
                            `}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        >
                            {primaryColor === color.value && (
                                <Check className="w-6 h-6 text-white drop-shadow-md" />
                            )}
                        </button>
                    ))}

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl ml-4">
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                            title="Custom Color"
                        />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                            Custom
                        </span>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4">Typography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Font Family */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Family
                        </label>
                        <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="input w-full"
                        >
                            {FONTS.map((font) => (
                                <option key={font} value={`'${font}', sans-serif`}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Font Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Weight: <span className="text-primary">{fontWeight}</span>
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="900"
                            step="100"
                            value={fontWeight}
                            onChange={(e) => setFontWeight(Number(e.target.value))}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Thin (100)</span>
                            <span>Normal (400)</span>
                            <span>Black (900)</span>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Base Font Size: <span className="text-primary">{fontSize}px</span>
                        </label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Small (12px)</span>
                            <span>Standard (16px)</span>
                            <span>Large (24px)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Background Section */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Sidebar Background</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl">
                        <input
                            type="color"
                            value={sidebarBackgroundColor || '#0f5474'}
                            onChange={(e) => setSidebarBackgroundColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                            title="Choose Sidebar Background Color"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Pick Color
                            </span>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {sidebarBackgroundColor}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4">Notification Sounds</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {SOUNDS.map((sound) => (
                        <button
                            key={sound.id}
                            onClick={() => {
                                setNotificationSound(sound.id);
                                playPreview(sound.url);
                            }}
                            className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:scale-105 active:scale-95
                ${notificationSound === sound.id
                                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary ring-opacity-50"
                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }
              `}
                        >
                            <span className="font-semibold mb-1 text-sm">{sound.label}</span>
                            <span className="text-[10px] uppercase tracking-wide opacity-60">Play</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
                <p>Sidebar rearrangement is now available directly in the sidebar! Hover over items to drag.</p>
            </div>
        </div>
    );
};

export default Appearance;
