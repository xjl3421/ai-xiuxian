import { ReactNode } from 'react'

interface SectionBadgeProps {
  children: ReactNode
  variant?: 'default' | 'animated'
}

export function SectionBadge({ children, variant = 'default' }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2">
      <span
        className={`h-2 w-2 rounded-full bg-primary ${
          variant === 'animated' ? 'animate-pulse-dot' : ''
        }`}
      />
      <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-primary">
        {children}
      </span>
    </div>
  )
}
