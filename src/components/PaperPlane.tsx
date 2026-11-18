import React from 'react';

export interface PaperPlaneProps {
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  showShadow?: boolean;
  showBeacon?: boolean;
  accentColor?: string;
  beaconColor?: string;
}

export const PaperPlane: React.FC<PaperPlaneProps> = ({
  scale = 0.44,
  className = '',
  style,
  showShadow = true,
  showBeacon = true,
  accentColor = '#847445',
  beaconColor = '#C5A869',
}) => {
  return (
    <g
      className={`paper-plane-graphic pointer-events-none ${className}`}
      style={{ willChange: 'transform', ...style }}
    >
      {/* Soft Drop Shadow */}
      {showShadow && (
        <g transform="translate(8, 16) scale(0.44) translate(-110, -90)" opacity="0.25">
          <path d="M110 20 L25 140 L110 115 Z" fill="#000000" />
          <path d="M110 20 L195 140 L110 115 Z" fill="#000000" />
          <path d="M110 20 L110 160 L102 116 Z" fill="#000000" />
          <path d="M110 20 L110 160 L118 116 Z" fill="#000000" />
        </g>
      )}

      {/* Warm Ambient Beacon Glow */}
      {showBeacon && (
        <circle
          cx="0"
          cy="22"
          r="16"
          fill={beaconColor}
          opacity="0.35"
          className="animate-pulse"
        />
      )}

      {/* Multi-faceted Origami Paper Plane Body */}
      <g transform={`scale(${scale}) translate(-110, -90)`}>
        {/* Left wing (bright top paper reflection) */}
        <path
          d="M110 20 L25 140 L110 115 Z"
          fill="#FFFFFF"
          stroke="#C4BCAD"
          strokeWidth="2"
        />
        {/* Right wing (subtle warm parchment tone) */}
        <path
          d="M110 20 L195 140 L110 115 Z"
          fill="#F4F1EA"
          stroke="#C4BCAD"
          strokeWidth="2"
        />
        {/* Left keel fold (crease shadow) */}
        <path
          d="M110 20 L110 160 L102 116 Z"
          fill="#E4DFC7"
        />
        {/* Right keel fold (deeper shadow) */}
        <path
          d="M110 20 L110 160 L118 116 Z"
          fill="#D0C9B3"
        />
        {/* Signature Olive-gold nose accent */}
        <path
          d="M110 20 L100 48 L120 48 Z"
          fill={accentColor}
        />
        {/* Nose apex dot */}
        <circle
          cx="110"
          cy="24"
          r="3"
          fill="#FFFFFF"
        />
      </g>
    </g>
  );
};

export default PaperPlane;
