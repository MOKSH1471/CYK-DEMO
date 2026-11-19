import React from 'react';
import { CraftNavbar } from './CraftNavbar';

interface HeaderProps {
  isIntroComplete?: boolean;
  onOpenEnquiry: (prefilledStage?: number) => void;
  onOpenServices: (serviceSlug?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isIntroComplete = true,
  onOpenEnquiry,
  onOpenServices
}) => {
  return (
    <CraftNavbar
      isIntroComplete={isIntroComplete}
      onOpenEnquiry={onOpenEnquiry}
      onOpenServices={onOpenServices}
    />
  );
};

