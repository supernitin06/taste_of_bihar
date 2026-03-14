import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        flex items-center justify-center
        w-8 h-8
        bg-transparent
        outline-none
        transition-transform duration-200
        hover:scale-110
        active:scale-95
      "
    >
      {theme === 'light' ? (
        <Moon
          className="
            w-5 h-5
            text-muted-foreground
            transition-all duration-300
            group-hover:text-indigo-500
          "
        />
      ) : (
        <Sun
          className="
            w-5 h-5
            text-yellow-400
            transition-all duration-300
            hover:rotate-90
          "
        />
      )}
    </button>
  );
};

export default ThemeToggle;
