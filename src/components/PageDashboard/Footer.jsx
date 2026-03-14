import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' }
  ];

  const footerLinks = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Term and Condition', href: '#' },
    { text: 'Contact', href: '#' }
  ];

  return (
    <footer className="bg-primary border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Copyright © {currentYear}{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">BITMAX</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#2563eb] dark:hover:text-[#3b82f6] transition-colors font-medium"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#2563eb] hover:text-white dark:hover:bg-[#3b82f6] dark:hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;