'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  icon?: React.ReactNode;
  items: NavItem[];
}

export default function NavDropdown({ label, icon, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // 画面端の検出
    const checkPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const dropdownWidth = 256; // w-64 = 16rem = 256px
        const rightEdge = rect.left + dropdownWidth;

        // 画面右端に近い場合は右寄せ
        setAlignRight(rightEdge > window.innerWidth - 20);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      checkPosition();
      window.addEventListener('resize', checkPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkPosition);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-muted hover:text-primary transition-colors font-medium gap-1"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-56 sm:w-64 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 ${
          alignRight ? 'right-0' : 'left-0'
        }`}>
          <div className="py-2">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start px-4 py-3 hover:bg-background transition-colors group"
              >
                {item.icon && (
                  <div className="mr-3 mt-0.5 text-muted group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
