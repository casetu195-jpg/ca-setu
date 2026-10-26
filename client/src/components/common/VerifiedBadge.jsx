import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function VerifiedBadge({ className = '', showText = true, size = 'sm' }) {
  return (
    <span
      title="Verified by CA Dwar Administration"
      className={`inline-flex items-center gap-1 font-medium text-brand-success bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9] ${
        size === 'sm' ? 'text-xs' : 'text-sm px-2.5 py-1'
      } ${className}`}
    >
      <CheckCircle2 className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-brand-success shrink-0`} />
      {showText && <span>CA Dwar Verified</span>}
    </span>
  );
}
