'use client';

import React, { useRef, useState, useEffect } from 'react';
import './AccordionGallery.css';

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  tilt?: number;
  className?: string;
}

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: './images/gallery/gallery-risotto.jpg', label: 'Risotto', link: '#' },
  { image: './images/gallery/gallery-croissant.jpg', label: 'Croissant', link: '#' },
  { image: './images/gallery/gallery-taco.jpg', label: 'Taco', link: '#' },
  { image: './images/gallery/gallery-ramen.jpg', label: 'Ramen', link: '#' },
  { image: './images/gallery/gallery-corn-chaat.jpg', label: 'Corn Chaat', link: '#' }
];

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  accentColor = '#847445',
  overlayColor = '#121316',
  textColor = '#FAF8F5',
  height = 420,
  gap = 12,
  radius = 18,
  expandRatio = 0.48,
  orientation = 'horizontal',
  trigger = 'hover',
  showLabels = true,
  className = ''
}) => {
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));
  const hoverTimerRef = useRef<number | null>(null);

  const vertical = orientation === 'vertical';

  // Calculate dynamic flex-grow based on ratio and count
  const r = Math.min(Math.max(expandRatio, 0.2), 0.85);
  const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleEnter = (i: number) => {
    if (trigger === 'hover' && i !== active) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = window.setTimeout(() => {
        setActive(i);
      }, 35);
    }
  };

  const handleLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        '--ag-grow': grow.toFixed(2),
        height: vertical ? `${Math.round(height * 1.5)}px` : `${height}px`
      } as React.CSSProperties}
      role="list"
      aria-label="Culinary gallery accordion"
      onMouseLeave={handleLeave}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';

        return (
          <Tag
            key={i}
            className={`ag-panel ${isActive ? 'ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media">
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  loading="eager"
                  decoding="async"
                />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>

            {showLabels && (
              <span className="ag-panel__label" aria-hidden={!isActive}>
                <span className="ag-panel__bar" />
                <span className="ag-panel__text">{item.label}</span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
