import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark
    return savedTheme || 'dark';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#f91616';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', primaryColor);

    // Create a simple darken function for hover effect
    const darkenColor = (hex, percent) => {
      let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        B = ((num >> 8) & 0x00ff) - amt,
        G = (num & 0x0000ff) - amt;
      return "#" + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)).toString(16).slice(1);
    };

    try {
      const hoverColor = darkenColor(primaryColor, 20); // Darken by ~20%
      root.style.setProperty('--primary-hover', hoverColor);
    } catch (e) {
      console.error("Error generating hover color", e);
      root.style.setProperty('--primary-hover', primaryColor);
    }

    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('fontFamily') || "'Poppins', sans-serif";
  });

  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('fontSize')) || 16;
  });

  const [fontWeight, setFontWeight] = useState(() => {
    return parseInt(localStorage.getItem('fontWeight')) || 400;
  });

  const [notificationSound, setNotificationSound] = useState(() => {
    return localStorage.getItem('notificationSound') || 'sound1';
  });

  const [sidebarOrder, setSidebarOrder] = useState(() => {
    const saved = localStorage.getItem('sidebarOrder');
    return saved ? JSON.parse(saved) : [
      "dashboard", "users", "restaurants", "delivery-settings",
      "delivery-partners", "orders", "menu_items", "payments",
      "sub-admin", "offers", "reviews", "party", "settings"
    ];
  });

  const [sidebarBackgroundColor, setSidebarBackgroundColor] = useState(() => {
    return localStorage.getItem('sidebarBackgroundColor') || '#0f5474';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--font-family', fontFamily);
    root.style.setProperty('--font-size', `${fontSize}px`);
    root.style.setProperty('--font-weight', fontWeight);

    // Also update body directly to ensure immediate effect
    document.body.style.fontFamily = fontFamily;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.fontWeight = fontWeight;

    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontWeight', fontWeight);
  }, [fontFamily, fontSize, fontWeight]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--bg-sidebar', sidebarBackgroundColor);
    localStorage.setItem('sidebarBackgroundColor', sidebarBackgroundColor);
  }, [sidebarBackgroundColor]);

  useEffect(() => {
    localStorage.setItem('notificationSound', notificationSound);
  }, [notificationSound]);

  useEffect(() => {
    localStorage.setItem('sidebarOrder', JSON.stringify(sidebarOrder));
  }, [sidebarOrder]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme,
      primaryColor, setPrimaryColor,
      fontFamily, setFontFamily,
      fontSize, setFontSize,
      fontWeight, setFontWeight,
      notificationSound, setNotificationSound,
      sidebarOrder, setSidebarOrder,
      sidebarBackgroundColor, setSidebarBackgroundColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};